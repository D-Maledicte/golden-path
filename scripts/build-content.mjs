#!/usr/bin/env node
/**
 * Compila `content/*.md` a `app/generated/entries.ts`.
 *
 * Por qué un paso de build y no un fetch en runtime:
 *  - El HTML se genera en build, así que el contenido viaja en el bundle y en
 *    el HTML prerenderizado (sin peticiones ni parpadeo al abrir el lector).
 *  - Se usa markdown-it + Shiki, un renderer probado, en lugar del renderer
 *    propio del sitio original (que tenía bugs con code spans y anidamientos).
 *  - El frontmatter queda validado: los `related` que no resuelven se avisan.
 *
 * Se ejecuta automáticamente vía `predev` / `prebuild` / `pregenerate`.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import markdownItShiki from '@shikijs/markdown-it'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const contentDir = join(projectRoot, 'content')
const outputFile = join(projectRoot, 'app', 'generated', 'entries.ts')

const AREA_ORDER = [
  'Toda la biblioteca',
  'Gobierno de agentes',
  'Orca',
  'Diseño agéntico',
  'Hermes',
  'CRM versionado',
  'Casos de producto',
]

const VALID_TYPES = ['concept', 'guide', 'editorial', 'case-study']

/** Tema de Shiki derivado de la paleta del sitio. */
const goldenPathTheme = {
  name: 'golden-path',
  type: 'dark',
  colors: {
    'editor.background': '#0b0a18',
    'editor.foreground': '#c9f5f4',
  },
  settings: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#6b6580', fontStyle: 'italic' } },
    { scope: ['string', 'punctuation.definition.string'], settings: { foreground: '#edc35e' } },
    { scope: ['keyword', 'storage', 'storage.type', 'storage.modifier'], settings: { foreground: '#a86aff' } },
    { scope: ['constant.numeric', 'constant.language', 'constant.other'], settings: { foreground: '#ec5fbd' } },
    { scope: ['entity.name.function', 'support.function', 'variable.function'], settings: { foreground: '#57d9e8' } },
    { scope: ['entity.name.tag', 'support.class', 'entity.name.type', 'support.type'], settings: { foreground: '#ffe8a1' } },
    { scope: ['meta.object-literal.key', 'variable.other.property', 'support.type.property-name'], settings: { foreground: '#ffe8a1' } },
    { scope: ['variable', 'identifier', 'source'], settings: { foreground: '#c9f5f4' } },
    { scope: ['punctuation', 'meta.brace', 'meta.delimiter'], settings: { foreground: '#8e899d' } },
    { scope: ['markup.bold'], settings: { foreground: '#ffe8a1', fontStyle: 'bold' } },
    { scope: ['markup.italic'], settings: { foreground: '#c7b4e8', fontStyle: 'italic' } },
  ],
}

function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function decodeEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

/** Agrega `id` a cada h2/h3 y devuelve los encabezados para el índice. */
function withHeadingIds(html) {
  const headings = []
  const seen = new Map()

  const output = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_match, level, inner) => {
    const label = decodeEntities(inner.replace(/<[^>]+>/g, '')).trim()
    const base = slugify(label) || `seccion-${headings.length + 1}`
    const count = seen.get(base) ?? 0
    seen.set(base, count + 1)
    const id = count === 0 ? base : `${base}-${count + 1}`
    headings.push({ label, depth: Number(level), id })
    return `<h${level} id="${id}">${inner}</h${level}>`
  })

  return { html: output, headings }
}

function toArray(value) {
  if (Array.isArray(value)) return value.map(String).map(item => item.trim()).filter(Boolean)
  if (typeof value === 'string') return value.split(',').map(item => item.trim()).filter(Boolean)
  return []
}

const md = new MarkdownIt({ html: false, linkify: true, breaks: false })
md.use(
  await markdownItShiki({
    theme: goldenPathTheme,
    langs: ['json', 'bash', 'typescript', 'javascript', 'vue', 'html', 'css', 'plaintext', 'yaml', 'diff'],
    langAlias: { text: 'plaintext', txt: 'plaintext', sh: 'bash', shell: 'bash', ts: 'typescript', js: 'javascript' },
  }),
)

/** Los enlaces externos se abren en pestaña nueva y sin referrer. */
const defaultLinkOpen = md.renderer.rules.link_open
  ?? ((tokens, index, options, _env, self) => self.renderToken(tokens, index, options))

md.renderer.rules.link_open = (tokens, index, options, env, self) => {
  const href = tokens[index].attrGet('href') ?? ''
  if (/^https?:\/\//.test(href)) {
    tokens[index].attrSet('target', '_blank')
    tokens[index].attrSet('rel', 'noopener noreferrer')
  }
  return defaultLinkOpen(tokens, index, options, env, self)
}

/**
 * Compila un idioma. El español vive en `content/*.md` y el inglés en
 * `content/en/*.md`, con el mismo `slug` y el mismo `area` (el área es un id
 * editorial en español; la UI traduce su etiqueta).
 */
function compileLocale(dir, label) {
const files = readdirSync(dir).filter(name => name.endsWith('.md')).sort()
const entries = []

for (const file of files) {
  const raw = readFileSync(join(dir, file), 'utf8').replace(/\r\n/g, '\n')

  let data
  let content
  try {
    ;({ data, content } = matter(raw))
  } catch (error) {
    problems.push(`${label}${file}: frontmatter YAML inválido — ${error.reason ?? error.message}`)
    continue
  }

  for (const field of ['slug', 'title', 'summary', 'type', 'area']) {
    if (!data[field]) problems.push(`${label}${file}: falta \`${field}\` en el frontmatter`)
  }
  if (data.type && !VALID_TYPES.includes(data.type)) {
    problems.push(`${label}${file}: tipo desconocido "${data.type}"`)
  }
  if (data.area && !AREA_ORDER.includes(data.area)) {
    problems.push(`${label}${file}: área desconocida "${data.area}"`)
  }

  const rendered = md.render(content)
  // Cada archivo empieza con `# Título`, que duplicaría el <h1> de la página o
  // del lector. Se elimina del cuerpo renderizado.
  const body = rendered.replace(/^<h1[^>]*>[\s\S]*?<\/h1>\s*/, '')
  const { html, headings } = withHeadingIds(body)

  entries.push({
    slug: String(data.slug ?? ''),
    title: String(data.title ?? ''),
    summary: String(data.summary ?? ''),
    type: String(data.type ?? 'concept'),
    order: Number(data.order ?? 0),
    tags: toArray(data.tags),
    related: toArray(data.related),
    area: String(data.area ?? ''),
    glyph: String(data.glyph ?? '◇'),
    hue: String(data.hue ?? 'rgba(237,195,94,.25)'),
    file,
    html,
    headings,
    raw,
  })
}

// Orden estable: por área según AREA_ORDER y luego por `order`.
entries.sort((a, b) => {
  const byArea = AREA_ORDER.indexOf(a.area) - AREA_ORDER.indexOf(b.area)
  if (byArea !== 0) return byArea
  if (a.order !== b.order) return a.order - b.order
  return a.slug.localeCompare(b.slug, 'es')
})

const slugs = new Set(entries.map(entry => entry.slug))
for (const entry of entries) {
  if (!entry.slug) problems.push(`${label}${entry.file}: slug vacío`)
  for (const related of entry.related) {
    if (!slugs.has(related)) problems.push(`${label}${entry.file}: related "${related}" no existe`)
  }
}

return entries
}

const problems = []
const entries = compileLocale(contentDir, '')
const enDir = join(contentDir, 'en')
const entriesEn = existsSync(enDir) ? compileLocale(enDir, 'en/') : []

const esSlugs = new Set(entries.map(entry => entry.slug))
for (const entry of entriesEn) {
  if (!esSlugs.has(entry.slug)) problems.push(`en/${entry.file}: no hay entrada en español con slug "${entry.slug}"`)
}
for (const slug of esSlugs) {
  if (!entriesEn.some(entry => entry.slug === slug)) problems.push(`falta la traducción al inglés de "${slug}"`)
}

mkdirSync(dirname(outputFile), { recursive: true })
writeFileSync(
  outputFile,
  `// AUTO-GENERADO por scripts/build-content.mjs — no editar a mano.
// Ejecutar \`npm run content\` después de tocar content/*.md.

import type { LibraryEntry } from '~/types/library'

export const generatedAt = ${JSON.stringify(new Date().toISOString())}

export const entries: LibraryEntry[] = ${JSON.stringify(entries, null, 2)}

export const entriesEn: LibraryEntry[] = ${JSON.stringify(entriesEn, null, 2)}
`,
  'utf8',
)

const words = entries.reduce((total, entry) => total + entry.raw.split(/\s+/).length, 0)
console.log(`Entradas compiladas: ${entries.length}`)
console.log(`Palabras totales:    ${words.toLocaleString('es-AR')}`)
console.log(`Encabezados:         ${entries.reduce((total, entry) => total + entry.headings.length, 0)}`)
console.log(`Salida:              app/generated/entries.ts`)

/* ---------------------------------------------------------------------------
 * Artefactos estáticos: la biblioteca como JSON, sitemap y robots.
 * Se generan acá (y no en rutas de Nitro) porque el sitio es 100% estático.
 * ------------------------------------------------------------------------- */
const publicDir = join(projectRoot, 'public')
const siteUrl = (process.env.NUXT_PUBLIC_SITE_URL ?? 'https://golden-path.pages.dev').replace(/\/+$/, '')

mkdirSync(publicDir, { recursive: true })

/**
 * La biblioteca en inglés, en el orden editorial del español. Si una entrada
 * no tiene traducción, va la española y su `language` lo dice.
 */
const enBySlug = new Map(entriesEn.map(entry => [entry.slug, entry]))
const libraryEn = entries.map(entry =>
  enBySlug.has(entry.slug) ? { ...enBySlug.get(entry.slug), language: 'en' } : { ...entry, language: 'es' },
)

/**
 * Etiquetas en inglés de las áreas (el id es el nombre en español). Es la
 * misma tabla que `MCP_AREA_LABELS_EN` en `shared/mcp.ts` y `area.*` en
 * `app/i18n/messages.ts`: este script es JS plano y no importa TypeScript.
 */
const AREA_LABELS_EN = {
  'Gobierno de agentes': 'Agent governance',
  Orca: 'Orca',
  'Diseño agéntico': 'Agentic design',
  Hermes: 'Hermes',
  'CRM versionado': 'Versioned CRM',
  'Casos de producto': 'Product cases',
}

function writeContentJson(file, { description, language, list }) {
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(
    file,
    `${JSON.stringify(
      { name: 'Golden Path', description, language, generatedAt: new Date().toISOString(), count: list.length, entries: list },
      null,
      2,
    )}\n`,
    'utf8',
  )
}

writeContentJson(join(publicDir, 'content.json'), {
  description:
    'Conceptos, patrones y aprendizajes transferibles para diseñar entornos donde los agentes hacen buen trabajo sin llevarse producción puesta.',
  language: 'es',
  list: entries,
})

writeContentJson(join(publicDir, 'en', 'content.json'), {
  description:
    'Transferable concepts, patterns and lessons for designing environments where agents do good work without taking production down.',
  language: 'en',
  list: libraryEn,
})

const urls = [
  { loc: `${siteUrl}/`, changefreq: 'weekly', priority: '1.0' },
  { loc: `${siteUrl}/entradas`, changefreq: 'weekly', priority: '0.8' },
  { loc: `${siteUrl}/glosario`, changefreq: 'monthly', priority: '0.7' },
  { loc: `${siteUrl}/conectar`, changefreq: 'monthly', priority: '0.5' },
  ...entries.map(entry => ({
    loc: `${siteUrl}/entrada/${entry.slug}`,
    changefreq: 'monthly',
    priority: '0.6',
  })),
]
// Versión en inglés: mismas rutas bajo `/en`.
urls.push(
  ...urls.map(url => ({
    ...url,
    loc: url.loc.replace(siteUrl, `${siteUrl}/en`).replace(/\/en\/$/, '/en'),
  })),
)

writeFileSync(
  join(publicDir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    url =>
      `  <url>\n    <loc>${url.loc}</loc>\n    <changefreq>${url.changefreq}</changefreq>\n    <priority>${url.priority}</priority>\n  </url>`,
  )
  .join('\n')}
</urlset>
`,
  'utf8',
)

writeFileSync(
  join(publicDir, 'robots.txt'),
  `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`,
  'utf8',
)

/**
 * `llms.txt` (https://llmstxt.org): índice en Markdown para agentes que no usan
 * MCP, en los dos idiomas. Existe también en el deploy estático puro, donde
 * `/mcp` no está.
 */
function llmsIndex(list, { areaLabel, entryBase }) {
  return AREA_ORDER.map(area => ({ area, items: list.filter(entry => entry.area === area) }))
    .filter(group => group.items.length)
    .map(
      group =>
        `## ${areaLabel(group.area)}\n\n${group.items
          .map(entry => `- [${entry.title}](${siteUrl}${entryBase}/${entry.slug}): ${entry.summary}`)
          .join('\n')}`,
    )
    .join('\n\n')
}

writeFileSync(
  join(publicDir, 'llms.txt'),
  `# Golden Path

> Biblioteca editorial en español sobre cómo diseñar entornos donde los agentes de IA hacen buen trabajo sin llevarse producción puesta: conceptos, patrones, guías y casos reales anonimizados.

## Acceso para agentes

- [Servidor MCP](${siteUrl}/mcp): Streamable HTTP, público y de sólo lectura. Sirve en inglés por defecto; con language "es", en español. Instrucciones en ${siteUrl}/conectar
- [Biblioteca completa en JSON](${siteUrl}/content.json): todas las entradas con su Markdown original
- [Glosario](${siteUrl}/glosario): vocabulario de referencia
- [English version](${siteUrl}/en/llms.txt): este índice en inglés

${llmsIndex(entries, { areaLabel: area => area, entryBase: '/entrada' })}
`,
  'utf8',
)

writeFileSync(
  join(publicDir, 'en', 'llms.txt'),
  `# Golden Path

> Editorial library on designing environments where AI agents do good work without taking production down: concepts, patterns, guides and anonymized real-world cases.

## Agent access

- [MCP server](${siteUrl}/mcp): Streamable HTTP, public and read-only. Serves English by default. Setup: ${siteUrl}/en/conectar
- [Full library as JSON](${siteUrl}/en/content.json): every entry with its original Markdown
- [Glossary](${siteUrl}/en/glosario): reference vocabulary
- [Versión en español](${siteUrl}/llms.txt): this index in the original Spanish

${llmsIndex(libraryEn, {
  areaLabel: area => AREA_LABELS_EN[area] ?? area,
  entryBase: '/en/entrada',
})}
`,
  'utf8',
)

console.log(`Artefactos:          public/{,en/}content.json, public/{,en/}llms.txt, public/sitemap.xml, public/robots.txt (${urls.length} URLs)`)

if (problems.length) {
  console.error(`\nAdvertencias (${problems.length}):`)
  for (const problem of problems) console.error(`  · ${problem}`)
  process.exitCode = 1
}
