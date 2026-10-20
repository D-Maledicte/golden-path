---
slug: autonomia-con-contrato
title: "Autonomía con contrato: alinear alcance, permisos y herramientas"
type: editorial
order: 21
summary: "Dar permiso, habilitar una herramienta y estar listo para entregar son tres cosas distintas. Cómo conectarlas sin convertir la autonomía en acceso irrestricto."
tags: [agentes, permisos, sandbox, codex, claude-code, autonomia, entregas]
related: [modelos-guiados-el-entorno-es-la-politica, comparar-harness-cli-codex-claude-opencode-cline, orquestacion, arquitectura-read-only]
area: Gobierno de agentes
glyph: ⚿
hue: rgba(237,195,94,.25)
---

# Autonomía con contrato: alinear alcance, permisos y herramientas

> Revisión documental y operativa: 20 de octubre de 2026. No acredita validación integral en las sesiones ejecutoras.

## Cuando «tenés mi permiso» no alcanza

El coordinador entiende la tarea, el responsable autorizó una operación acotada y existe un procedimiento. Pero, al llegar al comando, el cliente lo rechaza. El agente explica la autorización, el responsable la repite y la herramienta vuelve a bloquear.

Puede faltar un permiso técnico, haber una clasificación incorrecta o existir un exceso real de alcance. Desde la terminal se parecen; corregirlos exige decisiones diferentes. Habilitar todos los comandos sólo oculta el problema.

En el caso que motiva esta editorial apareció además otro fracaso: después de pasar el día destrabando operaciones pequeñas, llegó a la ventana LIVE un paquete todavía inmaduro. Según su responsable, lo preocupante no era únicamente el trabajo pendiente, sino que se entregara sin reconocer por qué aún no estaba listo.

**Una autonomía útil necesita un camino ejecutable para el trabajo autorizado y evidencia suficiente para decidir cuándo entregarlo.**

## Alinear tres capas

El **alcance** define resultado, recursos, efectos y exclusiones. «Trabajar en el portal» es ambiguo; «modificar esta funcionalidad, probar localmente y preparar una revisión, sin publicar ni consultar datos reales» permite tomar decisiones.

El **harness**, es decir, el cliente que organiza las herramientas del agente, evalúa llamadas, reglas y aprobaciones. Que el modelo comprenda una autorización no significa que el CLI esté configurado para ejecutarla.

El **entorno** determina qué alcanza realmente el proceso: archivos, red, identidades y permisos remotos. Puede impedir una llamada admitida por el cliente o permitir técnicamente mucho más de lo autorizado.

Como criterio de diseño:

> Autonomía utilizable = alcance autorizado ∩ política del harness ∩ capacidades del entorno ∩ precondiciones vigentes.

Un README aporta contexto, pero no concede permisos del sistema. Una identidad con acceso completo tampoco amplía la tarea. Las documentaciones de [Claude Code](https://code.claude.com/docs/en/sandbox-environments) y [Codex](https://learn.chatgpt.com/docs/sandboxing) distinguen las decisiones de permiso del aislamiento de ejecución.

### «Auto» depende del cliente

En **Claude Code**, Auto utiliza un clasificador para ciertas acciones que llegan a revisión, no para aprobar universalmente todas las llamadas. Las reglas mantienen precedencia **deny > ask > allow**: una autorización específica no anula por sí sola una prohibición más amplia. El contexto de infraestructura ayuda a interpretar operaciones, pero no funciona como firewall. [Modos](https://code.claude.com/docs/en/permission-modes), [reglas](https://code.claude.com/docs/en/permissions) y [configuración de Auto](https://code.claude.com/docs/en/auto-mode-config).

En **Codex**, auto-review cambia quién evalúa las solicitudes elegibles; no amplía automáticamente directorios escribibles ni acceso de red. Tampoco revisa rutinariamente cada acción ya permitida. Las reglas por prefijo controlan coincidencias de ejecución, no describen todo el impacto del programa autorizado. Permitir ampliamente un intérprete o una herramienta extensible merece especial cuidado. [Auto-review](https://learn.chatgpt.com/docs/sandboxing/auto-review) y [reglas de ejecución](https://learn.chatgpt.com/docs/agent-configuration/rules).

Por eso no conviene trasladar un perfil entre clientes por semejanza de nombres. Hay que comprobar versión, configuración efectiva y políticas administradas en la sesión que ejecutará el trabajo.

## Diseñar capacidades, no sólo listas de comandos

«Puede usar curl» describe una herramienta. «Puede consultar el estado de una aplicación de staging, con identidad de lectura, destino fijo y campos de salida definidos» describe una capacidad.

El contrato de capacidades es un patrón de arquitectura que debe traducirse a controles reales. Su versión mínima responde:

- **Operación y recurso:** qué puede hacer, en qué proyecto y entorno.
- **Identidad y datos:** con qué privilegios, qué puede leer o modificar y qué puede exportar.
- **Vía de ejecución:** implementación revisada, parámetros admitidos y efectos posibles.
- **Condiciones:** vigencia, límites y decisiones que requieren volver al responsable.
- **Evidencia:** cómo se comprueba el resultado sin exponer secretos.

Debe cubrir el circuito completo: inspeccionar, validar, adquirir exclusión cuando corresponda, ejecutar, comprobar, informar y detener. Autorizar la operación principal pero impedir su readback deja un carril incompleto.

En un caso observado, quitar el shell a un worker de lectura también le quitó el mecanismo para avisar que había terminado. La solución es ofrecer un canal de cierre limitado, no devolverle una terminal generalista por comodidad. Del mismo modo, cerrar una ventana o una PTY no demuestra que un proceso compartido se haya detenido: hace falta una comprobación explícita.

### Una base compartida, perfiles distintos

Un backend de integración, un portal y un repositorio de funciones CRM pueden compartir herramientas sin compartir radio de impacto. Una separación inicial razonable sería:

- Backend: edición y pruebas locales; consultas remotas y despliegues como capacidades independientes.
- Portal: desarrollo y build; preview separado de publicación y del acceso a datos reales.
- Funciones CRM: pruebas con fixtures; lectura real separada de funciones que escriben, envían mensajes o disparan automatizaciones.

En el caso revisado ya se integró documentación que distingue contexto, política general y configuración por repositorio. El portal incorporó también su contexto operativo, sin cambiar settings ni conceder permisos. Es un avance documental concreto, no la validación de tres perfiles efectivos: los settings viven fuera de esos repositorios y todavía debe comprobarse qué cargó cada sesión.

## Usar una credencial sin exponerla

Autorizar una consulta autenticada no implica autorizar la lectura, impresión o copia de su clave. Cuando es posible, un intermediario confiable conserva la credencial, valida destino y parámetros, ejecuta la operación y devuelve únicamente lo necesario, usando una identidad de mínimo privilegio.

Una variable de entorno ordinaria no oculta el secreto al código que corre con ella. Un wrapper tampoco lo protege automáticamente: **si el agente puede modificarlo y después ejecutarlo con credenciales, puede cambiar lo que hace con ellas**. La implementación privilegiada necesita protección frente a quien la consume, parámetros restringidos y destinos validados.

Claude Code documenta mecanismos específicos de protección de credenciales, con requisitos y límites. No deben suponerse activos ni aplicables a todas las herramientas; el aislamiento de shell tampoco abarca automáticamente todos los hooks, servidores MCP y procesos relacionados. [Credenciales y sandboxing](https://code.claude.com/docs/en/sandboxing), [alcance del aislamiento](https://code.claude.com/docs/en/sandbox-environments).

El wrapper debe ser una interfaz verificable, nunca un disfraz para conseguir que pase un comando rechazado.

## Destrabar un permiso exige revisar el presente

En el caso hubo operaciones autorizadas sobre un entorno llamado Development que fueron clasificadas como Production Deploy. Algunos bloqueos se resolvieron mediante decisiones autorizadas y ajustes acotados. Eso no vuelve inocua la operación: había superficies LIVE involucradas.

**LIVE describe algo que alguien consume hoy, no el nombre comercial del entorno.**

También apareció el riesgo inverso: reanudar después del desbloqueo con condiciones viejas. Durante la pausa pudo liberarse un lock, cambiar el candidato o llegar una instrucción de STOP. Un postflight exitoso no corrige retroactivamente esa falta de control.

Antes de continuar hay que revisar mensajes y restricciones posteriores, confirmar alcance e identidad, recuperar la exclusión necesaria y renovar las verificaciones que puedan haber vencido. En un sistema multiagente, comunicar una autorización al coordinador tampoco actualiza automáticamente las sesiones abiertas de sus workers.

Para diagnosticar el rechazo, registrar acción, destino, efecto y capa que lo produjo, sin argumentos sensibles. Si falta alcance, se aclara con el responsable; si falla una identidad, se busca el rol mínimo; si hay una regla explícita, se revisa con quien puede modificarla. Una clasificación aparentemente incorrecta se contrasta con evidencia y se corrige por una vía autorizada.

Cambiar de comando, ruta o agente para obtener el mismo efecto prohibido es eludir la frontera. Una alternativa válida debe ser materialmente más segura o contar con una decisión autorizada sobre el cambio de límite. [Criterios de Auto-review](https://learn.chatgpt.com/docs/sandboxing/auto-review).

## Llegar a LIVE requiere una entrega preparada

La política operativa revisada separa cuatro estados que suelen mezclarse:

| Estado | Qué acredita | Qué falta demostrar |
| --- | --- | --- |
| Preparado localmente | Pruebas, paridad cuando corresponde, rollback y auditoría del candidato | Recepción por el integrador y autorización para aplicar |
| Recibido e integrado | Intake e incorporación del candidato | Aplicación remota y resultado |
| Aplicado y verificado | Ejecución y postflight inmediato | Aceptación del siguiente ciclo natural, si forma parte del compromiso |
| Aceptado | Evidencia del resultado comprometido | No habilita otra tarea ni amplía el alcance |

El coordinador no puede anunciar «listo para la ventana» apoyándose sólo en su propio «listo local». Debe contrastarlo con la recepción del integrador, el estado del PR y la auditoría cruzada. El permiso para aplicar sigue siendo independiente.

Si falta una parte de la aceptación original, la tarea permanece abierta salvo reducción expresa del alcance. Un HOLD debe decir qué falta, quién puede resolverlo y qué trabajo independiente puede continuar. Así se evita tanto frenar innecesariamente todos los frentes como presentar un paquete incompleto por haber llegado al horario previsto.

### Qué garantiza realmente un gate

La implementación revisada incorpora un control concreto en los wrappers de despliegue: una declaración JSON de esquema cerrado con estado listo, auditoría aprobada, identificador del delta y referencias de paridad y rollback. Rechaza declaraciones pendientes, incompletas o inválidas; conserva una transición explícita y temporal para ciertos paquetes previamente aplicados.

Se contrastaron código, tests y auditorías versionadas, sin ejecutar un nuevo despliegue ni repetir esas pruebas. El control reduce la ambigüedad de la prosa libre, pero tiene un límite importante: **validar la forma del comprobante no prueba la verdad de su contenido**.

En ese código, el identificador de auditoría se valida por formato, no por existencia ni correspondencia con el candidato actual. Las referencias de paridad y rollback tampoco ejecutan las comprobaciones que mencionan. La coherencia entre evidencia y cambio sigue dependiendo de la coordinación y la auditoría.

La conclusión precisa es que el wrapper impide aceptar ciertas declaraciones incompletas. No que garantice toda la preparación. Vincular recibos verificables al artefacto auditado y comprobar su vigencia sería un endurecimiento posible, aún propuesto, que tampoco reemplazaría las pruebas de comportamiento ni la aceptación natural.

## Validar el contrato antes de confiar en él

Una ejecución exitosa prueba un camino, no sus límites. Conviene validar el contrato como una API:

- **Positivos:** la capacidad funciona con identidad mínima, en la sesión y el entorno previstos, sin intervención improvisada ni secretos en la salida.
- **Negativos:** rechaza otros proyectos, destinos, parámetros y efectos fuera de alcance. Se ensayan en un entorno controlado, sin exfiltrar secretos reales ni probar mutaciones peligrosas en producción.
- **Ciclo de vida:** responde correctamente a pausa, revocación, STOP y cambios del artefacto ejecutable.

Las pruebas de coincidencia de reglas ayudan a revisar el matching, no certifican la seguridad del programa autorizado. [Pruebas de reglas en Codex](https://learn.chatgpt.com/docs/agent-configuration/rules).

Para medir el resultado sirven los falsos positivos confirmados, las intervenciones imprevistas, las ejecuciones con condiciones vencidas y los paquetes devueltos por evidencia faltante. Contar únicamente cuántas preguntas se evitaron premia una autonomía que puede estar trasladando el problema a producción.

## Un camino claro, con fronteras comprobables

Este patrón resulta útil cuando hay varias identidades, herramientas o etapas de entrega. Exige mantener controles y evidencia, por lo que conviene empezar por las capacidades de mayor impacto, no multiplicar documentos para cada comando.

El caso ya muestra documentación integrada y controles ejecutables. Queda validar la configuración efectiva por sesión y repositorio, sus límites positivos y negativos, y una entrega completa cuyo candidato auditado coincida con lo recibido, aplicado y aceptado.

**El Golden Path no elimina las puertas: hace que correspondan a los riesgos reales.** Tener permiso permite avanzar dentro de un alcance; un control reduce errores concretos; la evidencia demuestra cuándo el trabajo está listo para llegar a LIVE.

### Para seguir leyendo en Golden Path

- [Modelos guiados: el entorno es la política](/entrada/modelos-guiados-el-entorno-es-la-politica).
- [Comparar harness CLI](/entrada/comparar-harness-cli-codex-claude-opencode-cline).
- [Orquestación en Orca](/entrada/orquestacion).
- [Read-only como decisión arquitectónica](/entrada/arquitectura-read-only).
