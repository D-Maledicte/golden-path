---
slug: tailscale-permisos-grants
title: "Tailscale: permisos que se pueden explicar"
type: guide
order: 15
summary: "Diseñar grants por identidad, destino y puerto; comprobar accesos permitidos y denegados; distinguir red, SSH y permisos de aplicación."
tags: [tailscale, grants, acl, ssh, seguridad, politicas]
related: [tailscale-red-privada-identidad, tailscale-entorno-agentes, acceso-portatil-orca]
area: Gobierno de agentes
glyph: ⚿
hue: rgba(168,106,255,.24)
---

# Tailscale: permisos que se pueden explicar

## Estar en la tailnet no alcanza

El primer prototipo suele conectar dos dispositivos y celebrar que se ven. Para operar un entorno con agentes, VPS y paneles internos hace falta una pregunta más precisa: **¿qué identidad puede iniciar una conexión a qué destino y en qué puerto?**

Tailscale recomienda **grants** para expresar esos permisos. Cada grant define `src`, `dst` y capacidades de red (`ip`) o de aplicación (`app`). Las conexiones que no tengan una regla que las permita quedan denegadas; atención, porque una tailnet recién creada suele traer una política inicial *allow all*. Hay que revisar y reemplazar esa regla amplia antes de dar por hecho el mínimo privilegio. [Grants](https://tailscale.com/docs/features/access-control/grants) · [Política inicial y ACL](https://tailscale.com/docs/features/access-control/acls)

## Dibujar la política antes del archivo

Supongamos una notebook, un host de desarrollo y una VPS. El objetivo es notebook → host por SSH, host → VPS por HTTPS, y ningún acceso de la notebook a la base de datos de la VPS. Esa matriz se puede revisar sin conocer la sintaxis de HuJSON.

| Origen | Destino | Puerto | Decisión |
| --- | --- | --- | --- |
| Notebook de trabajo | Host de desarrollo | TCP 22 | Permitir |
| Host de desarrollo | API interna de la VPS | TCP 443 | Permitir |
| Notebook de trabajo | Base de datos de la VPS | TCP 5432 | Denegar |

Una forma esquemática de llevarla a grants sería:

```json
{
  "tagOwners": {
    "tag:dev-host": ["autogroup:admin"],
    "tag:internal-api": ["autogroup:admin"]
  },
  "grants": [
    {
      "src": ["persona@ejemplo.com"],
      "dst": ["tag:dev-host"],
      "ip": ["tcp:22"]
    },
    {
      "src": ["tag:dev-host"],
      "dst": ["tag:internal-api"],
      "ip": ["tcp:443"]
    }
  ]
}
```

Es un ejemplo para adaptar: los nombres y la identidad son ficticios; los tags sólo tienen sentido si los dispositivos tienen esas etiquetas asignadas. Antes de aplicar una política real, revisá los grants y ACL existentes: una regla amplia que permanezca activa puede seguir habilitando tráfico. Las políticas permiten sumar accesos, no escribir una regla `deny` para restar los que otra ya concedió. [Sintaxis de grants](https://tailscale.com/docs/reference/syntax/grants) · [Tags](https://tailscale.com/docs/features/tags)

## SSH tiene dos modos de operación

**SSH habitual sobre Tailscale** conserva `sshd`, usuarios y claves SSH del host; la tailnet aporta una ruta privada y el grant habilita el puerto. **Tailscale SSH** deja que Tailscale gestione autenticación y autorización SSH en nodos compatibles, con sus propias reglas `ssh` y opciones como `check`. Activar sólo el grant de TCP 22 no equivale a haber configurado Tailscale SSH. Tampoco sirve para hacer Tailscale SSH hacia una máquina que sólo está detrás de un subnet router. [Tailscale SSH](https://tailscale.com/docs/features/tailscale-ssh)

Si ya existe un flujo SSH que funciona para Orca, el primer paso puede ser conservarlo y limitar la ruta. Una migración a Tailscale SSH merece su propia prueba de usuarios, sesiones y recuperación.

## Probar que el límite existe

Primero usá **Preview rules** para inspeccionar los destinos que ve una identidad y agregá tests de política para las conexiones esperadas. Después probá desde un dispositivo real: SSH al host permitido y conexión al puerto restringido de un destino que esté encendido y escuchando. Un timeout hacia una máquina apagada no demuestra que un grant esté funcionando. [Editar y previsualizar políticas](https://tailscale.com/docs/features/tailnet-policy-file/manage-tailnet-policies)

Para diagnosticar, `tailscale ping --tsmp` verifica conectividad antes de comprobar la política; `tailscale ping --icmp` verifica conectividad incluyendo las reglas. Si ambos pasan pero la aplicación falla, revisá el puerto, el servicio y sus permisos. Para el puerto concreto, probá el protocolo real: un ping no verifica que TCP 22 o 443 esté habilitado. [Diagnóstico de políticas](https://tailscale.com/docs/features/tailnet-policy-file/manage-tailnet-policies)

El resultado que queremos poder escribir en una línea es: «esta identidad llega a este servicio por este puerto; a aquel otro no». Con esa política lista, el [caso de un entorno con agentes](/entrada/tailscale-entorno-agentes) muestra dónde ubicar cada conexión.
