---
slug: tailscale-entorno-agentes
title: "Tailscale en un entorno de agentes: portátil, VPS y WSL"
type: guide
order: 10
summary: "Un diseño de referencia anonimizado para acceder al host de trabajo, operar una VPS y compartir previews internas sin publicar puertos de administración."
tags: [tailscale, orca, wsl, vps, ssh, agentes]
related: [tailscale-red-privada-identidad, tailscale-permisos-grants, acceso-portatil-orca, hosts-ssh]
area: Casos de producto
glyph: ◆
hue: rgba(237,195,94,.24)
---

# Tailscale en un entorno de agentes: portátil, VPS y WSL

## El escenario

Un desarrollador trabaja en Windows con WSL 2: ahí viven repositorios, agentes y procesos locales. También administra una VPS y quiere entrar desde una notebook cuando se mueve. El objetivo es conservar **una sola estación de trabajo** y darle rutas privadas a operaciones puntuales. Este es un diseño de referencia anonimizado, no el registro de una implementación ya verificada.

La [guía de acceso portátil a Orca](/entrada/acceso-portatil-orca) plantea esa continuidad. Acá ampliamos el mapa para incorporar la VPS y las previews de desarrollo.

## Mapa de conexiones

| Desde | Hacia | Uso | Límite |
| --- | --- | --- | --- |
| Notebook | Host Windows/WSL | Orca y SSH | Sólo la identidad y el puerto autorizados |
| Host de trabajo | VPS | Administración o API interna | Sólo los servicios necesarios |
| Equipo invitado | Preview local | Revisión de una interfaz | Acceso temporal y restringido |

La notebook funciona como cliente; los repos, credenciales de ejecución y ramas siguen en el host. La VPS es otro nodo con identidad propia. Los agentes pueden operar por esas rutas, pero su capacidad de modificar código o producción sigue dependiendo de credenciales, permisos del servicio y aprobaciones del flujo de trabajo.

## La decisión incómoda de WSL 2

Tailscale documenta un conflicto cuando se ejecuta **a la vez en Windows y dentro de WSL 2**: el tráfico cifrado de WSL sobre el Tailscale del host puede fallar por el tamaño de los paquetes. Para este diseño, el punto de partida es instalar Tailscale **en Windows** y mantener una sola instancia de red. Si un cliente remoto necesita llegar a `sshd` dentro de WSL, hay que verificar la ruta Windows → WSL, la dirección y el puerto de escucha, el firewall y el modo de red de WSL vigente; no asumir que la IP de la tailnet del Windows apunta mágicamente al Linux. [Tailscale en WSL 2](https://tailscale.com/docs/install/windows/wsl2)

Antes de cambiar reglas de red, comprobá desde la propia máquina Windows que podés conectar al SSH de WSL. Después comprobalo desde la notebook por la dirección de Tailscale del host. Si una actualización de WSL cambia el enrutamiento, la prueba remota es la que detecta la regresión. La alternativa de ejecutar Tailscale *sólo* dentro de WSL existe, pero requiere evaluar su ciclo de vida y las consideraciones de MTU que describe la documentación.

## Administrar la VPS sin confundir red con autoridad

En la VPS, Tailscale puede dar una dirección privada estable para SSH o una API interna. Un servidor automatizado debería tener identidad de máquina mediante tag y una forma de autenticación administrada, sin pegar auth keys en repositorios o imágenes. La política puede habilitar host de trabajo → VPS TCP 22 o 443 y dejar fuera la base de datos. La app y SSH siguen validando usuarios, sesiones y acciones. [Configurar servidores](https://tailscale.com/docs/how-to/set-up-servers) · [Auth keys](https://tailscale.com/docs/features/access-control/auth-keys)

Si el servicio está en un contenedor, decidí dónde vive Tailscale: en el host con un proxy al contenedor o en un contenedor con estado y autenticación propios. La primera opción reduce identidades que gestionar para pocas apps; la segunda sirve cuando se necesita un ciclo de vida independiente. Ninguna habilita automáticamente acceso a toda la red Docker. [Parámetros para Docker](https://tailscale.com/docs/features/containers/docker/docker-params)

## Previews: Serve y Funnel hacen trabajos distintos

**Tailscale Serve** publica un servicio local hacia la tailnet y mantiene las reglas de acceso de la red. **Funnel** lo expone a Internet: sirve para una demo pública deliberada, con controles de la aplicación y un tiempo de vida claro. Para una revisión interna de un panel o una interfaz, Serve es el punto de partida. Revisá el comando y sus requisitos en la documentación vigente antes de activarlo, porque su sintaxis cambió con el tiempo. [Serve](https://tailscale.com/docs/features/tailscale-serve) · [Funnel](https://tailscale.com/docs/features/tailscale-funnel)

## Un preflight que cabe en una tarde

1. Elegí el host que será el nodo de Tailscale en la máquina Windows/WSL; verificá que SSH de WSL sea accesible desde Windows.
2. Registrá notebook, host y VPS con identidades distinguibles; asigná tags a servidores, no a personas.
3. Definí una [política mínima por origen, destino y puerto](/entrada/tailscale-permisos-grants) y revisá que no quede una regla amplia anterior.
4. Probá notebook → host y host → VPS con el protocolo real. Probá también una conexión que debe fallar hacia un servicio **encendido**.
5. Reiniciá WSL o el host y repetí las pruebas. Si el host está apagado, ningún túnel conserva el entorno de agentes disponible.

El resultado es concreto: movilidad sin clones paralelos, VPS administrable por ruta privada y previews que se comparten con alcance explícito. La red conecta las piezas; la autorización de cada servicio y la continuidad operativa siguen en manos del equipo.
