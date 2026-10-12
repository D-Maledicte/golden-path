---
slug: orquestacion
title: Orchestration in Orca
type: concept
order: 3
summary: "Orchestrating is not opening agents in parallel: it is distributing authority, dependencies, context, decisions and evidence of completion."
tags: [orca, orchestration, multi-agent, coordination, delegation]
related: [workspaces-y-worktrees, agent-terminals, caso-orca-cockpit-multiagente]
area: Orca
glyph: ✣
hue: rgba(236,95,189,.24)
---

# Orchestration in Orca

> External product documentation reviewed on October 12, 2026. Historical cases and local operating choices are preserved.

## Parallelism is not orchestration

Opening several agents at once increases capacity, but it does not define who decides, what depends on what, or when a task is really finished.

There is orchestration when, at a minimum, there is:

- a shared goal;
- an explicit division of work;
- clear ownership of each result;
- known dependencies;
- channels for questions and blockers;
- a closing authority;
- reviewable evidence.

## Two possible layers

### Methodological orchestration

The pattern you can apply today with regular workspaces and terminals:

1. a manager agent keeps the full context;
2. it prepares bounded tasks;
3. each implementer works in an isolated worktree;
4. agents deliver a diff, tests, risks and open items;
5. the manager reviews and merges;
6. production actions respect the authorized scope and applicable gate.

The initial case required human intervention for every production step. In its V4 evolution, reviewed on October 12, 2026, certain small LIVE operations have previously bounded autonomy; others, such as deletions, still require explicit permission. Project policy defines that boundary: opening an Orca terminal does not grant authority. The [cockpit case](/en/entrada/caso-orca-cockpit-multiagente#case-evolution-v4-october-2026) details the current separation between general direction, integration and package coordination.

This layer does not depend on an experimental feature. Its authority lives in the work contract, Git and the review process.

### Native Orca orchestration

Orca includes a structured layer, currently experimental, based on:

- **Run:** durable coordination context;
- **Task:** unit of work with state and dependencies;
- **Dispatch:** a concrete attempt to run a task in a terminal;
- **Worker:** a supervised agent that performs that attempt;
- **Message:** communication of status, questions, heartbeats and closures;
- **Decision gate:** a pending decision that blocks progress.

This option is useful when it matters to follow a task graph, record ownership or require every worker to formally close its dispatch. For a one-off prompt watched by a person, a regular terminal is still enough.

Current documentation requires enabling the experimental feature and uses `run-create`, tasks and `worker-start`. The old `orchestration run` and `run-stop` commands are retired. A Run preserves coordination context; it does not place or schedule workers by itself. Consult `orca skills get orchestration --full` in the installation you will use before copying commands from another version. [Official flow](https://www.onorca.dev/docs/cli/orchestration).

## The manager’s role

The manager should not become the universal implementer. Its value lies in:

- holding the full picture;
- spotting dependencies between fronts;
- writing instructions another agent can execute;
- reviewing evidence and compatibility;
- deciding what gets merged and what goes back to work.

The more it writes directly on every front, the more it loses the separation that makes the system useful.

## What to delegate

Delegation works well for tasks that can be described with a clear boundary: implementing an endpoint, auditing a module, writing tests, comparing alternatives or verifying a migration.

It is best to keep centralized the decisions that cut across several branches: lockfiles, shared schemas, secrets, migrations, deployments and architecture changes.

## A worker’s minimum handoff

A delivery should answer:

- what it did;
- which files it modified;
- which tests it ran;
- what it could not verify;
- what risks or decisions remain;
- which commit or branch holds the result.

“Done” without evidence is not completion; it is just a notification.

## Reference

- [Orchestration — Orca Docs](https://www.onorca.dev/docs/cli/orchestration)
