---
slug: opendesign-integracion-local-cli-proxy
title: OpenDesign entre Windows, WSL, planes y proxies
type: editorial
order: 2
summary: Local-first no siempre significa un único entorno. Cuando la interfaz vive en Windows y los agentes en WSL, elegir entre CLI, BYOK y proxy define consumo, sesiones y superficie de riesgo.
tags: [opendesign, windows, wsl, local-cli, byok, proxy, codex, claude-code, opencode-go]
related: [opendesign-direccion-visual-agentes, setup-windows-wsl, hosts-ssh, continuidad-y-observabilidad]
---

# OpenDesign entre Windows, WSL, planes y proxies

> Vigencia editorial: 14 de septiembre de 2026. Los mecanismos de autenticación, modelos y límites dependen de cada proveedor y pueden cambiar.

“Local-first” suena a una sola computadora. En Windows con WSL, sin embargo, una computadora contiene dos entornos que comparten recursos pero no necesariamente ejecutables, credenciales ni sesiones.

La aplicación de OpenDesign puede vivir en Windows mientras Codex, Claude Code, OpenCode y los repositorios viven dentro de Ubuntu. En la pantalla todo parece local; desde el daemon son mundos distintos.

Esta frontera define mucho más que la instalación. Define quién ejecuta el modelo, dónde se guardan las credenciales y contra qué cuota se contabiliza cada generación.

## Tres caminos hacia un modelo

OpenDesign puede llegar a un modelo por tres rutas conceptuales:

| Ruta | Autenticación | Consumo |
|---|---|---|
| Local CLI | Sesión del agente instalado | Cuota del plan asociado al CLI |
| BYOK / proveedor custom | Clave API | Cuenta o saldo API del proveedor |
| OpenDesign Cloud | Cuenta de OpenDesign | Créditos incluidos o comprados allí |

Si OpenDesign lanza un Codex CLI autenticado con ChatGPT, el trabajo se descuenta de la cuota de Codex. Si lanza Claude Code autenticado con Pro o Max, consume ese plan. Si recibe una clave en el panel de proveedores, ya no está usando la sesión del CLI: realiza llamadas API.

La interfaz no cambia esta regla. La decide el camino efectivo que toma la request.

## Por qué un CLI instalado en WSL puede no aparecer

Un daemon iniciado por una aplicación de Windows inspecciona el entorno de Windows. No necesariamente ve:

- binarios instalados dentro de Linux;
- el `PATH` de la shell de WSL;
- configuraciones bajo el home de Ubuntu;
- sesiones OAuth guardadas por los CLIs Linux;
- variables exportadas en `.bashrc` o servicios de `systemd`.

Por eso tener `codex`, `claude` u `opencode` funcionando desde Ubuntu no garantiza que OpenDesign Desktop los muestre como Local CLI.

La solución más directa para conservar la aplicación nativa es duplicar los CLIs en Windows y autenticarlos allí. Las instalaciones quedan separadas, aunque consuman la misma cuota del plan.

```text
OpenDesign Desktop en Windows
        ↓
Codex / Claude Code nativos
        ↓
Cuotas de ChatGPT y Claude
```

La alternativa es ejecutar el daemon de OpenDesign dentro de WSL y abrir su interfaz desde el navegador de Windows. De esa forma el daemon comparte filesystem, PATH y credenciales con los agentes existentes.

```text
Navegador Windows
        ↓
OpenDesign daemon en WSL
        ↓
CLIs y repositorios de WSL
```

## El proxy como puente deliberado

Existe una tercera opción: exponer en WSL un proxy compatible con OpenAI y configurarlo como proveedor custom.

```text
OpenDesign en Windows
        ↓
Proxy local en 127.0.0.1
        ↓
Proveedor externo
```

Este camino no reutiliza automáticamente la cuota de Codex o Claude. OpenDesign cree que está hablando con una API; el proxy decide qué proveedor y credencial utiliza detrás.

El patrón es especialmente adecuado para servicios que publican endpoints y claves de API, como OpenCode Go. Permite adaptar protocolos, normalizar modelos y agregar el identificador estable de sesión que Go solicita para routing y prompt caching.

Un proxy no es necesariamente un parche. Puede convertirse en una frontera de control:

- oculta la credencial real al cliente;
- aplica allowlists de modelos;
- agrega encabezados de sesión;
- sanitiza logs;
- impone límites y timeouts;
- evita que cada aplicación conozca el proveedor final.

Pero cada responsabilidad agregada también convierte al proxy en infraestructura que alguien debe mantener.

## Sesiones: el detalle que cambia el resultado

Un endpoint compatible no garantiza una conversación correctamente identificada. OpenCode Go solicita una sesión estable por conversación mediante información nativa del cliente o el encabezado `x-opencode-session`.

El proxy debe evitar dos extremos:

- generar un ID nuevo en cada request, perdiendo continuidad y caching;
- reutilizar un único ID global, mezclando proyectos y conversaciones.

La unidad correcta suele ser un thread o proyecto de OpenDesign:

```text
x-opencode-session = hash(project_id + conversation_id)
```

La derivación no debe incluir prompts, secretos ni la API key.

## Credencial real frente a credencial local

Cuando OpenDesign obliga a completar un campo API key para un proveedor custom, hay dos diseños posibles.

### Reenviar la key real

OpenDesign guarda la key del proveedor y la transmite al proxy, que la reenvía.

Es simple, pero la credencial queda almacenada y circula por más componentes.

### Separar las credenciales

OpenDesign utiliza un token local aleatorio. El proxy lo valida y obtiene la key real desde su propio entorno protegido.

```text
OpenDesign        → token local
Proxy             → valida token local
Proveedor externo → recibe la key real
```

Esta separación limita el impacto de una exportación, un log accidental o una falla en el cliente. Para una instalación estable es la opción preferible.

## Reglas mínimas para un proxy local

Un puente de este tipo debería cumplir al menos con estas condiciones:

1. escuchar únicamente en loopback salvo necesidad explícita;
2. no registrar `Authorization`, bodies completos ni variables sensibles;
3. mantener una sesión estable por conversación;
4. declarar un `User-Agent` identificable;
5. permitir sólo los modelos necesarios;
6. usar timeouts y límites de tamaño;
7. fallar de forma visible, sin cambiar silenciosamente de proveedor;
8. conservar una prueba mínima de health y descubrimiento de modelos.

Abrirlo en `0.0.0.0` transforma un puente local en un servicio accesible desde la red. Esa decisión exige autenticación, firewall y una revisión distinta.

## Las cuotas siguen al proveedor efectivo

La regla para entender el gasto es seguir la request completa:

```text
¿Quién recibió finalmente la llamada autenticada?
```

- Codex CLI con sesión ChatGPT: cuota Codex.
- Claude Code con sesión Pro/Max: cuota Claude.
- API de OpenAI o Anthropic: facturación API.
- Proxy hacia OpenCode Go: límites incluidos de Go.
- Go con fallback a saldo habilitado: saldo Zen después del límite.
- OpenDesign Cloud: créditos de OpenDesign.

La etiqueta del modelo en la interfaz puede confundir. Un modelo de OpenAI servido por OpenCode Go no consume el plan de ChatGPT; consume la asignación del proveedor que atendió la request.

## Una arquitectura razonable para un entorno híbrido

Para preservar sesiones existentes y separar consumos, una distribución posible es:

| Camino | Uso |
|---|---|
| OpenDesign → Codex Windows | Trabajo descontado del plan de Codex |
| OpenDesign → Claude Code Windows | Trabajo descontado del plan de Claude |
| OpenDesign → proxy WSL → OpenCode Go | Modelos económicos bajo los límites de Go |
| Orca → CLIs WSL | Desarrollo y coordinación existentes |

La duplicación de CLIs no es elegante, pero mantiene claras las fronteras. Mover todo el daemon a WSL reduce duplicación, aunque renuncia a parte de la comodidad de la aplicación nativa.

## Veredicto

La integración local no depende sólo de que dos procesos vivan en la misma computadora. Depende de que compartan el entorno correcto.

Instalar los CLIs en Windows es la ruta más simple para que OpenDesign Desktop consuma cuotas de los planes. Ejecutar el daemon en WSL es la ruta más coherente para reutilizar instalaciones existentes. Un proxy es la ruta más flexible cuando el proveedor ofrece una API y necesitamos controlar sesiones, credenciales o compatibilidad.

Ninguna opción gana siempre. La decisión correcta surge de elegir qué queremos preservar: comodidad de escritorio, sesiones existentes, control del tráfico o aislamiento de credenciales.

---

## Fuentes oficiales

- [OpenDesign](https://open-design.ai/)
- [Quickstart de OpenDesign](https://github.com/nexu-io/open-design/blob/main/QUICKSTART.md)
- [Adaptadores de agentes](https://open-design.ai/agents/)
- [OpenCode Go](https://opencode.ai/docs/go/)
