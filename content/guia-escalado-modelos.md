---
slug: guia-escalado-modelos
title: Elegir modelo y nivel de razonamiento
type: guide
order: 12
summary: Una guía práctica para asignar coordinadores y workers, subir razonamiento antes de pagar un modelo mayor y escalar cuando aparece una brecha real de capacidad.
tags: [modelos, razonamiento, openai, claude, opencode-go, coordinador, workers]
related: [orquestacion, terminal-vs-web-superficies-trabajo, modelos-guiados-el-entorno-es-la-politica, caso-orca-cockpit-multiagente]
area: Gobierno de agentes
glyph: △
hue: rgba(168,106,255,.24)
---

# Elegir modelo y nivel de razonamiento

> Catálogos revisados el 12 de noviembre de 2026. Privacidad y novedades de OpenCode Go verificadas el 17 de noviembre. Los nombres, límites y catálogos cambian; verificar las fichas oficiales antes de convertir esta guía en política. Las recomendaciones son criterios editoriales, no benchmarks propios.

## La decisión no empieza por la marca

Elegir modelo es asignar capacidad a una tarea. Antes de mirar el selector, conviene responder:

1. ¿La tarea está bien especificada?
2. ¿El resultado se puede verificar automáticamente?
3. ¿Cuánto contexto y cuántas dependencias debe sostener?
4. ¿Un error cuesta una corrección local o una decisión equivocada de arquitectura?
5. ¿Necesita producir trabajo, coordinarlo o juzgarlo?

Un worker con objetivo acotado, tests claros y poco contexto no necesita el modelo más grande. Un coordinador que debe conservar la intención, detectar conflictos entre cinco cambios y decidir qué integrar sí puede justificarlo.

La regla económica es **costo por tarea resuelta**, no costo por token. Un modelo barato que entra en loops, falla pruebas o necesita tres reintentos puede resultar más caro que uno superior usado una sola vez.

## La escalera correcta

Antes de cambiar de familia o subir al modelo premium:

1. mejorar la especificación y los criterios de aceptación;
2. reducir el alcance o dividir el trabajo;
3. aportar las herramientas y el contexto faltantes;
4. subir un nivel de razonamiento;
5. recién entonces escalar de modelo.

Subir razonamiento sirve cuando el modelo **puede** resolver el problema pero necesita explorar más. Subir de modelo sirve cuando aparece una **brecha de capacidad**: pierde relaciones, no sostiene el horizonte, juzga mal los tradeoffs o repite el mismo tipo de error.

## OpenAI: cuatro perfiles, no una sola escalera

| Modelo | Rol sugerido | Tareas recomendadas | Cuándo subir |
|---|---|---|---|
| GPT-6 Luna | Worker rápido y eficiente | Extracción, resúmenes, tests, documentación y cambios locales verificables | La tarea requiere juicio sostenido entre archivos |
| GPT-6.1 Terra | Especialista rápido en escritura y trabajo visual | Propuestas, interpretación de gráficos y pantallas, tareas en aplicaciones compatibles | El problema exige más razonamiento sostenido o integración compleja |
| GPT-6.1 Sol | Generalista fuerte o coordinador, cuando esté disponible | Código complejo, investigación, herramientas y flujos agénticos con varias restricciones | Aun con razonamiento alto no sostiene el trabajo de punta a punta |
| GPT-6 Astra | Coordinador y juez de máxima exigencia | Arquitectura, síntesis extensa, decisiones ambiguas, investigación profunda y workflows largos | Reservar para la cola difícil, no como default |

### Cuándo pasar de Luna a Sol

Luna es ideal cuando el contrato de la tarea cabe en pocas frases y el resultado tiene una comprobación clara. Sol es el siguiente escalón para trabajo que ya necesita interpretación, autonomía y coordinación.

Pasar a Sol cuando aparezcan varias de estas señales:

- el cambio atraviesa múltiples capas del sistema;
- hay que elegir entre alternativas y explicar tradeoffs;
- los tests no describen por completo el éxito;
- el agente debe recuperarse de hallazgos inesperados;
- varios workers dependen de una decisión central.

Astra se justifica cuando el problema combina amplitud, ambigüedad y consecuencias: no sólo debe escribir bien, sino preservar coherencia durante un proceso largo y juzgar el conjunto.

Terra no es un escalón obligatorio entre Luna y Sol: es otra elección según el tipo de trabajo. Para leer un dashboard y preparar una propuesta, probar Terra; para integrar cambios complejos entre componentes, Sol; para decisiones ambiguas de punta a punta, Astra. Esta asignación es una heurística, no una garantía de resultado.

GPT-6.1 Terra requiere Codex CLI 0.159.0 o superior (`codex -m gpt-6.1-terra`). GPT-6.1 Sol usa por defecto una ventana de contexto de 500.000 tokens en Codex y ChatGPT Work; eso no equivale a un cupo de uso ni elimina la necesidad de seleccionar contexto. La disponibilidad depende del plan, el cliente y el workspace; cambiar el nombre en una configuración no concede acceso. Estas recomendaciones corresponden a Work y Codex, no necesariamente al selector de Chat. [Modelos y disponibilidad](https://learn.chatgpt.com/docs/models?surface=app).

## Claude: Haiku, Sonnet, Opus y Fable

Haiku 5.5 se publicó el 7 de octubre y Sonnet 5.5 el 28 de septiembre de 2026. Son versiones del catálogo de Anthropic; cada proveedor y harness debe exponerlas por separado. [Haiku](https://platform.claude.com/docs/en/models/haiku-5-5/overview) · [Sonnet](https://platform.claude.com/docs/en/models/sonnet-5-5/overview).

| Modelo | Rol sugerido | Tareas recomendadas | Cuándo subir |
|---|---|---|---|
| Claude Haiku 5.5 | Worker veloz | Clasificación, extracción, cambios repetitivos, subagentes acotados y tareas de alto volumen | Falta consistencia o el trabajo exige razonamiento entre varias piezas |
| Claude Sonnet 5.5 | Default equilibrado | Desarrollo cotidiano, análisis, contenido, uso de herramientas y agentes con alcance medio | El horizonte se alarga o el costo del juicio incorrecto aumenta |
| Claude Opus 5.5 | Coordinador senior | Coding agente complejo, planificación amplia, revisión crítica y decisiones de alto impacto | Opus con esfuerzo alto sigue sin cerrar el problema |
| Claude Fable 5.2 | Frontera para la cola difícil | Razonamiento muy demandante y trabajo agente de largo horizonte | Usar de forma selectiva y medir si mejora la tasa de resolución |

### Cuándo pasar de Haiku a Sonnet y de Sonnet a Opus

Haiku funciona mejor como ejecutor de unidades pequeñas y comprobables. Sonnet es un punto de partida práctico cuando la tarea necesita comprender intención además de seguir instrucciones. La documentación actual de Anthropic recomienda comenzar con Opus 5.5 para la mayoría de los trabajos; esta guía prioriza el costo por tarea resuelta dentro de una orquestación con workers.

Subir de Sonnet a Opus cuando:

- la tarea no admite una descomposición limpia;
- necesita sostener muchas restricciones durante bastante tiempo;
- coordina otros agentes o evalúa sus resultados;
- un error plausible puede propagarse por el diseño;
- los reintentos con Sonnet cuestan más que una ejecución buena con Opus.

La documentación de Anthropic recomienda probar primero más `effort` cuando el modelo tiene esa opción. Si Opus en sus niveles más altos no alcanza, Fable es hoy el paso siguiente para problemas de frontera.

Fable 5.2, publicado el 9 de noviembre, reemplaza a 5.1 como referencia de frontera. Su ficha declara contexto de 1M y salida máxima de 128K tokens, con precios base de API de USD 8/40 por millón de tokens de entrada/salida, antes de caché, batch u otras condiciones. Mantiene pensamiento adaptativo siempre activo. **Requiere retención de datos de 30 días y no está disponible bajo ZDR salvo autorización expresa de Anthropic**: no es una sustitución transparente para un flujo que exige cero retención. [Ficha de Fable 5.2](https://platform.claude.com/docs/en/models/fable-5-2/overview).

## Qué significa el nivel de razonamiento

El nivel de razonamiento es un presupuesto de deliberación, no un multiplicador mágico de inteligencia. En general, más razonamiento implica más tiempo y más tokens, y permite explorar hipótesis, revisar decisiones y sostener pasos intermedios.

| Nivel conceptual | Usarlo para | Evitarlo cuando |
|---|---|---|
| Bajo o light | Ediciones locales, consultas directas y tareas con camino obvio | Hay ambigüedad o varias restricciones en tensión |
| Medio | Desarrollo diario, debugging moderado y decisiones reversibles | La tarea es trivial o extremadamente compleja |
| Alto o extra high | Arquitectura, bugs esquivos, migraciones y síntesis multiarchivo | El resultado se verifica con una transformación simple |
| Max | Un único modelo necesita agotar una investigación difícil | La tarea puede dividirse mejor entre agentes |
| Ultra | El trabajo se separa naturalmente y conviene delegar en subagentes | Hay una sola pieza indivisible o mucha coordinación accidental |

En Codex, `Max` entrega más deliberación al mismo modelo; `Ultra` puede delegar automáticamente en subagentes. GPT-6 Luna llega hasta Max, sin Ultra. En Claude, el comportamiento depende del modelo: el pensamiento adaptativo y `effort` son controles blandos, y Haiku 5.5 admite pensamiento adaptativo y `effort`, a diferencia de Haiku 4.5. [Ficha de Haiku 5.5](https://platform.claude.com/docs/en/models/haiku-5-5/overview).

### Calibrar por modelo, no copiar el mismo ajuste

En Work y Codex, OpenAI recomienda comenzar Sol con el esfuerzo predeterminado del cliente, Luna en `High` y Astra en `Light` (`low` en CLI). Subir desde ahí cuando las pruebas muestren falta de planificación o comprobación. [Guía oficial](https://learn.chatgpt.com/docs/models?surface=app).

Claude usa `low`, `medium`, `high`, `xhigh` y `max`, pero no tienen equivalencia exacta con los presets de Codex. Haiku 5.5 parte de `medium`; Sonnet 5.5 tiene default `high`, aunque para coding agente bien especificado conviene empezar en `medium`. Opus 5.5 parte de `medium`. En Fable 5.2, empezar en `high`; probar `xhigh` para trabajo largo especialmente exigente y reservar `max` para casos donde una evaluación muestre una mejora que justifique el tiempo y los tokens. No trasladar ajustes de una versión a otra sin volver a medir. [Effort en Claude](https://platform.claude.com/docs/en/build-with-claude/effort).

Dos advertencias:

- razonamiento alto no reemplaza contexto, herramientas ni tests;
- mostrar el texto de *thinking* no cambia por sí solo cuánto razona el modelo. En OpenCode V2, las variantes `provider/model#variant` configuran opciones como esfuerzo o presupuesto; sus nombres y efectos dependen del modelo y proveedor. [Variantes](https://opencode.ai/v2/docs/models/).

## OpenCode Go: mapa práctico del catálogo

OpenCode Go reúne modelos de varios proveedores. Al 12 de noviembre ofrece Go (USD 10/mes), Go Plus (USD 40/mes) y Go Teams (USD 20 por miembro/mes, mínimo dos miembros). Go y Plus corresponden a workspaces de un miembro; Teams cubre workspaces con varias personas, con límites individuales, pero no service accounts. La tabla siguiente es una **heurística editorial de arranque**, no un benchmark oficial. La presencia en el catálogo no demuestra aptitud para una tarea: los modelos nuevos quedan en evaluación hasta pasar pruebas del repositorio. [Planes y catálogo](https://opencode.ai/docs/console/go/).

| Opciones del catálogo de Go | Punto de partida sugerido | Papel inicial |
|---|---|---|
| Grok 4.7 | Revisión independiente y segunda opinión | Reviewer selectivo |
| GLM 5.3 Flash, 5.3, 5.2 | 5.3 Flash para trabajo acotado; 5.3 para planificación y cambios cruzados | Worker económico; 5.3 como escalamiento |
| GPT-6 Luna y GPT-5.6 Luna | GPT-6 Luna para implementación, refactors, tests y documentación verificable; 5.6 como fallback probado | Worker general |
| Gemini 4 Argon | Comparar contra tareas reales antes de asignarle un rol estable | En evaluación |
| Kimi K3.1 Pro, K3, K2.7 Code | K2.7 Code para código; evaluar K3.1 Pro frente a K3 en tareas exigentes | Worker de código; Pro en evaluación |
| LongCat 2.0 | Mantenimiento simple, lotes y tareas repetibles | Worker de volumen |
| MiMo V2.6 Flash y Pro | Flash para tareas baratas y comprobables; Pro cuando hace falta más juicio | Worker económico |
| MiniMax M3.1 Flash y M3 | Evaluar Flash en tareas acotadas; comparar M3 en cambios con más contexto | Worker general evaluado |
| Muse Spark 1.3 y 1.2 Contributor (regiones limitadas) | Implementación, tests y docs con alcance bien delimitado | Contributor acotado |
| Qwen4 Max | Evaluar en cambios multiarchivo frente a Qwen3.8 Max con las mismas pruebas | En evaluación |
| Qwen3.8 Max, 3.8 Flash, 3.7 Plus | 3.8 Flash para volumen; 3.8 Max para planificación y revisión | Worker o reviewer según variante |
| DeepSeek V4.1 Flash y V4 Pro | Flash para trabajo corriente; Pro para debugging y revisión, después de evaluar | Worker especializado |
| Hy4, Hy4 preview y Hy3 | Evaluar Hy4 estable por separado; mantener preview fuera del camino crítico | Worker evaluado o experimental |
| Step 5 Preview | No asumir gratuidad por conservar el nombre preview | Evaluación aislada |
| Beam Free, Iceman Contributor Free, LongCat 2.5 Free y Hy4 Flash Free | Disponibilidad temporal; revisar regiones y entrenamiento antes de enviar datos | Experimentación temporal |
| Claude Haiku 5.5 | Extracción, clasificación y subagentes acotados | Worker de volumen |

Los modelos pagos comparten un cupo. Los montos en dólares por modelo y plan indican cuánto uso cubriría el cupo si usaras sólo ese modelo. Cambiar de modelo sigue descontando del mismo cupo. Las ventanas de cinco horas, semana y mes representan el 20%, 50% y 100% del límite mensual. Los recuentos de solicitudes son estimaciones, no garantías. Cada respuesta informa `opencode.allowance`. Una opción barata puede tener un cupo menor; las variantes gratuitas y descuentos son temporales. No fijar una política sobre una promoción. [Catálogo y límites](https://opencode.ai/docs/console/go/).

### Privacidad antes que capacidad

La política de privacidad del workspace también aplica a Go. Por defecto bloquea endpoints pagos que entrenan con los datos y permite Europa y Estados Unidos; la documentación describe una excepción Global para solicitudes desde China en workspaces sin ajustes guardados. Un owner o admin puede habilitar endpoints restringidos. No ampliar regiones sólo para desbloquear un modelo sin revisar primero qué datos va a recibir.

| Modelos o familia, vía Go | Entrenamiento declarado | Retención declarada |
|---|---|---|
| Grok 4.7, GPT-6/5.6 Luna, Claude Haiku 5.5 | No | 30 días |
| Gemini 4 Argon | No | Hasta 55 días para monitoreo de abuso |
| GLM, Kimi, MiMo, Qwen, MiniMax, Hy y LongCat | No | 0 días para los endpoints indicados en la tabla oficial |
| Muse Spark Contributor e Iceman Contributor Free | Sí | No ZDR |
| Beam Free | No | 30 días |
| DeepSeek V4.1 Flash y V4 Pro | No | 0 días bajo acuerdo renovable mensualmente |

DeepSeek y LongCat 2.5 Free requieren región Global; este último está alojado en China. Muse Contributor requiere habilitar endpoints pagos que entrenan con las solicitudes. El acuerdo ZDR de DeepSeek está vigente hasta el **30 de noviembre de 2026**: revisarlo antes de reutilizar esta condición en una política. Estas condiciones son del servicio Go y del endpoint, no propiedades universales del modelo. [Privacidad y restricciones](https://opencode.ai/docs/console/go/#privacy).

### Cómo usar esta tabla sin enamorarse del ranking

Para cada familia que parezca prometedora, construir un set pequeño de tareas reales:

- una lectura y explicación de arquitectura;
- un cambio local con tests;
- un bug multiarchivo;
- una revisión de diff con errores sembrados;
- una tarea que deba detenerse ante un permiso sensible.

Medir tasa de resolución, reintentos, tiempo, costo y respeto del contrato. La elección final puede diferir por repositorio: un modelo excelente programando puede ser un coordinador mediocre, y uno muy convincente puede ignorar límites operativos si el entorno no los aplica.

Las versiones anteriores del catálogo sirven como fallback cuando una integración o comportamiento está validado, pero no deberían conservarse por inercia. Las variantes `preview` o `Exp` deben permanecer fuera del camino crítico hasta superar una evaluación propia.

## Asignación recomendada en una orquestación

| Responsabilidad | Capacidad mínima útil | Escalamiento |
|---|---|---|
| Discovery de sólo lectura | Modelo rápido con razonamiento bajo | Subir si omite relaciones importantes |
| Cambio aislado con tests | Worker económico con razonamiento bajo o medio | Mejorar el contrato; luego subir modelo |
| Bug multiarchivo | Generalista con razonamiento medio o alto | Escalar si repite hipótesis fallidas |
| Coordinación de varios workers | Modelo fuerte con razonamiento alto | Modelo frontera si no integra el panorama |
| Auditoría de seguridad o arquitectura | Modelo fuerte y segunda opinión de otra familia | Escalar por desacuerdo o evidencia incompleta |
| Acción irreversible | Ningún modelo decide solo | Gate humano y enforcement externo |

## Una política simple para empezar

1. Elegir el modelo más pequeño que razonablemente puede cerrar la tarea.
2. Asignar workers por unidades verificables, no por prestigio del modelo.
3. Subir razonamiento cuando falta exploración; subir modelo cuando falta capacidad.
4. Reservar el modelo frontera para coordinación, juicio y excepciones difíciles.
5. Comparar familias con el mismo set de pruebas del repositorio.
6. Registrar modelo, esfuerzo, reintentos y resultado para aprender del uso real.
7. Mantener permisos y credenciales independientes del modelo elegido.

El selector no es una jerarquía de empleados. Es una caja de cambios: el mejor nivel es el que entrega suficiente control y potencia sin gastar complejidad donde no agrega valor.

## Fuentes oficiales

- [OpenAI: modelos recomendados y niveles de razonamiento](https://learn.chatgpt.com/docs/models)
- [OpenAI: guía del modelo más reciente](https://developers.openai.com/api/docs/guides/latest-model)
- [Anthropic: panorama actual de modelos Claude](https://platform.claude.com/docs/en/models/overview)
- [Anthropic: cómo elegir un modelo](https://platform.claude.com/docs/en/about-claude/models/choosing-a-model)
- [Anthropic: optimizar costo e inteligencia](https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence)
- [Anthropic: thinking, effort y costo](https://platform.claude.com/docs/en/build-with-claude/thinking-steering-and-cost)
- [Anthropic: Fable 5.2, límites y retención](https://platform.claude.com/docs/en/models/fable-5-2/overview)
- [Anthropic: niveles de effort por modelo](https://platform.claude.com/docs/en/build-with-claude/effort)
- [OpenCode Go: modelos, precios, privacidad y límites vigentes](https://opencode.ai/docs/console/go/)
- [OpenCode V2: modelos y variantes de razonamiento](https://opencode.ai/v2/docs/models/)
