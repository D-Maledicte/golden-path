---
slug: orca-t3-code-capy
title: Orca, T3 Code y Capy — dónde conviene coordinar a los agentes
type: editorial
order: 24
summary: "Tres formas de repartir trabajo entre agentes. Cuándo sostener el cockpit de Orca, qué probar en T3 Code y qué delegar a Capy alrededor de un pull request."
tags: [orca, t3-code, capy, orquestacion, worktrees, gobierno]
related: [caso-orca-cockpit-multiagente, orquestacion, enrutamiento-modelo-esfuerzo-rol-harness]
area: Gobierno de agentes
glyph: ⚿
hue: rgba(87,217,232,.24)
---

# Orca, T3 Code y Capy — dónde conviene coordinar a los agentes

Si ya trabajás con un agente que reparte tareas, implementadores en ramas separadas y una revisión antes de integrar, cambiar de herramienta vale la pena cuando simplifica un tramo concreto del trabajo. **Orca es la referencia para operar ese sistema desde el entorno de desarrollo. T3 Code es la alternativa más directa para probar qué cambia cuando la delegación queda registrada entre hilos. Capy tiene su mejor caso en el trabajo que puede seguir avanzando alrededor de un pull request mientras el equipo está en otra cosa.**

*Documentación revisada el 17 de noviembre de 2026. El punto de partida es un caso de Orca ya documentado en Golden Path. La evaluación de T3 Code y Capy se basa en sus capacidades documentadas y propone una prueba de campo.*

## Qué tendría que reemplazar una alternativa

En el [caso del cockpit de Orca](https://ia.dmaledicte.cloud/entrada/caso-orca-cockpit-multiagente), el coordinador inicial repartía el trabajo entre agentes con distintos CLIs. La experiencia evolucionó hacia tres responsabilidades diferenciadas: dirección, integración y coordinación de paquetes. Cada implementación tenía una rama y un worktree propios, es decir, un checkout de Git con su propio directorio de trabajo. La revisión podía recaer en otro agente. BUILD y LIVE tenían reglas distintas, y las excepciones de producción dependían de un alcance autorizado. Integrar un PR, aplicar el cambio y aceptarlo tras observar el comportamiento eran hitos distintos.

El costo de cambiar de herramienta aparece en esas relaciones. Importa si el coordinador puede seguir eligiendo quién implementa y quién revisa, si al volver de una interrupción puede reconstruir qué avanzó y si una tarea terminada por el agente sigue esperando la decisión que le corresponde. Abrir dos sesiones con el mismo prompt cubre una parte pequeña de ese circuito.

## Comparación operativa

| Pregunta | Orca | T3 Code | Capy |
| --- | --- | --- | --- |
| ¿Qué organiza primero? | El workspace, con terminales, archivos y agentes asociados a un repo y un worktree. | El hilo de trabajo, con historial durable y un proveedor conectado al entorno. | El hilo y su trabajo pendiente, con seguimiento de PR y eventos. Un Captain reúne varios hilos de un proyecto. |
| ¿Dónde se ejecuta? | En el entorno propio, incluido WSL o un host SSH según la configuración. | En la máquina que corre el servidor de T3, con los proveedores configurados en ese entorno. | En una VM Linux por hilo cloud o en un dispositivo vinculado. En Windows, la guía de escritorio documenta Git for Windows. |
| ¿Cómo se aísla una tarea? | Un worktree por tarea en el flujo habitual. | Worktree al crear un hilo o al pedir aislamiento explícito en la delegación local. La delegación comparte el checkout por defecto. | Hilos locales con checkout actual, worktree existente o nuevo. Los subagentes cloud pueden compartir máquina y árbol con el padre o recibir una VM propia. |
| ¿Qué vuelve al coordinador? | En el flujo del caso, la evidencia llega por el handoff y Git. La capa experimental agrega tareas, mensajes y gates. | La delegación por MCP registra el vínculo padre–hijo, el estado y la devolución del resultado. | El subagente devuelve un resumen. Un Captain coordina hilos de su proyecto y reúne decisiones y bloqueos en un digest. |
| ¿Dónde se comprueba la autoridad? | En los permisos efectivos del entorno y en las reglas de integración y LIVE. | En los permisos por hilo y por proveedor, además de los controles en Git y despliegue. | En el acceso de la cuenta, el alcance sobre los repos y las reglas de GitHub y despliegue. El modo cloud utiliza la GitHub App para acceder a los repos. |

## Orca conserva el control del entorno

Orca pone el worktree, la terminal y el diff a mano. Eso favorece tareas en las que la persona necesita intervenir en el mismo entorno que usan los agentes, por ejemplo para reproducir un fallo en WSL o consultar un host por SSH. También permite asignar un CLI diferente a cada rol y revisar el trabajo desde Git aunque la conversación se interrumpa. [Worktrees en Orca](https://orca.dev/docs/model/worktrees) · [Terminal y WSL](https://orca.dev/docs/terminal)

La contracara es el trabajo de mantener ese mapa. Los checkouts, dependencias y procesos locales consumen recursos, y el coordinador tiene que reconstruir estado si la información importante quedó en distintas terminales. Orca documenta una capa experimental de orquestación con Runs, tareas, workers y gates, cuya disponibilidad conviene comprobar en la compilación que se use. El caso de Golden Path demuestra el método con worktrees y handoffs. Ese circuito ya produce evidencia que se puede recuperar desde Git. [Orquestación oficial](https://orca.dev/docs/cli/orchestration) · [Caso del cockpit](https://ia.dmaledicte.cloud/entrada/caso-orca-cockpit-multiagente)

## T3 Code pone la delegación en el historial

T3 tiene sentido cuando la fricción está en saber qué le pidió el coordinador a cada worker y qué volvió. Su MCP de orquestación documenta hilos hijos con estado y devolución de resultados, además de opciones para elegir proveedor y modelo. Un coordinador también puede operar desde afuera de T3 mediante su servidor MCP, con acceso acotado a las capacidades que se le concedan. Eso permite probar primero un paquete de trabajo con el coordinador actual y observar cómo cambia el handoff. [Delegación en T3 Code](https://github.com/pingdotgg/t3code/blob/main/docs/orchestration-v2/orchestrator-mcp-server.md#delegate_task) · [Agentes externos](https://github.com/pingdotgg/t3code/blob/main/docs/user/outside-agents.md)

La condición importante es **pedir un worktree al delegar escritura local**. El modo predeterminado comparte checkout. El worktree nuevo parte del commit del padre, así que los cambios sin commit quedan fuera del encargo. En un entorno enlazado, la delegación directa usa el checkout remoto del proyecto. Para abrir allí un hilo aislado, la documentación indica lanzarlo con una estrategia de worktree. Antes de trasladar un paquete entero, probaría también qué permisos aplica cada proveedor y qué diferencias hay entre el entorno instalado en WSL y las opciones de la rama principal de T3. [Contrato de delegación y lanzamiento](https://github.com/pingdotgg/t3code/blob/main/docs/orchestration-v2/orchestrator-mcp-server.md) · [Modos de permiso](https://github.com/pingdotgg/t3code/blob/main/docs/user/permission-modes.md)

## Capy puede hacerse cargo del seguimiento del PR

Capy encaja cuando la tarea se puede expresar como un resultado verificable en GitHub. Un hilo cloud tiene su VM Linux y puede retomar trabajo cuando termina CI o llega una revisión. Para una actualización acotada de dependencias con pruebas reproducibles, el agente puede preparar el cambio, abrir un PR y ocuparse de un fallo de CI dentro del alcance acordado. Un Captain amplía esa idea a un proyecto: coordina varios hilos, mantiene un plan y reúne en un digest las decisiones que requieren atención. Un Captain y su equipo operan con el acceso que corresponda a su dueño, una consideración material al elegir quién lo configura. [Inicio rápido](https://docs.capy.ai/quickstart) · [Trabajo en segundo plano](https://docs.capy.ai/async-work) · [Captains](https://docs.capy.ai/captains)

La decisión de adopción pasa por el entorno. En cloud hay que preparar las dependencias y autorizar la GitHub App para los repos elegidos. El disco persiste durante la suspensión, los procesos se detienen y una reconstrucción de VM puede perder cambios sin subir. El modo de escritorio usa herramientas y credenciales del dispositivo y evita el cargo por tiempo de máquina cloud. Para reproducir un flujo apoyado en Ubuntu bajo WSL, comprobaría compatibilidad efectiva con esa distribución, sus rutas y sus CLIs antes de atribuirle paridad. [Máquinas cloud](https://docs.capy.ai/machines) · [Escritorio y dispositivos](https://docs.capy.ai/desktop)

## Una prueba que puede cambiar la decisión

Usaría un repo de ensayo con CI y dos tareas equivalentes de bajo riesgo. Mantendría la misma base, pruebas de aceptación y, cuando esté disponible en los tres productos, el mismo modelo. Cada tarea tendría un implementador y un revisor, y terminaría en un PR listo para decisión humana. Haría una pausa durante CI, enviaría un comentario de revisión y volvería a la sesión para reconstruir el estado con la evidencia disponible. En Capy, limitaría la instalación al repo de ensayo. En los tres casos, dejaría la rama protegida y los permisos de despliegue fuera del entorno del agente para que el gate sea verificable.

| Qué medir | Qué observar |
| --- | --- |
| Intervención humana | Minutos activos y cantidad de veces que hubo que reenviar contexto, mover trabajo o reactivar un hilo. |
| Recuperación | Tiempo para identificar el commit, el estado de CI, el responsable y la próxima decisión después de la pausa. |
| Aislamiento y autorización | Rama y directorio por implementador. Resultado de una comprobación que confirme que la integración sigue detrás del gate. |
| Evidencia y costo | PR, alcance real del diff, pruebas, observaciones de la revisión y consumo del modelo. Sumar minutos de VM cuando se use cloud. |

**Mantendría Orca como base del flujo heterogéneo que ya funciona.** Probaría primero T3 Code para un paquete coordinado con dos workers en WSL. Si reduce los handoffs manuales y permite recuperar el estado y verificar el gate, merece una segunda prueba con un paquete real de BUILD. Probaría Capy en paralelo para una tarea cuyo avance dependa de CI y de la revisión del PR. Si reduce el seguimiento manual con acceso acotado y evidencia suficiente, ya se ganó un lugar aunque el resto de la coordinación siga en Orca.
