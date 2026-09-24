---
slug: orca-como-ade
title: Orca as an ADE and control plane
type: concept
order: 1
summary: Orca organizes agents, repositories and execution environments; it does not replace the model or decide on its own how the team should work.
tags: [orca, ade, agents, control-plane]
related: [workspaces-y-worktrees, orquestacion, agent-terminals]
area: Orca
glyph: ◉
hue: rgba(237,195,94,.25)
---

# Orca as an ADE and control plane

## The idea in one sentence

Orca is an **Agent Development Environment**: an interface for running and supervising different coding agents on real projects, each with its own terminal, session and workspace.

It does not bring a new “brain”. The brains are still Codex, Claude Code, OpenCode, Pi or other CLI agents. Orca provides the place where you can see who is working, on which branch, on which host and in what state.

## What problem it solves

When agents live in loose terminals, coordination stays in the operator’s memory:

- which agent was in each repository;
- which one had permission to edit;
- which branch belonged to each task;
- which one finished and which one is waiting for a decision;
- where a session ended up after closing a window or switching machines.

Orca makes that state visible and ties it to concrete entities: project, workspace, worktree, terminal, session and host.

## Three separate planes

### Agent

The executor: Codex, Claude Code, OpenCode or another CLI. It reasons, uses tools and modifies files according to its permissions.

### Execution environment

The machine where the repository, Git, dependencies and credentials actually live. It can be the local PC, WSL, a machine over SSH or a remote Orca Server.

### Control plane

That is Orca Desktop. It lets you open, arrange, observe and resume work without necessarily moving the code to the machine you are looking from.

Separating these planes is the first big conceptual win: **the interface can close or change devices without the development environment having to move**.

## What it does not do on its own

Orca enables parallel work, but it does not guarantee good orchestration. Five agents open in five panes can produce five times more conflict if they share scope, branch or sensitive files.

The value shows up when you add a methodology:

- one owner of context and planning;
- bounded tasks;
- one worktree per implementation;
- explicit limits on shared files;
- review, tests and a human decision before merging.

## When it pays off

Orca makes sense when there are several simultaneous projects, agents or tasks; when the environment runs on Linux but the interface is used from Windows; or when you need to recover context after frequent interruptions.

For a single quick question in a small repository, a regular terminal may be enough. Orca starts paying for its complexity when the problem stops being “talking to an agent” and becomes **managing a work system with agents**.

## The outcome we want

The goal is not to have more agents switched on. It is to increase useful parallel work without losing traceability, isolation or the ability to stop.

## References

- [Orca — official repository](https://github.com/stablyai/orca)
- [Agents & sessions](https://www.onorca.dev/docs/model/agents-sessions)
