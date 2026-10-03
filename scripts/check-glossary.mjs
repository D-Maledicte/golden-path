/** Validate the shared website/MCP glossary without requiring a Nuxt build. */
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import matter from 'gray-matter'
import ts from 'typescript'

const root = new URL('../', import.meta.url)
const source = readFileSync(new URL('app/data/glossary.ts', root), 'utf8')
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
})
const { glossary, glossaryEn, glossaryFor } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
)

function articleSlugs(locale) {
  const directory = new URL(locale === 'en' ? 'content/en/' : 'content/', root)
  return new Set(readdirSync(directory)
    .filter(file => file.endsWith('.md'))
    .map(file => matter(readFileSync(new URL(file, directory), 'utf8')).data.slug))
}

// Mirrors the stable IDs rendered by pages/glosario.vue.
function anchor(term) {
  return term.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

assert.ok(glossary.length > 0, 'The glossary must not be empty')
assert.equal(glossary.length, glossaryEn.length, 'ES/EN must have matching term counts')
assert.equal(glossaryFor('es'), glossary)
assert.equal(glossaryFor('en'), glossaryEn)
assert.deepEqual(glossary.map(item => item.slug), glossaryEn.map(item => item.slug),
  'ES/EN entries must retain matching context links in the same order')

for (const [locale, terms] of [['es', glossary], ['en', glossaryEn]]) {
  const slugs = articleSlugs(locale)
  const names = new Set()
  const anchors = new Set()
  for (const item of terms) {
    const label = `${locale}: ${item.term}`
    assert.ok(item.term?.trim(), `Missing term: ${label}`)
    assert.equal(item.term, item.term.trim(), `Whitespace in term: ${label}`)
    assert.ok(item.definition?.trim(), `Missing definition: ${label}`)
    const name = item.term.toLocaleLowerCase(locale)
    assert.ok(!names.has(name), `Duplicate term: ${label}`)
    names.add(name)
    const id = anchor(item.term)
    assert.ok(id && !anchors.has(id), `Empty or duplicate anchor: ${label}`)
    anchors.add(id)
    assert.ok(item.slug && slugs.has(item.slug), `Missing context article: ${label} → ${item.slug}`)
  }
  console.log(`✓ ${locale}: ${terms.length} terms, unique anchors and valid context articles`)
}
console.log('✓ Shared glossary validated')
