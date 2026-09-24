import type { EntryType, LibraryEntry } from './types/library'

/**
 * Constantes y búsqueda de la biblioteca. Viven en `shared/` porque las usan
 * tanto el sitio (`useLibrary`) como el servidor MCP (`server/routes/mcp.ts`),
 * y así la paleta de búsqueda y los agentes encuentran lo mismo.
 */

/** Orden editorial de los recorridos. */
export const AREA_ORDER = [
  'Toda la biblioteca',
  'Gobierno de agentes',
  'Orca',
  'Diseño agéntico',
  'Hermes',
  'CRM versionado',
  'Casos de producto',
]

/** Glifo decorativo por área (identidad del sitio original). */
export const AREA_GLYPHS: Record<string, string> = {
  'Toda la biblioteca': '◎',
  'Gobierno de agentes': '⚿',
  Orca: '◉',
  'Diseño agéntico': '✦',
  Hermes: '✦',
  'CRM versionado': '▣',
  'Casos de producto': '◆',
}

export const TYPE_LABELS: Record<EntryType, string> = {
  concept: 'Concepto',
  guide: 'Guía',
  editorial: 'Editorial',
  'case-study': 'Caso real',
}

export const ALL_AREAS = 'Toda la biblioteca'
export const ALL_TYPES = 'Todos'

export interface SearchIndexItem {
  entry: LibraryEntry
  /** Texto buscable en minúsculas: metadatos más el cuerpo completo. */
  haystack: string
}

/** Arma el índice de búsqueda. Incluye el cuerpo completo de cada entrada. */
export function buildSearchIndex(entries: LibraryEntry[]): SearchIndexItem[] {
  return entries.map(entry => ({
    entry,
    haystack: [
      entry.title,
      entry.summary,
      entry.area,
      TYPE_LABELS[entry.type],
      ...entry.tags,
      entry.raw,
    ]
      .join(' ')
      .toLocaleLowerCase('es'),
  }))
}

/** Normaliza para comparar sin mayúsculas ni tildes. */
export function fold(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLocaleLowerCase('es')
}

/** Mismo algoritmo que `scripts/build-content.mjs` usa para los ids de h2/h3. */
export function slugify(text: string): string {
  return fold(text)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
