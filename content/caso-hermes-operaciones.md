---
slug: caso-hermes-operaciones
title: Caso real — Hermes como interfaz operativa
type: case-study
order: 3
summary: Un agente autoalojado acercó consultas y alertas a canales cotidianos, con permisos acotados y pruebas de negocio observables.
tags: [hermes, agentes, canales, operaciones, caso-real]
related: [hermes-agente-operativo, hermes-preset-instalacion]
area: Hermes
glyph: ◈
hue: rgba(87,217,232,.22)
---

# Caso real — Hermes como interfaz operativa

## Contexto anonimizado

Una empresa de servicios necesitaba acercar información operativa a un equipo no técnico y transformar eventos pasivos en avisos accionables. El objetivo no era sumar otro chat con IA, sino reducir la dependencia de una persona que supiera consultar cada sistema.

Hermes se planteó como una capa conversacional conectada a herramientas internas, disponible desde canales que el equipo ya utilizaba.

## Decisiones tomadas

### Reutilizar infraestructura con un límite inicial

La primera versión se instaló en infraestructura existente. Para evitar que el nuevo servicio compitiera sin control con otras cargas, se definió una concurrencia conservadora y se postergó cualquier ampliación hasta contar con métricas reales.

### Aislar proveedor y consumo

El acceso al proveedor de modelos se creó exclusivamente para el proyecto. Esto permitió comparar alternativas, observar gasto y revocar la integración sin afectar otros agentes.

La elección del modelo se hizo con un conjunto fijo de consultas representativas, puntuando precisión y costo. La comparación se apoyó en tareas reales y no en una impresión general.

### Separar audiencias

Las consultas del equipo y las alertas administrativas se trataron como recorridos diferentes. Cada canal recibió sólo la información correspondiente a su rol.

### Mantener secretos fuera del contexto

Las credenciales permanecieron en el entorno de ejecución. No se copiaron a documentación, prompts ni archivos de contexto compartidos con el agente.

## MVP verificable

La primera versión se consideró válida cuando pudo demostrar tres comportamientos:

1. Un usuario autorizado formulaba una consulta operativa y recibía una respuesta consistente con el sistema fuente.
2. Un evento controlado producía una alerta dentro del intervalo esperado.
3. Una notificación restringida llegaba al canal administrativo, pero no al canal general.

Cada hito describe una evidencia observable. “El agente está instalado” no cuenta como resultado.

## Qué aprendimos

- Reutilizar infraestructura funciona cuando la capacidad empieza acotada y se mide.
- Una credencial por proyecto simplifica costo, auditoría y revocación.
- El valor aparece en el recorrido completo: canal → agente → herramienta → respuesta.
- Separar audiencias es tan importante como conectar canales.
- Un MVP operativo necesita pruebas de negocio, no solamente checks técnicos.

## Beneficio obtenido

El equipo ganó una vía directa para consultar información y recibir avisos sin depender de una interfaz especializada. La organización, a la vez, conservó el control mediante permisos mínimos, identidades autorizadas y separación de canales.

> Caso basado en una implementación real. Se removieron nombres, infraestructura, métricas y circuitos internos.
