---
slug: terminal-vs-web-superficies-trabajo
title: CLI vs. web — el agente dentro del proyecto
type: concept
order: 11
summary: "La terminal no vuelve más inteligente al modelo: lo ubica dentro del sistema que debe comprender, modificar y verificar. La web conserva ventaja para pensar, investigar y comunicar."
tags: [cli, web, terminal, agentes, codex, claude-code, opencode, worktrees]
related: [agent-terminals, modelos-guiados-el-entorno-es-la-politica, workspaces-y-worktrees, orquestacion]
area: Gobierno de agentes
glyph: ⌨
hue: rgba(87,217,232,.22)
---

# CLI vs. web — el agente dentro del proyecto

## No es una competencia de inteligencia

Trabajar desde Codex, Claude Code u OpenCode en una terminal no vuelve más capaz al modelo que conversa en una web. Cambia su **posición respecto del trabajo**.

En una conversación web, el modelo suele recibir una pregunta, archivos elegidos por la persona o una copia del contexto. En un CLI, el agente puede habitar el repositorio: leer su estado actual, inspeccionar el historial, modificar archivos, ejecutar comandos y observar el resultado.

La diferencia útil no es *chat versus código*. Es **contexto entregado versus contexto verificable**, y **recomendación versus ciclo de ejecución**.

> La web es una gran mesa de trabajo. La terminal es el taller conectado a la máquina.

## Qué habilita realmente la terminal

### Un ciclo cerrado

El CLI puede recorrer una secuencia completa sin que una persona copie cada resultado:

1. inspeccionar el repositorio;
2. formular una hipótesis;
3. editar en una rama o worktree;
4. ejecutar tests, lint o build;
5. leer errores y corregir;
6. revisar el diff;
7. dejar un cambio trazable.

Ese feedback reduce la distancia entre lo que el modelo cree y lo que el sistema hace. Una respuesta convincente puede estar equivocada; una prueba ejecutada contra el proyecto ofrece evidencia.

### Contexto nativo del proyecto

Desde la terminal, el agente puede acceder —si el entorno lo permite— a:

- estructura y archivos reales del repositorio;
- versión exacta de dependencias y runtime;
- estado de Git, ramas y worktrees;
- instrucciones persistentes como `AGENTS.md` o `CLAUDE.md`;
- scripts, linters, tests y generadores ya existentes;
- herramientas internas, hooks, skills y servidores MCP;
- logs y servicios de desarrollo.

No hace falta comprimir manualmente todo eso en un prompt. El agente puede descubrirlo y citar su evidencia.

### Composición y repetibilidad

Un CLI se integra con pipes, scripts, CI, tareas programadas y procesos no interactivos. También permite repetir el mismo método en sesiones distintas: preparar un worktree, ejecutar una auditoría, validar un resultado y producir un artifact.

Esto lo vuelve especialmente valioso para un esquema coordinador–workers: una terminal conserva la visión global y otras resuelven tareas acotadas en espacios aislados.

## Dónde la web sigue siendo mejor

Las interfaces web como ChatGPT o Claude son una superficie especialmente cómoda para:

- convertir una intuición ambigua en un problema bien formulado;
- investigar y contrastar documentación;
- trabajar con imágenes, documentos y fuentes heterogéneas;
- explorar opciones antes de tocar un repositorio;
- escribir explicaciones, propuestas y piezas editoriales;
- compartir una conversación o resultado sin preparar un entorno local;
- delegar tareas largas a un agente cloud cuando el repositorio no está disponible localmente.

La frontera tampoco es absoluta. Las experiencias web modernas pueden conectar repositorios y ejecutar agentes remotos; los CLIs pueden conversar, investigar y producir documentación. La pregunta correcta es **dónde vive el contexto autoritativo y dónde conviene cerrar el loop**.

## Mapa rápido de elección

| Trabajo | Superficie sugerida | Motivo |
|---|---|---|
| Explorar una idea o comparar enfoques | Web | Conversación amplia y mezcla de fuentes |
| Entender el comportamiento exacto de un repo | CLI | Acceso al estado y herramientas reales |
| Implementar un cambio multiarchivo | CLI en worktree | Edición, pruebas y diff trazable |
| Producir un informe o guía portable | Web, con evidencia del CLI | Mejor síntesis sin perder verificación |
| Prototipar una dirección visual | Web o canvas | Iteración visual más directa |
| Integrar el prototipo al producto | CLI | Ajuste contra componentes, build y tests |
| Automatizar una tarea repetible | CLI o SDK | Ejecución componible y no interactiva |
| Operar sobre producción | Gate humano y entorno restringido | La superficie no reemplaza el control |

## El costo escondido del CLI: autoridad

La terminal también aumenta el radio de impacto. Si el proceso ve claves SSH, tokens cloud, una base productiva y una shell sin restricciones, el agente puede actuar sobre todo eso.

Por eso **CLI no significa seguro**. Significa cercano al sistema. Esa cercanía es una ventaja sólo cuando se acompaña con:

- worktrees o contenedores descartables;
- credenciales mínimas y efímeras;
- red y hosts limitados;
- permisos `allow`, `ask` y `deny` explícitos;
- revisión de diffs antes de integrar;
- bloqueos externos para push, deploy y producción.

La editorial sobre [modelos guiados](https://ia.dmaledicte.cloud/#modelos-guiados-el-entorno-es-la-politica) desarrolla esta idea: las instrucciones orientan, pero el entorno limita.

## El flujo híbrido que mejor aprovecha ambas

### 1. Enmarcar en la web

Usar la conversación para clarificar objetivo, audiencia, restricciones, riesgos y criterios de éxito.

### 2. Descubrir en un CLI coordinador

Abrir el proyecto, verificar el estado real y transformar la intención en un plan apoyado en archivos, comandos y dependencias concretas.

### 3. Ejecutar con workers aislados

Delegar implementaciones, auditorías o pruebas en worktrees separados. Cada worker recibe una tarea verificable y la autoridad mínima necesaria.

### 4. Integrar con evidencia

El coordinador revisa diffs, corre la suite relevante y resuelve interacciones entre cambios.

### 5. Volver a una superficie editorial

Traducir el resultado en una guía, decisión o artifact que otra persona —o su agente— pueda reutilizar sin heredar todo el ruido operativo.

## Regla de salida

Conviene pasar de la web a la terminal cuando la respuesta depende del **estado vivo de un sistema** y necesita un ciclo de inspección, acción y verificación. Conviene volver a la web cuando el valor principal está en **comprender, decidir o comunicar**.

No hay una superficie superior. Hay una superficie más honesta respecto de la tarea.

## Fuentes oficiales para profundizar

- [Codex: modelos y niveles de razonamiento](https://learn.chatgpt.com/docs/models)
- [Claude Code: descripción general y superficies disponibles](https://code.claude.com/docs/en/overview)
- [OpenCode: interfaz de terminal](https://opencode.ai/docs/tui/)
- [OpenCode: permisos](https://opencode.ai/docs/permissions/)

