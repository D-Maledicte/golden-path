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

## Lo que aprendimos recuperando sesiones

En recuperaciones reales fue necesario distinguir entre una interfaz caída, un servicio de Orca detenido, un agente todavía vivo y un worktree sano aunque la conversación ya no pudiera retomarse.

Antes de detener procesos o limpiar workspaces, conviene observar el estado del runtime, la sesión, la rama, el worktree y Git. El objetivo no es reconstruir toda la infraestructura desde memoria: es identificar qué capa falló y preservar las que siguen sanas.

La regla es sencilla: **primero identificar, después intervenir**.

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
