---
slug: enrutamiento-modelo-esfuerzo-rol-harness
title: "Advanced agent routing: model, effort, role and harness"
type: editorial
order: 19
summary: "Why agent selection must account for model, reasoning effort, task role and execution harness, using Codex versus OMP as a controlled contrast."
tags: [orchestration, harness, cli, codex, omp, routing, agents, benchmarks, governance]
related: [comparar-harness-cli-codex-claude-opencode-cline, guia-escalado-modelos, orquestacion]
area: Gobierno de agentes
glyph: ⌘
hue: rgba(87,217,232,.24)
---

# Advanced agent routing: model, effort, role and harness

> Architecture proposal, October 8, 2026. This is not a claim of an already validated deployment. Documented features, hypotheses and results still requiring measurement are kept separate.

## The fourth parameter

Early orchestration strategies asked **which model** to use and **how much reasoning effort** to allocate. Roles add **what function** an agent should perform. A further decision remains: **which harness should execute that task?**

The operational configuration becomes **`model + effort + role + harness`**, rather than only model plus effort. This is not a complete score function: permissions, codebase, budget, context and availability remain hard eligibility constraints.

Even with identical model weights, harness instructions, read outputs, editing tools and compaction strategies can change observed behavior. Model comparisons that ignore the execution surface can therefore confuse causes.

## Controlled contrast: OpenAI in Codex and OMP

Codex CLI and Oh My Pi can run compatible OpenAI-family models, depending on version and authentication. This creates a useful experiment: **same model, same effort, same task, different harness**.

Codex has an integrated workflow for reading, editing, running commands, approvals and sandboxing. It is a reasonable initial candidate for complete implementations with tests and auditable delivery. [Codex](https://github.com/openai/codex).

OMP, a Pi fork, includes specialized tools such as LSP integration, debugging and hash-anchored editing, along with multi-provider support and extensibility. It is an interesting candidate for references, symbol navigation and focused modifications. [OMP](https://github.com/can1357/oh-my-pi).

**Neither product is proven superior by this feature comparison.** LSP can reduce exploration when supported by the language and environment, but add little to small or unindexed projects. Integrated workflows may improve consistency on longer assignments, but that too needs measurement. Maintainer-published benchmarks are not a substitute for tests on your own repository.

| Dimension | Codex CLI | OMP | Question to test |
| --- | --- | --- | --- |
| Execution | Integrated tool and command loop | Specialized, extensible tooling | Which needs fewer human interventions? |
| Exploration | Repository reading and search | Search and LSP when available | Which locates correct changes with fewer reads? |
| Editing | Agent editing tools | Hash-anchored and structured edits | Which incurs fewer failed attempts? |
| Context | Built-in session and compaction | Its own configurable session strategies | Which preserves task constraints? |
| Safety | Sandbox and explicit approvals | Controls depend on setup and tools | Which enforces the same restrictions? |
| Cost | Subscription quota or API, depending on access | Compatible subscription or separate API, depending on provider | Which lowers cost per accepted task? |

The **harness** and the **inference provider** are different choices. OMP authentication paths can change billing, model availability and limits. A Codex subscription and an OpenAI API key must not be assumed interchangeable. Record the effective model ID and authentication route before benchmarking.

## Routing as a planning problem

A coordinator choosing only the strongest model may waste capacity while using unsuitable tools. A more precise scheduler:

1. **Classifies work:** exploration, implementation, refactor, debugging, testing, review or documentation.
2. **Applies hard constraints:** permission boundaries, secrets, language, available tools, quotas, latency and required isolation.
3. **Assigns a role:** owner, explorer, implementer, reviewer or verifier, each with explicit scope and output.
4. **Evaluates model–harness pairs:** actual compatibility, effort settings, capabilities and evidence for the task type.
5. **Executes and verifies:** isolated worktree, tests, diff, usage logs and human approval when needed.
6. **Learns cautiously:** records outcomes, updates routing rules and retains a safe fallback.

Roles are contracts, not decorations. A read-only reviewer must not gain write access merely because routing selects another CLI. Determine authorized actions **before** selecting the harness.

## An initial routing matrix

| Assignment | Role | Initial candidate | When to prefer it |
| --- | --- | --- | --- |
| Locate cross-module impact | Explorer | OMP | Working LSP and measured reduction in reads |
| Fix a reproducible bug | Implementer | Codex | Higher accepted-resolution rate |
| Symbol-level refactor | Specialized implementer | OMP | Verified structural edits and renames |
| Cross-layer change | Implementer | Codex | Better consistency across tests and contracts |
| Review a diff | Reviewer | Any eligible read-only harness | Fewer missed defects and lower review cost |
| Recover a failed run | Diagnostic fallback | Another eligible harness | Evidence a tooling change helps |

These are **routing hypotheses**, not exclusive product capabilities. If empirical results disagree, update the matrix.

## A portable task contract

Cross-harness delegation works best when the coordinator creates a provider-independent task envelope:

```yaml
task_id: BUG-142
role: implementer
goal: "Fix duplicate events without changing the HTTP contract"
repository_ref: "immutable-commit"
scope:
  writable: ["src/events/**", "tests/events/**"]
constraints:
  network: false
  secrets: none
  production_write: false
acceptance:
  - "regression tests pass"
  - "diff stays in scope"
outputs: ["summary", "diff", "tests", "usage", "blockers"]
```

This contract must be translated into **actual** harness and operating-system enforcement. Writing `network: false` in YAML does not disable the network. A harness unable to satisfy critical constraints must be ineligible, no matter its benchmark score.

## A/B benchmarking: isolate the harness effect

For paired tasks, hold constant the starting commit, fixtures, effective model version where possible, reasoning effort, functional instructions, scope, budget and acceptance checks. Record unavoidable differences in system prompts, tools and compaction, because **these are part of the experimental treatment**.

Use representative tasks and at least three runs per configuration, fresh worktrees and no reused solutions. Measure:

- **Quality:** accepted-task rate, tests, regressions, missed defects and diff quality.
- **Efficiency:** attributable tokens and cost, tool calls, edit retries and time to acceptance.
- **Operation:** human interventions, compactions, repeat reads, permission failures and recovery events.
- **Safety:** attempted out-of-scope actions and actual enforcement of restrictions.

The central outcome is **total cost per accepted task**, including review, rework and failures, not simply patch-generation time. Where usage accounting differs between providers, report it separately and favor observed monetary cost and independently checked outcomes.

## Fallback, learning and limits

An advanced router must avoid two traps: switching harnesses automatically on every error, and rewarding whichever agent reports success fastest. A logic failure is not necessarily a harness failure, and success requires independent acceptance.

Record `(task type, model, effort, harness, version, tools, permissions, outcome)` and update preferences only with meaningful samples. Infrastructure or tool failures can trigger compatible fallbacks. **Safety violations must stop and escalate**, not seek a more permissive harness.

Switching execution surfaces has costs too: setup, context reconstruction, logs and new failure modes. A consistent single-harness system can outperform a complex router at small scale.

## From choosing the best model to choosing the best working environment

The point is not to accumulate CLIs, but to stop treating the harness as an invisible constant.

A mature coordinator should ask: **Which model, effort, role and harness combination delivers a verifiable result for this task within its constraints and budget?**

Answer with portable contracts, reproducible experiments and accepted-task metrics, not brand loyalties. The harness becomes a planning variable rather than a terminal preference.

For the broader product comparison, see [Comparing CLI harnesses](/entrada/comparar-harness-cli-codex-claude-opencode-cline).
