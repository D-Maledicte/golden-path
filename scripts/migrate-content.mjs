#!/usr/bin/env node
/**
 * Migra el contenido del sitio original (export estático) al proyecto Nuxt.
 *
 * - Copia los 23 Markdown a `content/` normalizando a LF.
 * - Inyecta `area`, `glyph` y `hue` en el frontmatter, tomándolos del manifest
 *   original (dist/app.js), para que cada entrada sea autodescriptiva.
 * - Copia los assets (favicon + banner) a `public/assets/`.
 *
 * Uso: node scripts/migrate-content.mjs [origenDist]
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync, copyFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sourceDist = resolve(process.argv[2] ?? '/mnt/d/Temp/opencode/golden-path/dist')

const sourceContent = join(sourceDist, 'content')
const sourceAssets = join(sourceDist, 'assets')
const targetContent = join(projectRoot, 'content')
const targetAssets = join(projectRoot, 'public', 'assets')

if (!existsSync(sourceContent)) {
  console.error(`No encuentro el contenido de origen en ${sourceContent}`)
  process.exit(1)
}

/** Extrae `{ file, area, glyph, hue }` del manifest embebido en app.js. */
function readManifest() {
  const app = readFileSync(join(sourceDist, 'app.js'), 'utf8')
  const entry = /file: "([^"]+)", area: "([^"]+)", glyph: "([^"]+)", hue: "([^"]+)"/g
  const map = new Map()
  for (const match of app.matchAll(entry)) {
    const [, file, area, glyph, hue] = match
    map.set(file, { area, glyph, hue })
  }
  return map
}

const manifest = readManifest()
mkdirSync(targetContent, { recursive: true })
mkdirSync(targetAssets, { recursive: true })

let migrated = 0
const missing = []

for (const file of readdirSync(sourceContent).filter((name) => name.endsWith('.md'))) {
  const raw = readFileSync(join(sourceContent, file), 'utf8').replace(/\r\n/g, '\n')
  const extra = manifest.get(file)
  if (!extra) {
    missing.push(file)
    continue
  }

  const end = raw.indexOf('\n---', 3)
  if (!raw.startsWith('---') || end === -1) {
    missing.push(`${file} (sin frontmatter válido)`)
    continue
  }

  const frontmatter = raw.slice(4, end)
  const body = raw.slice(end + 4).replace(/^\n+/, '')
  const injected = [
    frontmatter.replace(/\n+$/, ''),
    `area: ${extra.area}`,
    `glyph: ${extra.glyph}`,
    `hue: ${extra.hue}`,
  ].join('\n')

  writeFileSync(join(targetContent, file), `---\n${injected}\n---\n\n${body}`, 'utf8')
  migrated += 1
}

let assets = 0
for (const name of readdirSync(sourceAssets)) {
  copyFileSync(join(sourceAssets, name), join(targetAssets, name))
  assets += 1
}

console.log(`Entradas migradas: ${migrated}`)
console.log(`Assets copiados:   ${assets}`)
if (missing.length) {
  console.error(`Sin datos de manifest: ${missing.join(', ')}`)
  process.exitCode = 1
}
