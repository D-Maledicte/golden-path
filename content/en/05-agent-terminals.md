---
slug: agent-terminals
title: Agent terminals and the session lifecycle
type: concept
order: 5
summary: An agent terminal ties together a CLI, a session, a worktree and an observable state; it is not just a console under another name.
tags: [orca, terminals, sessions, agents, panes]
related: [workspaces-y-worktrees, orquestacion, continuidad-y-observabilidad]
area: Orca
glyph: ▤
hue: rgba(87,217,232,.22)
---

# Agent terminals and the session lifecycle

## What an agent terminal is

In Orca, an agent session is a CLI running inside a specific terminal and worktree. That link lets the system show identity and state without forcing the operator to open every pane.

A regular terminal only exposes input and output. An agent terminal adds operational context:

- which agent is running;
- in which workspace and host;
- whether it is working, waiting, done or blocked;
- which conversation or session it belongs to;
- how to bring it back into focus.

## Tabs, panes and splits

Tabs organize different surfaces inside a workspace. Panes let you see several at once. A split can be used for:

- agent and dev server;
- agent and test run;
- implementation and log monitoring;
- two agents on deliberately separate tasks.

The layout helps you observe; it does not replace isolation. Two agents in different panes are still dangerous if they write to the same checkout and the same scope.

## Agent states

Orca recognizes lifecycle changes through terminal signals and agent hooks. In operational terms, the important states are:

- **working:** processing or using tools;
- **needs you:** waiting for permission, an answer or a decision;
- **done:** finished and needs review;
- **blocked/failed:** could not continue;
- **idle:** still open but with no relevant activity;
- **plain shell:** a terminal with no recognized agent.

The dashboard lets you supervise several agents by exception: deal first with the ones that need intervention and review the ones that finished, without going pane by pane.

## Stable pane identity

In our environment we confirmed that several shells can share a workspace and worktree, but each pane keeps its own identifiers such as `ORCA_PANE_KEY`, `ORCA_TAB_ID` and `ORCA_TERMINAL_HANDLE`.

That enables an external observability layer: relating descendant processes to a specific pane, detecting whether Codex or OpenCode is running there and representing the state without writing to the project.

## Copy Context and handoffs

Copying a bounded stretch of scrollback is useful for transferring recent evidence to another tool. It should not be the main continuity strategy: transcripts grow, get truncated and mix reasoning with operational noise.

A durable handoff should summarize decisions, files, tests, risks and the next step. The terminal keeps the detail; the documentation keeps the useful state.

## Permissions and autonomy

Launch defaults can change and, currently, Orca favors highly autonomous agents inside the worktree. If the team needs manual confirmation, it must explicitly configure and verify the actual arguments of each agent.

The worktree reduces the blast radius on files, but on its own it does not limit access to the network, secrets, system commands or external services.

## References

- [Terminal — Orca Docs](https://www.onorca.dev/docs/terminal)
- [Agents & sessions — Orca Docs](https://www.onorca.dev/docs/model/agents-sessions)
