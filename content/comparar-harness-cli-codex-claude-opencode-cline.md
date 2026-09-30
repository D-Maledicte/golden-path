---
slug: comparar-harness-cli-codex-claude-opencode-cline
title: "Comparar harness CLI: Codex, Claude Code, OpenCode V2 y Cline"
type: editorial
order: 18
summary: "Ventajas, diferencias y desventajas de cuatro harness de programación: cómo elegirlos, repartir responsabilidades y evaluar el costo real de trabajar con agentes."
tags: [harness, cli, codex, claude-code, opencode, cline, agentes, permisos]
related: [guia-escalado-modelos, terminal-vs-web-superficies-trabajo, orquestacion]
area: Gobierno de agentes
glyph: ⚿
hue: rgba(168,106,255,.24)
---

# Comparar harness CLI: Codex, Claude Code, OpenCode V2 y Cline

> Revisada el 29 de septiembre de 2026. Las capacidades dependen de la versión y la configuración instalada.

Elegir un agente de programación suele empezar por una pregunta: ¿qué modelo conviene usar? Pero hay otra decisión que cambia el trabajo cotidiano: qué harness va a convertir las respuestas de ese modelo en acciones sobre un proyecto.

Codex CLI, Claude Code, OpenCode y Cline pueden ocupar ese lugar. Comparten el objetivo de trabajar con código y herramientas, pero ofrecen distintas maneras de organizar contexto, permisos, extensiones y ejecución. Entender esas diferencias permite elegir con criterio y también combinarlos sin convertir el repositorio en una pelea de cuatro agentes por el mismo archivo.

Esta comparación distingue capacidades documentadas de recomendaciones editoriales. Los roles sugeridos son una propuesta de uso; no representan un benchmark de calidad, velocidad o costo.

## Qué es un harness y qué aporta la CLI

El modelo interpreta información y propone acciones. El harness administra el ciclo de trabajo: prepara el contexto, expone herramientas, ejecuta llamadas, recoge resultados y permite continuar hasta obtener una entrega o encontrar un bloqueo.

La CLI es la interfaz de terminal para acceder a ese sistema. Harness y CLI están relacionados, pero no son sinónimos: un mismo agente puede tener terminal, extensión de editor y aplicación de escritorio.

Esto explica por qué cambiar de interfaz no siempre equivale a cambiar de agente y por qué usar un modelo parecido en dos herramientas puede producir experiencias distintas. Importan las instrucciones que recibe, las herramientas disponibles y la forma en que se gestiona la sesión.

Para elegir conviene mirar cinco cosas: el modelo disponible, el control de ejecución, la continuidad del contexto, la integración con el proyecto y el costo de operar todo ese conjunto.

## Codex CLI y el trabajo dentro de límites explícitos

Codex CLI permite inspeccionar un repositorio, editar archivos y ejecutar herramientas locales. Admite trabajo interactivo y automatización mediante `codex exec`, además de seleccionar modelo, esfuerzo de razonamiento y permisos. [Documentación oficial](https://learn.chatgpt.com/docs/codex/cli).

Su sandbox establece límites para los comandos que ejecuta, con implementación específica por plataforma. La política de aprobación decide cuándo una acción necesita autorización; es una capa diferente del sandbox. [Sandbox de Codex](https://learn.chatgpt.com/docs/sandboxing).

**Ventaja editorial:** resulta atractivo cuando querés delegar una implementación y revisar una entrega concreta: cambios, comandos ejecutados y validación. El límite de ejecución ayuda a definir qué puede hacer el agente durante ese trabajo.

**Desventaja práctica:** un entorno mal preparado puede bloquear instalaciones, acceso de red o herramientas que el proyecto necesita. Resolverlo exige configurar permisos y dependencias; dar acceso total como respuesta automática elimina una parte del control que motivó la elección.

También conviene evaluar la oferta de modelos y autenticación disponible en tu instalación. Si tu prioridad es alternar libremente entre muchos proveedores, esa necesidad debe formar parte de la comparación desde el comienzo.

**Dónde lo pondría:** implementación delimitada, diagnóstico de errores y revisión de cambios que se puedan comprobar con las herramientas reales del repositorio.

## Claude Code y la especialización del flujo de trabajo

Claude Code dispone de contexto de proyecto mediante `CLAUDE.md`, skills, MCP, hooks y plugins. Los hooks permiten asociar acciones al ciclo de ejecución. [Extensiones de Claude Code](https://code.claude.com/docs/en/features-overview).

Sus subagentes pueden tener instrucciones, herramientas y permisos propios, además de contexto separado. Sus solicitudes consumen los límites de uso correspondientes; delegar no vuelve gratuito el trabajo. [Subagentes de Claude Code](https://code.claude.com/docs/en/sub-agents).

**Ventaja editorial:** ofrece piezas útiles para convertir un flujo habitual en una configuración reutilizable. Por ejemplo, separar exploración, implementación y revisión con responsabilidades claras.

**Desventaja práctica:** cada especialización agrega algo que mantener. Instrucciones repetidas, hooks innecesarios y delegaciones demasiado amplias pueden aumentar el consumo y dificultar entender por qué el agente actuó de determinada manera.

Su propuesta está centrada en el ecosistema Claude. Eso simplifica algunas decisiones, pero conviene considerarlo si buscás una infraestructura de ejecución que alterne entre proveedores independientes.

**Dónde lo pondría:** como candidato a coordinar tareas que requieren dividir responsabilidades y sostener convenciones del proyecto. Ese rol es una decisión de arquitectura, no una afirmación de superioridad frente a Codex.

## OpenCode V2 y la flexibilidad de proveedores

El sitio oficial de OpenCode referencia V2 en su instalación y presenta una herramienta abierta disponible en terminal, editor y escritorio, con soporte para múltiples proveedores y modelos locales. [OpenCode](https://opencode.ai/). Esta editorial cubre su oferta actual; no atribuye a V2 un listado de mejoras frente a V1 sin una comparación de versiones.

OpenCode documenta agentes principales, subagentes y configuración de modelos por agente. Incluye Build y Plan, con distinto acceso a herramientas. [Agentes](https://opencode.ai/docs/agents/). Sus permisos permiten autorizar, preguntar o denegar acciones; la documentación describe defaults mayormente permisivos. [Permisos](https://opencode.ai/docs/permissions/).

**Ventaja editorial:** permite diseñar un reparto de modelos según la tarea. Podés probar un proveedor para exploración y otro para implementación sin reemplazar necesariamente toda la interfaz de trabajo.

**Desventaja práctica:** esa libertad traslada decisiones al operador. Hay que evaluar modelos, compatibilidad con herramientas, límites del proveedor y comportamiento ante errores. Que dos modelos aparezcan en el mismo selector no significa que resuelvan una tarea con la misma confiabilidad.

La configuración de permisos merece atención propia. Una regla del harness y una barrera del sistema operativo son mecanismos diferentes; no corresponde tratarlos como equivalentes.

**Dónde lo pondría:** ejecutores especializados y pruebas controladas de proveedores. Para reducir costos, mediría tareas aceptadas y correcciones posteriores, no solamente precio por token.

## Cline y las tareas que entran y salen de la terminal

Cline tiene CLI interactiva y modo headless. Documenta ejecución desde pipes, salida JSON, selección de proveedor mediante autenticación y gestión de MCP. También contempla ejecución sin intervención mediante autoaprobación, que puede modificar archivos y ejecutar comandos. [CLI de Cline](https://docs.cline.bot/usage/cli-overview).

**Ventaja editorial:** es un candidato práctico para encargos puntuales que reciben una entrada concreta y devuelven un resultado: analizar un diff, explicar un fallo o preparar una revisión. Su CLI permite incorporar esas tareas a scripts.

**Desventaja práctica:** un encargo aparentemente pequeño puede crecer si no tiene límite. Un pedido de revisión puede terminar convertido en una sesión de implementación si el objetivo y los permisos quedan abiertos. Además, cambiar de proveedor requiere volver a evaluar la calidad del resultado.

Headless describe una forma de ejecutar sin interfaz interactiva; no acredita por sí solo aislamiento ni confiabilidad. Para automatizar, hace falta decidir qué cambios están autorizados y cómo se acepta la salida.

**Dónde lo pondría:** como comodín para tareas acotadas y una segunda mirada sobre cambios preparados por otro agente. También puede asumir trabajo principal si encaja mejor con el proyecto; el rol de comodín es una elección operativa.

## Comparación de ventajas y costos operativos

La siguiente tabla resume el criterio editorial desarrollado arriba.

| Harness | Ventaja para aprovechar | Desventaja a gestionar | Rol sugerido |
| --- | --- | --- | --- |
| Codex CLI | Trabajo local con límites de ejecución configurables | Fricción si permisos o entorno no acompañan al proyecto | Implementación y validación delimitadas |
| Claude Code | Especialización mediante contexto, extensiones y subagentes | Consumo y mantenimiento de la configuración | Coordinación de responsabilidades |
| OpenCode V2 | Flexibilidad para combinar proveedores y agentes | Evaluación y configuración a cargo del operador | Ejecutores especializados |
| Cline CLI | Encargos interactivos o integrados a scripts | Control del alcance y aceptación de la salida | Comodín y revisión adicional |

Los roles se superponen. La tabla propone por dónde empezar a probar cada herramienta, no exclusividades.

## Cómo combinarlos sin multiplicar el desorden

Una combinación razonable empieza con un responsable de la tarea. Ese agente o persona conserva el objetivo, decide qué se delega y acepta el resultado. Cada ejecutor recibe un encargo que puede terminar de forma verificable.

Por ejemplo, para corregir una integración:

1. El responsable define el contrato esperado y reproduce el error.
2. Un ejecutor prepara el cambio en una rama o worktree propio.
3. Otro agente revisa el diff con acceso de lectura y busca casos omitidos.
4. El responsable comprueba la ejecución real, resuelve observaciones y prepara la entrega.

El reparto puede hacerse entre estos cuatro harness, pero no requiere usarlos todos. Dos herramientas con responsabilidades claras pueden aportar más que cuatro sesiones abiertas con contexto duplicado.

La delegación entre productos necesita una integración explícita: comando, script, API u otro mecanismo disponible. Un subagente nativo de un harness no se convierte automáticamente en una sesión de otro.

Cada encargo debería definir objetivo, archivos autorizados, restricciones, validación y salida esperada. Ese contrato hace posible cambiar de herramienta sin reconstruir toda la intención del trabajo.

## Cómo evaluar cuál conviene en tu proyecto

Elegí algunas tareas representativas: un bug reproducible, una modificación pequeña y una revisión de código. Prepará el mismo punto de partida y registrá modelo, versión, permisos y contexto de cada prueba.

Compará tiempo hasta obtener un resultado aceptable, intervenciones humanas, costo o consumo de cuota y defectos encontrados después. Cuando cambies simultáneamente de modelo y harness, interpretá el resultado como evaluación de la combinación completa.

La pregunta que importa es cuánto trabajo confiable obtenés por el costo total. Ese costo incluye revisar, corregir, mantener configuración y recuperar contexto, además de pagar inferencia.

## Elegir según la responsabilidad que vas a delegar

Codex, Claude Code, OpenCode y Cline ofrecen puntos de entrada distintos a un mismo problema: transformar una intención en trabajo ejecutable y revisable.

La elección mejora cuando el proyecto conserva sus contratos, convenciones y comprobaciones fuera de una sesión particular. Así, el harness puede cambiar y el equipo sigue sabiendo qué había que hacer, qué se hizo y cómo se verificó.

La autonomía que vale la pena ampliar es la que produce evidencia suficiente para confiar en la entrega.
