/** Tipos compartidos de la biblioteca editorial. */

export type EntryType = 'concept' | 'guide' | 'editorial' | 'case-study'

export interface TocItem {
  /** Texto plano del encabezado. */
  label: string
  /** Nivel del encabezado: 2 o 3. */
  depth: number
  /** Id del encabezado en el HTML renderizado. */
  id: string
}

export interface LibraryEntry {
  slug: string
  title: string
  summary: string
  type: EntryType
  /** Orden dentro del área. */
  order: number
  tags: string[]
  related: string[]
  area: string
  glyph: string
  /** Color de acento por entrada, usado por el glow de las tarjetas. */
  hue: string
  /** Nombre del archivo Markdown de origen. */
  file: string
  /** Cuerpo renderizado a HTML en build. */
  html: string
  /** Encabezados h2/h3 para el índice lateral. */
  headings: TocItem[]
  /** Markdown original, para copiar o descargar. */
  raw: string
}

export interface GlossaryTerm {
  term: string
  definition: string
  /** Slug de la entrada donde se explica en contexto. */
  slug?: string
}
