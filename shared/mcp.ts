/**
 * Metadatos del servidor MCP. Los consumen `server/routes/mcp.ts` (lo que ve
 * el agente) y `app/pages/conectar.vue` (lo que ve la persona), así la página
 * nunca describe tools que el servidor no tiene.
 *
 * La interfaz del servidor es en inglés (nombres de tools, parámetros y la
 * copia de `en`, que es lo que lee el agente). `title` y `description` en la
 * raíz son la copia en español para la página.
 */

export const MCP_PATH = '/mcp'

export const MCP_SERVER_NAME = 'golden-path'

export const MCP_INSTRUCTIONS = [
  'Golden Path is an editorial library about designing environments where AI agents do good work',
  'without taking production down: agent governance, multi-agent orchestration, worktrees, Orca,',
  'Hermes, Amp, OpenDesign, versioned CRM and anonymized real-world cases.',
  'Use `search_entries` to find entries by topic, `read_entry` to read one in full (or a single section),',
  '`list_entries` for the index and `lookup_glossary` for definitions.',
  'Content is served in English by default; pass `language: "es"` for the original Spanish.',
  'Entries not yet translated are returned in Spanish and flagged as such.',
  'Cite the entry URL when you use its content.',
].join(' ')

/**
 * Etiquetas en inglés de las áreas. El id de cada área es su nombre en español
 * (así viene en el frontmatter); el agente las ve y las pasa en inglés.
 */
export const MCP_AREA_LABELS_EN: Record<string, string> = {
  'Gobierno de agentes': 'Agent governance',
  Orca: 'Orca',
  'Diseño agéntico': 'Agentic design',
  Hermes: 'Hermes',
  'CRM versionado': 'Versioned CRM',
  'Casos de producto': 'Product cases',
}

export const MCP_TYPE_LABELS_EN = {
  concept: 'Concept',
  guide: 'Guide',
  editorial: 'Editorial',
  'case-study': 'Case study',
} as const

export interface McpToolInfo {
  name: string
  /** Parámetros, en texto, para la página pública. */
  params: string
  /** Copia en español, para la página. */
  title: string
  description: string
  /** Copia en inglés: la que recibe el agente (y la página en `/en`). */
  en: { title: string, description: string }
}

export const MCP_TOOLS = {
  buscar: {
    name: 'search_entries',
    params: 'query, area?, type?, limit?, language?',
    title: 'Buscar entradas',
    description:
      'Busca en las entradas de Golden Path por texto libre (título, resumen, tags y cuerpo completo). '
      + 'Devuelve las más relevantes con slug, resumen, área, tipo, URL y un fragmento donde aparece la coincidencia.',
    en: {
      title: 'Search entries',
      description:
        'Full-text search across Golden Path entries (title, summary, tags and full body). '
        + 'Returns the most relevant ones with slug, summary, area, type, URL and a snippet where the match appears.',
    },
  },
  leer: {
    name: 'read_entry',
    params: 'slug, section?, language?',
    title: 'Leer una entrada',
    description:
      'Devuelve una entrada completa en Markdown, con sus metadatos, secciones y entradas relacionadas. '
      + 'Con `section` (id o título de un h2/h3) devuelve sólo esa sección.',
    en: {
      title: 'Read an entry',
      description:
        'Returns a full entry as Markdown, with its metadata, sections and related entries. '
        + 'With `section` (the id or title of an h2/h3) it returns only that section.',
    },
  },
  listar: {
    name: 'list_entries',
    params: 'area?, type?, language?',
    title: 'Listar entradas',
    description:
      'Índice de la biblioteca agrupado por área (recorrido), con slug, título, tipo y resumen de cada entrada.',
    en: {
      title: 'List entries',
      description:
        'Library index grouped by area (learning path), with the slug, title, type and summary of each entry.',
    },
  },
  glosario: {
    name: 'lookup_glossary',
    params: 'term?, language?',
    title: 'Consultar el glosario',
    description:
      'Definiciones del vocabulario de Golden Path (ADE, harness, worktree, MCP…). '
      + 'Sin `term` devuelve el glosario completo.',
    en: {
      title: 'Look up the glossary',
      description:
        'Definitions of Golden Path vocabulary (ADE, harness, worktree, MCP…). '
        + 'Without `term` it returns the whole glossary.',
    },
  },
} satisfies Record<string, McpToolInfo>
