import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { z } from 'zod'
import { entries } from '~/generated/entries'
import { glossary } from '~/data/glossary'
import { AREA_ORDER, TYPE_LABELS, fold, slugify } from '#shared/library'
import { MCP_INSTRUCTIONS, MCP_SERVER_NAME, MCP_TOOLS } from '#shared/mcp'
import type { EntryType, LibraryEntry } from '#shared/types/library'

/**
 * Servidor MCP de Golden Path: la biblioteca, de sólo lectura, para agentes.
 *
 * Es la única ruta dinámica del sitio. En Vercel (preset `vercel`) queda como
 * función y todas las páginas siguen prerenderizadas; con `nuxt generate`
 * (hosting estático puro) simplemente no existe.
 *
 * Transporte Streamable HTTP **sin estado**: cada POST crea su servidor, responde
 * JSON y termina. No hay sesiones ni streams SSE abiertos, que es lo que conviene
 * a una función serverless (cada invocación dura milisegundos).
 */

const MAX_BODY_BYTES = 64 * 1024
const MAX_RESULTS = 10
const SNIPPET_CHARS = 280

const CORS_HEADERS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST, GET, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, mcp-protocol-version, mcp-session-id, authorization',
  'access-control-expose-headers': 'mcp-session-id',
  'access-control-max-age': '86400',
}

/* ---------------------------------------------------------------------------
 * Datos derivados: se calculan una vez por instancia de la función.
 * ------------------------------------------------------------------------- */

interface Section {
  id: string
  label: string
  depth: number
  /** Markdown desde el encabezado hasta el siguiente de igual o mayor nivel. */
  markdown: string
}

interface PreparedEntry {
  entry: LibraryEntry
  /** Cuerpo en Markdown, sin frontmatter ni `# Título`. */
  body: string
  paragraphs: string[]
  sections: Section[]
  folded: { title: string; summary: string; tags: string; headings: string; body: string }
}

function stripFrontmatter(raw: string): string {
  return raw.replace(/^---\n[\s\S]*?\n---\n/, '').replace(/^\s*#\s+.+\n/, '').trim()
}

/**
 * Parte el cuerpo en secciones h2/h3. Los ids se toman de `entry.headings`
 * (los mismos del HTML del sitio, en el mismo orden) para que `seccion` acepte
 * exactamente los anclas de las URLs `…#id`.
 */
function splitSections(body: string, entry: LibraryEntry): Section[] {
  const lines = body.split('\n')
  const found: { line: number; depth: number; label: string }[] = []
  let inFence = false

  lines.forEach((line, index) => {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence
    if (inFence) return
    const match = line.match(/^(#{2,3})\s+(.+?)\s*#*\s*$/)
    if (match) found.push({ line: index, depth: match[1]!.length, label: match[2]! })
  })

  const idsMatch = found.length === entry.headings.length

  return found.map((heading, position) => {
    const next = found.slice(position + 1).find(other => other.depth <= heading.depth)
    const label = idsMatch ? entry.headings[position]!.label : heading.label.replace(/[`*_]/g, '')
    return {
      id: idsMatch ? entry.headings[position]!.id : slugify(label),
      label,
      depth: heading.depth,
      markdown: lines.slice(heading.line, next?.line ?? lines.length).join('\n').trim(),
    }
  })
}

function toParagraphs(body: string): string[] {
  return body
    .replace(/^(```|~~~)[\s\S]*?^\1/gm, '')
    .split(/\n{2,}/)
    .map(block => block.replace(/^#{1,6}\s+/, '').replace(/\s+/g, ' ').trim())
    .filter(block => block.length > 40)
}

const prepared: PreparedEntry[] = entries.map((entry) => {
  const body = stripFrontmatter(entry.raw)
  return {
    entry,
    body,
    paragraphs: toParagraphs(body),
    sections: splitSections(body, entry),
    folded: {
      title: fold(entry.title),
      summary: fold(entry.summary),
      tags: fold(entry.tags.join(' ')),
      headings: fold(entry.headings.map(heading => heading.label).join(' ')),
      body: fold(body),
    },
  }
})

const bySlug = new Map(prepared.map(item => [item.entry.slug, item]))

const slugs = entries.map(entry => entry.slug) as [string, ...string[]]
const areas = AREA_ORDER.filter(area => entries.some(entry => entry.area === area)) as [string, ...string[]]
const types = Object.keys(TYPE_LABELS) as [EntryType, ...EntryType[]]

/* ---------------------------------------------------------------------------
 * Búsqueda con ranking. El sitio filtra por coincidencia exacta de la frase;
 * un agente suele mandar varias palabras sueltas, así que acá se puntúa término
 * por término y se ordena por relevancia.
 * ------------------------------------------------------------------------- */

function countOccurrences(haystack: string, needle: string): number {
  let count = 0
  let from = haystack.indexOf(needle)
  while (from !== -1 && count < 20) {
    count++
    from = haystack.indexOf(needle, from + needle.length)
  }
  return count
}

function score(item: PreparedEntry, terms: string[], phrase: string): number {
  const { folded } = item
  let total = 0
  let matched = 0

  for (const term of terms) {
    const termScore
      = (folded.title.includes(term) ? 10 : 0)
      + (folded.tags.includes(term) ? 6 : 0)
      + (folded.summary.includes(term) ? 4 : 0)
      + (folded.headings.includes(term) ? 3 : 0)
      + Math.min(countOccurrences(folded.body, term), 10)
    if (termScore > 0) matched++
    total += termScore
  }

  if (!matched) return 0
  // Premia las entradas que cubren todos los términos y la frase literal.
  total *= matched / terms.length
  if (terms.length > 1 && folded.body.includes(phrase)) total += 15
  return total
}

function snippet(item: PreparedEntry, terms: string[]): string {
  const paragraph
    = item.paragraphs.find(text => terms.some(term => fold(text).includes(term)))
      ?? item.paragraphs[0]
      ?? item.entry.summary
  return paragraph.length > SNIPPET_CHARS ? `${paragraph.slice(0, SNIPPET_CHARS).trimEnd()}…` : paragraph
}

/* ---------------------------------------------------------------------------
 * Formato de salida: Markdown compacto, que es lo que mejor lee un modelo.
 * ------------------------------------------------------------------------- */

function entryUrl(siteUrl: string, slug: string, anchor?: string) {
  return `${siteUrl}/entrada/${slug}${anchor ? `#${anchor}` : ''}`
}

function text(markdown: string) {
  return { content: [{ type: 'text' as const, text: markdown }] }
}

function notFound(message: string) {
  return { ...text(message), isError: true }
}

function createServer(siteUrl: string) {
  const server = new McpServer(
    { name: MCP_SERVER_NAME, title: 'Golden Path', version: '1.0.0', websiteUrl: siteUrl },
    { instructions: MCP_INSTRUCTIONS },
  )

  const readOnly = { readOnlyHint: true, idempotentHint: true, openWorldHint: false }

  server.registerTool(
    MCP_TOOLS.buscar.name,
    {
      title: MCP_TOOLS.buscar.title,
      description: MCP_TOOLS.buscar.description,
      inputSchema: {
        consulta: z.string().min(2).max(200).describe('Texto a buscar, en español. Ej.: "worktrees y paralelismo".'),
        area: z.enum(areas).optional().describe('Limitar a un área (recorrido) de la biblioteca.'),
        tipo: z.enum(types).optional().describe('Limitar a un tipo de entrada.'),
        limite: z.number().int().min(1).max(MAX_RESULTS).default(5).describe('Cantidad máxima de resultados.'),
      },
      annotations: readOnly,
    },
    async ({ consulta, area, tipo, limite }) => {
      const phrase = fold(consulta.trim())
      const terms = [...new Set(phrase.split(/[^a-z0-9ñ.#-]+/).filter(term => term.length >= 2))]
      if (!terms.length) return notFound('La consulta no tiene términos buscables.')

      const results = prepared
        .filter(({ entry }) => (!area || entry.area === area) && (!tipo || entry.type === tipo))
        .map(item => ({ item, score: score(item, terms, phrase) }))
        .filter(result => result.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limite)

      if (!results.length) {
        return text(
          `Sin resultados para "${consulta}". Probá con otros términos o usá \`${MCP_TOOLS.listar.name}\` para ver el índice.`,
        )
      }

      const lines = results.map(({ item }, index) => {
        const { entry } = item
        return [
          `${index + 1}. **${entry.title}** — \`${entry.slug}\``,
          `   ${TYPE_LABELS[entry.type]} · ${entry.area} · ${entryUrl(siteUrl, entry.slug)}`,
          `   ${entry.summary}`,
          `   > ${snippet(item, terms)}`,
        ].join('\n')
      })

      return text(
        `${results.length} resultado(s) para "${consulta}":\n\n${lines.join('\n\n')}\n\n`
        + `Usá \`${MCP_TOOLS.leer.name}\` con el slug para leer una entrada completa.`,
      )
    },
  )

  server.registerTool(
    MCP_TOOLS.leer.name,
    {
      title: MCP_TOOLS.leer.title,
      description: MCP_TOOLS.leer.description,
      inputSchema: {
        slug: z.enum(slugs).describe('Slug de la entrada.'),
        seccion: z
          .string()
          .max(200)
          .optional()
          .describe('Id (el ancla de la URL) o título de un h2/h3 para leer sólo esa sección.'),
      },
      annotations: readOnly,
    },
    async ({ slug, seccion }) => {
      const item = bySlug.get(slug)
      if (!item) return notFound(`No existe la entrada "${slug}".`)
      const { entry } = item

      const sectionIndex = item.sections
        .map(section => `- \`${section.id}\`${section.depth === 3 ? ' (h3)' : ''} — ${section.label}`)
        .join('\n')

      if (seccion) {
        const wanted = fold(seccion.trim())
        const section
          = item.sections.find(candidate => candidate.id === wanted || fold(candidate.label) === wanted)
            ?? item.sections.find(candidate => fold(candidate.label).includes(wanted))
        if (!section) {
          return notFound(`La entrada "${slug}" no tiene la sección "${seccion}". Secciones disponibles:\n${sectionIndex}`)
        }
        return text(
          `# ${entry.title} → ${section.label}\n\nFuente: ${entryUrl(siteUrl, slug, section.id)}\n\n${section.markdown}`,
        )
      }

      const related = entry.related
        .map(relatedSlug => bySlug.get(relatedSlug)?.entry)
        .filter((relatedEntry): relatedEntry is LibraryEntry => Boolean(relatedEntry))
        .map(relatedEntry => `- \`${relatedEntry.slug}\` — ${relatedEntry.title}`)
        .join('\n')

      return text(
        [
          `# ${entry.title}`,
          '',
          `- **Tipo:** ${TYPE_LABELS[entry.type]}`,
          `- **Área:** ${entry.area}`,
          `- **Tags:** ${entry.tags.join(', ') || '—'}`,
          `- **URL:** ${entryUrl(siteUrl, slug)}`,
          '',
          `> ${entry.summary}`,
          '',
          '---',
          '',
          item.body,
          '',
          '---',
          '',
          related ? `**Entradas relacionadas:**\n${related}` : '',
        ].join('\n').trim(),
      )
    },
  )

  server.registerTool(
    MCP_TOOLS.listar.name,
    {
      title: MCP_TOOLS.listar.title,
      description: MCP_TOOLS.listar.description,
      inputSchema: {
        area: z.enum(areas).optional().describe('Mostrar sólo esta área.'),
        tipo: z.enum(types).optional().describe('Mostrar sólo este tipo de entrada.'),
      },
      annotations: readOnly,
    },
    async ({ area, tipo }) => {
      const groups = areas
        .map(groupArea => ({
          area: groupArea,
          items: entries.filter(entry =>
            entry.area === groupArea && (!area || entry.area === area) && (!tipo || entry.type === tipo),
          ),
        }))
        .filter(group => group.items.length)

      if (!groups.length) return text('No hay entradas con esos filtros.')

      const total = groups.reduce((sum, group) => sum + group.items.length, 0)
      const body = groups
        .map(group =>
          [
            `## ${group.area} (${group.items.length})`,
            ...group.items.map(entry => `- \`${entry.slug}\` — **${entry.title}** (${TYPE_LABELS[entry.type]}): ${entry.summary}`),
          ].join('\n'),
        )
        .join('\n\n')

      return text(`# Golden Path — ${total} entrada(s)\n\n${body}`)
    },
  )

  server.registerTool(
    MCP_TOOLS.glosario.name,
    {
      title: MCP_TOOLS.glosario.title,
      description: MCP_TOOLS.glosario.description,
      inputSchema: {
        termino: z.string().max(100).optional().describe('Término a buscar. Ej.: "worktree", "ADE".'),
      },
      annotations: readOnly,
    },
    async ({ termino }) => {
      const sorted = [...glossary].sort((a, b) => a.term.localeCompare(b.term, 'es'))
      const wanted = termino ? fold(termino.trim()) : ''

      const matches = !wanted
        ? sorted
        : (() => {
            const exact = sorted.filter(item => fold(item.term) === wanted)
            if (exact.length) return exact
            const inTerm = sorted.filter(item => fold(item.term).includes(wanted))
            return inTerm.length ? inTerm : sorted.filter(item => fold(item.definition).includes(wanted))
          })()

      if (!matches.length) {
        return text(
          `"${termino}" no está en el glosario. Términos disponibles: ${sorted.map(item => item.term).join(', ')}.`,
        )
      }

      return text(
        matches
          .map(item =>
            `**${item.term}**: ${item.definition}${item.slug ? `\n  → Se explica en \`${item.slug}\` (${entryUrl(siteUrl, item.slug)})` : ''}`,
          )
          .join('\n\n'),
      )
    },
  )

  return server
}

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, CORS_HEADERS)
  const method = event.method

  if (method === 'OPTIONS') {
    setResponseStatus(event, 204)
    return ''
  }

  // Sin estado no hay stream SSE que abrir por GET. Una persona que abre la URL
  // en el navegador va a la página que explica cómo conectarse.
  if (method !== 'POST') {
    if (method === 'GET' && getRequestHeader(event, 'accept')?.includes('text/html')) {
      return sendRedirect(event, '/conectar', 302)
    }
    setResponseHeader(event, 'allow', 'POST, OPTIONS')
    setResponseStatus(event, 405)
    return {
      jsonrpc: '2.0',
      error: { code: -32000, message: 'Método no permitido: este servidor MCP es sin estado y sólo acepta POST.' },
      id: null,
    }
  }

  const { siteUrl } = useRuntimeConfig(event).public
  const server = createServer(siteUrl)
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
    maxRequestBodySize: MAX_BODY_BYTES,
  })

  await server.connect(transport)
  try {
    return await transport.handleRequest(toWebRequest(event))
  }
  finally {
    await server.close()
  }
})
