---
slug: protocolos-humanos-cuota-rct-overdrive
title: "RCT y Overdrive: protocolos humanos para gestionar la cuota de proveedores"
type: editorial
order: 20
summary: "Dos respuestas preparadas para la escasez y el vencimiento de cuota: proteger pasos LIVE, aprovechar trabajo BUILD y mantener la decisión en manos del operador."
tags: [proveedores, cuota, protocolos, rct, overdrive, continuidad, operaciones, gobierno]
related: [enrutamiento-modelo-esfuerzo-rol-harness, guia-escalado-modelos, comparar-harness-cli-codex-claude-opencode-cline, orquestacion]
area: Gobierno de agentes
glyph: ◈
hue: rgba(237,195,94,.25)
---

# RCT y Overdrive: protocolos humanos para gestionar la cuota de proveedores

> Marco operativo definido en octubre de 2026. Describe decisiones del operador humano, todavía no una política autónoma del coordinador ni una optimización validada por benchmarks. Los nombres de modelos y comandos del ejemplo pertenecen a una configuración concreta.

## La cuota también condiciona la operación

Una ronda de trabajo puede estar bien diseñada y encontrarse con dos situaciones opuestas: queda poca cuota para terminarla, o queda capacidad disponible que podría perderse al llegar un reset. Resolver ambas sobre la marcha introduce decisiones apuradas justo cuando menos conviene improvisar.

La idea de RCT y Overdrive es dejar preparada esa respuesta. El operador cambia cuánto trabajo abre, qué frentes prioriza y dónde decide detenerse. La complejidad de cada tarea sigue determinando el modelo y el esfuerzo de razonamiento que necesita.

Se puede pensar como un *min-maxing* de la gestión de proveedores: aprovechar mejor una capacidad limitada sin debilitar los controles que hacen confiable el resultado. La unidad de valor es una tarea aceptada, una incertidumbre resuelta o un riesgo reducido. Agotar un contador, por sí solo, no demuestra eficiencia.

Este enfoque complementa el [enrutamiento por modelo, esfuerzo, rol y harness](/entrada/enrutamiento-modelo-esfuerzo-rol-harness). Allí se decide qué combinación sirve para una tarea; aquí se decide cómo administrar una ronda cuando cambia la disponibilidad del proveedor.

## Primero, quién decide

**La activación y la salida de estos protocolos son decisiones humanas.** El operador observa el consumo, interpreta la ventana de disponibilidad y elige las prioridades. También decide si canjea un reset y cuándo hacerlo.

El coordinador puede recibir una instrucción explícita: reducir frentes, preparar pruebas, registrar un punto de reanudación o presentar evidencia. Esa colaboración no le concede autoridad para cambiar de régimen, gastar capacidad extra, elevar permisos o iniciar un paso LIVE por su cuenta.

En esta versión, el aviso al cruzar un umbral de cuota forma parte de la operación humana. Si más adelante se instrumenta una alerta automática, habrá que definir qué fuente lee, con qué demora y a quién avisa. Una alerta no equivale a una autorización.

## BUILD y LIVE: separar el trabajo por sus consecuencias

Usamos **BUILD** para preparación aislada: implementación en ramas, tests con datos de prueba, documentación, auditorías y pre-revisiones. Usamos **LIVE** para pasos con efecto real: desplegar, migrar datos, cambiar configuración de producción o ejecutar una operación sobre un servicio activo.

La clasificación depende del efecto y los permisos. Una prueba que escribe en producción es LIVE aunque su nombre diga “test”. Una auditoría que solamente lee puede seguir siendo BUILD, pero necesita cuidar los datos a los que accede.

Esta separación permite aumentar la preparación sin acelerar automáticamente la publicación. El gate LIVE conserva su autorización, evidencia y mecanismo de recuperación.

| Decisión | RCT: cuota baja | Overdrive: cuota por vencer |
| --- | --- | --- |
| Objetivo | Llegar a cierres seguros y conservar continuidad | Convertir capacidad disponible en entregables útiles |
| Frentes | Menos abiertos, priorizar los que cierran algo | Más BUILD independiente, dentro de la capacidad de revisión |
| Modelo y razonamiento | Conservar el nivel que requiere la tarea | Conservar el nivel que requiere la tarea |
| Pasos LIVE | Admitir solo los que tienen margen para terminar y recuperar | Mantener los mismos gates; no multiplicarlos por tener cuota |
| Evidencia | Punto seguro, recibo y sesión registrada | Resultados verificables y salidas revisables por cada frente |
| Decisión de régimen | Operador humano | Operador humano |

## RCT: proteger el cierre cuando queda poca cuota

El protocolo original establece siete reglas:

1. **No bajar modelos ni razonamiento por falta de cuota.** Si una tarea requiere una configuración, se conserva. Se reduce alcance o concurrencia antes que degradar esa asignación.
2. **Antes de cada paso LIVE, dejar un punto seguro y un recibo en disco.** El estado previo y el plan de recuperación deben ser localizables fuera del chat.
3. **No empezar un paso LIVE si no entra en la cuota restante, contando su rollback.** También hay que contemplar verificación y diagnóstico, no solamente la ejecución feliz.
4. **Abrir menos frentes y priorizar los que cierran algo.** Un cambio pequeño aceptado puede valer más que cinco tareas a medio hacer.
5. **Registrar las sesiones para retomar desde un estado identificable.** Guardar referencias, resultados y el próximo paso evita reconstruir todo de memoria.
6. **Canjear el reset entre pasos, nunca en medio de uno.** Primero se termina o se lleva la operación a un punto seguro; después se cambia la condición de capacidad.
7. **Avisar al cruzar un umbral, alrededor del 5 %.** Es una señal de atención del operador, no un margen universalmente suficiente.

La tercera regla exige prudencia: un porcentaje de uso rara vez permite predecir exactamente cuántas acciones quedan. Una estimación conservadora puede apoyarse en pasos comparables y agregar margen de incertidumbre. Si no se puede justificar capacidad para ejecutar, verificar y recuperar, la decisión es posponer el LIVE.

Además, la recuperación no debería depender exclusivamente de que el mismo modelo siga respondiendo. Un rollback documentado, accesible y ejecutable por una persona reduce esa dependencia. Hay operaciones que no admiten reversión simple; en esos casos hace falta un plan de recuperación adecuado antes de tratarlas como elegibles.

### Qué contiene un recibo útil

Un recibo es un registro breve de la operación, no una transcripción interminable:

- Identificador de tarea, responsable y momento del registro.
- Repositorio, rama o worktree y commit de partida; cambios todavía sin commit, si existen.
- Estado observado y ubicación del punto seguro o respaldo, cuando corresponda.
- Paso autorizado, alcance y verificación prevista.
- Procedimiento de rollback o recuperación y cómo acceder a él.
- Sesión o terminal asociada, resultados de las pruebas y próximo paso exacto.

El recibo previo documenta la preparación. Después del paso se actualiza con lo que realmente ocurrió y la evidencia obtenida. No debe contener credenciales ni confundir un plan con una ejecución completada.

Registrar una sesión ayuda a recuperar contexto, pero no congela el mundo: al retomar hay que comprobar si cambiaron la rama, los servicios o el estado remoto. “Retomar exactamente” significa reconstruir el punto de trabajo con evidencia, no repetir comandos a ciegas.

## Overdrive: aprovechar capacidad sin fabricar trabajo

Overdrive parte de otra condición: el operador tiene motivos para creer que cierta cuota disponible vencerá antes de usarla. Antes de activarlo, verifica la ventana aplicable a su cuenta. Una publicación ambigua sobre horarios o un reset supuesto no alcanza para tratar esa capacidad como disponible.

En el entorno que dio origen a este protocolo, la pauta es activar **`/fast` en todas las terminales de Codex que participan en la ronda**. Se registra como una elección de ese entorno, no como una promesa de disponibilidad, velocidad, precio o consumo para cualquier cuenta. El operador debe comprobar que el comando exista en su versión, que el modo quede activo y qué condiciones aplica el proveedor. Cambiar velocidad no autoriza cambiar razonamiento.

Como referencia externa al 12 de octubre de 2026, Fast consume los límites incluidos a 2,5 veces la tasa Standard; los créditos comprados y Enterprise pay-as-you-go se facturan a 2 veces. Confirmá qué bolsa usa la cuenta antes de activar la ronda. [Velocidad y consumo de Codex](https://learn.chatgpt.com/docs/agent-configuration/speed).

La capacidad se orienta a **más frentes BUILD en paralelo, más auditorías y pre-revisiones, más tests y documentación**. Para que eso produzca valor, cada frente necesita una salida y una condición de cierre: una prueba de regresión, un informe de impacto, un diff acotado o una guía contrastada con el código.

El ejemplo conserva **coordinadores en Sol medium y Luna en high**, según el reparto habitual del operador. Son asignaciones concretas, no una tabla universal de equivalencias entre familias. La excepción “subir a high para auditores de gate LIVE o diseños difíciles” se refiere a elevar las asignaciones que parten de medium; Luna ya está en high. La cuota sobrante no justifica una escalada general.

Más concurrencia también aumenta el costo de integración. Conviene aislar ramas o worktrees, asignar archivos y responsabilidades, y evitar que varios agentes resuelvan el mismo problema sin una comparación planificada. Las auditorías aportan poco si repiten observaciones sin criterio de aceptación ni alguien que las revise.

### La capacidad humana pone el límite

Antes de abrir otro frente, el operador debería poder responder:

- ¿Qué entrega útil va a producir y qué decisión habilita?
- ¿Puede cerrarse o quedar en un punto seguro dentro de la ventana?
- ¿Tiene independencia suficiente para no bloquear a los demás?
- ¿Quién va a revisar el resultado y cuándo?

Si la revisión humana ya está saturada, aumentar agentes puede convertir cuota que vence en deuda de revisión. En ese caso conviene terminar tests, consolidar documentación o cerrar frentes existentes. También es válido dejar capacidad sin usar.

## Dos escenas para aplicar el criterio

**Cuota baja antes de una migración.** Hay una corrección casi cerrada, dos investigaciones abiertas y una migración pendiente. El operador activa RCT, termina la corrección verificable y registra las investigaciones. La migración espera si no hay margen defendible para validación y recuperación. El reset, si corresponde y está disponible, se canjea desde ese punto seguro.

**Ventana confirmada con cuota disponible.** Hay una feature en BUILD que todavía necesita tests y revisión. El operador activa Overdrive y reparte tareas independientes: regresión, compatibilidad, revisión del diff y documentación operativa. Los resultados llegan al mismo gate de publicación. Ninguna de esas salidas convierte el despliegue en automático.

Son ejemplos de aplicación del protocolo, no resultados medidos. Para validar su utilidad conviene comparar rondas por cierres aceptados, defectos encontrados antes de LIVE, tiempo de reanudación, retrabajo y carga de revisión. El porcentaje consumido es contexto, no el indicador principal de éxito.

## Una ficha antes de empezar la ronda

La formalización mínima puede ser un registro del operador:

```yaml
protocolo: RCT # u Overdrive
activado_por: operador_humano
motivo: "Condición de cuota verificada para esta ronda"
fuente_y_hora_de_cuota: "Completar con la consulta real"
ventana_de_reset: "Confirmada o desconocida; no estimar como hecho"
frentes_prioritarios: []
configuraciones_que_se_conservan: []
limite_de_concurrencia: "Según aislamiento y capacidad de revisión"
proximo_punto_seguro: "Referencia verificable"
condicion_de_salida: "Definida por el operador"
```

Es una propuesta de registro, no un archivo que active comportamientos por sí mismo. La condición de salida puede ser llegar al cierre previsto, cambiar la disponibilidad o agotar la capacidad de revisión. El operador la evalúa entre pasos seguros.

## Qué aporta tenerlo decidido de antemano

RCT sirve cuando la prioridad es continuidad y cierre con capacidad escasa. Overdrive sirve cuando hay una ventana confirmada y un backlog de preparación útil que se puede absorber. Ambos conservan el nivel técnico de las tareas y hacen explícita la responsabilidad humana.

La mejora buscada es concreta: que un evento del proveedor cambie la organización de la ronda sin obligar a inventar criterios de riesgo, permisos y calidad en ese momento. Más adelante se podrá automatizar la observación o parte del registro. Delegar la decisión de régimen requiere un diseño y una autorización adicionales.

### Lecturas relacionadas

- [Elegir modelos y esfuerzo de razonamiento](/entrada/guia-escalado-modelos): el nivel se elige por la tarea.
- [Modelo, esfuerzo, rol y harness](/entrada/enrutamiento-modelo-esfuerzo-rol-harness): cómo repartir funciones entre configuraciones.
- [Comparar harness CLI](/entrada/comparar-harness-cli-codex-claude-opencode-cline): herramientas, permisos y continuidad del trabajo.

Las reglas RCT y Overdrive provienen del protocolo humano que motivó esta editorial. Los recibos, la ficha y las métricas propuestas desarrollan su aplicación; no representan funciones nativas garantizadas por un proveedor.
