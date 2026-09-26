---
slug: acceso-portatil-orca
title: Portable access to Orca over a private network
type: guide
order: 8
summary: Use another device as a client of the same development environment, without duplicating repositories or exposing SSH to the Internet.
tags: [orca, tailscale, ssh, wsl, remote, security]
related: [hosts-ssh, setup-windows-wsl, tailscale-red-privada-identidad, tailscale-entorno-agentes]
area: Orca
glyph: ↗
hue: rgba(87,217,232,.22)
---

# Portable access to Orca over a private network

## Goal

Work from a laptop on the same environment, repositories and agents that live on the main workstation.

The portable device does not recreate the stack or keep parallel clones. It acts as an Orca client and connects over SSH through a private network.

## Topology

- **Work host:** holds Git, repositories, runtimes and agents.
- **Portable client:** runs Orca Desktop.
- **Private network:** connects both devices without opening SSH to the Internet.
- **Identity:** each client has its own revocable key.

## Recommended controls

### A stable destination

The client points to a stable private identity of the host, not to an ephemeral internal address. This avoids reconfiguring the connection after reboots or network changes.

### Least network privilege

The laptop should only be able to open connections to the development host and the port it needs. Other servers and destinations stay out of reach.

### Separating use from administration

The device’s everyday user does not need the ability to modify the private network’s rules. Authorized connectivity and administering that connectivity are different permissions.

### Positive and negative tests

Validate that the allowed host responds and that an explicitly blocked destination is unreachable. Testing against a machine that is switched off does not prove the policy works.

## Availability

Remote access depends on the host being on, connected and with the execution environment started. The private network does not replace a remote power-on or system recovery strategy.

## The real benefit

Mobility stops creating a second development station. There is a single Git state, a single credentials policy and the same agents seen from another client.

## References

- [Tailscale on WSL2](https://tailscale.com/docs/install/windows/wsl2)
- [Tailscale for Windows](https://tailscale.com/docs/install/windows)
