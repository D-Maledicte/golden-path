---
slug: caso-orca-cockpit-multiagente
title: Case study — Orca as a multi-agent cockpit
type: case-study
order: 9
summary: The evolution from one coordinator to separate direction, integration and packages, with cross-family auditing and verifiable acceptance.
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

## The initial model

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

## Initial operational flow

1. The coordinator inspects the project and prepares a task.
2. A worktree is created from a known base.
3. The implementer works within its scope.
4. It delivers changes, tests, risks and open items.
5. Another agent or the coordinator reviews the result.
6. Merging and any production action stay behind a human gate.

## Case evolution: V4, October 2026

The V4 documentation, reviewed on October 12, 2026, separates responsibilities previously concentrated in one coordinator. The earlier design remains part of the case history; the current allocation distinguishes three levels:

| Level | Assignment in this environment | Responsibility |
| --- | --- | --- |
| General direction | Opus | Conversation with the human operator, priorities and cross-cutting decisions |
| Integration | Sol at low effort | Reconstruct state, order dependencies and integrate package evidence |
| Package coordination | Sol at medium effort or Opus at low effort | Lead a bounded capability through acceptance |

These are project assignments, not universal recommendations or model equivalences. LIVE implementation uses Luna at high effort or Sonnet; auditing switches to the opposite model family. The package can use an inverted assignment: Opus coordinates, Sonnet implements, and Sol audits. Review from a different family adds a second perspective alongside the tests.

The current unit is **one capability, one Notion task, one branch, and one worktree**. Implementation, corrections, and audit share that branch and worktree. The reviewer works in read-only mode and records a separate verdict against the candidate. Parallelism happens across capabilities, and the package coordinator keeps ownership through handoff to integration.

**BUILD/LIVE and the three-part gate already existed in V3.** V4 permits narrowly scoped LIVE changes when they cover one section, preserve its contract, involve no deletions, and have a one-step rollback. The gate requires parity with CRM, an executable rollback, and cross-family audit. The Catalyst deployment wrappers require a structured `gate.json` for this LIVE path and reject a pending or incomplete gate. Deletions and tombstones still require explicit human permission.

General direction receives a decision queue grouped by urgency: incidents, unblocking decisions and non-urgent matters. The integrator gathers evidence; it does not interrupt the person for every update or treat a pending decision as implied permission.

### From merge to accepted outcome

A local test, a merged PR, and a production check are evidence of different events. One staged rollout package passed local checks and cross-family audit and was merged with the operational gate and LIVE application still pending. Its handoff preserved the candidate, the checks performed, and the remaining decision for the integrator.

The team tracks local readiness, integration, application, immediate postflight, and acceptance after the agreed operating cycle. The handoff records the latest milestone actually demonstrated, the remaining work, its owner, and the next piece of evidence.

Before resuming, reconcile active workers and worktrees with Git, the task record, and the systems that show what is running. The [continuity guide](/en/entrada/continuidad-y-observabilidad) explains where each piece of evidence lives. These examples come from anonymized project records reviewed on November 17, 2026.

## What Orca contributed

### Understandable parallelism

Fronts stopped being anonymous terminals. Each one was tied to a project, worktree, agent and visible state.

### Vendor freedom

Different CLIs coexisted on the same surface. The model could be chosen per task without losing the overall map of the project.

### Real isolation

Each capability kept its own checkout. Within that checkout, one implementer and a read-only reviewer could work against the same candidate and its evidence.

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
