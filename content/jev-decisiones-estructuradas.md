---
slug: jev-decisiones-estructuradas
title: "Jev: decisiones pequeñas dentro de sistemas grandes"
type: concept
order: 13
summary: "Qué hace un modelo de decisiones estructuradas y dónde conviene ponerlo: routing, clasificación, scoring y gates antes de cambiar el estado."
tags: [jev, decisiones, routing, scoring, agentes, arquitectura]
related: [caso-jev-director-narrativo, modelos-guiados-el-entorno-es-la-politica, orquestacion]
area: Gobierno de agentes
glyph: ◈
hue: rgba(168,106,255,.24)
---

# Jev: decisiones pequeñas dentro de sistemas grandes

## Una pregunta distinta a «escribime una respuesta»

Muchos pasos de una aplicación con IA no necesitan otro párrafo. Necesitan saber **qué hacer a continuación**: a qué equipo enviar un pedido, si una afirmación está respaldada, qué candidato revisar primero o si vale la pena llamar a un modelo más costoso.

[Jev 1.13](https://openrouter.ai/typesafe/jev-1.13), de TypeSafe, está diseñado para ese tipo de decisiones. Recibe texto o estado estructurado y devuelve respuestas tipadas, no prosa libre. La [documentación de System One](https://docs.typesafe.ai/concepts/system-one) distingue tres primitivas:

| Primitiva | Pregunta | Respuesta |
| --- | --- | --- |
| **Choice** | ¿Cuál de estas opciones describe mejor el caso? | Una opción y probabilidades |
| **Score** | ¿Dónde cae el caso en una escala definida? | Una puntuación sobre los niveles configurados |
| **Noul** | ¿Se cumple esta condición? | Una probabilidad entre 0 y 1 |

Las opciones y los criterios los define la aplicación. Jev juzga un estado dentro de ese marco; el código decide qué acción corresponde, con sus propias reglas y permisos.

## Cuatro lugares donde tiene sentido probarlo

### Routing y clasificación

Una solicitud entrante puede ir a soporte técnico, facturación o revisión manual. Si la elección es ambigua, la aplicación puede pedirle a Jev una categoría y enviar los casos de baja confianza a una persona. La misma idea sirve para clasificar incidentes o separar señales útiles del ruido en una cola.

### Scoring y orden de candidatos

Cuando ya existe una lista acotada de opciones, Jev puede puntuar cuáles parecen más pertinentes: recuerdos recuperados, alertas o tareas por revisar. Primero conviene reducir el conjunto con filtros baratos; pedir una decisión sobre toda la base aumenta costo y ruido.

### Gates antes de persistir

Un LLM generativo puede extraer datos de una conversación, pero redactar una afirmación no la convierte en un hecho. Un gate puede evaluar si hay evidencia, si el dato parece duradero o si contradice lo ya registrado. Las mutaciones siguen pasando por validación e idempotencia del sistema.

### Escalamiento entre modelos

Si la tarea sólo requiere elegir entre rutas conocidas, quizá no haga falta llamar a un modelo de razonamiento largo. Jev puede ayudar a derivar casos claros y dejar los difíciles para otro modelo o una revisión humana. El ahorro real se mide junto con los errores de derivación: abaratar una llamada a costa de perder casos importantes sería una pésima cuenta.

## La confianza no es un permiso

Una probabilidad alta no demuestra que la respuesta individual sea correcta. TypeSafe describe la calibración como una propiedad que se mide sobre conjuntos de predicciones, no como una garantía por caso. Hay que probar con datos del dominio, idiomas reales y ejemplos difíciles antes de elegir umbrales.

Además, *Score* usa la escala configurada: si los criterios tienen cinco niveles, no se debe interpretar su valor crudo como un número entre 0 y 1 sin normalizarlo. Y una decisión bien formada tampoco autoriza por sí misma un envío, una escritura o una publicación.

La arquitectura útil suele tener cuatro piezas: **estado relevante → pregunta acotada → respuesta tipada → regla determinista**. Se registran las decisiones para poder comparar aciertos y errores; ante fallos del proveedor, la aplicación elige un fallback explícito.

## Qué uso terminó siendo concreto

En una v2 de ficción interactiva probamos a Jev como parte de un Director que observa escenas y decide qué relaciones, hechos, temas y promesas dejan consecuencias. Ahí la pregunta no era «escribí una escena mejor», sino «¿qué cambió realmente y quién puede recordarlo?».

El diseño, las correcciones encontradas en las pruebas y sus límites están en [el caso del Director narrativo](/entrada/caso-jev-director-narrativo). Es un ejemplo de aplicación; routing, scoring y gates son otros puntos de partida que requieren su propia evaluación.

