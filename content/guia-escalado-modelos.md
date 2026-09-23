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

> Vigencia editorial: 12 de septiembre de 2026. Los nombres, límites y catálogos cambian; verificar las fichas oficiales antes de convertir esta guía en política.

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

## OpenAI: Luna, Terra, Sol y Astra

| Modelo | Rol sugerido | Tareas recomendadas | Cuándo subir |
|---|---|---|---|
| GPT-5.6 Luna | Worker rápido y económico | Búsqueda, clasificación, transformaciones, resúmenes, tests, documentación y cambios locales verificables | La tarea deja de ser lineal o requiere juicio entre archivos |
| GPT-5.6 Terra | Generalista cotidiano | Implementación normal, debugging moderado, análisis y coordinación de pocas piezas | Pierde dependencias, necesita mayor autonomía o el error es costoso |
| GPT-5.6 Sol | Worker senior o coordinador | Código complejo, investigación, uso de herramientas y problemas abiertos con varias restricciones | Aun con razonamiento alto no sostiene el trabajo de punta a punta |
| GPT-6 Astra | Coordinador y juez de máxima exigencia | Arquitectura, síntesis extensa, decisiones ambiguas, investigación profunda y workflows largos | Reservar para la cola difícil, no como default |

### Cuándo pasar de Luna a Sol

Luna es ideal cuando el contrato de la tarea cabe en pocas frases y el resultado tiene una comprobación clara. Antes de saltar directamente a Sol, Terra suele ser el peldaño natural para trabajo cotidiano que ya necesita interpretación.

Pasar a Sol cuando aparezcan varias de estas señales:

- el cambio atraviesa múltiples capas del sistema;
- hay que elegir entre alternativas y explicar tradeoffs;
- los tests no describen por completo el éxito;
- el agente debe recuperarse de hallazgos inesperados;
- varios workers dependen de una decisión central.

Astra se justifica cuando el problema combina amplitud, ambigüedad y consecuencias: no sólo debe escribir bien, sino preservar coherencia durante un proceso largo y juzgar el conjunto.

## Claude: Haiku, Sonnet, Opus y Fable

| Modelo | Rol sugerido | Tareas recomendadas | Cuándo subir |
|---|---|---|---|
| Claude Haiku 4.5 | Worker veloz | Clasificación, extracción, cambios repetitivos, subagentes acotados y tareas de alto volumen | Falta consistencia o el trabajo exige razonamiento entre varias piezas |
| Claude Sonnet 5 | Default equilibrado | Desarrollo cotidiano, análisis, contenido, uso de herramientas y agentes con alcance medio | El horizonte se alarga o el costo del juicio incorrecto aumenta |
| Claude Opus 5 | Coordinador senior | Coding agente complejo, planificación amplia, revisión crítica y decisiones de alto impacto | Opus con esfuerzo alto sigue sin cerrar el problema |
| Claude Fable 5.1 | Frontera para la cola difícil | Razonamiento muy demandante y trabajo agente de largo horizonte | Usar de forma selectiva y medir si mejora la tasa de resolución |

### Cuándo pasar de Haiku a Sonnet y de Sonnet a Opus

Haiku funciona mejor como ejecutor de unidades pequeñas y comprobables. Sonnet es el punto de partida general cuando la tarea necesita comprender intención además de seguir instrucciones.

Subir de Sonnet a Opus cuando:

- la tarea no admite una descomposición limpia;
- necesita sostener muchas restricciones durante bastante tiempo;
- coordina otros agentes o evalúa sus resultados;
- un error plausible puede propagarse por el diseño;
- los reintentos con Sonnet cuestan más que una ejecución buena con Opus.

La documentación de Anthropic recomienda probar primero más `effort` cuando el modelo tiene esa opción. Si Opus en sus niveles más altos no alcanza, Fable es hoy el paso siguiente para problemas de frontera.

## Qué significa el nivel de razonamiento

El nivel de razonamiento es un presupuesto de deliberación, no un multiplicador mágico de inteligencia. En general, más razonamiento implica más tiempo y más tokens, y permite explorar hipótesis, revisar decisiones y sostener pasos intermedios.

| Nivel conceptual | Usarlo para | Evitarlo cuando |
|---|---|---|
| Bajo o light | Ediciones locales, consultas directas y tareas con camino obvio | Hay ambigüedad o varias restricciones en tensión |
| Medio | Desarrollo diario, debugging moderado y decisiones reversibles | La tarea es trivial o extremadamente compleja |
| Alto o extra high | Arquitectura, bugs esquivos, migraciones y síntesis multiarchivo | El resultado se verifica con una transformación simple |
| Max | Un único modelo necesita agotar una investigación difícil | La tarea puede dividirse mejor entre agentes |
| Ultra | El trabajo se separa naturalmente y conviene delegar en subagentes | Hay una sola pieza indivisible o mucha coordinación accidental |

En OpenAI, `Max` entrega más tiempo al mismo modelo; `Ultra` habilita una estrategia con delegación automática. En Claude, el comportamiento depende del modelo: el pensamiento adaptativo y `effort` son controles blandos, y Haiku 4.5 admite pensamiento extendido pero no el parámetro `effort`.

Dos advertencias:

- razonamiento alto no reemplaza contexto, herramientas ni tests;
- mostrar el texto de *thinking* no cambia por sí solo cuánto razona el modelo. En OpenCode, `/thinking` controla la visualización y las variantes del modelo controlan el razonamiento efectivo.

## OpenCode Go: mapa práctico del catálogo

OpenCode Go reúne modelos de varios proveedores en un plan único. La tabla siguiente es una **heurística editorial de arranque**, no un benchmark oficial de OpenCode. Agrupa el catálogo vigente por el tipo de trabajo que conviene evaluar primero en nuestro esquema coordinador–workers.

| Familia actual en Go | Punto de partida sugerido | Papel inicial |
|---|---|---|
| Grok 4.6 | Revisión independiente, razonamiento amplio y segunda opinión | Coordinador o reviewer selectivo |
| GLM 5.3 Flash, 5.3, 5.2, 5.1 | 5.3 Flash para trabajo acotado; 5.3 para planificación y cambios cruzados | Worker económico; 5.3 como escalamiento |
| GPT-5.6 Luna | Implementación, refactors, tests y documentación verificable | Worker general |
| Kimi K3, K2.7 Code, K2.6 | K2.7 Code para código; K3 para síntesis y tareas más exigentes | Worker de código; K3 selectivo |
| LongCat 2.0 | Mantenimiento simple, lotes y tareas repetibles | Worker de volumen |
| MiMo V2.5 y V2.5 Pro | V2.5 para tareas baratas y comprobables; Pro cuando hace falta más juicio | Worker económico |
| MiniMax M3 y M2.7 | M3 como generalista; M2.7 como fallback evaluado | Worker general |
| Muse Spark 1.3 y 1.2 Contributor | Implementación, tests y docs con alcance bien delimitado | Contributor acotado |
| Qwen3.8 Max, 3.8 Flash, 3.7 Max, 3.7 Plus, 3.6 Plus | 3.8 Flash para volumen; 3.8 Max para planificación y revisión | Worker o reviewer según variante |
| DeepSeek V4.1 Flash, V4 Pro, V4 Flash, V4 Flash Vision Exp | V4.1 Flash para trabajo corriente; Pro para debugging/revisión; Vision para insumos visuales | Worker especializado |
| Hy4 preview y Hy3 | Hy4 sólo en sandbox de evaluación; Hy3 después de una prueba contra el repo | Experimental o worker evaluado |

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
- [OpenCode Go: modelos, precios y límites vigentes](https://opencode.ai/docs/go/)
- [OpenCode: interfaz TUI y variantes de razonamiento](https://opencode.ai/docs/tui/)
