---
slug: orca-bots-grok-bot-dots
title: "Orca Bots, Grok Bot y Dots: dónde conviene que viva tu agente"
type: editorial
order: 25
summary: "Tres formas de sostener trabajo entre conversaciones. Una prueba real de Orca Bots muestra qué cambia cuando el agente vive cerca del código, y por qué una aprobación en el chat no alcanza para proteger producción."
tags: [orca, grok-bot, dots, gobierno, automatizaciones, permisos]
related: [orca-t3-code-capy, caso-orca-cockpit-multiagente, autonomia-con-contrato]
area: Gobierno de agentes
glyph: ⚿
hue: rgba(87,217,232,.24)
---

# Orca Bots, Grok Bot y Dots: dónde conviene que viva tu agente

Un agente que puede leer una alerta, mirar qué cambió y avisar al equipo ya hace más que contestar preguntas. Pero cuando también puede publicar un workflow o abrir una terminal, la decisión de fondo cambia: **¿dónde corre, con las credenciales de quién, y quién puede impedir que toque producción?** Ahí se separan Orca Bots, Grok Bot y Dots.

*Documentación revisada el 20 de noviembre de 2026. Los ejemplos de Orca vienen de un piloto real anonimizado. Grok Bot y Dots se comparan a partir de sus documentos oficiales, no de una prueba equivalente de producción.*

## Qué agrega Orca Bots al cockpit

Un worktree aísla cambios de código; un bot sostiene una responsabilidad entre sesiones. En Orca, esa responsabilidad tiene una carpeta, instrucciones de comportamiento, memoria editable y rutinas. El bot corre con el agente y la cuenta configurados en tu máquina o en un servidor vinculado. Slack, GitHub, Linear y webhooks pueden entrar por Orca Cloud; eso no convierte a Orca Cloud en el lugar donde se ejecuta el bot. Si el host está dormido, las solicitudes remotas pueden quedar en cola. Tener la carpeta en tu equipo tampoco significa que todo el contexto se quede allí: lo que lee el agente puede llegar a su proveedor de modelo. [Bots](https://orca.dev/docs/bots) · [Seguridad de Orca](https://orca.dev/docs/bots/security).

El valor para un equipo que ya opera con ramas y worktrees es concreto: el bot puede recibir el pedido donde está el equipo y devolver trabajo revisable en el entorno de desarrollo. La continuidad vive en el bot; no exige dejar abierta para siempre la sesión de un coordinador. La contracara es que hay que operar el host, sus sesiones y los permisos efectivos de los conectores.

## Qué mostró el piloto

- **Reparación y verificación.** Un alta de usuarios fallaba con 401 en un workflow. Se cambió la autenticación de la función del CRM a OAuth2, manteniendo el método de la llamada. Se publicó el cambio, un alta de prueba pasó y el equipo recibió el resultado. La revisión posterior indicó que el 401 cortaba antes de crear la cuenta y no encontró altas parciales: no hubo reproceso. El 401 no demuestra que una clave hubiera vencido; [Zoho documenta que su clave de Functions no expira](https://www.zoho.com/crm/developer/docs/functions/security.html).
- **Aprobar un plan no lo valida.** Antes de ese arreglo, el operador había aprobado otro plan: cambiar el método de la llamada y usar una credencial personal. La evidencia de otro agente que conocía ese CRM lo contradijo: había llamadas que funcionaban con el método original y con otra credencial. El bot frenó, volvió a preguntar con la evidencia nueva y aplicó el segundo plan.
- **Secretos que no pasan por nadie.** En otro flujo, el bot ayudó a revisar una tarea de reporting. La contraseña del usuario de solo lectura y el token de la función se generaron dentro de la base, con bytes aleatorios del lado del servidor, y quedaron en el vault: el bot los guardó sin verlos. El operador solo los copió al panel de secretos de la función, adonde no llegaban las herramientas del bot. El bot probó la función llamándola desde la propia base, con el token leído del vault, y después borró la copia de la contraseña.
- **Prueba versus escritura.** En ese flujo, la prueba devolvió datos sin escribir; más tarde, una corrida real dejó un resultado persistido. Son comprobaciones distintas: un HTTP 200 del modo prueba no valida ni el cron ni la escritura. Y una prueba contra producción también escribe: el alta que confirmó el arreglo del 401 creó un registro real en el CRM, que hubo que borrar a mano porque la herramienta del bot podía leer y actualizar, pero no borrar.
- **Rutinas configuradas, no validadas en el tiempo.** Quedaron definidos un resumen de correo y un monitor técnico que solo debía avisar ante novedades. El piloto no mide continuidad, tasa de alertas ni comportamiento con el host caído. Tampoco incluye una prueba de SSH para el bot.

Lo replicable no es conectar todo. Es cerrar el circuito entre alerta, evidencia, cambio acotado y verificación. Nombre de la credencial y principal efectivo son cosas distintas: antes de aprobar un cambio, importa saber qué identidad ejecutará la operación, no cómo se llama en la interfaz.

## Tres centros de gravedad

| Pregunta | Orca Bots | Grok Bot | Dots |
| --- | --- | --- | --- |
| ¿Dónde corre el trabajo? | En tu equipo o servidor vinculado, con el agente que configuraste. | Computadora persistente administrada; los bots personales comparten la del usuario. Los chats compartidos de un Team Bot tienen un entorno propio. | Computadora cloud del dot; podés habilitar una computadora propia o usar entornos de Codex cuando la tarea lo pide. |
| ¿Qué continuidad ofrece? | Memoria e instrucciones en archivos, rutinas y disparadores; los cambios de código pueden llegar como rama y PR. | Bots por responsabilidad, rutinas por horario o evento y Team Bots con memoria compartida bajo revisión. También puede delegar código a Cursor Cloud Agents. | Contexto de ChatGPT, tareas recurrentes e investigación de fondo. La conversación sigue siendo el lugar para revisar resultados y corregir el rumbo. |
| ¿Dónde conviene empezar? | Incidentes de ingeniería que cruzan chat, repo y entorno, si ya operás ese stack. | Trabajo entre aplicaciones que conviene alojar sin mantener tu propio host, sobre todo para un equipo. | Seguimiento personal y transversal de varios compromisos, sin que cada pedido nazca en un repo. |

Fuentes de las diferencias: [Orca: bots y permisos](https://orca.dev/docs/bots/security); Grok Bot: [arquitectura](https://docs.x.ai/grok-bot/how-grok-bot-works), [Team Bots](https://docs.x.ai/grok-bot/team-bots) y [rutinas](https://docs.x.ai/grok-bot/skills-routines-and-automations); [OpenAI: guía de Dots](https://help.openai.com/en/articles/20001530-getting-started-with-your-dot). Orca deja elegir el agente compatible; [Grok Bot enruta modelos sin selector por tarea](https://docs.x.ai/grok-bot/faq). Eso importa si querés controlar el entorno de ejecución y comparar resultados con el mismo agente.

## El gate de LIVE no es el botón de aprobación del chat

En Orca, el modo nuevo hereda la configuración global salvo que la sobrescribas por bot. Los chats abiertos mantienen su modo anterior. Con un agente que soporta *Ask for approval*, quien hizo el pedido puede aprobar; la lista *Who can ask* no cubre por sí sola webhooks ni automatizaciones por eventos. El piloto mostró que esa lista además da más de lo que parece: sumar a alguien le permite usar el bot como el dueño, con sus cuentas conectadas, no solo chatear con él. Y la identidad cambia según el canal: en Slack el bot habla con su propia identidad; en GitHub y en el issue tracker actúa como el dueño. En [Grok Bot](https://docs.x.ai/grok-bot/approvals-security-and-privacy), *Auto Review* y las reglas *Ask first* revisan acciones desde el chat. En [Dots](https://openai.com/index/introducing-dots/), el acceso de las apps y las reglas de aprobación también son controles distintos. El piloto suma otra razón: un plan aprobado en el chat estaba equivocado, y lo que lo corrigió fue evidencia nueva, no el botón. Ninguno de esos controles sustituye una protección externa que exija un revisor humano para el paso de producción.

Si tuviera que elegir un primer uso, probaría **Orca para el circuito alerta → diagnóstico → PR**, **Grok Bot para un proceso de equipo que cruza aplicaciones** y **Dots para seguimiento transversal**. Haría la misma prueba en los tres: un dato sintético, lectura acotada, una propuesta reversible y un intento inocuo de escritura en un sandbox que deba quedar bloqueado o requerir aprobación. Para LIVE, la identidad del bot no debería poder saltar las reglas del repositorio ni del sistema de despliegue. El criterio es simple: que el agente pueda terminar su parte sin poder decidir por su cuenta que ya está en producción.

Para el diseño de ramas y revisión, ver el [caso del cockpit multiagente](/entrada/caso-orca-cockpit-multiagente).
