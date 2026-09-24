/**
 * Metadatos del servidor MCP. Los consumen `server/routes/mcp.ts` (lo que ve
 * el agente) y `app/pages/conectar.vue` (lo que ve la persona), así la página
 * nunca describe tools que el servidor no tiene.
 */

export const MCP_PATH = '/mcp'

export const MCP_SERVER_NAME = 'golden-path'

export const MCP_INSTRUCTIONS = [
  'Golden Path es una biblioteca editorial en español sobre cómo diseñar entornos donde los agentes de IA',
  'hacen buen trabajo sin llevarse producción puesta: gobierno de agentes, orquestación multiagente,',
  'worktrees, Orca, Hermes, Amp, OpenDesign, CRM versionado y casos reales anonimizados.',
  'Usá `buscar_entradas` para encontrar entradas por tema, `leer_entrada` para leer una completa',
  '(o una sola sección), `listar_entradas` para ver el índice y `consultar_glosario` para definiciones.',
  'Citá la URL de la entrada cuando uses su contenido.',
].join(' ')

export interface McpToolInfo {
  name: string
  title: string
  description: string
  /** Parámetros, en texto, para la página pública. */
  params: string
}

export const MCP_TOOLS = {
  buscar: {
    name: 'buscar_entradas',
    title: 'Buscar entradas',
    description:
      'Busca en las entradas de Golden Path por texto libre (título, resumen, tags y cuerpo completo). '
      + 'Devuelve las más relevantes con slug, resumen, área, tipo, URL y un fragmento donde aparece la coincidencia.',
    params: 'consulta, area?, tipo?, limite?',
  },
  leer: {
    name: 'leer_entrada',
    title: 'Leer una entrada',
    description:
      'Devuelve una entrada completa en Markdown, con sus metadatos, secciones y entradas relacionadas. '
      + 'Con `seccion` (id o título de un h2/h3) devuelve sólo esa sección.',
    params: 'slug, seccion?',
  },
  listar: {
    name: 'listar_entradas',
    title: 'Listar entradas',
    description:
      'Índice de la biblioteca agrupado por área (recorrido), con slug, título, tipo y resumen de cada entrada.',
    params: 'area?, tipo?',
  },
  glosario: {
    name: 'consultar_glosario',
    title: 'Consultar el glosario',
    description:
      'Definiciones del vocabulario de Golden Path (ADE, harness, worktree, MCP…). '
      + 'Sin `termino` devuelve el glosario completo.',
    params: 'termino?',
  },
} satisfies Record<string, McpToolInfo>
