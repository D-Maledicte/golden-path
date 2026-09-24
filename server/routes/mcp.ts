import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { z } from 'zod'
import * as generated from '~/generated/entries'
import * as glossaryData from '~/data/glossary'
import { AREA_ORDER, TYPE_LABELS, fold, slugify } from '#shared/library'
import {
  MCP_AREA_LABELS_EN,
  MCP_INSTRUCTIONS,
  MCP_SERVER_NAME,
  MCP_TOOLS,
  MCP_TYPE_LABELS_EN,
} from '#shared/mcp'
import type { EntryType, GlossaryTerm, LibraryEntry } from '#shared/types/library'

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
 *
 * La interfaz es en inglés. El contenido sale en inglés por defecto y, si una
 * entrada todavía no está traducida, en español marcada como tal.
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

type Language = 'en' | 'es'

/*
 * `entriesEn` y `glossaryEn` los agrega la traducción del sitio. Se leen del
 * namespace para que el servidor funcione también mientras no existan: en ese
 * caso todo cae al español.
 */
const entriesEs: LibraryEntry[] = generated.entries
const entriesEn: LibraryEntry[] = (generated as { entriesEn?: LibraryEntry[] }).entriesEn ?? []
const glossaryEs: GlossaryTerm[] = glossaryData.glossary
const glossaryEn: GlossaryTerm[] = (glossaryData as { glossaryEn?: GlossaryTerm[] }).glossaryEn ?? []

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
  /** Idioma real del contenido. */
  language: Language
  /** Se pidió inglés y la entrada todavía no está traducida. */
  fallback: boolean
  /** Cuerpo en Markdown, sin frontmatter ni `# Título`. */
  body: string
  paragraphs: string[]
  sections: Section[]
  folded: { title: string, summary: string, tags: string, headings: string, body: string }
}

function stripFrontmatter(raw: string): string {
  return raw.replace(/^---\n[\s\S]*?\n---\n/, '').replace(/^\s*#\s+.+\n/, '').trim()
}

/**
 * Parte el cuerpo en secciones h2/h3. Los ids se toman de `entry.headings`
 * (los mismos del HTML del sitio, en el mismo orden) para que `section` acepte
 * exactamente los anclas de las URLs `…#id`.
 */
function splitSections(body: string, entry: LibraryEntry): Section[] {
  const lines = body.split('\n')
  const found: { line: number, depth: number, label: string }[] = []
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

function prepare(entry: LibraryEntry, language: Language, fallback: boolean): PreparedEntry {
  const body = stripFrontmatter(entry.raw)
  return {
    entry,
    language,
    fallback,
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
}

/**
 * La biblioteca en cada idioma, en el orden editorial del español. En inglés,
 * las entradas sin traducir se sirven en español con `fallback: true`.
 */
const enBySlug = new Map(entriesEn.map(entry => [entry.slug, entry]))
const library: Record<Language, PreparedEntry[]> = {
  es: entriesEs.map(entry => prepare(entry, 'es', false)),
  en: entriesEs.map((entry) => {
    const translated = enBySlug.get(entry.slug)
    return translated ? prepare(translated, 'en', false) : prepare(entry, 'es', true)
  }),
}
const bySlug: Record<Language, Map<string, PreparedEntry>> = {
  es: new Map(library.es.map(item => [item.entry.slug, item])),
  en: new Map(library.en.map(item => [item.entry.slug, item])),
}

const slugs = entriesEs.map(entry => entry.slug) as [string, ...string[]]
const types = Object.keys(TYPE_LABELS) as [EntryType, ...EntryType[]]

/** Áreas presentes, por su etiqueta en inglés (lo que ve y manda el agente). */
const areaIds = AREA_ORDER.filter(area => entriesEs.some(entry => entry.area === area))
const areaLabel = (area: string) => MCP_AREA_LABELS_EN[area] ?? area
const areaByLabel = new Map(areaIds.map(area => [areaLabel(area), area]))
const areaLabels = areaIds.map(areaLabel) as [string, ...string[]]

const languageParam = z
  .enum(['en', 'es'])
  .default('en')
  .describe('Content language. Defaults to English; "es" returns the original Spanish.')

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

function entryUrl(siteUrl: string, item: PreparedEntry, anchor?: string) {
  const prefix = item.language === 'en' ? '/en' : ''
  return `${siteUrl}${prefix}/entrada/${item.entry.slug}${anchor ? `#${anchor}` : ''}`
}

function typeLabel(type: EntryType, language: Language) {
  return language === 'en' ? MCP_TYPE_LABELS_EN[type] : TYPE_LABELS[type]
}

function displayArea(area: string, language: Language) {
  return language === 'en' ? areaLabel(area) : area
}

const FALLBACK_NOTE = '_(Spanish only: English translation pending)_'

function text(markdown: string) {
  return { content: [{ type: 'text' as const, text: markdown }] }
}

function toolError(message: string) {
  return { ...text(message), isError: true }
}

function createServer(siteUrl: string) {
  const server = new McpServer(
    { name: MCP_SERVER_NAME, title: 'Golden Path', version: '2.0.0', websiteUrl: siteUrl },
    { instructions: MCP_INSTRUCTIONS },
  )

  const readOnly = { readOnlyHint: true, idempotentHint: true, openWorldHint: false }

  server.registerTool(
    MCP_TOOLS.buscar.name,
    {
      title: MCP_TOOLS.buscar.en.title,
      description: MCP_TOOLS.buscar.en.description,
      inputSchema: {
        query: z.string().min(2).max(200).describe('Text to search for. E.g. "worktrees and parallel agents".'),
        area: z.enum(areaLabels).optional().describe('Restrict to one area (learning path) of the library.'),
        type: z.enum(types).optional().describe('Restrict to one entry type.'),
        limit: z.number().int().min(1).max(MAX_RESULTS).default(5).describe('Maximum number of results.'),
        language: languageParam,
      },
      annotations: readOnly,
    },
    async ({ query, area, type, limit, language }) => {
      const phrase = fold(query.trim())
      const terms = [...new Set(phrase.split(/[^a-z0-9ñ.#-]+/).filter(term => term.length >= 2))]
      if (!terms.length) return toolError('The query has no searchable terms.')

      const areaId = area ? areaByLabel.get(area) : undefined
      const results = library[language]
        .filter(({ entry }) => (!areaId || entry.area === areaId) && (!type || entry.type === type))
        .map(item => ({ item, score: score(item, terms, phrase) }))
        .filter(result => result.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)

      if (!results.length) {
        return text(
          `No results for "${query}". Try other terms or use \`${MCP_TOOLS.listar.name}\` to browse the index.`,
        )
      }

      const lines = results.map(({ item }, index) => {
        const { entry } = item
        return [
          `${index + 1}. **${entry.title}** — \`${entry.slug}\`${item.fallback ? ` ${FALLBACK_NOTE}` : ''}`,
          `   ${typeLabel(entry.type, language)} · ${displayArea(entry.area, language)} · ${entryUrl(siteUrl, item)}`,
          `   ${entry.summary}`,
          `   > ${snippet(item, terms)}`,
        ].join('\n')
      })

      return text(
        `${results.length} result(s) for "${query}":\n\n${lines.join('\n\n')}\n\n`
        + `Use \`${MCP_TOOLS.leer.name}\` with the slug to read a full entry.`,
      )
    },
  )

  server.registerTool(
    MCP_TOOLS.leer.name,
    {
      title: MCP_TOOLS.leer.en.title,
      description: MCP_TOOLS.leer.en.description,
      inputSchema: {
        slug: z.enum(slugs).describe('Entry slug.'),
        section: z
          .string()
          .max(200)
          .optional()
          .describe('Id (the URL anchor) or title of an h2/h3, to read only that section.'),
        language: languageParam,
      },
      annotations: readOnly,
    },
    async ({ slug, section, language }) => {
      const item = bySlug[language].get(slug)
      if (!item) return toolError(`There is no entry "${slug}".`)
      const { entry } = item
      const note = item.fallback ? `\n\n${FALLBACK_NOTE}` : ''

      const sectionIndex = item.sections
        .map(candidate => `- \`${candidate.id}\`${candidate.depth === 3 ? ' (h3)' : ''} — ${candidate.label}`)
        .join('\n')

      if (section) {
        const wanted = fold(section.trim())
        const found
          = item.sections.find(candidate => candidate.id === wanted || fold(candidate.label) === wanted)
            ?? item.sections.find(candidate => fold(candidate.label).includes(wanted))
        if (!found) {
          return toolError(`Entry "${slug}" has no section "${section}". Available sections:\n${sectionIndex}`)
        }
        return text(
          `# ${entry.title} → ${found.label}${note}\n\nSource: ${entryUrl(siteUrl, item, found.id)}\n\n${found.markdown}`,
        )
      }

      const related = entry.related
        .map(relatedSlug => bySlug[language].get(relatedSlug)?.entry)
        .filter((relatedEntry): relatedEntry is LibraryEntry => Boolean(relatedEntry))
        .map(relatedEntry => `- \`${relatedEntry.slug}\` — ${relatedEntry.title}`)
        .join('\n')

      return text(
        [
          `# ${entry.title}${note}`,
          '',
          `- **Type:** ${typeLabel(entry.type, language)}`,
          `- **Area:** ${displayArea(entry.area, language)}`,
          `- **Tags:** ${entry.tags.join(', ') || '—'}`,
          `- **URL:** ${entryUrl(siteUrl, item)}`,
          '',
          `> ${entry.summary}`,
          '',
          '---',
          '',
          item.body,
          '',
          '---',
          '',
          related ? `**Related entries:**\n${related}` : '',
        ].join('\n').trim(),
      )
    },
  )

  server.registerTool(
    MCP_TOOLS.listar.name,
    {
      title: MCP_TOOLS.listar.en.title,
      description: MCP_TOOLS.listar.en.description,
      inputSchema: {
        area: z.enum(areaLabels).optional().describe('Show only this area.'),
        type: z.enum(types).optional().describe('Show only this entry type.'),
        language: languageParam,
      },
      annotations: readOnly,
    },
    async ({ area, type, language }) => {
      const areaId = area ? areaByLabel.get(area) : undefined
      const groups = areaIds
        .map(groupArea => ({
          area: groupArea,
          items: library[language].filter(({ entry }) =>
            entry.area === groupArea && (!areaId || entry.area === areaId) && (!type || entry.type === type),
          ),
        }))
        .filter(group => group.items.length)

      if (!groups.length) return text('No entries match those filters.')

      const total = groups.reduce((sum, group) => sum + group.items.length, 0)
      const pending = groups.reduce((sum, group) => sum + group.items.filter(item => item.fallback).length, 0)
      const body = groups
        .map(group =>
          [
            `## ${displayArea(group.area, language)} (${group.items.length})`,
            ...group.items.map(({ entry, fallback }) =>
              `- \`${entry.slug}\` — **${entry.title}** (${typeLabel(entry.type, language)})${fallback ? ' [es]' : ''}: ${entry.summary}`,
            ),
          ].join('\n'),
        )
        .join('\n\n')

      const legend = pending ? `\n\n${pending} entr${pending === 1 ? 'y is' : 'ies are'} marked [es]: Spanish only, English translation pending.` : ''
      return text(`# Golden Path — ${total} entr${total === 1 ? 'y' : 'ies'}${legend}\n\n${body}`)
    },
  )

  server.registerTool(
    MCP_TOOLS.glosario.name,
    {
      title: MCP_TOOLS.glosario.en.title,
      description: MCP_TOOLS.glosario.en.description,
      inputSchema: {
        term: z.string().max(100).optional().describe('Term to look up. E.g. "worktree", "ADE".'),
        language: languageParam,
      },
      annotations: readOnly,
    },
    async ({ term, language }) => {
      const source = language === 'en' && glossaryEn.length ? glossaryEn : glossaryEs
      const note = language === 'en' && !glossaryEn.length ? `${FALLBACK_NOTE}\n\n` : ''
      const sorted = [...source].sort((a, b) => a.term.localeCompare(b.term, language))
      const wanted = term ? fold(term.trim()) : ''

      const matches = !wanted
        ? sorted
        : (() => {
            const exact = sorted.filter(item => fold(item.term) === wanted)
            if (exact.length) return exact
            const inTerm = sorted.filter(item => fold(item.term).includes(wanted))
            return inTerm.length ? inTerm : sorted.filter(item => fold(item.definition).includes(wanted))
          })()

      if (!matches.length) {
        return text(`"${term}" is not in the glossary. Available terms: ${sorted.map(item => item.term).join(', ')}.`)
      }

      return text(
        note + matches
          .map((item) => {
            const linked = item.slug ? bySlug[language].get(item.slug) : undefined
            return `**${item.term}**: ${item.definition}${
              linked ? `\n  → Explained in \`${linked.entry.slug}\` (${entryUrl(siteUrl, linked)})` : ''
            }`
          })
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
      error: { code: -32000, message: 'Method not allowed: this MCP server is stateless and only accepts POST.' },
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
