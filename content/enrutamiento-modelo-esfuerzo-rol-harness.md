---
slug: enrutamiento-modelo-esfuerzo-rol-harness
title: "Enrutamiento avanzado de agentes: modelo, esfuerzo, rol y harness"
type: editorial
order: 19
summary: "Por qué elegir un agente exige evaluar no solo el modelo y su razonamiento, sino la función y el harness: Codex frente a OMP como caso de contraste."
tags: [orquestacion, harness, cli, codex, omp, routing, agentes, benchmarks, gobierno]
related: [comparar-harness-cli-codex-claude-opencode-cline, guia-escalado-modelos, orquestacion]
area: Gobierno de agentes
glyph: ⌘
hue: rgba(87,217,232,.24)
---

# Enrutamiento avanzado de agentes: modelo, esfuerzo, rol y harness

> Propuesta arquitectónica, 8 de octubre de 2026. No describe una implementación ya validada. Diferenciamos capacidades documentadas, hipótesis y resultados que todavía hay que medir.

## El cuarto parámetro

Las primeras estrategias de orquestación respondían dos preguntas: **qué modelo** utilizar y **cuánto esfuerzo de razonamiento** asignarle. Incorporar roles agrega otra: **para qué función** se lo necesita. Pero todavía falta una decisión: **en qué harness ejecutar ese trabajo**.

La configuración operativa deja de ser solo `modelo + esfuerzo` y pasa a ser **`modelo + esfuerzo + rol + harness`**. No es una fórmula de puntuación ni una afirmación de que cuatro variables bastan: permisos, repositorio, presupuesto, contexto y disponibilidad siguen siendo restricciones de elegibilidad.

Un modelo puede mostrar comportamientos diferentes según cómo el harness le entregue instrucciones, resultados de lectura, herramientas de edición y mecanismos de compactación. Por eso, comparar modelos ignorando su entorno de ejecución puede confundir causas.

## Caso de contraste: OpenAI en Codex y en OMP

Codex CLI y Oh My Pi pueden operar con modelos de la familia OpenAI, según la autenticación y las versiones compatibles. Eso permite diseñar un contraste útil: **mismo modelo, mismo esfuerzo y misma tarea; distinto harness**.

Codex ofrece un ciclo integrado de lectura, edición, comandos, aprobaciones y sandbox. Es una opción inicial razonable para cambios completos que exigen pruebas y una entrega verificable. [Codex](https://github.com/openai/codex).

OMP, derivado de Pi, ofrece herramientas especializadas, incluida integración LSP, depuración y edición con anclajes hash, además de extensibilidad y acceso multiproveedor. Es un candidato interesante para explorar referencias, localizar símbolos y hacer modificaciones focalizadas. [OMP](https://github.com/can1357/oh-my-pi).

La diferencia **no demuestra que uno programe mejor que el otro**. LSP puede ahorrar exploración cuando el lenguaje y el servidor están disponibles; también puede aportar poco en un proyecto pequeño o mal indexado. Un flujo integrado puede mejorar la coherencia de tareas largas, pero eso también requiere medición. Los benchmarks publicados por un proveedor no sustituyen las pruebas sobre un proyecto propio.

| Dimensión | Codex CLI | OMP | Hipótesis que vale probar |
| --- | --- | --- | --- |
| Ciclo de ejecución | Herramientas, comandos y controles integrados | Superficie de herramientas especializada y extensible | ¿Cuál termina la tarea con menos intervenciones? |
| Exploración | Lectura y búsqueda del repositorio | Búsqueda y operaciones LSP cuando están disponibles | ¿Cuál localiza cambios correctos con menos lecturas? |
| Edición | Edición según herramientas del agente | Edición hash-anchored y operaciones estructuradas | ¿Cuál produce menos intentos fallidos? |
| Contexto | Gestión integrada de sesión y compactación | Configuración y estrategias propias de sesión | ¿Cuál conserva mejor las restricciones? |
| Seguridad | Sandbox y aprobaciones explícitos | Controles dependientes de configuración y herramientas | ¿Cuál respeta el mismo contrato de permisos? |
| Costo | Cuota de suscripción o API, según acceso | Suscripción compatible u otras API, según proveedor | ¿Cuál reduce costo total por tarea aceptada? |

No hay que confundir **harness** con **proveedor de inferencia**. En OMP, la ruta de autenticación puede afectar facturación, límites y modelos disponibles; una suscripción de Codex y una clave de OpenAI API no son intercambiables por definición. Antes del A/B, fijar el identificador efectivo de modelo y las condiciones de acceso.

## El selector como planificador de trabajo

Un coordinador que solo escoge el modelo más fuerte puede terminar pagando por capacidad ociosa y usando herramientas inadecuadas. Un planificador más fino resuelve la tarea por etapas:

1. **Clasificar el trabajo:** exploración, implementación, refactor, depuración, test, revisión o documentación.
2. **Aplicar restricciones duras:** permisos, secretos, lenguaje, herramientas disponibles, límites de cuota, latencia aceptable y aislamiento requerido.
3. **Seleccionar un rol:** responsable, explorador, implementador, revisor o verificador; cada rol con alcance y salida esperada.
4. **Evaluar parejas modelo–harness:** compatibilidad real, esfuerzo configurable, herramientas y evidencia empírica para ese tipo de tarea.
5. **Ejecutar y verificar:** en worktree aislado, con tests, diff, registro de consumo y aceptación humana cuando corresponda.
6. **Aprender sin automatizar a ciegas:** registrar resultados, ajustar reglas y conservar una ruta de fallback segura.

El rol no es una etiqueta estética: define el contrato. Un revisor no debería adquirir permisos de escritura por elegir otro CLI. El harness se elige **después** de establecer qué acciones están autorizadas.

## Una matriz de enrutamiento inicial

| Tipo de encargo | Rol | Harness candidato inicial | Condición para preferirlo |
| --- | --- | --- | --- |
| Localizar impacto entre módulos | Explorador | OMP | LSP operativo y ahorro medido de lecturas |
| Corregir bug con tests | Implementador | Codex | Mayor tasa de resolución aceptada |
| Refactor de símbolos | Implementador especializado | OMP | Edición y renombres estructurados verificables |
| Cambios transversales | Implementador | Codex | Mejor consistencia en tests y contratos |
| Revisar un diff | Revisor | Cualquiera elegible, con lectura únicamente | Menos defectos omitidos y menor costo de revisión |
| Recuperar trabajo fallido | Diagnóstico y fallback | Harness alternativo permitido | Evidencia de que el cambio de herramientas corrige la falla |

Son **hipótesis de asignación**, no propiedades exclusivas de los productos. Si las pruebas contradicen la tabla, cambia la tabla, no la evidencia.

## Un contrato portable entre harnesses

Para delegar sin quedar atrapados en una CLI, el coordinador puede construir un sobre de tarea independiente del proveedor:

```yaml
task_id: BUG-142
role: implementer
goal: "Corregir duplicación de eventos sin alterar el contrato HTTP"
repository_ref: "commit-inmutable"
scope:
  writable: ["src/events/**", "tests/events/**"]
constraints:
  network: false
  secrets: none
  production_write: false
acceptance:
  - "tests de regresión aprobados"
  - "diff acotado al scope"
outputs: ["resumen", "diff", "tests", "uso", "bloqueos"]
```

Ese contrato debe traducirse a mecanismos **reales** del harness y del sistema operativo. Escribir `network: false` en un YAML no desconecta la red por arte de magia. Si el harness no puede respetar una restricción crítica, se descarta como candidato, aunque su benchmark sea excelente.

## Benchmark A/B: aislar el efecto del harness

La comparación útil no enfrenta modelos distintos por accidente. Para tareas pareadas, mantener iguales: commit inicial, fixtures, modelo e identificador de versión cuando sea posible, esfuerzo efectivo, instrucciones funcionales, alcance, presupuesto y pruebas de aceptación. Documentar diferencias inevitables en prompts de sistema, herramientas y compactación: **son precisamente parte del tratamiento experimental**.

Usar varias tareas representativas y al menos tres repeticiones por configuración, sin reutilizar soluciones previas y con worktrees limpios. Medir:

- **Calidad:** porcentaje de tareas aceptadas, tests, regresiones, defectos omitidos y calidad de diff.
- **Eficiencia:** tokens y costo atribuibles, número de llamadas, reintentos de edición y tiempo hasta aceptación.
- **Operación:** intervenciones humanas, compactaciones, relecturas, errores de permisos y recuperaciones.
- **Seguridad:** intentos de acciones fuera del alcance y cumplimiento efectivo de restricciones.

El indicador central no es la velocidad de generar un patch, sino el **costo total por tarea aceptada**, incluyendo revisión, retrabajo y fallas. Si las métricas de consumo no son comparables entre proveedores, informarlas por separado y privilegiar calidad y costo monetario observado.

## Fallback, aprendizaje y límites

Un router avanzado necesita evitar dos trampas. La primera es cambiar automáticamente de harness ante cualquier error: si falla un test por lógica, otro CLI no garantiza resolverlo. La segunda es premiar al agente que reporta éxito más rápido, cuando la verificación independiente dice otra cosa.

Conviene registrar `(tipo de tarea, modelo, esfuerzo, harness, versión, herramientas, permisos, resultado)` y actualizar preferencias solo con un tamaño de muestra razonable. Ante fallos de infraestructura o herramientas, permitir fallback compatible. Ante una restricción de seguridad, **detener y escalar**, no buscar un harness más permisivo.

También importa el costo de cambiar de superficie: instalación, contexto que hay que reconstruir, complejidad de los logs y nuevas clases de errores. Un único harness consistente puede superar a un router sofisticado si la operación es pequeña.

## De elegir el mejor modelo a elegir el mejor entorno de trabajo

La evolución no consiste en acumular CLIs. Consiste en dejar de considerar al harness una constante invisible.

Un coordinador maduro debería poder responder: **¿qué combinación de modelo, esfuerzo, rol y harness produce una entrega verificable para esta función, dentro de las restricciones y el presupuesto disponible?**

La respuesta no sale de preferencias de marca. Sale de contratos portables, experimentos reproducibles y métricas de tareas aceptadas. El harness se convierte así en una variable de planificación, no en una religión del terminal.

Para una panorámica de los productos y sus compensaciones, ver [Comparar harness CLI](/entrada/comparar-harness-cli-codex-claude-opencode-cline).
