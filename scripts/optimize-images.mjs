#!/usr/bin/env node
/**
 * Optimiza el banner del hero: genera AVIF y WebP en varios anchos a partir del
 * PNG original. El PNG se conserva como fallback para navegadores sin AVIF/WebP.
 *
 * El archivo de origen ya trae la obra completa, incluido el "GOLDEN PATH"
 * horneado en el centro. Es intencional: el hero suma su propio <h1> encima.
 *
 * Uso: node scripts/optimize-images.mjs
 */
import { readdirSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const assetsDir = join(projectRoot, 'public', 'assets')
const source = join(assetsDir, 'golden-path-banner.png')
const widths = [2000, 1400, 900]

const kb = path => `${(statSync(path).size / 1024).toFixed(0)} KB`

const meta = await sharp(source).metadata()
console.log(`Origen: ${source} (${meta.width}x${meta.height}, ${kb(source)})`)

const tasks = []
for (const width of widths) {
  for (const format of ['avif', 'webp']) {
    const suffix = width === 2000 ? '' : `-${width}`
    const target = join(assetsDir, `golden-path-banner${suffix}.${format}`)
    tasks.push(
      sharp(source)
        .resize({ width, withoutEnlargement: true })
        [format]({ quality: format === 'avif' ? 54 : 78, effort: 6 })
        .toFile(target)
        .then(() => console.log(`  → ${target.split(/[\\/]/).pop()} (${kb(target)})`)),
    )
  }
}

await Promise.all(tasks)

const generated = readdirSync(assetsDir).filter(name => name.startsWith('golden-path-banner'))
const total = generated.reduce((sum, name) => sum + statSync(join(assetsDir, name)).size, 0)
console.log(`\nVariantes: ${generated.length} · peso total del set: ${(total / 1024).toFixed(0)} KB`)
