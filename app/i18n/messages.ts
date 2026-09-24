/**
 * Textos de interfaz por idioma. El español es la fuente: el inglés tiene que
 * declarar exactamente las mismas claves (lo verifica el tipo `Messages`).
 *
 * Los `{param}` se interpolan con `t('clave', { param })`.
 */
const es = {
  'site.description':
    'Golden Path: conceptos, patrones y aprendizajes transferibles para diseñar entornos donde los agentes hacen buen trabajo sin llevarse producción puesta.',
  'site.ogAlt': 'Una figura con túnica blanca camina hacia un horizonte dorado en un paisaje egipcio psicodélico',
  'site.skip': 'Ir a la biblioteca',
  'site.jsonTitle': 'Biblioteca completa en JSON',

  'locale.label': 'Idioma',
  'locale.switchTo': 'Ver en {language}',

  'area.Toda la biblioteca': 'Toda la biblioteca',
  'area.Gobierno de agentes': 'Gobierno de agentes',
  'area.Orca': 'Orca',
  'area.Diseño agéntico': 'Diseño agéntico',
  'area.Hermes': 'Hermes',
  'area.CRM versionado': 'CRM versionado',
  'area.Casos de producto': 'Casos de producto',

  'type.all': 'Todos',
  'type.concept': 'Concepto',
  'type.guide': 'Guía',
  'type.editorial': 'Editorial',
  'type.case-study': 'Caso real',
  'type.fallback': 'Entrada',

  'hero.kicker': 'Manual vivo · casos anonimizados',
  'hero.lead':
    'Conceptos, patrones y aprendizajes transferibles para diseñar entornos donde los agentes puedan hacer buen trabajo sin llevarse producción puesta.',
  'hero.search': 'Buscar en la biblioteca',
  'hero.index': 'Índice completo',
  'hero.indexHover': 'Ver {total} entradas',
  'hero.entries': 'entradas',

  'home.title': 'Biblioteca de conceptos y casos',
  'home.description':
    'Conceptos, patrones y casos reales anonimizados sobre Orca, Hermes, Amp, OpenDesign y el gobierno de agentes en entornos de desarrollo.',
  'home.ogDescription':
    'Manual vivo sobre cómo diseñar entornos donde los agentes hacen buen trabajo sin llevarse producción puesta.',
  'home.resultsFor': 'Resultados para “{query}”',
  'home.pickDoor': 'Elegí una puerta de entrada',
  'home.explore': 'Explorá {area}',
  'home.emptyTitle': 'No apareció nada por ese sendero',
  'home.emptyText': 'Probá con otra palabra o volvé a toda la biblioteca.',
  'home.clear': 'Limpiar filtros',

  'rail.label': 'Explorar la biblioteca',
  'rail.title': 'Recorridos',
  'rail.tip': 'Cada entrada se puede copiar o descargar en Markdown para pasarle contexto limpio a otro agente.',
  'rail.glossary': 'Abrir el glosario',

  'catalog.searchLabel': 'Buscar conceptos',
  'catalog.placeholder': 'Buscar concepto, herramienta o proceso…',
  'catalog.palette': 'Paleta de comandos',
  'catalog.filterType': 'Filtrar por tipo',

  'entry.copy': 'Copiar contexto',
  'entry.copied': 'Contexto copiado en Markdown',
  'entry.download': 'Descargar .md',
  'entry.downloaded': 'Markdown descargado',
  'entry.openPage': 'Abrir página completa',
  'entry.continue': 'Seguí por acá',
  'entry.toc': 'En esta entrada',
  'entry.notFound': 'Esa entrada no existe en la biblioteca',
  'entry.breadcrumbs': 'Migas de pan',
  'entry.library': 'Biblioteca',
  'entry.back': '← Volver a la biblioteca',
  'entry.openReader': 'Abrir en el lector',
  'entry.fallbackTitle': 'Entrada',

  'reader.close': 'Cerrar lectura',

  'index.title': 'Índice completo',
  'index.description':
    'Las {count} entradas de Golden Path, agrupadas por recorrido: gobierno de agentes, Orca, diseño agéntico, Hermes, CRM versionado y casos de producto.',
  'index.kicker': 'Biblioteca completa',
  'index.lead':
    'Las {count} entradas de Golden Path, agrupadas por recorrido. Cada una tiene su propia página y se puede copiar o descargar en Markdown.',
  'index.back': '← Volver al catálogo',
  'index.lookingFor': '¿Buscabas una definición?',
  'index.toGlossary': 'Ir al glosario',
  'index.openReader': 'Abrir el lector',

  'glossary.title': 'Glosario',
  'glossary.description':
    'Glosario de {count} términos esenciales: ADE, harness, worktree, MCP, Orb, Runner, DESIGN.md y el resto del vocabulario de Golden Path.',
  'glossary.kicker': 'Referencia rápida',
  'glossary.lead':
    '{count} conceptos esenciales del vocabulario de Golden Path. Cada término con entrada propia enlaza al contexto donde se explica.',
  'glossary.reveal': 'El vocabulario compartido del trabajo con agentes',
  'glossary.inContext': 'Leer en contexto →',
  'glossary.close': 'Cerrar glosario',
  'glossary.searchLabel': 'Buscar en el glosario',
  'glossary.placeholder': 'Buscar Orca, CLI, harness…',
  'glossary.count': '{count} conceptos esenciales',
  'glossary.result': '{count} resultado',
  'glossary.results': '{count} resultados',
  'glossary.empty': 'No encontré ese concepto todavía.',

  'palette.index': 'Ver el índice completo',
  'palette.glossary': 'Abrir el glosario',
  'palette.nav': 'Navegación',

  'footer.rights': 'All rights reserved · Autor',
  'footer.entries': '{count} entradas',
  'footer.index': 'índice completo',
  'footer.glossary': 'glosario',
  'footer.mcp': 'MCP para agentes',
  'footer.socials': 'Redes sociales de D_Maledicte',

  'connect.title': 'Conectar agentes (MCP)',
  'connect.description':
    'Conectá Claude, Cursor o VS Code a Golden Path por MCP: tu agente puede buscar y leer las {count} entradas y el glosario mientras trabaja. Público, gratuito y de sólo lectura.',
  'connect.heading': 'Conectá tu agente',
  'connect.lead':
    'Golden Path tiene un servidor MCP público. Conectalo una vez y tu agente puede buscar, leer y citar las {count} entradas y el glosario mientras trabaja, sin copiar y pegar. Es de sólo lectura, gratuito y no pide cuenta.',
  'connect.contentNote':
    'El servidor MCP sirve la biblioteca en inglés por defecto; pedile language: "es" para el original en español.',
  'connect.copyUrl': 'Copiar URL',
  'connect.endpointNote':
    'Transporte Streamable HTTP, sin autenticación. El endpoint sólo acepta POST: si lo abrís en el navegador, te trae a esta página.',
  'connect.install': 'Instalación',
  'connect.clientTabs': 'Cliente MCP',
  'connect.copyConfig': 'Copiar configuración de {client}',
  'connect.copy': 'Copiar',
  'connect.tools': 'Qué puede hacer tu agente',
  'connect.try': 'Para probarlo',
  'connect.tryLead': 'Una vez conectado, pedíselo a tu agente con tus palabras. Por ejemplo:',
  'connect.noMcp': 'Sin MCP',
  'connect.noMcpBefore': 'Si tu herramienta no soporta MCP, pasale uno de estos archivos como contexto:',
  'connect.noMcpIndex': '(índice con resúmenes y enlaces) o',
  'connect.noMcpAfter':
    '(la biblioteca completa). Cada entrada también se puede copiar o descargar en Markdown desde su página.',
  'connect.copied': '{what} copiado',
  'connect.copyFailed': 'No se pudo copiar: seleccioná el texto a mano',
  'connect.what.endpoint': 'Endpoint',
  'connect.what.config': 'Configuración',
  'connect.what.example': 'Ejemplo',
  'connect.claudeCode.where': 'En la terminal, dentro de cualquier proyecto:',
  'connect.claude.label': 'Claude (web y desktop)',
  'connect.claude.where': 'Desde la configuración de tu cuenta:',
  'connect.claude.step1': 'Abrí Configuración → Conectores.',
  'connect.claude.step2': 'Elegí «Agregar conector personalizado».',
  'connect.claude.step3': 'Nombre: Golden Path · URL: {endpoint}',
  'connect.claude.step4': 'No pide autenticación: la biblioteca es pública.',
  'connect.cursor.where': 'En ~/.cursor/mcp.json (global) o .cursor/mcp.json (por proyecto):',
  'connect.vscode.where': 'En .vscode/mcp.json:',
  'connect.example1': '¿Qué dice Golden Path sobre usar worktrees con varios agentes en paralelo?',
  'connect.example2': 'Revisá mi setup de agentes contra las entradas de gobierno de agentes y decime qué me falta.',
  'connect.example3': 'Explicame qué es un ADE según el glosario de Golden Path y dame la entrada donde se desarrolla.',

  'error.notFoundTitle': 'Sendero no encontrado',
  'error.genericTitle': 'Algo se rompió',
  'error.notFoundHeading': 'Ese sendero no existe',
  'error.genericHeading': 'Algo se rompió en el camino',
  'error.notFoundText':
    'La entrada que buscás no está en la biblioteca. Probá desde el catálogo o el índice completo.',
  'error.genericText': 'Ocurrió un error inesperado. Volver al catálogo suele resolverlo.',
  'error.home': 'Volver al catálogo',
  'error.index': 'Ver el índice completo',
}

export type MessageKey = keyof typeof es
export type Messages = Record<MessageKey, string>

const en: Messages = {
  'site.description':
    'Golden Path: transferable concepts, patterns and lessons for designing environments where agents do good work without taking production down with them.',
  'site.ogAlt': 'A figure in a white robe walks toward a golden horizon across a psychedelic Egyptian landscape',
  'site.skip': 'Skip to the library',
  'site.jsonTitle': 'Full library as JSON',

  'locale.label': 'Language',
  'locale.switchTo': 'View in {language}',

  'area.Toda la biblioteca': 'Whole library',
  'area.Gobierno de agentes': 'Agent governance',
  'area.Orca': 'Orca',
  'area.Diseño agéntico': 'Agentic design',
  'area.Hermes': 'Hermes',
  'area.CRM versionado': 'Versioned CRM',
  'area.Casos de producto': 'Product cases',

  'type.all': 'All',
  'type.concept': 'Concept',
  'type.guide': 'Guide',
  'type.editorial': 'Editorial',
  'type.case-study': 'Case study',
  'type.fallback': 'Entry',

  'hero.kicker': 'Living handbook · anonymized cases',
  'hero.lead':
    'Transferable concepts, patterns and lessons for designing environments where agents can do good work without taking production down with them.',
  'hero.search': 'Search the library',
  'hero.index': 'Full index',
  'hero.indexHover': 'See {total} entries',
  'hero.entries': 'entries',

  'home.title': 'Library of concepts and cases',
  'home.description':
    'Concepts, patterns and anonymized real-world cases about Orca, Hermes, Amp, OpenDesign and agent governance in development environments.',
  'home.ogDescription':
    'A living handbook on designing environments where agents do good work without taking production down with them.',
  'home.resultsFor': 'Results for “{query}”',
  'home.pickDoor': 'Pick a way in',
  'home.explore': 'Explore {area}',
  'home.emptyTitle': 'Nothing turned up on that path',
  'home.emptyText': 'Try another word or go back to the whole library.',
  'home.clear': 'Clear filters',

  'rail.label': 'Explore the library',
  'rail.title': 'Paths',
  'rail.tip': 'Every entry can be copied or downloaded as Markdown to hand clean context to another agent.',
  'rail.glossary': 'Open the glossary',

  'catalog.searchLabel': 'Search concepts',
  'catalog.placeholder': 'Search a concept, tool or process…',
  'catalog.palette': 'Command palette',
  'catalog.filterType': 'Filter by type',

  'entry.copy': 'Copy context',
  'entry.copied': 'Context copied as Markdown',
  'entry.download': 'Download .md',
  'entry.downloaded': 'Markdown downloaded',
  'entry.openPage': 'Open full page',
  'entry.continue': 'Keep going',
  'entry.toc': 'In this entry',
  'entry.notFound': 'That entry does not exist in the library',
  'entry.breadcrumbs': 'Breadcrumbs',
  'entry.library': 'Library',
  'entry.back': '← Back to the library',
  'entry.openReader': 'Open in the reader',
  'entry.fallbackTitle': 'Entry',

  'reader.close': 'Close reader',

  'index.title': 'Full index',
  'index.description':
    'All {count} Golden Path entries, grouped by path: agent governance, Orca, agentic design, Hermes, versioned CRM and product cases.',
  'index.kicker': 'Full library',
  'index.lead':
    'All {count} Golden Path entries, grouped by path. Each one has its own page and can be copied or downloaded as Markdown.',
  'index.back': '← Back to the catalog',
  'index.lookingFor': 'Looking for a definition?',
  'index.toGlossary': 'Go to the glossary',
  'index.openReader': 'Open the reader',

  'glossary.title': 'Glossary',
  'glossary.description':
    'Glossary of {count} essential terms: ADE, harness, worktree, MCP, Orb, Runner, DESIGN.md and the rest of the Golden Path vocabulary.',
  'glossary.kicker': 'Quick reference',
  'glossary.lead':
    '{count} essential concepts from the Golden Path vocabulary. Every term with its own entry links to the context where it is explained.',
  'glossary.reveal': 'The shared vocabulary of working with agents',
  'glossary.inContext': 'Read in context →',
  'glossary.close': 'Close glossary',
  'glossary.searchLabel': 'Search the glossary',
  'glossary.placeholder': 'Search Orca, CLI, harness…',
  'glossary.count': '{count} essential concepts',
  'glossary.result': '{count} result',
  'glossary.results': '{count} results',
  'glossary.empty': 'I have not found that concept yet.',

  'palette.index': 'See the full index',
  'palette.glossary': 'Open the glossary',
  'palette.nav': 'Navigation',

  'footer.rights': 'All rights reserved · Author',
  'footer.entries': '{count} entries',
  'footer.index': 'full index',
  'footer.glossary': 'glossary',
  'footer.mcp': 'MCP for agents',
  'footer.socials': 'D_Maledicte on social media',

  'connect.title': 'Connect agents (MCP)',
  'connect.description':
    'Connect Claude, Cursor or VS Code to Golden Path over MCP: your agent can search and read all {count} entries and the glossary while it works. Public, free and read-only.',
  'connect.heading': 'Connect your agent',
  'connect.lead':
    'Golden Path has a public MCP server. Connect it once and your agent can search, read and cite all {count} entries and the glossary while it works, with no copy and paste. It is read-only, free and needs no account.',
  'connect.contentNote':
    'The MCP server serves the library in English by default; pass language: "es" for the original Spanish.',
  'connect.copyUrl': 'Copy URL',
  'connect.endpointNote':
    'Streamable HTTP transport, no authentication. The endpoint only accepts POST: opening it in a browser brings you to this page.',
  'connect.install': 'Setup',
  'connect.clientTabs': 'MCP client',
  'connect.copyConfig': 'Copy {client} configuration',
  'connect.copy': 'Copy',
  'connect.tools': 'What your agent can do',
  'connect.try': 'Try it',
  'connect.tryLead': 'Once connected, ask your agent in your own words. For example:',
  'connect.noMcp': 'Without MCP',
  'connect.noMcpBefore': 'If your tool does not support MCP, give it one of these files as context:',
  'connect.noMcpIndex': '(index with summaries and links) or',
  'connect.noMcpAfter': '(the full library). Every entry can also be copied or downloaded as Markdown from its page.',
  'connect.copied': '{what} copied',
  'connect.copyFailed': 'Could not copy: select the text by hand',
  'connect.what.endpoint': 'Endpoint',
  'connect.what.config': 'Configuration',
  'connect.what.example': 'Example',
  'connect.claudeCode.where': 'In the terminal, inside any project:',
  'connect.claude.label': 'Claude (web and desktop)',
  'connect.claude.where': 'From your account settings:',
  'connect.claude.step1': 'Open Settings → Connectors.',
  'connect.claude.step2': 'Choose “Add custom connector”.',
  'connect.claude.step3': 'Name: Golden Path · URL: {endpoint}',
  'connect.claude.step4': 'No authentication needed: the library is public.',
  'connect.cursor.where': 'In ~/.cursor/mcp.json (global) or .cursor/mcp.json (per project):',
  'connect.vscode.where': 'In .vscode/mcp.json:',
  'connect.example1': 'What does Golden Path say about using worktrees with several agents in parallel?',
  'connect.example2': 'Check my agent setup against the agent governance entries and tell me what I am missing.',
  'connect.example3': 'Explain what an ADE is according to the Golden Path glossary and point me to the entry that covers it.',

  'error.notFoundTitle': 'Path not found',
  'error.genericTitle': 'Something broke',
  'error.notFoundHeading': 'That path does not exist',
  'error.genericHeading': 'Something broke along the way',
  'error.notFoundText': 'The entry you are looking for is not in the library. Try the catalog or the full index.',
  'error.genericText': 'An unexpected error occurred. Going back to the catalog usually fixes it.',
  'error.home': 'Back to the catalog',
  'error.index': 'See the full index',
}

export const LOCALES = ['es', 'en'] as const
export type Locale = (typeof LOCALES)[number]

export const LOCALE_META: Record<Locale, { label: string, name: string, htmlLang: string, og: string }> = {
  es: { label: 'ES', name: 'español', htmlLang: 'es', og: 'es_AR' },
  en: { label: 'EN', name: 'English', htmlLang: 'en', og: 'en_US' },
}

export const messages: Record<Locale, Messages> = { es, en }
