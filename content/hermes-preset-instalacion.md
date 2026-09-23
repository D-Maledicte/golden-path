---
slug: hermes-preset-instalacion
title: Preset de instalación de Hermes
type: guide
order: 2
summary: "Cinco decisiones previas para montar Hermes sin copiar una infraestructura ajena: hosting, modelo, canales, concurrencia e integraciones."
tags: [hermes, setup, hosting, modelos, mcp]
related: [hermes-agente-operativo, caso-hermes-operaciones]
area: Hermes
glyph: ◇
hue: rgba(168,106,255,.24)
---

# Preset de instalación de Hermes

## Antes del instalador

Levantar Hermes no empieza con un comando. Empieza con cinco decisiones que determinan costo, seguridad y utilidad. El preset no prescribe un proveedor: funciona como guía para diseñar la instancia según el contexto.

## 1. Hosting

Opciones habituales:

- VPS propio nuevo o existente;
- servicio gestionado;
- cluster o runtime serverless con GPU.

Preguntas útiles:

- ¿Ya existe infraestructura con margen medido?
- ¿Qué disponibilidad necesita el agente?
- ¿Quién se hace cargo del uptime, backups y actualizaciones?
- ¿La red debe alcanzar sistemas privados?

Reutilizar un VPS reduce costo, pero comparte fallas y recursos con lo que ya vive allí. La capacidad se mide después del despliegue; no se adivina desde la ficha comercial.

## 2. Proveedor y modelo

Se puede usar una API directa, un agregador como OpenRouter o el proveedor ofrecido por el ecosistema de Hermes.

Si no está claro qué modelo conviene, el método más sano es un benchmark pequeño con consultas reales. Puntuar precisión y costo sobre el mismo set evita elegir por reputación o por una demo amable.

La key debería ser exclusiva para el proyecto. Aísla gasto, telemetría, revocación y radio de impacto.

## 3. Canales

Hermes puede conectarse a WhatsApp, Telegram, Discord, Slack, Teams, Signal, email y otros canales. La pregunta no es cuántos soporta, sino quién necesita acceso y qué información puede recibir.

Separar canales por rol evita que una alerta administrativa termine en un espacio comercial. Un mismo agente puede conversar con el equipo y notificar al administrador, pero cada recorrido necesita su propia política.

## 4. Concurrencia y recursos

Arrancar con un límite conservador de subagentes es una decisión operativa, no una pérdida de potencia. Se sube el paralelismo cuando existen métricas reales de CPU, RAM, latencia y costo.

Si la infraestructura aloja otros servicios, el agente no puede tratar todos los recursos como propios.

## 5. Integraciones

Para cada MCP o herramienta conectada, declarar:

- qué caso resuelve;
- si necesita lectura o escritura;
- qué usuarios pueden activarlo;
- qué límites o colas absorben rate limits;
- qué evidencia deja cada operación.

## Checklist mínimo

- [ ] Hosting y responsable operativo definidos.
- [ ] Proveedor y key exclusiva elegidos.
- [ ] Canales y roles separados.
- [ ] Concurrencia inicial acotada.
- [ ] Integraciones mínimas y permisos revisados.
- [ ] Secretos fuera de documentación y repositorio.
- [ ] Pruebas de consulta, alerta y separación de canales.
- [ ] Métricas para decidir el siguiente ajuste.
