---
slug: tailscale-red-privada-identidad
title: "Tailscale: una red privada que empieza por la identidad"
type: concept
order: 14
summary: "Tailnets, WireGuard, conexiones directas y relays: un mapa para entender qué resuelve Tailscale y qué responsabilidades siguen siendo tuyas."
tags: [tailscale, redes, wireguard, identidad, infraestructura]
related: [tailscale-permisos-grants, tailscale-entorno-agentes, acceso-portatil-orca]
area: Gobierno de agentes
glyph: ◈
hue: rgba(87,217,232,.24)
---

# Tailscale: una red privada que empieza por la identidad

## El problema de las máquinas dispersas

Una estación con WSL, una notebook de viaje y una VPS pueden tener todo lo necesario para colaborar y, aun así, no poder hablarse con facilidad. Las direcciones cambian, hay NAT de por medio y publicar SSH o un panel de administración en Internet suma una superficie que después hay que cuidar.

Tailscale permite conectar usuarios y dispositivos en una **tailnet**, una red privada superpuesta a las redes donde ya viven. Cada dispositivo entra autenticado, recibe una dirección estable dentro de esa red y puede encontrar a otros por nombre con MagicDNS. Instalarlo no convierte automáticamente a cada servicio en una aplicación segura: primero hay que definir quién se conecta y qué puede alcanzar. [Qué es una tailnet](https://tailscale.com/docs/concepts/tailnet) · [MagicDNS](https://tailscale.com/docs/features/magicdns)

## Qué ocurre cuando dos nodos se hablan

WireGuard cifra el tráfico entre los dispositivos. El plano de control coordina identidades, claves y políticas; el plano de datos transporta los paquetes cifrados. Tailscale intenta establecer una conexión directa por UDP. Si la red no lo permite, puede usar un peer relay de la tailnet o un relay DERP. En los tres casos el tráfico entre los extremos mantiene cifrado de extremo a extremo; lo que suele cambiar es la latencia y el caudal. [Plano de control y de datos](https://tailscale.com/docs/concepts/control-data-planes) · [Tipos de conexión](https://tailscale.com/docs/reference/connection-types)

La distinción importa: que un salto pase por un relay no significa que el servicio al otro lado se haya vuelto público. También evita prometer una conexión directa que depende del NAT, los firewalls y la red de cada extremo.

## Cuatro piezas para no mezclar conceptos

| Pieza | Responde a | Ejemplo |
| --- | --- | --- |
| Tailnet | ¿Qué identidades y dispositivos pertenecen a la red? | Notebook, estación y VPS |
| MagicDNS | ¿Cómo encuentro un nodo por un nombre estable? | `estacion` en vez de una IP cambiante |
| Grant | ¿Quién puede llegar a qué destino y puerto? | Notebook → estación por TCP 22 |
| Servicio | ¿Quién puede usar la aplicación una vez conectado? | Login y permisos del panel interno |

Un grant de red habilita una conexión; no implementa por sí solo las autorizaciones de una app. Y un nombre de MagicDNS simplifica el destino; no otorga permisos. Esas dos confusiones son bastante caras cuando el primer prototipo empieza a crecer.

## Dónde sí cambia el trabajo cotidiano

Desde una notebook podés entrar por SSH al entorno que ya tiene tus repos y agentes. Una VPS puede aceptar conexiones de administración dentro de la tailnet sin exponer ese puerto públicamente. Un panel de desarrollo puede compartirse con un equipo pequeño por Tailscale Serve, sujeto a las reglas de acceso de la red. En cada caso la identidad y el destino quedan explícitos. [Serve](https://tailscale.com/docs/features/tailscale-serve)

Tailscale tampoco enciende una computadora apagada, arregla un proceso caído ni sustituye backups. Si Orca vive en una estación de trabajo, el acceso remoto depende de que esa estación y WSL estén disponibles. La guía [Acceso portátil a Orca](/entrada/acceso-portatil-orca) desarrolla esa topología.

## Una primera decisión razonable

Elegí **un cliente, un host y un servicio**. Incorporá ambos dispositivos a la tailnet; comprobá el nombre y la conexión; limitá el acceso al puerto que realmente necesitás. Recién después sumá otros destinos. La próxima entrada baja esa decisión a políticas, grants y pruebas negativas: [Permisos que se pueden explicar](/entrada/tailscale-permisos-grants).
