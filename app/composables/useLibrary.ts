import { entries, generatedAt } from '~/generated/entries'
import type { EntryType, LibraryEntry } from '~/types/library'
import {
  ALL_AREAS,
  ALL_TYPES,
  AREA_GLYPHS,
  AREA_ORDER,
  TYPE_LABELS,
  buildSearchIndex,
  type SearchIndexItem,
} from '#shared/library'

export { ALL_AREAS, ALL_TYPES, AREA_GLYPHS, AREA_ORDER, TYPE_LABELS }

export type AreaFilter = string
export type TypeFilter = EntryType | 'Todos'

export interface LibraryFilters {
  area: AreaFilter
  type: TypeFilter
  query: string
}

let searchIndex: SearchIndexItem[] | null = null

/** Índice de búsqueda: se arma una vez, la primera vez que se filtra. */
function getSearchIndex() {
  searchIndex ??= buildSearchIndex(entries)
  return searchIndex
}

export function useLibrary() {
  const all = entries

  const areas = AREA_ORDER.filter(
    area => area === ALL_AREAS || all.some(entry => entry.area === area),
  )

  const types = Object.keys(TYPE_LABELS) as EntryType[]

  function bySlug(slug: string): LibraryEntry | undefined {
    return all.find(entry => entry.slug === slug)
  }

  function relatedOf(entry: LibraryEntry): LibraryEntry[] {
    return entry.related
      .map(slug => bySlug(slug))
      .filter((related): related is LibraryEntry => Boolean(related))
  }

  function filter({ area, type, query }: LibraryFilters): LibraryEntry[] {
    const needle = query.trim().toLocaleLowerCase('es')
    const index = getSearchIndex()

    return index
      .filter(({ entry, haystack }) => {
        if (area !== ALL_AREAS && entry.area !== area) return false
        if (type !== ALL_TYPES && entry.type !== type) return false
        return !needle || haystack.includes(needle)
      })
      .map(({ entry }) => entry)
  }

  function countByArea(area: string): number {
    return area === ALL_AREAS ? all.length : all.filter(entry => entry.area === area).length
  }

  function typeLabel(type: EntryType | string): string {
    return TYPE_LABELS[type as EntryType] ?? 'Entrada'
  }

  function areaGlyph(area: string): string {
    return AREA_GLYPHS[area] ?? '◇'
  }

  return {
    entries: all,
    areas,
    types,
    bySlug,
    relatedOf,
    filter,
    countByArea,
    typeLabel,
    areaGlyph,
    generatedAt,
  }
}
