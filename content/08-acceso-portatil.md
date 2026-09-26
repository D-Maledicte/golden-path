---
slug: acceso-portatil-orca
title: Acceso portátil a Orca mediante red privada
type: guide
order: 8
summary: Usar otro dispositivo como cliente del mismo entorno de desarrollo, sin duplicar repositorios ni publicar SSH en Internet.
tags: [orca, tailscale, ssh, wsl, remoto, seguridad]
related: [hosts-ssh, setup-windows-wsl, tailscale-red-privada-identidad, tailscale-entorno-agentes]
area: Orca
glyph: ↗
hue: rgba(87,217,232,.22)
---

# Acceso portátil a Orca mediante red privada

## Objetivo

Trabajar desde una notebook sobre el mismo entorno, repositorios y agentes que viven en la estación principal.

El dispositivo portátil no recrea el stack ni mantiene clones paralelos. Funciona como cliente de Orca y conecta por SSH a través de una red privada.

## Topología

- **Host de trabajo:** contiene Git, repositorios, runtimes y agentes.
- **Cliente portátil:** ejecuta Orca Desktop.
- **Red privada:** conecta ambos dispositivos sin abrir SSH a Internet.
- **Identidad:** cada cliente posee su propia clave revocable.

## Controles recomendados

### Destino estable

El cliente apunta a una identidad privada estable del host y no a una dirección interna efímera. Esto evita reconfigurar la conexión después de reinicios o cambios de red.

### Mínimo privilegio de red

La notebook sólo debería iniciar conexiones al host de desarrollo y al puerto necesario. Otros servidores y destinos quedan fuera de alcance.

### Separación entre uso y administración

El usuario cotidiano del dispositivo no necesita capacidad para modificar las reglas de la red privada. La conectividad autorizada y la administración de esa conectividad son permisos distintos.

### Prueba positiva y negativa

Se valida que el host permitido responda y que un destino explícitamente bloqueado no sea alcanzable. Probar contra una máquina apagada no demuestra que la política funcione.

## Disponibilidad

El acceso remoto depende de que el host esté encendido, conectado y con el entorno de ejecución iniciado. La red privada no reemplaza una estrategia de encendido remoto ni de recuperación del sistema.

## Beneficio real

La movilidad deja de crear una segunda estación de desarrollo. Hay un único estado de Git, una única política de credenciales y los mismos agentes vistos desde otro cliente.

## Referencias

- [Tailscale en WSL2](https://tailscale.com/docs/install/windows/wsl2)
- [Tailscale para Windows](https://tailscale.com/docs/install/windows)
