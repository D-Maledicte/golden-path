import type { GlossaryTerm } from '~/types/library'

/**
 * Glosario de referencia rápida. Portado del sitio original (24 términos) y
 * ordenado alfabéticamente en render, no a mano.
 */
export const glossary: GlossaryTerm[] = [
  {
    term: 'ADE',
    definition:
      'Agent Development Environment: entorno pensado para ejecutar, organizar y supervisar agentes de desarrollo.',
    slug: 'orca-como-ade',
  },
  {
    term: 'Agente',
    definition:
      'Sistema que usa un modelo, instrucciones y herramientas para razonar y realizar acciones dentro de un alcance definido.',
  },
  {
    term: 'Agent-to-agent',
    definition:
      'Delegación entre agentes completos que trabajan en conversaciones y entornos separados, intercambian instrucciones o archivos y devuelven resultados.',
    slug: 'amp-fabrica-agentes-cloud',
  },
  {
    term: 'Amp',
    definition:
      'Entorno de desarrollo agéntico que reúne modelos, threads, máquinas remotas, Git y coordinación bajo una misma plataforma.',
    slug: 'amp-fabrica-agentes-cloud',
  },
  {
    term: 'BYOK',
    definition:
      'Bring Your Own Key: modalidad donde el usuario aporta una clave API y el consumo se factura directamente en la cuenta del proveedor.',
    slug: 'opendesign-integracion-local-cli-proxy',
  },
  {
    term: 'CLI',
    definition:
      'Interfaz de línea de comandos. Permite trabajar con herramientas y agentes desde una terminal, con acceso directo al proyecto y su entorno.',
    slug: 'terminal-vs-web-superficies-trabajo',
  },
  {
    term: 'CRM',
    definition:
      'Sistema que centraliza relaciones, datos y procesos comerciales. En estos casos también actúa como fuente de verdad operativa.',
    slug: 'backup-versionado-crm',
  },
  {
    term: 'Daemon',
    definition:
      'Proceso que permanece ejecutándose en segundo plano y sostiene servicios, sesiones o tareas aunque una interfaz se cierre.',
    slug: 'continuidad-y-observabilidad',
  },
  {
    term: 'DESIGN.md',
    definition:
      'Archivo portable que codifica colores, tipografía, composición y reglas visuales para que distintos agentes produzcan artefactos coherentes.',
    slug: 'opendesign-direccion-visual-agentes',
  },
  {
    term: 'Harness',
    definition:
      'El CLI o entorno que convierte las decisiones del modelo en acciones reales: leer archivos, editar código, ejecutar comandos o pedir permisos.',
    slug: 'modelos-guiados-el-entorno-es-la-politica',
  },
  {
    term: 'Hermes',
    definition:
      'Agente operativo que puede vivir en un servidor, conectarse a canales e integraciones y ejecutar tareas con continuidad.',
    slug: 'hermes-agente-operativo',
  },
  {
    term: 'MCP',
    definition:
      'Model Context Protocol: estándar para conectar agentes con herramientas y fuentes de datos mediante interfaces declaradas.',
  },
  {
    term: 'n8n',
    definition:
      'Plataforma de automatización visual usada para coordinar integraciones, webhooks y pasos entre distintos sistemas.',
  },
  {
    term: 'OpenDesign',
    definition:
      'Workspace local-first que combina agentes de código, skills, templates y sistemas DESIGN.md para producir artefactos visuales como archivos reales.',
    slug: 'opendesign-direccion-visual-agentes',
  },
  {
    term: 'Oracle',
    definition:
      'Rol de segunda opinión dentro de Amp, usado por el agente principal para consultar razonamiento, planificación o decisiones difíciles.',
    slug: 'amp-fabrica-agentes-cloud',
  },
  {
    term: 'Orb',
    definition:
      'Máquina remota, fresca y aislada donde un agente de Amp puede trabajar con código, herramientas y servicios aunque la computadora del usuario esté apagada.',
    slug: 'amp-fabrica-agentes-cloud',
  },
  {
    term: 'Orca',
    definition:
      'ADE y plano de control para organizar agentes, repositorios, workspaces, terminales y hosts sin reemplazar al modelo.',
    slug: 'orca-como-ade',
  },
  {
    term: 'Runner',
    definition:
      'Máquina propia o administrada que Amp puede usar como entorno de ejecución en lugar de un Orb de su infraestructura.',
    slug: 'amp-fabrica-agentes-cloud',
  },
  {
    term: 'SSH',
    definition:
      'Protocolo seguro para acceder y ejecutar trabajo en otra máquina o entorno, como WSL o un servidor remoto.',
    slug: 'hosts-ssh',
  },
  {
    term: 'The Dial',
    definition:
      'Selector de Amp que expresa cuánto esfuerzo requiere una tarea mediante los modos low, medium, high y ultra, independientemente del modelo asignado detrás.',
    slug: 'amp-fabrica-agentes-cloud',
  },
  {
    term: 'Thread',
    definition:
      'Conversación persistente de Amp que conserva contexto, decisiones, archivos y referencias al trabajo producido por el agente.',
    slug: 'amp-fabrica-agentes-cloud',
  },
  {
    term: 'Worktree',
    definition:
      'Copia de trabajo aislada de Git, asociada a una rama, que permite desarrollar tareas en paralelo sin mezclar archivos.',
    slug: 'workspaces-y-worktrees',
  },
  {
    term: 'Workspace',
    definition:
      'Frente de trabajo visible que agrupa tabs, terminales, editores y una tarea; no equivale por sí mismo al aislamiento de Git.',
    slug: 'workspaces-y-worktrees',
  },
  {
    term: 'WSL',
    definition:
      'Windows Subsystem for Linux: entorno Linux integrado en Windows donde pueden vivir repositorios, runtimes y agentes CLI.',
    slug: 'setup-windows-wsl',
  },
]
