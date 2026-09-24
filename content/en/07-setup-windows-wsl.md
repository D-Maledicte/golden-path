---
slug: setup-windows-wsl
title: Orca Desktop with Windows and WSL
type: guide
order: 7
summary: A reference pattern for separating the desktop interface from the Linux environment where repositories, runtimes and agents live.
tags: [orca, setup, windows, wsl, ssh]
related: [hosts-ssh, agent-terminals, acceso-portatil-orca]
area: Orca
glyph: ⊞
hue: rgba(168,106,255,.24)
---

# Orca Desktop with Windows and WSL

## The pattern

Orca Desktop can live on Windows while the real work runs inside WSL. The separation keeps a native interface without moving repositories, dependencies and CLIs onto the Windows filesystem.

| Layer | Responsibility |
| --- | --- |
| Windows | Orca interface and host selection |
| WSL/Linux | Git, repositories, runtimes and CLI agents |
| Local SSH | Controlled bridge between the interface and the environment |

## Important decisions

### Repositories on Linux

Projects stay inside the WSL filesystem. This reduces friction with permissions, watchers, performance and tools designed for Linux.

### A dedicated SSH identity

Orca uses a dedicated key. There is no need to reuse a personal identity with broader reach: a specific credential simplifies revocation and auditing.

### Agents installed on the real host

Each CLI must be installed and authenticated inside WSL. A tool working on Windows does not mean it exists, or shares a session, inside Linux.

### First test in read-only mode

Before enabling edits, ask the agent to identify the framework and cite the file where it checked. The test simultaneously proves the connection, path, CLI and repository access without modifying anything.

## Preparing parallel work

- one worktree and one branch per task;
- a single owner for shared resources;
- scope and validations written down before running;
- human review before merge or deploy;
- credentials limited to the host and project that need them.

## Portable checklist

- [ ] The Linux environment’s SSH service is running.
- [ ] Orca uses a dedicated key.
- [ ] The local host connects without depending on an open terminal.
- [ ] Repositories are opened from the Linux filesystem.
- [ ] Agents are available and authenticated on that host.
- [ ] The read-only test finished with a clean Git state.
- [ ] The worktree strategy is defined.

The exact commands depend on the distribution, the WSL version and the security policy. The guide keeps the design; the implementation gets validated against each tool’s current documentation.
