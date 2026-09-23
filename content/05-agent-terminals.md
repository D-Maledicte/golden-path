---
slug: agent-terminals
title: Agent terminals y ciclo de sesión
type: concept
order: 5
summary: Una agent terminal vincula un CLI, una sesión, un worktree y un estado observable; no es solamente una consola con otro nombre.
tags: [orca, terminales, sesiones, agentes, panes]
related: [workspaces-y-worktrees, orquestacion, continuidad-y-observabilidad]
area: Orca
glyph: ▤
hue: rgba(87,217,232,.22)
---

# Agent terminals y ciclo de sesión

## Qué es una agent terminal

En Orca, una sesión de agente es un CLI ejecutándose dentro de una terminal y un worktree concretos. Ese vínculo le permite al sistema mostrar identidad y estado sin obligar al operador a abrir cada panel.

Una terminal común sólo expone entrada y salida. Una agent terminal agrega contexto operativo:

- qué agente está corriendo;
- en qué workspace y host;
- si está trabajando, esperando, terminado o bloqueado;
- qué conversación o sesión corresponde;
- cómo volver a enfocarla.

## Tabs, panes y splits

Los tabs organizan distintas superficies dentro de un workspace. Los panes permiten ver varias en simultáneo. Un split puede servir para:

- agente y servidor de desarrollo;
- agente y ejecución de pruebas;
- implementación y monitoreo de logs;
- dos agentes sobre tareas deliberadamente separadas.

El layout ayuda a observar; no reemplaza el aislamiento. Dos agentes en panes diferentes siguen siendo peligrosos si escriben sobre el mismo checkout y el mismo alcance.

## Estados del agente

Orca reconoce cambios de ciclo mediante señales de terminal y hooks del agente. En términos operativos, los estados importantes son:

- **working:** está procesando o usando herramientas;
- **needs you:** espera permiso, respuesta o decisión;
- **done:** terminó y requiere revisión;
- **blocked/failed:** no pudo continuar;
- **idle:** permanece abierto pero sin actividad relevante;
- **plain shell:** terminal sin un agente reconocido.

El dashboard permite supervisar varios agentes por excepción: atender primero los que necesitan intervención y revisar los que terminaron, sin recorrer panel por panel.

## Identidad estable de los panes

En nuestro entorno confirmamos que varias shells pueden compartir workspace y worktree, pero cada pane conserva identificadores propios como `ORCA_PANE_KEY`, `ORCA_TAB_ID` y `ORCA_TERMINAL_HANDLE`.

Eso habilita una capa de observabilidad externa: relacionar procesos descendientes con un pane concreto, detectar si allí corre Codex u OpenCode y representar el estado sin escribir sobre el proyecto.

## Copy Context y handoffs

Copiar un tramo acotado del scrollback sirve para transferir evidencia reciente a otra herramienta. No debería ser la estrategia principal de continuidad: las transcripciones crecen, se truncan y mezclan razonamiento con ruido operativo.

El handoff durable debe resumir decisiones, archivos, pruebas, riesgos y próximo paso. La terminal conserva el detalle; la documentación conserva el estado útil.

## Permisos y autonomía

Los defaults de lanzamiento pueden cambiar y, actualmente, Orca favorece agentes con alta autonomía dentro del worktree. Si el equipo necesita confirmación manual, debe configurar y verificar explícitamente los argumentos reales de cada agente.

El worktree reduce el radio de daño sobre archivos, pero no limita por sí solo acceso a red, secretos, comandos del sistema o servicios externos.

## Referencias

- [Terminal — Orca Docs](https://www.onorca.dev/docs/terminal)
- [Agents & sessions — Orca Docs](https://www.onorca.dev/docs/model/agents-sessions)
