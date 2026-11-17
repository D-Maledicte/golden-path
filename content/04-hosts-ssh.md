---
slug: hosts-ssh
title: Hosts SSH y topología de ejecución
type: concept
order: 4
summary: Orca puede operar como interfaz local mientras agentes, repositorios y runtimes viven en WSL o en una máquina remota.
tags: [orca, ssh, wsl, remoto, tailscale]
related: [orca-como-ade, setup-windows-wsl, acceso-portatil-orca]
area: Orca
glyph: ⌁
hue: rgba(168,106,255,.24)
---

# Hosts SSH y topología de ejecución

## La idea central

Con un host SSH, Orca separa el lugar desde el que se controla del lugar donde se ejecuta el trabajo.

La interfaz puede estar en Windows o en una notebook, mientras que el repositorio, Git, Node, Python, Docker y los agentes CLI viven en Linux/WSL o en una máquina remota más potente.

## Qué queda en cada lado

### Cliente Orca

- interfaz;
- navegación entre proyectos y workspaces;
- visualización de terminales, diffs y estados;
- acciones de supervisión.

### Host de ejecución

- archivos reales del repositorio;
- ramas y worktrees;
- procesos de los agentes;
- dependencias y runtimes;
- credenciales necesarias para el proyecto.

Esta separación evita duplicar entornos y reduce el “en mi máquina funciona”: todos los clientes pueden entrar al mismo host de desarrollo.

## SSH host y Orca Server no son lo mismo

Un **SSH host** permite que Orca abra y administre workspaces directamente sobre otra máquina mediante SSH.

Un **Remote Orca Server** aloja el runtime completo en otra máquina. Ese servidor conserva workspaces, sesiones y estado para clientes emparejados. Puede correr en Orca Desktop o como servicio headless con `orca serve`. Con un **SSH host**, el cliente Orca conserva el control del runtime y delega la ejecución de worktrees seleccionados al host. Orca puede instalar un componente administrado en el destino SSH. [Remote Orca Servers](https://orca.dev/docs/remote-servers) · [SSH worktrees](https://orca.dev/docs/ssh)

Para una distribución WSL de la propia estación, también podés abrir su repositorio directamente desde Orca en Windows. SSH sobre loopback describe el flujo de referencia de este caso. La documentación incluye además VMs efímeras por workspace con un proveedor propio. [Terminal en Orca](https://orca.dev/docs/terminal) · [Modos de ejecución](https://orca.dev/docs/ways-to-run)

## Nuestro patrón

En el escritorio principal:

- Orca Desktop corre en Windows;
- el trabajo vive dentro de WSL;
- SSH conecta la interfaz con el entorno Linux;
- cada dispositivo cliente usa una clave dedicada.

Para acceso portátil:

- Tailscale crea una red privada;
- la notebook conecta al nodo WSL por MagicDNS o IP privada;
- las ACL permiten desde la notebook únicamente SSH hacia el host de desarrollo;
- no se publica el puerto 22 en Internet.

## Por qué una clave por dispositivo

Una clave dedicada permite revocar una notebook sin romper GitHub, VPS u otros accesos. También facilita auditar qué dispositivo conserva autorización.

La clave privada permanece en el cliente; el host sólo recibe la pública en `authorized_keys`.

## Límite operativo

El cliente remoto no crea disponibilidad. Si el host está apagado, suspendido, sin red o WSL nunca arrancó después de un reinicio, no hay entorno al cual conectarse.

La disponibilidad debe verificarse por capas:

1. host encendido;
2. WSL iniciado;
3. servicio SSH escuchando;
4. red privada disponible;
5. autenticación válida;
6. runtime de Orca conectado.

## Beneficio real

La notebook deja de ser una segunda estación de desarrollo que hay que mantener sincronizada. Se convierte en otra ventana hacia el mismo entorno, con los mismos repositorios, sesiones y credenciales.

## Referencias

- [SSH worktrees — Orca Docs](https://www.onorca.dev/docs/ssh)
- [Tailscale en WSL2](https://tailscale.com/docs/install/windows/wsl2)
