#!/usr/bin/env node
/**
 * Descarga componentes del registry nxui vía su servidor MCP remoto y los
 * escribe en `app/components/ui/<nombre>/`.
 *
 * Uso:
 *   node scripts/fetch-nxui.mjs            # escribe los componentes
 *   node scripts/fetch-nxui.mjs --inspect  # sólo reporta dependencias
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const MCP_URL = 'https://nxui.geoql.in/mcp'
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const inspectOnly = process.argv.includes('--inspect')

/** Componentes de nxui que usa el rediseño. */
const COMPONENTS = [
  // atmósfera
  'soft-aurora',
  'noise-texture',
  'dot-grid',
  // texto
  'hyper-text',
  'blur-text',
  'text-animate',
  'count-up',
  'gradient-text',
  // superficies
  'spotlight-card',
  'border-beam',
  'glass-surface',
  'star-border',
  // botones
  'shimmer-button',
  'interactive-hover-button',
  // listas y navegación
  'animated-list',
  'animated-toc',
  'magnet',
  'scroll-reveal',
  // búsqueda
  'command-menu',
]

let nextId = 1

async function callTool(name, args) {
  const response = await fetch(MCP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: nextId++,
      method: 'tools/call',
      params: { name, arguments: args },
    }),
  })
  if (!response.ok) throw new Error(`MCP ${response.status} para ${args.name ?? ''}`)
  const payload = await response.json()
  if (payload.error) throw new Error(payload.error.message)
  return payload.result.content.map(chunk => chunk.text).join('\n')
}

/** `## <ruta>\n\n```vue\n<fuente>\n```` */
function parseFiles(markdown) {
  const files = []
  const pattern = /^## (.+?)\n\n```[a-z]*\n([\s\S]*?)\n```\s*$/gm
  for (const match of markdown.matchAll(pattern)) {
    files.push({ path: match[1].trim(), source: match[2] })
  }
  return files
}

const report = []
const npmDeps = new Set()
const registryDeps = new Set()
let written = 0

for (const name of COMPONENTS) {
  let markdown
  try {
    markdown = await callTool('get_component', { name })
  } catch (error) {
    report.push(`✗ ${name.padEnd(24)} ERROR: ${error.message}`)
    continue
  }

  const npm = markdown.match(/npm dependencies: (.+)/)?.[1]?.trim() ?? '—'
  const registry = markdown.match(/registry dependencies: (.+)/)?.[1]?.trim() ?? '—'
  const files = parseFiles(markdown)

  if (npm !== '—') npm.split(',').map(d => d.trim()).filter(Boolean).forEach(d => npmDeps.add(d))
  if (registry !== '—') registry.split(',').map(d => d.trim()).filter(Boolean).forEach(d => registryDeps.add(d))

  report.push(`${files.length ? '✓' : '✗'} ${name.padEnd(24)} files=${String(files.length).padEnd(2)} npm=[${npm}] registry=[${registry}]`)

  if (inspectOnly || !files.length) continue

  for (const file of files) {
    // Los `index.ts` sólo sirven para imports explícitos; con el auto-import de
    // Nuxt colisionan con el componente principal (mismo nombre resuelto).
    if (file.path.endsWith('/index.ts')) continue
    const target = join(projectRoot, 'app', file.path)
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, `${file.source.replace(/\s+$/, '')}\n`, 'utf8')
    written += 1
  }
}

console.log(report.join('\n'))
console.log('')
console.log(`Componentes:        ${COMPONENTS.length}`)
console.log(`Archivos escritos:  ${inspectOnly ? '(inspect)' : written}`)
console.log(`npm deps totales:   ${[...npmDeps].sort().join(', ') || '—'}`)
console.log(`registry deps:      ${[...registryDeps].sort().join(', ') || '—'}`)
