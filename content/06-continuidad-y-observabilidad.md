---
slug: continuidad-y-observabilidad
title: Continuidad, recuperación y observabilidad
type: concept
order: 6
summary: Orca preserva layout y scrollback, y puede mantener agentes vivos mientras sobreviva el daemon; el estado crítico debe seguir existiendo fuera de la interfaz.
tags: [orca, sesiones, recuperacion, observabilidad, daemon]
related: [agent-terminals, hosts-ssh, caso-orca-cockpit-multiagente]
area: Orca
glyph: ◌
hue: rgba(237,195,94,.25)
---

# Continuidad, recuperación y observabilidad

## Qué significa continuidad

Continuidad no es que un chat permanezca abierto. Es poder responder, después de una interrupción:

- qué se estaba haciendo;
- en qué rama y worktree;
- qué procesos siguen vivos;
- qué evidencia se produjo;
- desde dónde conviene retomar.

Orca restaura workspaces, tabs, splits, foco y scrollback. Mientras el daemon del host sobreviva, también puede mantener vivos los procesos de los agentes aunque la ventana de Desktop se cierre o reinicie.

## El límite físico

Si cae el host completo —reinicio, corte eléctrico, kernel panic— los procesos terminan. Al volver, puede restaurarse la disposición y el último scrollback, pero no la ejecución que estaba en memoria.

Por eso hay tres niveles distintos:

1. **Estado visual:** layout, tabs y scrollback.
2. **Estado de proceso:** agente CLI y PTY mantenidos por el daemon.
3. **Estado de trabajo:** Git, archivos, commits, documentación y handoff.

Sólo el tercero sobrevive de forma independiente a una caída total y permite reconstruir con confianza.

### Hibernación de sesiones

Orca documenta una hibernación experimental, desactivada por defecto. Si una terminal de agente elegible terminó su turno y lleva tiempo inactiva, Orca puede detener su proceso y reanudar la sesión al abrir el worktree. Un turno en espera de respuesta o una tarea de orquestación pendiente impiden esa hibernación. Al volver, distinguí entre conversación reanudada, proceso original vivo y cambios persistidos en disco. [Agent hibernation](https://orca.dev/docs/agents/hibernation)

## Lo que aprendimos recuperando sesiones

En recuperaciones reales fue necesario distinguir entre una interfaz caída, un servicio de Orca detenido, un agente todavía vivo y un worktree sano aunque la conversación ya no pudiera retomarse.

Antes de detener procesos o limpiar workspaces, conviene observar el estado del runtime, la sesión, la rama, el worktree y Git. El objetivo no es reconstruir toda la infraestructura desde memoria: es identificar qué capa falló y preservar las que siguen sanas.

La regla es sencilla: **primero identificar, después intervenir**.

## Retomar con el estado real: revisión V4

Antes de relanzar trabajo, reconstruí PRs abiertos o integrados, ramas y worktrees, workers todavía activos y despliegues efectivos. Usá la última conversación para localizar evidencia. Después comprobá cada hecho donde se registra o se puede observar.

| Fuente | Pregunta que responde |
| --- | --- |
| Tarea en Notion | ¿Qué tiene prioridad, quién responde por la capacidad y qué aceptación o decisión falta? |
| Git y paquete de trabajo | ¿Qué commit se propuso o integró, qué pruebas corrieron y qué acreditó la auditoría? |
| Sistemas en ejecución | ¿Qué se aplicó, qué observó el postflight y se verificó el resultado en el ciclo acordado? |
| Cockpit | ¿Qué está avanzando, qué está bloqueado y qué requiere atención ahora? |

En el [caso multiagente](/entrada/caso-orca-cockpit-multiagente), la entrega distingue listo local, merge, aplicación, postflight y aceptación. El cockpit reúne esa lectura para que el operador se oriente. Si una fuente no se puede comprobar, marcá ese dato como desconocido y dejá anotada la verificación que falta. Así evitás que un resumen viejo o un PR en verde disparen trabajo duplicado o un cierre prematuro.

## Observabilidad por pane

Los identificadores estables de Orca permiten relacionar workspace, worktree, tab y terminal con el proceso que está ejecutándose. Esa relación alcanza para construir observabilidad de solo lectura sin controlar la sesión del agente.

Esto fue la base para visualizar agentes fuera de Orca sin controlar ni modificar sus sesiones. La observabilidad se mantiene separada de la autoridad operativa.

## Documentación de continuidad

Cada etapa de trabajo importante debería dejar un resumen corto fuera del scrollback:

- objetivo vigente;
- decisiones tomadas;
- rama y worktree;
- archivos modificados;
- validaciones realizadas;
- riesgos y pendientes;
- instrucción exacta para retomar.

La transcripción explica cómo se llegó. El handoff dice dónde estamos.

## Beneficio real

La recuperación deja de ser “abrir ventanas hasta encontrar algo familiar”. Se vuelve un diagnóstico por capas que permite preservar agentes vivos, rescatar trabajo y evitar limpiezas destructivas por ansiedad. Qué horror cerrar al gerente equivocado por apuro.

## Referencia

- [Session restore — Orca Docs](https://www.onorca.dev/docs/model/session-restore)
