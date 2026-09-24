---
slug: caso-jev-director-narrativo
title: "Caso: un Director que separa narración y memoria"
type: case-study
order: 14
summary: "Una arquitectura orquestada donde un modelo redacta la escena, Jev decide sus consecuencias y un registro de eventos reconstruye lo que cada personaje puede recordar."
tags: [jev, narrativa, memoria, agentes, eventos, caso-real]
related: [jev-decisiones-estructuradas, orquestacion, continuidad-y-observabilidad]
area: Gobierno de agentes
glyph: ◉
hue: rgba(236,95,189,.24)
---

# Caso: un Director que separa narración y memoria

## El problema que apareció después de escribir

En una aplicación de ficción interactiva, el modelo generativo podía producir escenas y diálogos. El desafío era conservar las consecuencias: quién descubrió un secreto, qué promesa quedó pendiente, cómo cambió una relación y qué tema seguía abierto.

Un chat largo no es una fuente estable para reconstruir todo eso. Repetirle el historial entero al narrador consume contexto y no garantiza que distinga entre un hecho duradero, una interpretación y un gesto cotidiano. La v2 incorporó un **Director** que observa cada turno y mantiene un estado narrativo separado de la prosa.

## La orquestación

El flujo divide responsabilidades:

1. **Narrador:** escribe la escena y entrega acciones con los personajes identificados.
2. **Constructor de candidatos:** arma pares de relación a partir de esos identificadores. Un compilador pequeño propone afirmaciones sobre hechos, temas y promesas.
3. **Jev:** responde preguntas tipadas sobre cambios de relación, categorías narrativas, equivalencia con asuntos registrados y quién se enteró.
4. **Código de dominio:** transforma decisiones válidas en eventos, limita su efecto y reconstruye el estado mediante `replay`.
5. **Contexto del siguiente turno:** resume lo relevante para el narrador y recupera sólo recuerdos que corresponden a ese punto de la historia.

El Director tiene un núcleo de eventos y reducers sin llamadas al modelo; la parte que consulta a Jev vive separada. Así se puede probar la lógica de estado sin red y revisar de dónde salió cada consecuencia.

## Relaciones: que un momento pese no significa que cambie todo

Los candidatos son pares dirigidos entre el protagonista y los demás personajes presentes. La dirección importa: la confianza de A hacia B puede cambiar aunque la de B hacia A no lo haga. El primer llamado a Jev pregunta, en lote, si hubo un cambio genuino; un segundo llamado evalúa dimensión, dirección y magnitud sólo para los candidatos seleccionados.

Las pruebas mostraron que un gesto agradable podía recibir demasiado peso si se miraba sólo la intensidad del momento. El cálculo incorporó otras dos señales: la probabilidad de que la relación haya cambiado y si alguien aprendió algo nuevo de la otra persona. Un café cotidiano y una revelación dejan huellas distintas.

El código acota el delta máximo por escena e invierte el signo cuando corresponde a tensión: mejorar una relación puede bajar la tensión mientras suben confianza o cercanía. También normaliza correctamente *Score* antes de aplicar el cambio; el valor crudo representa la escala de criterios definida en la pregunta.

## Hechos: saber algo no es haber estado cerca

Para el estado narrativo, un compilador propone afirmaciones en tercera persona. Jev las clasifica como hecho duradero, tema abierto, promesa o nada. Luego compara candidatos con lo ya registrado y con otros del mismo turno para evitar duplicados semánticos.

La pregunta «¿quién se enteró?» se hace por separado. Que un personaje esté en la escena no implica que oyó una conversación privada o entendió una alusión. Si se entera varios turnos más tarde, se actualiza la lista de quienes conocen **el mismo hecho**; no se inventa otro hecho igual.

Los eventos resultantes alimentan un registro del cual se reconstruye el estado. El resumen que recibe el narrador incluye hechos que conoce alguno de los presentes, relaciones expresadas en palabras y asuntos pendientes. Los recuerdos, además, se filtran por línea de tiempo: no entra un evento futuro ni uno que ocurrió exclusivamente en otra rama. Ese último filtro es una regla de código, no una decisión de Jev.

## Lo que la prueba permite afirmar

El Director está implementado en una rama v2 y se calibró con fragmentos de historia anotados a mano. Se hizo además una comparación a ciegas de la respuesta del narrador con y sin el resumen del Director sobre una sesión real: **20 pares; 7 preferencias por la versión con resumen, 5 por la versión sin él y 8 empates**. Es evidencia acotada de coherencia; no demuestra una mejora clara de la calidad de escritura.

La atribución de quién sabe qué todavía falla en escenas implícitas; en pruebas manuales un modelo generativo usado como juez resolvió mejor algunos ejemplos. También quedan promesas condicionales sin detectar y una falla de red al consultar Jev todavía puede cortar el turno. La v2 está en evaluación, con trabajo pendiente antes de tratarla como una solución cerrada.

## La decisión arquitectónica

La separación deja un contrato legible: **un modelo redacta, otro ayuda a decidir qué consecuencias hubo y el código determina qué queda registrado y qué puede recordarse**. Jev aporta decisiones estructuradas donde la pregunta es pequeña y verificable; el Director aporta reglas, trazabilidad y límites temporales.

El valor del caso no está en sumar un modelo al pipeline. Está en poder señalar un turno, una decisión y un evento cuando la historia recuerda algo que no debería, o se olvida de algo que sí pasó.

> Caso basado en una v2 funcional en evaluación. Se anonimizaron producto, personajes, sesiones y detalles del repositorio; las cifras corresponden a una prueba comparativa acotada, no a una medición de producción.
