---
slug: mapa-procesos-verificacion
title: From backup to process map
type: case-study
order: 3
summary: A faithful but silent repository became a surface where any agent can analyze a flow and verify improvements without touching production.
tags: [processes, audit, agents, verification, zoho-crm]
related: [backup-versionado-crm, arquitectura-read-only, orquestacion]
area: CRM versionado
glyph: ⌘
hue: rgba(168,106,255,.24)
---

# From backup to process map

## The second-stage leap

The backup answered what code existed. It did not explain how the business was organized, which functions made up a flow or how to check that a fix had been applied.

The second stage added three pieces:

| Piece | What it answers |
| --- | --- |
| Resource dictionary | Which functions use each shared resource and what the blast radius is |
| Process tree | Which flows exist and which functions make up each branch |
| Analysis contract | How a branch should be analyzed and what evidence to deliver |

## Generated and curated

Data that changes is regenerated on every sync. The conceptual organization is expressed through rules maintained by people.

No manual lists of functions are written into the documentation: they go stale the next day. A rule absorbs new functions and the report flags those that do not fit any branch.

## Unit of work: one branch

The process for a person or agent is deliberately bounded:

1. Open a working copy of the repository.
2. Pick a branch from the process tree.
3. Follow the analysis contract.
4. Deliver three artifacts.

| Deliverable | Purpose |
| --- | --- |
| `manual-operativo.md` | Explain the flow in business terms |
| `mejoras-propuestas.md` | Rank findings by consequence, anchored to file and line |
| `validar.sh` | Turn every finding into an executable check |

The agent starts from computed reports rather than a blind search across more than thirteen hundred functions. That cuts time, cost and variability.

## The limit that sustains quality

The analysis fixes visible defects; it does not redesign processes or propose broad migrations. On a platform where publishing is immediate, a large redesign of a flow that moves money needs another level of governance.

The restriction does not live only in the prompt: **every finding that gets developed must be expressible as an automated check**. If it cannot be verified, it is noted as a separate idea and not presented as a ready fix.

## Verification without AI

When someone reports they fixed a finding, there is no need to pay for reasoning again to read the code. You run `validar.sh` against the current snapshot.

Prose goes stale; the check gets re-evaluated. This separation reduces supervision and keeps the report from becoming a frozen truth.

## Pilot test

A branch with no previous manual was analyzed following only the contract. The agent delivered the three files and the priority findings were verified against the code.

The test found idempotency bugs, incomplete validations and external execution surface that needed review. The anonymization rules keep the problem categories, but do not publish the flow, the names or the client’s exact conditions.

The analysis also flagged as unconfirmed the points the API did not allow checking. That discipline was part of the success, not a limitation to hide.

## The benefit

Diagnostic capability stopped depending on whoever knows the organization by heart. The core cost is generating the snapshot and reports; each team member can analyze a branch with their own tool and verify fixes without production access.
