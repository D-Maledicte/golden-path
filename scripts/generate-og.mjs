#!/usr/bin/env node
/**
 * Genera las imágenes de previsualización (Open Graph) para compartir enlaces.
 *
 *   public/og/golden-path.jpg     → tarjeta del sitio (1200x630)
 *   public/og/<slug>.jpg          → una tarjeta por entrada, con su título
 *
 * Decisiones:
 *  - La tarjeta del sitio usa la obra completa, que ya trae "GOLDEN PATH"
 *    horneado: no hace falta renderizar texto y es la que mejor se ve.
 *  - Las tarjetas de entrada usan la parte baja de la obra (sin el título
 *    horneado) para que el único texto sea el título de la entrada.
 *  - El resultado se versiona en el repo. No se regenera en cada build: así las
 *    imágenes son estables y no dependen de las fuentes que tenga el runner.
 *    Correr `npm run og` cuando cambien títulos o se agregue una entrada.
 *
 * Uso: node scripts/generate-og.mjs
 */
import { mkdirSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import sharp from 'sharp'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const artwork = join(projectRoot, 'public', 'assets', 'golden-path-banner.png')
const contentDir = join(projectRoot, 'content')
const outDir = join(projectRoot, 'public', 'og')

const WIDTH = 1200
const HEIGHT = 630

/** Banda de la obra que queda por debajo del "GOLDEN PATH" horneado. */
const ARTWORK_TITLE_BAND = 200

const SERIF = 'Liberation Serif, DejaVu Serif, Times New Roman, serif'
const SANS = 'DejaVu Sans, Liberation Sans, Arial, sans-serif'

const kb = path => `${(statSync(path).size / 1024).toFixed(0)} KB`

const escapeXml = value =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

/**
 * Corte de línea aproximado. Sin métricas de fuente en Node, se estima el ancho
 * medio de avance por carácter y se reserva margen.
 */
function wrap(text, { fontSize, maxWidth, maxLines }) {
  const maxChars = Math.floor(maxWidth / (fontSize * 0.52))
  const words = text.split(/\s+/)
  const lines = []
  let current = ''

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (candidate.length <= maxChars) {
      current = candidate
    } else {
      if (current) lines.push(current)
      current = word
    }
  }
  if (current) lines.push(current)

  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines)
    kept[maxLines - 1] = `${kept[maxLines - 1].replace(/[,;:.]$/, '')}…`
    return kept
  }
  return lines
}

mkdirSync(outDir, { recursive: true })

/* ---------------------------------------------------------------------------
 * Tarjeta del sitio: la obra completa, recortada a 1200x630.
 * ------------------------------------------------------------------------- */
const siteTarget = join(outDir, 'golden-path.jpg')
await sharp(artwork)
  .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'center' })
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(siteTarget)
console.log(`✓ sitio            golden-path.jpg (${kb(siteTarget)})`)

/* ---------------------------------------------------------------------------
 * Tarjetas por entrada.
 * ------------------------------------------------------------------------- */
const base = await sharp(artwork)
  .extract({ left: 0, top: ARTWORK_TITLE_BAND, width: 2000, height: 771 - ARTWORK_TITLE_BAND })
  .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'center' })
  .modulate({ brightness: 0.42, saturation: 0.85 })
  .toBuffer()

const entries = readdirSync(contentDir)
  .filter(name => name.endsWith('.md'))
  .map(name => {
    const { data } = matter(readFileSync(join(contentDir, name), 'utf8'))
    return { slug: String(data.slug ?? ''), title: String(data.title ?? ''), area: String(data.area ?? '') }
  })
  .filter(entry => entry.slug && entry.title)
  .sort((a, b) => a.slug.localeCompare(b.slug, 'es'))

const TITLE_SIZE = 64
const titleLines = entries.map(entry =>
  wrap(entry.title, { fontSize: TITLE_SIZE, maxWidth: WIDTH - 160, maxLines: 3 }),
)

let generated = 0
await Promise.all(
  entries.map(async (entry, index) => {
    const lines = titleLines[index]
    const lineHeight = TITLE_SIZE * 1.14
    const blockHeight = lines.length * lineHeight
    // Bloque de texto anclado abajo, con la misma línea base que la portada.
    const firstLineY = HEIGHT - 132 - blockHeight + TITLE_SIZE * 0.82

    const text = lines
      .map(
        (line, i) =>
          `<text x="80" y="${(firstLineY + i * lineHeight).toFixed(1)}" font-family="${SERIF}" font-size="${TITLE_SIZE}" fill="#f8f3e3">${escapeXml(line)}</text>`,
      )
      .join('')

    const svg = `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#080714" stop-opacity="0.30"/>
      <stop offset="0.45" stop-color="#080714" stop-opacity="0.72"/>
      <stop offset="1" stop-color="#080714" stop-opacity="0.95"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#shade)"/>
  <rect x="80" y="${(firstLineY - TITLE_SIZE - 34).toFixed(1)}" width="72" height="3" fill="#edc35e"/>
  <text x="80" y="${(firstLineY - TITLE_SIZE - 52).toFixed(1)}" font-family="${SANS}" font-size="20" font-weight="bold" letter-spacing="3.2" fill="#edc35e">${escapeXml(entry.area.toUpperCase())}</text>
  ${text}
  <text x="${WIDTH - 80}" y="${HEIGHT - 42}" text-anchor="end" font-family="${SERIF}" font-size="22" fill="#aaa4bc">Golden Path</text>
</svg>`

    const target = join(outDir, `${entry.slug}.jpg`)
    await sharp(base)
      .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(target)
    generated += 1
  }),
)

console.log(`✓ entradas         ${generated} tarjetas`)
const total = readdirSync(outDir).reduce((sum, name) => sum + statSync(join(outDir, name)).size, 0)
console.log(`\nTotal: ${generated + 1} imágenes · ${(total / 1024).toFixed(0)} KB en public/og/`)
