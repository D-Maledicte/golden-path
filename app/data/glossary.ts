import type { GlossaryTerm } from '~/types/library'

/**
 * Referencia rápida de los conceptos presentes en la biblioteca.
 * ES y EN mantienen el mismo orden y contexto; el render ordena por idioma.
 * Cada término enlaza a una entrada publicada. Validación: npm run check:glossary.
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
      'Sistema que combina un modelo, instrucciones y herramientas para realizar tareas dentro de un alcance. Su capacidad de actuar depende del harness, el entorno y los permisos.',
    slug: 'modelos-guiados-el-entorno-es-la-politica',
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
      'Bring Your Own Key: modalidad donde aportás tu propia clave API de un proveedor. El consumo sigue la cuenta y las condiciones de esa integración; no equivale a usar una suscripción de chat.',
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
      'Sistema que administra el ciclo del agente: prepara contexto, expone herramientas, ejecuta llamadas, recoge resultados y aplica controles. La CLI es una interfaz para usarlo, no un sinónimo.',
    slug: 'comparar-harness-cli-codex-claude-opencode-cline',
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
      'Model Context Protocol: protocolo abierto para conectar aplicaciones de IA con herramientas y fuentes de datos. La conexión no reemplaza los permisos ni la aprobación de acciones.',
    slug: 'comparar-harness-cli-codex-claude-opencode-cline',
  },
  {
    term: 'n8n',
    definition:
      'Plataforma de automatización visual usada para coordinar integraciones, webhooks y pasos entre distintos sistemas.',
    slug: 'backup-versionado-crm',
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
      'Hilo de conversación que conserva el contexto de una tarea y sus resultados. En Amp puede coordinar trabajo en un entorno propio; la persistencia del hilo no garantiza que la máquina siga ejecutándose.',
    slug: 'amp-fabrica-agentes-cloud',
  },
  {
    term: 'Worktree',
    definition:
      'Directorio de trabajo adicional de un repositorio Git, normalmente en otra rama. Separa archivos para tareas paralelas, pero comparte datos del repositorio y no es un sandbox de seguridad.',
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
  {
    term: 'Orquestación',
    definition:
      'Coordinación de agentes con un objetivo común, tareas, dependencias, responsables y evidencia de cierre. Abrir varias sesiones en paralelo no define por sí solo quién decide o integra.',
    slug: 'orquestacion',
  },
  {
    term: 'Plano de control',
    definition:
      'Capa desde la que se organizan y supervisan agentes, sesiones y entornos de ejecución. Coordina el trabajo sin ser el modelo ni la máquina que lo ejecuta.',
    slug: 'orca-como-ade',
  },
  {
    term: 'Handoff',
    definition:
      'Entrega de contexto y responsabilidad a otro agente o persona: objetivo, cambios, pruebas, límites, pendientes y ubicación del resultado. Permite retomar el trabajo sin reconstruirlo desde cero.',
    slug: 'orquestacion',
  },
  {
    term: 'Worker',
    definition:
      'Agente ejecutor al que se delega una tarea acotada. Recibe alcance, permisos y criterio de finalización, y devuelve resultados verificables al coordinador.',
    slug: 'orquestacion',
  },
  {
    term: 'Decision gate',
    definition:
      'Punto de control que detiene el avance hasta resolver una decisión o cumplir una condición. Tener confianza en una respuesta no reemplaza la autorización necesaria.',
    slug: 'orquestacion',
  },
  {
    term: 'Sandbox',
    definition:
      'Entorno con límites técnicos sobre recursos como archivos, procesos o red. Reduce lo que una ejecución puede afectar; su protección depende de los límites realmente configurados.',
    slug: 'modelos-guiados-el-entorno-es-la-politica',
  },
  {
    term: 'Mínimo privilegio',
    definition:
      'Principio de dar sólo los permisos, credenciales y acceso de red necesarios para una tarea. Reduce el impacto de errores y evita que una consigna amplia se convierta en autoridad ilimitada.',
    slug: 'modelos-guiados-el-entorno-es-la-politica',
  },
  {
    term: 'Read-only',
    definition:
      'Acceso de sólo lectura que permite consultar sin modificar el sistema fuente. Una barrera real se aplica en credenciales, herramientas y arquitectura, no sólo en una instrucción al agente.',
    slug: 'arquitectura-read-only',
  },
  {
    term: 'Observabilidad',
    definition:
      'Evidencia para entender qué está haciendo un sistema: estado, salida, eventos y señales de salud. Permite distinguir trabajo activo, espera, bloqueo y fallo, en vez de confiar sólo en que la interfaz siga abierta.',
    slug: 'continuidad-y-observabilidad',
  },
  {
    term: 'Subagente',
    definition:
      'Agente al que otro delega una parte del trabajo con contexto propio. Su separación de conversación no implica necesariamente una máquina, archivos o permisos independientes.',
    slug: 'comparar-harness-cli-codex-claude-opencode-cline',
  },
  {
    term: 'Skill',
    definition:
      'Paquete reutilizable de instrucciones y recursos para una tarea especializada. Ayuda a repetir un método de trabajo; no concede permisos ni garantiza que el resultado sea correcto.',
    slug: 'gentle-ai-engram-memoria-y-proceso',
  },
  {
    term: 'Nivel de razonamiento',
    definition:
      'Control del esfuerzo de deliberación de un modelo, según las opciones del proveedor y el harness. Puede aumentar tiempo y consumo; no reemplaza contexto, herramientas ni verificación.',
    slug: 'guia-escalado-modelos',
  },
  {
    term: 'Proveedor',
    definition:
      'Servicio que recibe solicitudes y ejecuta un modelo. Puede ser distinto de su autor; el endpoint, los límites y el rendimiento forman parte de la configuración que hay que comparar.',
    slug: 'como-leer-rankings-openrouter',
  },
  {
    term: 'OpenRouter',
    definition:
      'Plataforma que da acceso a modelos de distintos proveedores mediante una API común. Sus rankings describen los datos incluidos en sus vistas, no todo el mercado ni la calidad de cada tarea.',
    slug: 'como-leer-rankings-openrouter',
  },
  {
    term: 'Token',
    definition:
      'Unidad en la que un modelo representa y procesa contenido. No equivale siempre a una palabra: la segmentación depende del tokenizador. Más tokens de uso no significan más usuarios ni más tareas resueltas.',
    slug: 'como-leer-rankings-openrouter',
  },
  {
    term: 'Benchmark',
    definition:
      'Evaluación con tareas, condiciones y una regla de puntuación definidas. Sirve para comparar resultados dentro de ese protocolo; un puntaje no demuestra el mismo desempeño en tu proyecto.',
    slug: 'como-leer-rankings-openrouter',
  },
  {
    term: 'Cuota de uso',
    definition:
      'Porción del total que corresponde a un modelo o autor dentro de una población y período. Puede medirse en tokens o solicitudes; hay que conservar el denominador para interpretar el porcentaje.',
    slug: 'como-leer-rankings-openrouter',
  },
  {
    term: 'Cuota de gasto',
    definition:
      'Porcentaje del gasto observado que corresponde a un modelo o tarea en una vista. Combina precio y consumo; no equivale a cuota de tokens, cantidad de usuarios o calidad.',
    slug: 'como-leer-rankings-openrouter',
  },
  {
    term: 'Costo por sesión',
    definition:
      'Gasto observado en una sesión de agente. Para compararlo hay que fijar harness, tramo de turnos y agregación; una sesión barata puede haber fallado y no equivale a una tarea resuelta.',
    slug: 'como-leer-rankings-openrouter',
  },
  {
    term: 'Costo por tarea resuelta',
    definition:
      'Costo del trabajo que alcanza el criterio de aceptación, incluyendo intentos fallidos, herramientas y revisión. Permite evaluar productividad más allá del precio por token o por sesión.',
    slug: 'comparar-harness-cli-codex-claude-opencode-cline',
  },
  {
    term: 'Mediana',
    definition:
      'Medida que divide un conjunto ordenado en dos mitades. Describe el centro, pero no muestra la dispersión ni el costo de las sesiones extremas. No es lo mismo que el promedio.',
    slug: 'como-leer-rankings-openrouter',
  },
  {
    term: 'Latencia',
    definition:
      'Tiempo de espera entre una solicitud y un hito de respuesta. Hay que aclarar si se mide hasta el primer token o hasta la respuesta completa y con qué condiciones y percentil.',
    slug: 'como-leer-rankings-openrouter',
  },
  {
    term: 'TTFT',
    definition:
      'Time to First Token: tiempo desde el envío de la solicitud hasta recibir el primer token. Describe la espera inicial, no cuánto tarda en completarse toda la respuesta o tarea.',
    slug: 'como-leer-rankings-openrouter',
  },
  {
    term: 'Throughput',
    definition:
      'Velocidad de generación, habitualmente medida en tokens por segundo. Debe compararse bajo condiciones equivalentes; no incluye por sí sola el tiempo de herramientas, turnos y reintentos de un agente.',
    slug: 'como-leer-rankings-openrouter',
  },
  {
    term: 'Ventana de contexto',
    definition:
      'Capacidad de tokens que un modelo puede manejar en una interacción, según su configuración. El máximo anunciado, el contexto realmente usado y la calidad al recuperar información son cosas distintas.',
    slug: 'como-leer-rankings-openrouter',
  },
  {
    term: 'Tool calling',
    definition:
      'Mecanismo por el que un modelo solicita ejecutar una herramienta con argumentos. La ejecución la realiza el sistema que lo rodea y puede exigir permisos; contar llamadas no demuestra que fueron correctas.',
    slug: 'como-leer-rankings-openrouter',
  },
  {
    term: 'Routing',
    definition:
      'Selección del modelo o proveedor que atenderá una solicitud, mediante reglas o un router. Cambia costo, disponibilidad y comportamiento, por lo que debe registrarse al comparar resultados.',
    slug: 'como-leer-rankings-openrouter',
  },
  {
    term: 'Frontera de Pareto',
    definition:
      'Opciones para las que no hay otra igual o mejor en todas las dimensiones elegidas y mejor en al menos una, como costo y puntaje. La frontera cambia si cambian las dimensiones o los candidatos.',
    slug: 'como-leer-rankings-openrouter',
  },
  {
    term: 'Modelo',
    definition:
      'Componente entrenado que procesa entradas y genera salidas, incluidas propuestas de llamadas a herramientas. El agente agrega instrucciones, contexto, ejecución y controles alrededor de ese modelo.',
    slug: 'modelos-guiados-el-entorno-es-la-politica',
  },
  {
    term: 'Codex CLI',
    definition:
      'Interfaz de terminal de Codex para trabajar sobre un repositorio con un agente. El sandbox limita la ejecución y la política de aprobación determina qué acciones necesitan autorización.',
    slug: 'comparar-harness-cli-codex-claude-opencode-cline',
  },
  {
    term: 'Claude Code',
    definition:
      'Agente de programación de Anthropic que combina contexto del proyecto y herramientas. Puede especializar su trabajo mediante instrucciones, skills, hooks y subagentes, según la configuración.',
    slug: 'comparar-harness-cli-codex-claude-opencode-cline',
  },
  {
    term: 'OpenCode',
    definition:
      'Herramienta abierta de programación con agentes que permite configurar modelos y proveedores. La flexibilidad del catálogo requiere verificar compatibilidad, permisos y resultados para cada tarea.',
    slug: 'comparar-harness-cli-codex-claude-opencode-cline',
  },
  {
    term: 'Cline',
    definition:
      'Agente de programación que puede trabajar de forma interactiva o mediante su CLI sin interfaz interactiva. Automatizarlo exige acotar el objetivo, los cambios autorizados y la validación de la salida.',
    slug: 'comparar-harness-cli-codex-claude-opencode-cline',
  },
  {
    term: 'Tailscale',
    definition:
      'Herramienta que conecta usuarios y dispositivos en una red privada basada en identidades, con tráfico cifrado y reglas explícitas de acceso.',
    slug: 'tailscale-red-privada-identidad',
  },
  {
    term: 'Tailnet',
    definition:
      'Red privada de Tailscale que agrupa identidades y dispositivos autenticados. Pertenecer a ella no sustituye los permisos de cada servicio.',
    slug: 'tailscale-red-privada-identidad',
  },
  {
    term: 'MagicDNS',
    definition:
      'Función de Tailscale que permite encontrar dispositivos de la tailnet por nombre. Facilita localizar un destino, pero no concede acceso.',
    slug: 'tailscale-red-privada-identidad',
  },
  {
    term: 'WireGuard',
    definition:
      'Protocolo que Tailscale utiliza para cifrar el tráfico entre dispositivos. El cifrado se mantiene tanto en conexiones directas como mediante relays.',
    slug: 'tailscale-red-privada-identidad',
  },
  {
    term: 'Grant',
    definition:
      'Regla de Tailscale que concede capacidades de red o aplicación entre orígenes y destinos definidos. Los permisos se suman; una regla no resta accesos concedidos por otra.',
    slug: 'tailscale-permisos-grants',
  },
  {
    term: 'Tailscale SSH',
    definition:
      'Función que gestiona autenticación y autorización SSH en nodos compatibles mediante reglas propias. Habilitar TCP 22 en la tailnet no basta para configurarla.',
    slug: 'tailscale-permisos-grants',
  },
  {
    term: 'Tailscale Serve',
    definition:
      'Función que comparte un servicio local dentro de la tailnet, sujeto a sus reglas de acceso. Sirve para previews y paneles internos.',
    slug: 'tailscale-entorno-agentes',
  },
  {
    term: 'Tailscale Funnel',
    definition:
      'Función que expone un servicio local a Internet. Conviene usarla con una audiencia pública deliberada, controles de aplicación y un tiempo de exposición definido.',
    slug: 'tailscale-entorno-agentes',
  },
  {
    term: 'Preflight',
    definition:
      'Verificación previa al despliegue que ejecuta el comando real de producción en un entorno de prueba y comprueba que el servicio arranca y responde.',
    slug: 'preflight-despliegue-backend',
  },
  {
    term: 'Healthcheck',
    definition:
      'Comprobación de salud de un servicio. Debe validar una señal que represente la capacidad esperada, no sólo que exista una respuesta HTTP.',
    slug: 'preflight-despliegue-backend',
  },
  {
    term: 'Liveness',
    definition:
      'Señal que comprueba si un proceso está vivo. No demuestra por sí sola que el servicio pueda atender tráfico correctamente.',
    slug: 'caso-tablero-continuidad-operativa',
  },
  {
    term: 'Readiness',
    definition:
      'Señal que comprueba si un servicio está listo para atender tráfico. Puede fallar aunque el proceso siga vivo.',
    slug: 'caso-tablero-continuidad-operativa',
  },
  {
    term: 'Gentle AI',
    definition:
      'Configurador de agentes de código que prepara integraciones, memoria, skills y componentes de trabajo o revisión para ajustar el gobierno del entorno.',
    slug: 'gentle-ai-engram-memoria-y-proceso',
  },
  {
    term: 'Engram',
    definition:
      'Memoria local y persistente para agentes que permite guardar y buscar observaciones por proyecto mediante CLI, MCP y otras interfaces.',
    slug: 'gentle-ai-engram-memoria-y-proceso',
  },
  {
    term: 'Memoria curada',
    definition:
      'Selección de decisiones, convenciones y descubrimientos útiles para otras sesiones. Cada recuerdo conserva contexto y debe contrastarse con el estado actual antes de aplicarlo.',
    slug: 'gentle-ai-engram-memoria-y-proceso',
  },
  {
    term: 'ODD',
    definition:
      'Organic Driven Development: recorrido de Gentle AI que propone explorar, implementar cambios autorizados, verificar y dejar referencias recuperables en proporción al tamaño del trabajo.',
    slug: 'gentle-ai-engram-memoria-y-proceso',
  },
  {
    term: 'Jev',
    definition:
      'Modelo de TypeSafe orientado a decisiones estructuradas: recibe texto o estado y devuelve respuestas tipadas según opciones y criterios definidos por la aplicación.',
    slug: 'jev-decisiones-estructuradas',
  },
  {
    term: 'Choice',
    definition:
      'Primitiva de decisión de Jev que elige entre opciones definidas por la aplicación y devuelve una opción con una distribución de probabilidades.',
    slug: 'jev-decisiones-estructuradas',
  },
  {
    term: 'Score',
    definition:
      'Primitiva de Jev que puntúa un caso sobre una escala configurada. Su valor crudo no debe interpretarse automáticamente como un número entre 0 y 1.',
    slug: 'jev-decisiones-estructuradas',
  },
  {
    term: 'Noul',
    definition:
      'Primitiva de Jev que estima, entre 0 y 1, la probabilidad de que se cumpla una condición definida.',
    slug: 'jev-decisiones-estructuradas',
  },
  {
    term: 'Prueba negativa',
    definition:
      'Comprobación de que una acción prohibida realmente falla. En red, debe probarse contra un servicio disponible para no confundir una caída con una restricción efectiva.',
    slug: 'tailscale-permisos-grants',
  },
  {
    term: 'Árbol de procesos',
    definition:
      'Organización de circuitos de negocio y las funciones que integran cada rama. Permite acotar el análisis y definir evidencia verificable para una unidad de trabajo.',
    slug: 'mapa-procesos-verificacion',
  },
]

/** Glosario en inglés: mismos conceptos y mismos `slug`, en el mismo orden. */
export const glossaryEn: GlossaryTerm[] = [
  {
    term: 'ADE',
    definition:
      'Agent Development Environment: an environment built to run, organize and supervise development agents.',
    slug: 'orca-como-ade',
  },
  {
    term: 'Agent',
    definition:
      'A system that combines a model, instructions and tools to carry out tasks within a defined scope. Its ability to act depends on the harness, environment and permissions.',
    slug: 'modelos-guiados-el-entorno-es-la-politica',
  },
  {
    term: 'Agent-to-agent',
    definition:
      'Delegation between full agents that work in separate conversations and environments, exchange instructions or files and return results.',
    slug: 'amp-fabrica-agentes-cloud',
  },
  {
    term: 'Amp',
    definition:
      'Agentic development environment that brings models, threads, remote machines, Git and coordination together on a single platform.',
    slug: 'amp-fabrica-agentes-cloud',
  },
  {
    term: 'BYOK',
    definition:
      'Bring Your Own Key: a setup where you supply your own provider API key. Usage follows that account and integration’s terms; it is not the same as using a chat subscription.',
    slug: 'opendesign-integracion-local-cli-proxy',
  },
  {
    term: 'CLI',
    definition:
      'Command-line interface. Lets you work with tools and agents from a terminal, with direct access to the project and its environment.',
    slug: 'terminal-vs-web-superficies-trabajo',
  },
  {
    term: 'CRM',
    definition:
      'A system that centralizes relationships, data and commercial processes. In these cases it also acts as the operational source of truth.',
    slug: 'backup-versionado-crm',
  },
  {
    term: 'Daemon',
    definition:
      'A process that keeps running in the background and sustains services, sessions or tasks even when an interface is closed.',
    slug: 'continuidad-y-observabilidad',
  },
  {
    term: 'DESIGN.md',
    definition:
      'A portable file that encodes colors, typography, composition and visual rules so different agents produce consistent artifacts.',
    slug: 'opendesign-direccion-visual-agentes',
  },
  {
    term: 'Harness',
    definition:
      'The system that manages the agent loop: preparing context, exposing tools, executing calls, collecting results and applying controls. A CLI is an interface to it, not a synonym.',
    slug: 'comparar-harness-cli-codex-claude-opencode-cline',
  },
  {
    term: 'Hermes',
    definition:
      'An operational agent that can live on a server, connect to channels and integrations and run tasks with continuity.',
    slug: 'hermes-agente-operativo',
  },
  {
    term: 'MCP',
    definition:
      'Model Context Protocol: an open protocol connecting AI applications to tools and data sources. A connection does not replace permissions or approval for actions.',
    slug: 'comparar-harness-cli-codex-claude-opencode-cline',
  },
  {
    term: 'n8n',
    definition:
      'A visual automation platform used to coordinate integrations, webhooks and steps across different systems.',
    slug: 'backup-versionado-crm',
  },
  {
    term: 'OpenDesign',
    definition:
      'A local-first workspace that combines coding agents, skills, templates and DESIGN.md systems to produce visual artifacts as real files.',
    slug: 'opendesign-direccion-visual-agentes',
  },
  {
    term: 'Oracle',
    definition:
      'A second-opinion role inside Amp, used by the main agent to consult on reasoning, planning or hard decisions.',
    slug: 'amp-fabrica-agentes-cloud',
  },
  {
    term: 'Orb',
    definition:
      'A fresh, isolated remote machine where an Amp agent can work with code, tools and services even while the user’s computer is off.',
    slug: 'amp-fabrica-agentes-cloud',
  },
  {
    term: 'Orca',
    definition:
      'An ADE and control plane for organizing agents, repositories, workspaces, terminals and hosts without replacing the model.',
    slug: 'orca-como-ade',
  },
  {
    term: 'Runner',
    definition:
      'A self-owned or managed machine that Amp can use as its execution environment instead of an Orb from its own infrastructure.',
    slug: 'amp-fabrica-agentes-cloud',
  },
  {
    term: 'SSH',
    definition:
      'A secure protocol for accessing and running work on another machine or environment, such as WSL or a remote server.',
    slug: 'hosts-ssh',
  },
  {
    term: 'The Dial',
    definition:
      'Amp’s selector for how much effort a task needs, through the low, medium, high and ultra modes, regardless of which model sits behind it.',
    slug: 'amp-fabrica-agentes-cloud',
  },
  {
    term: 'Thread',
    definition:
      'A conversation that retains a task’s context and results. In Amp it can coordinate work in its own environment; a persistent thread does not guarantee that the machine keeps running.',
    slug: 'amp-fabrica-agentes-cloud',
  },
  {
    term: 'Worktree',
    definition:
      'An additional working directory of a Git repository, usually on another branch. It separates files for parallel tasks but shares repository data and is not a security sandbox.',
    slug: 'workspaces-y-worktrees',
  },
  {
    term: 'Workspace',
    definition:
      'A visible work front that groups tabs, terminals, editors and a task; on its own it is not the same as Git isolation.',
    slug: 'workspaces-y-worktrees',
  },
  {
    term: 'WSL',
    definition:
      'Windows Subsystem for Linux: a Linux environment built into Windows where repositories, runtimes and CLI agents can live.',
    slug: 'setup-windows-wsl',
  },
  {
    term: 'Orchestration',
    definition:
      'Coordination of agents through a shared goal, tasks, dependencies, ownership and completion evidence. Parallel sessions alone do not establish who decides or integrates.',
    slug: 'orquestacion',
  },
  {
    term: 'Control plane',
    definition:
      'The layer used to organize and supervise agents, sessions and execution environments. It coordinates work without being the model or the machine running it.',
    slug: 'orca-como-ade',
  },
  {
    term: 'Handoff',
    definition:
      'A transfer of context and responsibility to another agent or person: goal, changes, tests, limits, open issues and the result’s location. It lets work continue without reconstructing it from scratch.',
    slug: 'orquestacion',
  },
  {
    term: 'Worker',
    definition:
      'An executing agent assigned a bounded task. It receives scope, permissions and completion criteria, then returns verifiable results to the coordinator.',
    slug: 'orquestacion',
  },
  {
    term: 'Decision gate',
    definition:
      'A checkpoint that stops progress until a decision is resolved or a condition is met. Confidence in an answer does not replace required authorization.',
    slug: 'orquestacion',
  },
  {
    term: 'Sandbox',
    definition:
      'An environment with technical limits on resources such as files, processes or network access. It reduces what execution can affect; protection depends on the actual configured boundaries.',
    slug: 'modelos-guiados-el-entorno-es-la-politica',
  },
  {
    term: 'Least privilege',
    definition:
      'The principle of granting only the permissions, credentials and network access a task requires. It reduces the impact of mistakes and prevents a broad request from becoming unlimited authority.',
    slug: 'modelos-guiados-el-entorno-es-la-politica',
  },
  {
    term: 'Read-only',
    definition:
      'Access that allows inspection without changing the source system. A real boundary is enforced through credentials, tools and architecture, not just an instruction to the agent.',
    slug: 'arquitectura-read-only',
  },
  {
    term: 'Observability',
    definition:
      'Evidence for understanding what a system is doing: state, output, events and health signals. It distinguishes active work, waiting, blockage and failure instead of relying on an open interface.',
    slug: 'continuidad-y-observabilidad',
  },
  {
    term: 'Subagent',
    definition:
      'An agent delegated part of a task by another agent, with its own context. A separate conversation does not necessarily mean independent machines, files or permissions.',
    slug: 'comparar-harness-cli-codex-claude-opencode-cline',
  },
  {
    term: 'Skill',
    definition:
      'A reusable package of instructions and resources for a specialized task. It helps repeat a working method; it does not grant permissions or guarantee a correct result.',
    slug: 'gentle-ai-engram-memoria-y-proceso',
  },
  {
    term: 'Reasoning effort',
    definition:
      'A control for a model’s deliberation effort, depending on provider and harness options. It can increase time and usage; it does not replace context, tools or verification.',
    slug: 'guia-escalado-modelos',
  },
  {
    term: 'Provider',
    definition:
      'A service that receives requests and runs a model. It may differ from the model’s author; the endpoint, limits and performance are part of the configuration being compared.',
    slug: 'como-leer-rankings-openrouter',
  },
  {
    term: 'OpenRouter',
    definition:
      'A platform that provides access to models from different providers through a common API. Its rankings describe the data included in each view, not the entire market or the quality of every task.',
    slug: 'como-leer-rankings-openrouter',
  },
  {
    term: 'Token',
    definition:
      'A unit used by a model to represent and process content. It is not always a word: segmentation depends on the tokenizer. More usage tokens do not mean more users or more completed tasks.',
    slug: 'como-leer-rankings-openrouter',
  },
  {
    term: 'Benchmark',
    definition:
      'An evaluation with defined tasks, conditions and scoring rules. It compares results within that protocol; a score does not demonstrate the same performance in your project.',
    slug: 'como-leer-rankings-openrouter',
  },
  {
    term: 'Usage share',
    definition:
      'The portion of a total attributable to a model or author within a population and period. It can be measured in tokens or requests; the denominator is essential to interpreting the percentage.',
    slug: 'como-leer-rankings-openrouter',
  },
  {
    term: 'Share of spend',
    definition:
      'The percentage of observed spending attributable to a model or task in a view. It combines price and usage; it is not token share, user count or quality.',
    slug: 'como-leer-rankings-openrouter',
  },
  {
    term: 'Cost per session',
    definition:
      'Observed spending in an agent session. Comparisons must fix the harness, turn-count range and aggregation; a cheap session may have failed and is not the same as a completed task.',
    slug: 'como-leer-rankings-openrouter',
  },
  {
    term: 'Cost per completed task',
    definition:
      'The cost of work that meets its acceptance criteria, including failed attempts, tools and review. It evaluates productivity beyond price per token or session.',
    slug: 'comparar-harness-cli-codex-claude-opencode-cline',
  },
  {
    term: 'Median',
    definition:
      'A measure that divides an ordered dataset into two halves. It describes the center but does not show spread or the cost of extreme sessions. It is not the same as the mean.',
    slug: 'como-leer-rankings-openrouter',
  },
  {
    term: 'Latency',
    definition:
      'Waiting time between a request and a response milestone. Specify whether it ends at the first token or the complete response, and under which conditions and percentile.',
    slug: 'como-leer-rankings-openrouter',
  },
  {
    term: 'TTFT',
    definition:
      'Time to First Token: elapsed time from sending a request to receiving the first token. It describes the initial wait, not the time to finish the full response or task.',
    slug: 'como-leer-rankings-openrouter',
  },
  {
    term: 'Throughput',
    definition:
      'Generation speed, usually measured in tokens per second. Compare it under equivalent conditions; it does not by itself include an agent’s tool, turn and retry time.',
    slug: 'como-leer-rankings-openrouter',
  },
  {
    term: 'Context window',
    definition:
      'The token capacity a model can handle in an interaction, depending on its configuration. The advertised maximum, actual context usage and information-retrieval quality are different things.',
    slug: 'como-leer-rankings-openrouter',
  },
  {
    term: 'Tool calling',
    definition:
      'A mechanism through which a model requests a tool execution with arguments. The surrounding system performs it and may require permissions; counting calls does not establish correctness.',
    slug: 'como-leer-rankings-openrouter',
  },
  {
    term: 'Routing',
    definition:
      'Selection of the model or provider that will handle a request, using rules or a router. It changes cost, availability and behavior, so it should be recorded when comparing results.',
    slug: 'como-leer-rankings-openrouter',
  },
  {
    term: 'Pareto frontier',
    definition:
      'Options for which no other is at least as good on every chosen dimension and better on at least one, such as cost and score. The frontier changes when dimensions or candidates change.',
    slug: 'como-leer-rankings-openrouter',
  },
  {
    term: 'Model',
    definition:
      'A trained component that processes inputs and generates outputs, including proposed tool calls. An agent adds instructions, context, execution and controls around that model.',
    slug: 'modelos-guiados-el-entorno-es-la-politica',
  },
  {
    term: 'Codex CLI',
    definition:
      'The Codex terminal interface for working on a repository with an agent. The sandbox limits execution, while the approval policy determines which actions require authorization.',
    slug: 'comparar-harness-cli-codex-claude-opencode-cline',
  },
  {
    term: 'Claude Code',
    definition:
      'Anthropic’s coding agent, combining project context and tools. Instructions, skills, hooks and subagents can specialize its work, depending on configuration.',
    slug: 'comparar-harness-cli-codex-claude-opencode-cline',
  },
  {
    term: 'OpenCode',
    definition:
      'An open coding-agent tool with configurable models and providers. Catalog flexibility requires checking compatibility, permissions and results for each task.',
    slug: 'comparar-harness-cli-codex-claude-opencode-cline',
  },
  {
    term: 'Cline',
    definition:
      'A coding agent that can work interactively or through its CLI without an interactive interface. Automation requires a bounded goal, authorized changes and output validation.',
    slug: 'comparar-harness-cli-codex-claude-opencode-cline',
  },
  {
    term: 'Tailscale',
    definition:
      'A tool that connects users and devices in an identity-based private network, with encrypted traffic and explicit access rules.',
    slug: 'tailscale-red-privada-identidad',
  },
  {
    term: 'Tailnet',
    definition:
      'A private Tailscale network that groups authenticated identities and devices. Membership does not replace each service’s own permissions.',
    slug: 'tailscale-red-privada-identidad',
  },
  {
    term: 'MagicDNS',
    definition:
      'A Tailscale feature that makes tailnet devices discoverable by name. It helps locate a destination but does not grant access.',
    slug: 'tailscale-red-privada-identidad',
  },
  {
    term: 'WireGuard',
    definition:
      'The protocol Tailscale uses to encrypt traffic between devices. Encryption is maintained over both direct connections and relays.',
    slug: 'tailscale-red-privada-identidad',
  },
  {
    term: 'Grant',
    definition:
      'A Tailscale rule that grants network or application capabilities between defined sources and destinations. Permissions add together; one rule does not subtract access granted by another.',
    slug: 'tailscale-permisos-grants',
  },
  {
    term: 'Tailscale SSH',
    definition:
      'A feature that manages SSH authentication and authorization on supported nodes through separate policy rules. Allowing TCP 22 on the tailnet is not enough to configure it.',
    slug: 'tailscale-permisos-grants',
  },
  {
    term: 'Tailscale Serve',
    definition:
      'A feature that shares a local service within the tailnet, subject to its access rules. Useful for previews and internal dashboards.',
    slug: 'tailscale-entorno-agentes',
  },
  {
    term: 'Tailscale Funnel',
    definition:
      'A feature that exposes a local service to the public internet. It should be used with a deliberate public audience, application controls and a defined exposure period.',
    slug: 'tailscale-entorno-agentes',
  },
  {
    term: 'Preflight',
    definition:
      'A pre-deployment check that runs the actual production command in a test environment and verifies that the service starts and responds.',
    slug: 'preflight-despliegue-backend',
  },
  {
    term: 'Healthcheck',
    definition:
      'A service health check. It must validate a signal that represents the expected capability, rather than merely receiving an HTTP response.',
    slug: 'preflight-despliegue-backend',
  },
  {
    term: 'Liveness',
    definition:
      'A signal that checks whether a process is alive. On its own, it does not establish that the service can handle traffic correctly.',
    slug: 'caso-tablero-continuidad-operativa',
  },
  {
    term: 'Readiness',
    definition:
      'A signal that checks whether a service is ready to handle traffic. It can fail even while the process remains alive.',
    slug: 'caso-tablero-continuidad-operativa',
  },
  {
    term: 'Gentle AI',
    definition:
      'A coding-agent configurator that prepares integrations, memory, skills and workflow or review components to tailor the environment’s governance.',
    slug: 'gentle-ai-engram-memoria-y-proceso',
  },
  {
    term: 'Engram',
    definition:
      'A local, persistent memory system for agents that lets them save and search project observations through a CLI, MCP and other interfaces.',
    slug: 'gentle-ai-engram-memoria-y-proceso',
  },
  {
    term: 'Curated memory',
    definition:
      'A selection of decisions, conventions and discoveries useful to later sessions. Each memory retains context and must be checked against the current state before use.',
    slug: 'gentle-ai-engram-memoria-y-proceso',
  },
  {
    term: 'ODD',
    definition:
      'Organic Driven Development: Gentle AI’s approach to exploring, implementing authorized changes, verifying results and leaving recoverable references in proportion to the work’s size.',
    slug: 'gentle-ai-engram-memoria-y-proceso',
  },
  {
    term: 'Jev',
    definition:
      'A TypeSafe model for structured decisions: it takes text or state and returns typed answers using options and criteria defined by the application.',
    slug: 'jev-decisiones-estructuradas',
  },
  {
    term: 'Choice',
    definition:
      'A Jev decision primitive that chooses among application-defined options and returns an option with a probability distribution.',
    slug: 'jev-decisiones-estructuradas',
  },
  {
    term: 'Score',
    definition:
      'A Jev primitive that scores a case on a configured scale. Its raw value should not automatically be interpreted as a number between 0 and 1.',
    slug: 'jev-decisiones-estructuradas',
  },
  {
    term: 'Noul',
    definition:
      'A Jev primitive that estimates, between 0 and 1, the probability that a defined condition holds.',
    slug: 'jev-decisiones-estructuradas',
  },
  {
    term: 'Negative test',
    definition:
      'A check that a forbidden action actually fails. For networking, test against an available service so an outage is not mistaken for an effective restriction.',
    slug: 'tailscale-permisos-grants',
  },
  {
    term: 'Process tree',
    definition:
      'An organization of business workflows and the functions in each branch. It bounds analysis and defines verifiable evidence for a unit of work.',
    slug: 'mapa-procesos-verificacion',
  },
]

/** Glosario del idioma pedido. */
export function glossaryFor(locale: 'es' | 'en'): GlossaryTerm[] {
  return locale === 'en' ? glossaryEn : glossary
}
