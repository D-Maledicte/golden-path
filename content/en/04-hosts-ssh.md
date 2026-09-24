---
slug: hosts-ssh
title: SSH hosts and execution topology
type: concept
order: 4
summary: Orca can act as a local interface while agents, repositories and runtimes live in WSL or on a remote machine.
tags: [orca, ssh, wsl, remote, tailscale]
related: [orca-como-ade, setup-windows-wsl, acceso-portatil-orca]
area: Orca
glyph: ⌁
hue: rgba(168,106,255,.24)
---

# SSH hosts and execution topology

## The core idea

With an SSH host, Orca separates the place you control from the place where the work runs.

The interface can be on Windows or a laptop, while the repository, Git, Node, Python, Docker and the CLI agents live on Linux/WSL or on a more powerful remote machine.

## What stays on each side

### Orca client

- the interface;
- navigation between projects and workspaces;
- viewing terminals, diffs and states;
- supervision actions.

### Execution host

- the repository’s real files;
- branches and worktrees;
- agent processes;
- dependencies and runtimes;
- the credentials the project needs.

This separation avoids duplicating environments and cuts down on “works on my machine”: every client can connect to the same development host.

## SSH host and Orca Server are not the same

An **SSH host** lets Orca open and manage workspaces directly on another machine over SSH.

A **Remote Orca Server** is another Orca runtime instance prepared for paired clients and more federated scenarios. To use local WSL from Orca Desktop, the simple pattern is an SSH connection over the loopback interface.

## Our pattern

On the main desktop:

- Orca Desktop runs on Windows;
- the work lives inside WSL;
- SSH connects the interface to the Linux environment;
- each client device uses a dedicated key.

For portable access:

- Tailscale creates a private network;
- the laptop connects to the WSL node through MagicDNS or a private IP;
- ACLs allow only SSH from the laptop to the development host;
- port 22 is not exposed to the Internet.

## Why one key per device

A dedicated key lets you revoke a laptop without breaking GitHub, a VPS or other access. It also makes it easier to audit which device still holds authorization.

The private key stays on the client; the host only receives the public one in `authorized_keys`.

## Operational limit

The remote client does not create availability. If the host is off, suspended, offline or WSL never started after a reboot, there is no environment to connect to.

Availability has to be checked layer by layer:

1. host powered on;
2. WSL started;
3. SSH service listening;
4. private network available;
5. valid authentication;
6. Orca runtime connected.

## The real benefit

The laptop stops being a second development station that has to be kept in sync. It becomes another window into the same environment, with the same repositories, sessions and credentials.

## References

- [SSH worktrees — Orca Docs](https://www.onorca.dev/docs/ssh)
- [Tailscale on WSL2](https://tailscale.com/docs/install/windows/wsl2)
