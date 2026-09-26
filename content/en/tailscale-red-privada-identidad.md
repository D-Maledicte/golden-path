---
slug: tailscale-red-privada-identidad
title: "Tailscale: a private network built around identity"
type: concept
order: 14
summary: "Tailnets, WireGuard, direct connections, and relays: what Tailscale solves and what remains your responsibility."
tags: [tailscale, networking, wireguard, identity, infrastructure]
related: [tailscale-permisos-grants, tailscale-entorno-agentes, acceso-portatil-orca]
area: Gobierno de agentes
glyph: ◈
hue: rgba(87,217,232,.24)
---

# Tailscale: a private network built around identity

## The problem with scattered machines

A workstation running WSL, a travel laptop, and a VPS may hold everything needed to work together, yet still be difficult to connect. Addresses change, NAT gets in the way, and exposing SSH or an admin panel to the public internet creates another surface to maintain.

Tailscale connects users and devices in a **tailnet**, a private overlay network. Each device joins with an authenticated identity, gets a stable address inside that network, and can be reached by name with MagicDNS. Joining a tailnet does not automatically secure every service: you still decide who can connect and what they may reach. [What is a tailnet?](https://tailscale.com/docs/concepts/tailnet) · [MagicDNS](https://tailscale.com/docs/features/magicdns)

## What happens when two nodes communicate

WireGuard encrypts traffic between devices. The control plane coordinates identities, keys, and policies; the data plane carries encrypted packets. Tailscale tries a direct UDP connection. If the network prevents that, it can use a peer relay inside the tailnet or a DERP relay. Traffic remains end-to-end encrypted in all three cases; latency and throughput are the usual differences. [Control and data planes](https://tailscale.com/docs/concepts/control-data-planes) · [Connection types](https://tailscale.com/docs/reference/connection-types)

A relay does not make a private service public. Nor should an architecture promise a direct connection regardless of NAT, firewalls, and the networks at both ends.

## Four pieces worth keeping separate

| Piece | Question | Example |
| --- | --- | --- |
| Tailnet | Which identities and devices belong? | Laptop, workstation, VPS |
| MagicDNS | How do I find a node by a stable name? | `workstation` instead of a changing IP |
| Grant | Who may reach which destination and port? | Laptop → workstation on TCP 22 |
| Service | Who may use the application after connecting? | Login and permissions inside a dashboard |

A network grant permits a connection; it does not implement application authorization by itself. A MagicDNS name helps locate a device; it does not grant access.

## Where it changes daily work

You can SSH from a laptop into the environment that already holds your repos and agents. A VPS can accept administrative connections within the tailnet without exposing that port publicly. A development dashboard can be shared with a small team using Tailscale Serve, subject to tailnet access controls. [Serve](https://tailscale.com/docs/features/tailscale-serve)

Tailscale cannot turn on a powered-off workstation, restart a broken process, or replace backups. If Orca lives on a workstation, remote access depends on that workstation and WSL being available. [Portable access to Orca](/entrada/acceso-portatil-orca) describes this topology.

## A sensible first decision

Choose **one client, one host, and one service**. Join both devices to the tailnet; check the name and connection; restrict access to the port you need. Add other destinations afterward. The next entry turns this into policies, grants, and negative tests: [Permissions you can explain](/entrada/tailscale-permisos-grants).
