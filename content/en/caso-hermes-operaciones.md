---
slug: caso-hermes-operaciones
title: Case study — Hermes as an operational interface
type: case-study
order: 3
summary: A self-hosted agent brought queries and alerts into everyday channels, with scoped permissions and observable business tests.
tags: [hermes, agents, channels, operations, case-study]
related: [hermes-agente-operativo, hermes-preset-instalacion]
area: Hermes
glyph: ◈
hue: rgba(87,217,232,.22)
---

# Case study — Hermes as an operational interface

## Anonymized context

A services company needed to bring operational information closer to a non-technical team and turn passive events into actionable notices. The goal was not to add another AI chat, but to reduce dependence on a single person who knew how to query each system.

Hermes was framed as a conversational layer connected to internal tools, available from channels the team already used.

## Decisions made

### Reuse infrastructure with an initial limit

The first version was installed on existing infrastructure. To keep the new service from competing uncontrollably with other workloads, a conservative concurrency limit was set and any expansion was postponed until there were real metrics.

### Isolate provider and spend

Access to the model provider was created exclusively for the project. This made it possible to compare alternatives, watch spend and revoke the integration without affecting other agents.

The model was chosen with a fixed set of representative queries, scoring accuracy and cost. The comparison relied on real tasks rather than a general impression.

### Separate audiences

Team queries and administrative alerts were treated as different paths. Each channel received only the information that matched its role.

### Keep secrets out of the context

Credentials stayed in the runtime environment. They were not copied into documentation, prompts or context files shared with the agent.

## A verifiable MVP

The first version was considered valid once it could demonstrate three behaviors:

1. An authorized user asked an operational question and got an answer consistent with the source system.
2. A controlled event produced an alert within the expected interval.
3. A restricted notification reached the administrative channel but not the general one.

Each milestone describes observable evidence. “The agent is installed” does not count as a result.

## What we learned

- Reusing infrastructure works when capacity starts bounded and is measured.
- One credential per project simplifies cost, auditing and revocation.
- The value shows up in the full path: channel → agent → tool → answer.
- Separating audiences matters as much as connecting channels.
- An operational MVP needs business tests, not just technical checks.

## The benefit

The team gained a direct way to query information and receive notices without depending on a specialized interface. At the same time, the organization kept control through minimal permissions, authorized identities and channel separation.

> Case based on a real implementation. Names, infrastructure, metrics and internal flows have been removed.
