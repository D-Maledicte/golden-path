---
slug: amp-fabrica-agentes-cloud
title: Amp y la fábrica de agentes en la nube
type: editorial
order: 13
summary: Amp empaqueta agente, máquina, contexto y Git en una sola superficie. No inventa el desarrollo multiagente, pero vuelve producto una práctica que todavía solemos construir a mano.
tags: [amp, orbs, agentes, cloud, orca, github, multi-modelo, automatizaciones]
related: [orquestacion, caso-orca-cockpit-multiagente, workspaces-y-worktrees, guia-escalado-modelos]
area: Gobierno de agentes
glyph: ◌
hue: rgba(87,217,232,.22)
---

# Amp y la fábrica de agentes en la nube

> Vigencia editorial: 13 de septiembre de 2026. Amp declara una filosofía de frontera y sin compromiso de compatibilidad hacia atrás; modelos, routing, precios y funciones pueden cambiar con rapidez.

Amp no resulta interesante porque haya inventado otro agente capaz de editar archivos. Ese espacio ya está lleno. Lo atractivo es que intenta convertir en producto todo lo que rodea al agente: la máquina donde trabaja, el contexto que conserva, el repositorio que modifica, las pruebas que ejecuta, los agentes que coordina y la continuidad necesaria para terminar aunque la computadora del usuario esté apagada.

En otras palabras, Amp comercializa una versión ordenada de una fábrica que muchos equipos todavía arman artesanalmente con CLIs, worktrees, sesiones persistentes, servidores y bastante disciplina operativa.

## El agente no trabaja en el vacío

Una conversación puede producir una buena idea, pero el desarrollo real exige un entorno. Hay que clonar código, instalar dependencias, ejecutar servicios, inspeccionar CI, probar la aplicación y devolver cambios revisables.

Amp reúne esas piezas alrededor de sus **Threads** y **Orbs**. Un Thread conserva la conversación y el trabajo; un Orb es una máquina remota aislada, creada para ese hilo, con su propia copia del repositorio y sus herramientas. Puede seguir ejecutándose cuando el usuario cierra la notebook, dormirse cuando queda inactivo y despertar después con archivos, servicios e historial disponibles.

La novedad no está en ninguna pieza aislada. Está en tratarlas como una sola unidad operativa:

**agente + contexto + máquina + código + evidencia**.

Esa combinación permite pedir algo más exigente que “escribí esta función”. Se le puede pedir que implemente el cambio, levante el sistema, lo pruebe de punta a punta y deje una rama o un pull request acompañado por evidencia.

## The Dial: elegir esfuerzo antes que marca

Amp organiza la capacidad mediante un selector de cuatro niveles: `low`, `medium`, `high` y `ultra`. La idea es elegir según la dificultad y el costo de equivocarse, no enamorarse del nombre de un modelo.

| Modo | Lectura práctica |
|---|---|
| `low` | Cambios chicos, tests y refactors con resultado evidente |
| `medium` | Desarrollo cotidiano con algo de ambigüedad o varios pasos |
| `high` | Trabajo delicado que debería llegar cerca de una revisión final |
| `ultra` | Arquitectura, migraciones y problemas abiertos entre varios sistemas |

Detrás de cada posición, Amp puede combinar modelo principal, nivel de razonamiento, herramientas, instrucciones, subagentes y un **Oracle** que aporta una segunda opinión. El routing automático cambia cuando aparecen mejores modelos, mientras que la intención del modo permanece estable.

La abstracción es sana: una organización no debería reescribir su política cada vez que cambia el ranking de proveedores. “Usar capacidad alta cuando una omisión sutil sería cara” envejece mejor que “usar siempre el modelo X”.

Sin embargo, Amp no obliga a entregar todo el control. Es posible fijar modelos y esfuerzo por separado para el agente principal, el Oracle y los subagentes, además de definir modos personalizados mediante plugins.

## Dos formas de delegar

Amp distingue entre subagentes especializados y agentes completos ejecutados en otros Threads.

Los subagentes internos sirven para búsquedas, investigación, lectura de conversaciones previas y consultas difíciles al Oracle. Trabajan con una ventana de contexto separada y devuelven un resumen al agente principal. Mantienen limpio el hilo central, aunque tienen límites claros: no conversan entre sí y no pueden ser orientados a mitad del trabajo.

La delegación entre agentes completos es más ambiciosa. Un agente puede iniciar otro Thread en un Orb, transferirle instrucciones o archivos y continuar trabajando mientras espera el resultado. Cada hilo obtiene su propia conversación, copia de trabajo y máquina. Eso habilita fan-out real: varias investigaciones, navegadores, resoluciones o proyectos avanzando en paralelo.

El aislamiento es deliberado. Los archivos sin commit y los cambios no aparecen mágicamente en los otros entornos; deben transferirse o integrarse de forma explícita. Esa fricción evita bastante caos, pero no elimina la necesidad de un buen coordinador.

## Amp frente a un cockpit como Orca

Amp y Orca se pisan, pero no son exactamente el mismo producto.

| Dimensión | Cockpit con Orca y CLIs | Amp |
|---|---|---|
| Unidad de trabajo | Sesión, terminal y worktree administrados por el usuario | Thread con working copy y Orb aislado |
| Infraestructura | Máquina local, WSL, SSH y servidores propios | Orbs cloud, ejecución local o runners propios |
| Selección de modelos | Explícita y granular por herramienta | Routing por dificultad, con posibilidad de fijarlo |
| Coordinación | Flexible, visible y artesanal | Delegación integrada entre subagentes y Threads |
| Continuidad | Depende de procesos y hosts administrados | El Orb sigue trabajando y se pausa automáticamente |
| GitHub | Credenciales y flujo del entorno local | GitHub App, tokens breves, branches, PR y CI integrados |
| Dependencia de plataforma | Menor: piezas intercambiables | Mayor: Orbs, Threads y coordinación viven en Amp |

Orca funciona especialmente bien como **cabina de mando**. Permite observar varias herramientas, elegir deliberadamente qué CLI y qué proveedor ocupa cada rol, intervenir sesiones y conservar control sobre la infraestructura.

Amp funciona más como una **fábrica administrada**. Entrega entornos remotos descartables, continuidad, aislamiento y un camino directo desde la consigna hasta una PR. Reduce trabajo operativo a cambio de aceptar más decisiones y más infraestructura de la plataforma.

No hay un ganador universal. Hay dos preferencias distintas: gobernar cada pieza o comprar una unidad de ejecución ya resuelta.

## GitHub como frontera de control

La integración con GitHub está pensada para trabajar sin distribuir tokens permanentes dentro de cada Orb. Amp usa una GitHub App y entrega credenciales breves cuando Git o `gh` necesitan comunicarse. Puede clonar repositorios privados, crear ramas y pull requests, consultar CI y firmar commits; las reglas de protección siguen aplicándose como si actuara el usuario.

Es una base razonable para equipos, pero la prudencia sigue siendo la misma: empezar con repositorios seleccionados, permisos mínimos y ramas protegidas. Que un agente tenga una máquina aislada no significa que deba recibir acceso a toda la organización.

## Automatizar con memoria

Las automatizaciones de Amp permiten que un Thread se reactive una vez o de forma recurrente conservando su historia. Puede revisar errores cada hora, observar un proceso largo, verificar CI después de un cambio o recordar el retiro de un feature flag.

Eso es más expresivo que un cron aislado porque el agente retoma decisiones y evidencia anteriores. También es más riesgoso si la consigna es vaga o los permisos son amplios. Una automatización agéntica necesita:

- una fuente de evidencia definida;
- permisos mínimos;
- una condición explícita de finalización;
- límites sobre qué puede modificar;
- un canal claro para escalar incertidumbre.

La continuidad no reemplaza al gobierno. Lo vuelve más importante.

## El costo real no es sólo el modelo

Amp separa el uso de agentes y herramientas del costo de cómputo de los Orbs. Permite conectar suscripciones compatibles, usar claves propias o consumir créditos de Amp. Los Orbs se cobran por minuto según CPU y memoria y dejan de generar costo cuando están pausados.

Para evaluar el producto no alcanza con comparar precio por token. Hay que medir:

1. tiempo desde la consigna hasta una PR revisable;
2. cantidad de correcciones humanas posteriores;
3. porcentaje de tareas resueltas en un intento;
4. costo de modelo, herramientas y máquina;
5. trabajo operativo que deja de hacer una persona;
6. facilidad para auditar cómo se llegó al cambio.

Un agente barato que necesita tres rondas no necesariamente es económico. Un Orb que cuesta centavos puede ahorrar una hora de preparación o, si queda sobredimensionado y mal controlado, sumar gasto sin mejorar el resultado.

## Una adopción sensata

Amp no debería reemplazar de golpe un entorno multiagente que ya funciona. La prueba útil es acotada:

- un repositorio no crítico;
- acceso de GitHub restringido a ese repositorio;
- una feature mediana con criterios de aceptación y tests;
- un Orb pequeño o mediano;
- comparación contra el mismo tipo de tarea realizado en el cockpit habitual.

Los primeros casos adecuados son features autónomas que terminan en PR, investigaciones largas que no conviene ejecutar localmente y tareas paralelas entre repositorios. Producción, secretos amplios y automatizaciones con capacidad de mutación deberían llegar después de validar el comportamiento real.

## Veredicto

Amp no reemplaza la necesidad de pensar cómo trabajan los agentes. La vuelve visible como producto.

Su aporte más fuerte no es prometer un modelo milagroso, sino reconocer que la calidad del desarrollo agéntico depende tanto del entorno como de la inteligencia: aislamiento, continuidad, herramientas, permisos, coordinación y evidencia.

Para quien ya construyó un cockpit artesanal, Amp puede sentirse menos como una revolución y más como una industrialización. La pregunta no es si puede escribir código. La pregunta es cuánto control conviene conservar y cuánto trabajo operativo vale la pena delegar a la plataforma.

---

## Fuentes oficiales

- [Introducción a Amp](https://ampcode.com/docs)
- [The Dial](https://ampcode.com/docs/the-dial)
- [Modes & Models](https://ampcode.com/docs/models-and-subagents)
- [Orbs](https://ampcode.com/docs/orbs)
- [Agent to Agent](https://ampcode.com/docs/orbs/agent-to-agent)
- [GitHub & Git](https://ampcode.com/docs/github)
- [Automations](https://ampcode.com/docs/orbs/automations)
- [Pricing](https://ampcode.com/docs/pricing)
