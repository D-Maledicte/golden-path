---
slug: tailscale-entorno-agentes
title: "Tailscale for an agent environment: laptop, VPS, and WSL"
type: guide
order: 10
summary: "An anonymized reference design for accessing a workstation, operating a VPS, and sharing internal previews without exposing admin ports."
tags: [tailscale, orca, wsl, vps, ssh, agents]
related: [tailscale-red-privada-identidad, tailscale-permisos-grants, acceso-portatil-orca, hosts-ssh]
area: Casos de producto
glyph: ◆
hue: rgba(237,195,94,.24)
---

# Tailscale for an agent environment: laptop, VPS, and WSL

## The scenario

A developer uses Windows with WSL 2 for repositories, agents, and local processes. They also operate a VPS and want to connect from a laptop while away. The goal is to keep **one workstation** and give specific operations private routes. This is an anonymized reference design, not a claim that a deployment has already been verified.

The [portable Orca access guide](/entrada/acceso-portatil-orca) describes the continuity goal. Here we expand it to include the VPS and development previews.

## Connection map

| From | To | Purpose | Boundary |
| --- | --- | --- | --- |
| Laptop | Windows/WSL host | Orca and SSH | Only the authorized identity and port |
| Workstation | VPS | Administration or internal API | Only necessary services |
| Invited teammate | Local preview | UI review | Temporary, restricted access |

The laptop is a client; repos, runtime credentials, and branches stay on the workstation. The VPS has its own machine identity. Agents may use these routes, but their ability to change code or production still depends on service credentials, permissions, and workflow approvals.

## The awkward WSL 2 decision

Tailscale documents a conflict when it runs **on Windows and inside WSL 2 at the same time**: encrypted WSL traffic over the Windows host's Tailscale can fail because of packet size. This design therefore starts with Tailscale **on Windows** and a single Tailscale instance. If a remote client needs `sshd` inside WSL, verify the Windows → WSL route, listen address and port, firewall, and current WSL networking mode. Do not assume the Windows tailnet IP automatically leads to Linux. [Tailscale on WSL 2](https://tailscale.com/docs/install/windows/wsl2)

Before changing network rules, verify that Windows itself can connect to WSL SSH. Then test from the laptop through the Windows host's Tailscale address. Repeat after WSL networking updates. Running Tailscale *only* inside WSL is another possible design, but requires checking its lifecycle and the documented MTU considerations.

## Operate the VPS without confusing connectivity with authority

Tailscale can give the VPS a stable private destination for SSH or an internal API. An automated server should use a machine identity with a tag and managed authentication; auth keys should not be pasted into repositories or images. Policy might allow workstation → VPS TCP 22 or 443 while excluding the database. SSH and the application still validate users, sessions, and actions. [Setting up servers](https://tailscale.com/docs/how-to/set-up-servers) · [Auth keys](https://tailscale.com/docs/features/access-control/auth-keys)

For containers, decide whether Tailscale lives on the host with a proxy to the container or in its own container with persistent state and separate authentication. The first has fewer identities to manage for a few apps; the second allows an independent lifecycle. Neither automatically opens every Docker network. [Docker parameters](https://tailscale.com/docs/features/containers/docker/docker-params)

## Serve and Funnel have different audiences

**Tailscale Serve** routes a local service to the tailnet and respects its access controls. **Funnel** exposes a local service to the public internet: use it for a deliberately public demo with application controls and a clear end date. For an internal dashboard review, start with Serve. Check current documentation for the command and prerequisites, as the syntax has changed over time. [Serve](https://tailscale.com/docs/features/tailscale-serve) · [Funnel](https://tailscale.com/docs/features/tailscale-funnel)

## An afternoon preflight

1. Choose which side of Windows/WSL runs Tailscale; verify Windows can reach WSL SSH.
2. Register laptop, host, and VPS with distinct identities; tag servers rather than people.
3. Define a [minimal policy by source, destination, and port](/entrada/tailscale-permisos-grants); remove any broad rule left over.
4. Test laptop → host and host → VPS using the real protocol. Test a connection that should fail against an **online** service.
5. Restart WSL or the host and repeat. A powered-off workstation cannot run your agents, regardless of the tunnel.

The practical outcome is mobility without parallel clones, a VPS reachable through a private route, and previews with an explicit audience. The network connects the pieces; application authorization and operational continuity remain team responsibilities.
