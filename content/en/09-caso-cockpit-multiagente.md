---
slug: caso-orca-cockpit-multiagente
title: Case study — Orca as a multi-agent cockpit
type: case-study
order: 9
summary: A coordinating agent keeps the full context and delegates implementations and audits to specialized workers in isolated worktrees.
tags: [orca, case-study, multi-agent, worktrees, orchestration]
related: [orquestacion, workspaces-y-worktrees, continuidad-y-observabilidad]
area: Orca
glyph: ◈
hue: rgba(236,95,189,.24)
---

# Case study — Orca as a multi-agent cockpit

## Starting point

A digital transformation project combined integrations, data, APIs, security and production operations. A single conversation could hold the context, but it became a bottleneck as soon as several fronts opened in parallel.

Launching agents without structure did not work either: it increased the risk of overlapping changes, contradictory decisions and lost context when switching sessions.

## The model we adopted

### Coordinating agent

A higher-capability agent operates on the main workspace. Its job is to:

- review the overall state;
- keep current decisions and constraints;
- prepare the plan;
- split the work into verifiable units;
- review implementations and audits;
- decide the next front.

The coordinator does not exist to implement everything. It exists so every task starts with enough context and comes back with comparable evidence.

### Implementers and reviewers

Bounded tasks are assigned according to cost, availability and each agent’s strengths. Different models and CLIs can coexist without changing the methodology.

Each worker gets:

- its own worktree and branch;
- an explicit scope;
- operational constraints;
- completion conditions;
- an expected way of delivering evidence.

Review agents are kept separate, when appropriate, from those who did the implementation.

## Operational flow

1. The coordinator inspects the project and prepares a task.
2. A worktree is created from a known base.
3. The implementer works within its scope.
4. It delivers changes, tests, risks and open items.
5. Another agent or the coordinator reviews the result.
6. Merging and any production action stay behind a human gate.

## What Orca contributed

### Understandable parallelism

Fronts stopped being anonymous terminals. Each one was tied to a project, worktree, agent and visible state.

### Vendor freedom

Different CLIs coexisted on the same surface. The model could be chosen per task without losing the overall map of the project.

### Real isolation

Implementations did not compete for the same checkout. Each branch could be reviewed, compared or discarded without contaminating the main work.

### Continuity

Separating interface, process, session, worktree and persistent state made it possible to recover work after interruptions without assuming everything was still alive or taking destructive actions by reflex.

### Remote operation

The interface worked as a cockpit while repositories and agents stayed in a central execution environment. Other devices could act as windows onto the same state, without creating divergent copies.

## Benefits

- more simultaneous fronts without sharing working files;
- context continuity even when the implementer changed;
- model selection by cost and task type;
- clearer, reviewable handoffs;
- less dependence on a particular session or interface;
- explicit separation between planning, implementation, auditing and production.

## The transferable lesson

The improvement did not come from “using many models”. It came from designing a system where models can be swapped, tasks stay isolated and the important context does not depend on any of them.

Orca made that architecture visible and operable. The quality of the result still depended on work contracts, Git, validations and human supervision.

> Case based on a real environment. Company names, repositories, infrastructure, identifiable incidents and operational data have been removed.
