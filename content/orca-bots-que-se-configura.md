---
slug: orca-bots-que-se-configura
title: "Qué se configura en un Orca Bot"
type: concept
order: 10
summary: "Un bot no es un prompt largo: son cinco capas que se configuran por separado (identidad, memoria, alcance, disparadores y permisos), cada una con su control y su forma de fallar. Un piloto real muestra qué resuelve cada capa y qué queda sin probar."
tags: [orca, bots, memoria, conectores, permisos, automatizaciones]
related: [orca-bots-grok-bot-dots, caso-orca-cockpit-multiagente, autonomia-con-contrato]
area: Orca
glyph: ⚙
hue: rgba(232,178,87,.24)
---

# Qué se configura en un Orca Bot

Un agente que hoy resuelve bien una tarea y mañana no recuerda nada obliga a repetir el contexto en cada sesión. El problema opuesto es peor: un agente que recuerda todo, actúa en tus cuentas y además puede recibir pedidos de otras personas. Pasar de un agente con worktrees a un bot con continuidad y conectores no es escribir un prompt más largo. **Un bot son cinco capas que se configuran por separado: identidad, memoria, alcance, disparadores y permisos.** Cada una tiene su propio control y su propia forma de fallar. Configurarlo bien es decidir qué capa resuelve cada problema.

*Documentación de Orca revisada el 20 de noviembre de 2026. Los casos vienen de un piloto real del mismo día, anonimizado. Lo que no se probó está marcado como propuesto o como no probado.*

## Las cinco capas de un vistazo

| Capa | Dónde se configura | Qué controla | Cómo falla |
| --- | --- | --- | --- |
| Identidad | El soul, un archivo Markdown | Propósito, voz y prohibiciones | El modelo no la sigue: es texto, no una regla aplicada |
| Memoria | Archivos Markdown en la carpeta del bot | Qué sabe entre conversaciones | Hechos viejos, duplicados o instrucciones ajenas guardadas como propias |
| Alcance | Conectores y herramientas | Con qué identidad actúa en cada servicio | Más acceso del que hace falta, o menos del que la tarea necesita |
| Disparadores | Horarios, eventos y webhooks | Cuándo trabaja sin que nadie le escriba | Ruido, partes vacíos o eventos de gente que no puede pedirle nada |
| Permisos | Modo de permiso y *Who can ask* | Qué puede hacer sin aprobación y quién lo dirige | Un default demasiado amplio o una lista que da más de lo que parece |

El bot vive en una carpeta, en una sola computadora (la tuya o un servidor vinculado a Orca), y su soul, su memoria y sus capacidades son archivos planos en esa carpeta. Corre con tu sesión del agente que elegiste, y lo que lee se envía al proveedor de ese modelo, como en cualquier sesión de agente. [Seguridad de los bots](https://orca.dev/docs/bots/security) · [Bots](https://orca.dev/docs/bots).

## Identidad: el soul

El soul es un archivo Markdown con el propósito del bot, su voz, una sección de cómo trabaja y una lista de cosas que no hace nunca. Orca lo entrega al modelo como instrucciones; no lo hace cumplir. La consecuencia operativa es que la identidad sirve para el estilo y el criterio, no para la seguridad: una prohibición escrita en el soul es una petición al modelo, no un bloqueo.

En el piloto, el soul resolvió dos cosas de tono: el bot baja el registro en los canales laborales, y la voz pública de un blog no es la voz del bot, así que el soul separa las dos. El límite está en lo que no es estilo: si algo no debe pasar, como mergear o enviar un mail, hay que llevarlo a la capa de permisos o a una protección externa.

## Memoria: un índice corto y archivos por tema

La memoria del bot también son archivos Markdown en su carpeta, que podés leer y editar, y Orca permite revisar los cambios que hace el ordenamiento nocturno de memoria. Ese ordenamiento no tiene herramientas: solo responde y no puede ejecutar comandos. [Qué revisar](https://orca.dev/docs/bots/security) · [Qué hace cumplir Orca](https://orca.dev/docs/bots/security#what-orca-enforces-and-what-the-bot-is-told).

El formato que funcionó en el piloto fue un índice con una línea por hecho, con fecha, y el detalle en archivos por tema. Conviene guardar decisiones y preferencias. No se guardan secretos, y la documentación dice que el bot tiene la indicación de no guardarlos; tampoco instrucciones que llegan en mails, mensajes o issues de terceros, que el bot debe tratar como información. Las dos cosas son indicaciones al bot, no reglas que Orca aplique.

Dos casos del piloto: una regla corregida en el día («los coordinadores son efímeros») quedó como un hecho fechado, y una memoria vieja que había quedado duplicada hubo que olvidarla. Ahí apareció un comportamiento observado y no documentado en las páginas revisadas: una línea borrada a mano volvió a aparecer, y la forma que funcionó fue pedirle al bot que la olvide con su comando. Tomalo como una observación de esa configuración. El límite general: más memoria no es mejor criterio; un hecho viejo bien guardado sigue siendo viejo.

## Alcance: conectores y herramientas

Cada conector cambia con qué identidad actúa el bot, y eso pesa más que el nombre del conector. Según la [documentación de conectores](https://orca.dev/docs/bots/connectors#who-the-bot-acts-as):

- **Slack:** actúa como el bot, con su propia app de Slack.
- **GitHub y Linear:** responde como la app de Orca donde lo llamaron; el resto del trabajo (comentar en otro lado, etiquetar, asignar, revisar o mover issues) lo hace con tu cuenta, y en GitHub pushea con tu login de git.
- **Google:** actúa como vos. La app de Google Cloud es tuya, tu sesión de Google queda en tu computadora y el bot llama a Google directamente desde ahí. [Google](https://orca.dev/docs/bots/connectors#google).
- **Webhooks:** no tienen identidad propia; solo disparan una automatización.

Para otras apps está Composio: Orca guarda la clave y el bot no la ve. Para servidores MCP, los que son web guardan claves y sesiones cifradas, y Orca las agrega en cada llamada; los que se ejecutan como comando toman sus claves de una configuración guardada sin cifrar, legible solo por tu usuario. [Otras apps y herramientas](https://orca.dev/docs/bots/connectors) · [Secretos](https://orca.dev/docs/bots/security#secrets).

En el piloto, el alcance falló de tres maneras distintas. La primera clave de Composio que se probó no sirvió, y una clave de solo lectura dio error de permisos para lo que se le pedía. Un MCP agregado en otra máquina no se pudo usar desde la sesión local, algo que puede ser propio de esa configuración. Y una herramienta del CRM podía leer y actualizar, pero no borrar, así que un registro de prueba hubo que borrarlo a mano. El límite: el alcance se mide por la identidad efectiva y las operaciones que permite cada herramienta, no por la lista de conectores activos.

## Disparadores: automatizaciones y bandeja de decisiones

Un bot trabaja sin que nadie le escriba por tres vías documentadas: horarios (cada hora, diarios, días hábiles, semanales, cron o RRULE), eventos de los conectores que agregaste y webhooks, cuya URL hay que tratar como una contraseña. Cuando el bot necesita algo de vos, el pedido espera en **Needs you** hasta que respondas. [Horarios](https://orca.dev/docs/bots) · [Webhooks](https://orca.dev/docs/bots/connectors).

En el piloto también se usaron esperas de una sola vez e ítems con botones como bandeja de decisiones; ninguna de las dos cosas aparece en las páginas revisadas, así que van como observadas. La regla de diseño que funcionó fue que los partes solo salgan si hay novedades y vayan a un chat propio. Quedaron un resumen de mails y un monitor técnico que pasó de correr cada 30 minutos a cada hora, de 9 a 21, en un chat dedicado. El límite: es una configuración, no una medición. El piloto no mide continuidad ni tasa de alertas.

## Permisos y quién puede pedir

Los modos de permiso son *Ask for approval*, *Accept edits*, *Approve for me* y *Full access*, según lo que soporte el agente. **El default de Orca para los chats es Full access.** La documentación recomienda pasar a *Ask for approval* cuando otras personas pueden pedirle cosas al bot o cuando lee mails, issues o mensajes de afuera. Algunos agentes no tienen modos de aprobación, y sus bots corren siempre en Full access. [Permisos](https://orca.dev/docs/bots/security).

*Who can ask* da más de lo que parece: la persona que agregás usa tu acceso, no el suyo, y puede iniciar, dirigir, aprobar y frenar el trabajo del bot. Las automatizaciones por evento y los webhooks no pasan por esa lista: una regla por evento arranca para cualquiera que esté en un lugar compartido con vos y el bot.

La distinción que ordena esta capa es [qué hace cumplir Orca y qué solo se le dice al bot](https://orca.dev/docs/bots/security#what-orca-enforces-and-what-the-bot-is-told). Orca controla *Who can ask* antes de que el pedido llegue a tu computadora, deja en solo lectura la corrida programada de exploración y quita las herramientas al ordenamiento de memoria. En cambio, aprobar o mergear un PR solo cuando se lo pedís, o redactar un mail en lugar de enviarlo, son indicaciones al bot. La propia página aclara que ninguno de esos ajustes es una garantía.

En el piloto, el bot arrancó en solo lectura y se le abrieron permisos puntuales, con un ok por acción. El límite: un ok en el chat aprueba una acción, no valida el plan, y no reemplaza una protección del repositorio o del despliegue.

## Trabajo delegado: workers y skills

El código no se hace en la sesión del bot. Va a un worker, una sesión de Claude Code o Codex en un worktree nuevo debajo del bot, y llega al repositorio como rama y PR para revisar. [Workers](https://orca.dev/docs/bots/security).

Las consultas, en cambio, el equipo las mandó a una sesión nueva en el workspace principal; es una práctica del piloto, no una función de Orca, y sale de la misma regla de que los coordinadores son efímeros. En el piloto, las skills se compartieron entre el bot y los workers, y el bot las leyó al iniciar cada conversación. Eso no figura en la [documentación de skills](https://orca.dev/docs/cli/skills), así que va como observado: si cambiás una skill, conviene abrir una conversación nueva antes de dar por hecho que el bot la usa.

## Qué no se probó

- **SSH.** Un acceso a una VPS con claves propias y un agente de claves que vence solo es un diseño propuesto; no se probó con el bot.
- **Continuidad en el tiempo.** El piloto duró un día; no dice nada de semanas de memoria, rutinas ni deriva del soul.
- **Host apagado.** La documentación dice que Orca Cloud retiene un pedido hasta un día si la computadora duerme y que los cuerpos de los webhooks quedan hasta 7 días. No lo verificamos.

## Por dónde empezar

Si el bot va a ser solo tuyo y no lee contenido de terceros, empezá por identidad y memoria: un soul corto y un índice de memoria que puedas revisar. Si va a tocar servicios, sumá el alcance de a un conector y verificá con qué identidad actúa antes del siguiente. Si va a recibir pedidos de otras personas o leer mails e issues de afuera, configurá los permisos antes de sumar a nadie: *Ask for approval* y una lista *Who can ask* corta.

La prueba chica: un bot en solo lectura, un conector, una rutina que solo avise ante novedades en un chat propio y una acción de escritura reversible con aprobación explícita. Si después de una semana la memoria sigue limpia y los partes siguen siendo útiles, recién ahí vale sumar la siguiente capa.

Para la comparación con otras formas de sostener un agente, ver [Orca Bots, Grok Bot y Dots](/entrada/orca-bots-grok-bot-dots); para el diseño de ramas y revisión, el [caso del cockpit multiagente](/entrada/caso-orca-cockpit-multiagente).
