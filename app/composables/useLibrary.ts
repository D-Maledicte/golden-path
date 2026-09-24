import { entries as entriesEs, entriesEn, generatedAt } from '~/generated/entries'
import type { Locale, MessageKey } from '~/i18n/messages'
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

const ENTRIES: Record<Locale, LibraryEntry[]> = { es: entriesEs, en: entriesEn }

const searchIndex: Partial<Record<Locale, SearchIndexItem[]>> = {}

/** Índice de búsqueda por idioma: se arma la primera vez que se filtra. */
function getSearchIndex(locale: Locale) {
  searchIndex[locale] ??= buildSearchIndex(ENTRIES[locale])
  return searchIndex[locale]
}

/**
 * La biblioteca en el idioma de la ruta. Las áreas se siguen identificando por
 * su nombre en español (es el id del frontmatter); `areaLabel` las traduce.
 */
export function useLibrary() {
  const { locale, t } = useI18n()
  const current = locale.value
  const all = ENTRIES[current]

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
    const needle = query.trim().toLocaleLowerCase(current)
    const index = getSearchIndex(current)

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
    return type in TYPE_LABELS ? t(`type.${type as EntryType}`) : t('type.fallback')
  }

  function areaLabel(area: string): string {
    return AREA_ORDER.includes(area) ? t(`area.${area}` as MessageKey) : area
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
    areaLabel,
    areaGlyph,
    generatedAt,
  }
}
