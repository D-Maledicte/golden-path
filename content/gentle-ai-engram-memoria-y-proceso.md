---
slug: gentle-ai-engram-memoria-y-proceso
title: "Gentle AI y Engram: memoria y proceso para agentes de código"
type: editorial
order: 14
summary: "Qué aporta un configurador de entorno y qué resuelve una memoria persistente cuando el trabajo de agentes cruza sesiones, herramientas y proyectos."
tags: [gentle-ai, engram, memoria, agentes, gobierno, workflow]
related: [orquestacion, continuidad-y-observabilidad, modelos-guiados-el-entorno-es-la-politica]
area: Gobierno de agentes
glyph: ◈
hue: rgba(168,106,255,.24)
---

# Gentle AI y Engram: memoria y proceso para agentes de código

## El problema no empieza cuando el agente se equivoca

Un agente puede terminar una tarea correctamente y, al abrir una sesión nueva, volver a preguntar por decisiones que el equipo ya tomó. También puede recordar una regla vieja, aplicar un proceso enorme a un cambio trivial o entregar código sin una prueba verificable. Son fallas distintas: continuidad, vigencia del contexto y evidencia del resultado.

El ecosistema de [Gentleman Programming](https://gentlemanprogramming.com/) propone dos piezas relacionadas. **Gentle AI** configura los agentes de código que ya usás con componentes de memoria, flujo de trabajo, skills y revisión. **Engram** aporta una memoria persistente, consultable desde distintos agentes. Una pieza organiza el entorno; la otra conserva conocimiento entre sesiones. No hace falta adoptar todo el ecosistema para evaluar cada una.

## Gentle AI: configurar el modo de trabajo

[Gentle AI](https://github.com/Gentleman-Programming/gentle-ai) es un configurador, no un modelo ni un agente nuevo. Prepara integraciones para herramientas como Claude Code, OpenCode y Codex, y ofrece componentes y presets para elegir cuánto gobierno necesita el entorno. La [guía de uso previsto](https://github.com/Gentleman-Programming/gentle-ai/blob/main/docs/intended-usage.md) describe **Organic Driven Development (ODD)** como el camino cotidiano: explorar el proyecto, hacer cambios entendidos con un flujo liviano, verificar el resultado y dejar una referencia recuperable cuando el trabajo crece.

Esa proporcionalidad importa. Si corregir una etiqueta exige el mismo ritual que migrar un módulo, el equipo termina ignorando el ritual. Para un cambio grande, en cambio, una descripción de la feature y sus avances permite que otra sesión retome el trabajo sin reconstruir la historia a partir de commits y chats.

| Capa | Pregunta que responde | Evidencia esperada |
| --- | --- | --- |
| Configuración | ¿Qué herramientas y reglas tiene este agente? | Componentes instalados y diagnóstico del entorno |
| Proceso | ¿Cómo se explora, implementa y retoma esta tarea? | Alcance, decisiones y estado actual |
| Verificación | ¿Qué comportamiento se comprobó? | Pruebas, revisión o chequeos pertinentes |
| Memoria | ¿Qué conviene recuperar en la próxima sesión? | Observaciones con contexto y proyecto |

Los modos de revisión y TDD pueden sumar una barrera útil, pero su valor depende del tipo de cambio y de la calidad de las pruebas. Un workflow prolijo no convierte una comprobación superficial en evidencia.

## Engram: recordar decisiones, no grabar todo

[Engram](https://github.com/Gentleman-Programming/engram) es una memoria local para agentes, implementada como binario de Go con SQLite y búsqueda de texto completo. Expone CLI, servidor MCP, API HTTP y TUI. El agente puede guardar y buscar observaciones sobre decisiones, descubrimientos, errores resueltos o convenciones del proyecto. La documentación lo presenta como **memoria curada**, no como un registro indiscriminado de cada conversación.

Supongamos que un portal usa IDs largos como strings para no perder precisión en JavaScript. Al terminar una sesión, guardar «los IDs de CRM se tratan como strings en API, ordenamiento y exportación; revisar el adaptador antes de normalizarlos» sirve más que conservar cien mensajes donde apareció el tema. La próxima sesión puede buscar la decisión, comprobar que sigue vigente en el código y trabajar desde ahí.

Esa última comprobación es crucial. Una memoria es una pista con procedencia, no una orden superior ni la fuente de verdad del repositorio. Si el contrato cambió, hay que corregir o reemplazar la observación. Engram agrupa recuerdos por proyecto y puede compartirlos mediante sincronización opcional, pero eso exige definir quién puede escribir, qué información se guarda y cómo se resuelven decisiones contradictorias.

## Un punto dulce para un entorno con varios agentes

En un entorno donde un coordinador deriva trabajo a distintos modelos, cada worker debería recibir el contexto mínimo necesario: objetivo, límites, estado del repo y decisiones relevantes. Engram puede ayudar a recuperar estas últimas; Gentle AI puede dar una configuración y un recorrido de trabajo repetibles. La coordinación y la autorización de cambios siguen perteneciendo al sistema que dirige el trabajo y a las personas responsables.

Un piloto razonable sería:

1. Elegir **un repositorio** con decisiones que se repiten entre sesiones.
2. Guardar pocas observaciones útiles: contratos, convenciones, errores difíciles y motivos de arquitectura. Vincularlas al código o documento vigente.
3. Pedir al agente que busque contexto al empezar y que **verifique cada recuerdo** antes de aplicarlo.
4. Medir durante varias tareas cuántas aclaraciones se evitaron, cuántos recuerdos fueron pertinentes y cuántos estaban desactualizados.
5. Recién entonces sumar un proceso de trabajo o revisión donde la frecuencia y el riesgo del cambio lo justifiquen.

No conviene medir el éxito por la cantidad de recuerdos guardados. La señal útil es que la próxima persona o agente pueda tomar una decisión correcta con menos reconstrucción y con evidencia visible.

## El límite que define si sirve

La memoria persistente introduce una deuda propia: información obsoleta que suena convincente. El proceso también puede volverse burocracia si se aplica sin escala. Por eso hay que separar **recuerdo**, **estado actual**, **prueba** y **permiso**. Ninguna observación habilita por sí sola una escritura en producción; ningún checklist demuestra que se ejecutó el comando correcto.

Gentle AI y Engram son interesantes cuando el dolor real es volver a explicar el contexto, perder decisiones entre herramientas o no poder retomar trabajo delegado. Probados por separado y con métricas simples, pueden darle continuidad al entorno sin convertir cada tarea en una ceremonia.
