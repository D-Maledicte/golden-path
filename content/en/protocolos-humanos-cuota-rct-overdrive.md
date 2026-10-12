---
slug: protocolos-humanos-cuota-rct-overdrive
title: "RCT and Overdrive: human protocols for managing provider quotas"
type: editorial
order: 20
summary: "Two prepared responses to scarce or expiring capacity: protect LIVE operations, prioritize useful BUILD work, and keep control with the human operator."
tags: [providers, quota, protocols, rct, overdrive, continuity, operations, governance]
related: [enrutamiento-modelo-esfuerzo-rol-harness, guia-escalado-modelos, comparar-harness-cli-codex-claude-opencode-cline, orquestacion]
area: Gobierno de agentes
glyph: ◈
hue: rgba(237,195,94,.25)
---

# RCT and Overdrive: human protocols for managing provider quotas

> Operating framework defined in October 2026. These are human operator decisions, not an autonomous coordinator policy or a benchmark-validated optimization. Model names and commands refer to a specific setup.

## Quota changes the shape of a work session

A well-planned round of work can face two opposite situations: too little quota to finish, or unused capacity that may expire at a reset. Improvising a response introduces rushed decisions at precisely the wrong moment.

RCT and Overdrive prepare that response in advance. The operator changes concurrency, priorities, and stopping points. Task complexity continues to determine the model and reasoning effort required.

Think of it as *min-maxing* provider capacity while preserving the controls that make the result reliable. The useful unit is an accepted task, resolved uncertainty, or reduced risk. Emptying a usage counter does not establish efficiency.

This complements [routing by model, effort, role, and harness](/en/entrada/enrutamiento-modelo-esfuerzo-rol-harness). Routing selects the execution configuration; these protocols organize a round of work when provider availability changes.

## Who makes the decision

**A human operator activates and exits each protocol.** The operator reads usage, interprets the availability window, chooses priorities, and decides whether and when to redeem a reset.

A coordinator can receive explicit instructions to reduce parallel work, prepare tests, record a recovery point, or present evidence. That does not authorize it to switch regimes, purchase capacity, expand permissions, or initiate a LIVE operation independently.

In this version, notifying the team when usage crosses a threshold is part of human operation. A future automated alert would need a defined data source, freshness expectation, and recipient. An alert is not authorization.

## BUILD and LIVE describe consequences

**BUILD** covers isolated preparation: implementation in branches, tests using fixtures, documentation, audits, and preliminary reviews. **LIVE** covers operations with real effects: deployment, data migration, production configuration changes, or actions against an active service.

Classification follows effects and permissions. A test that writes to production is LIVE regardless of its name. A read-only audit can remain BUILD while still requiring careful handling of the data it accesses.

This distinction allows more preparation without automatically accelerating publication. The LIVE gate retains its approval, evidence, and recovery requirements.

| Decision | RCT: scarce quota | Overdrive: expiring quota |
| --- | --- | --- |
| Goal | Safe closure and continuity | Useful deliverables from available capacity |
| Concurrency | Fewer fronts, favor work nearing closure | More independent BUILD work within review capacity |
| Model and reasoning | Preserve task requirements | Preserve task requirements |
| LIVE work | Admit only steps with completion and recovery margin | Keep the same gates; spare capacity is no justification to multiply them |
| Evidence | Safe point, receipt, and session record | Verifiable results and reviewable outputs |
| Regime authority | Human operator | Human operator |

## RCT: protect closure under scarcity

The original protocol defines seven rules:

1. **Do not lower models or reasoning because quota is scarce.** Reduce scope or concurrency before weakening the configuration a task requires.
2. **Before every LIVE step, establish a safe point and write a receipt to disk.** The previous state and recovery plan must be discoverable outside the chat.
3. **Do not start a LIVE step unless remaining capacity covers it and its rollback.** Include verification and diagnosis, not just the happy-path command.
4. **Open fewer fronts and prioritize those that close something.** An accepted small change can be worth more than five unfinished tasks.
5. **Register sessions so work can resume from an identifiable state.** Preserve references, results, and the next step.
6. **Redeem a reset between steps, never in the middle of one.** Finish the operation or reach a safe point first.
7. **Notify when crossing a threshold around 5%.** This is an operator attention signal, not a universally sufficient reserve.

A usage percentage rarely predicts exactly how much work remains possible. Conservative estimates can use comparable operations plus uncertainty margin. If execution, verification, and recovery capacity cannot be justified, postpone LIVE work.

Recovery should not depend exclusively on the same model remaining available. A documented procedure a human can execute reduces that dependency. Some operations have no simple reversal; they need an appropriate recovery plan before becoming eligible.

### A useful receipt

The receipt is a concise operational record:

- Task identifier, responsible person, and timestamp.
- Repository, branch or worktree, starting commit, and uncommitted changes.
- Observed state and location of the safe point or backup where applicable.
- Authorized step, scope, and planned verification.
- Rollback or recovery procedure and how to access it.
- Session or terminal reference, test results, and precise next action.

The pre-step receipt records preparation. Update it afterward with actual outcomes and evidence. Keep credentials out and distinguish plans from completed execution.

Session records preserve context, but the world can change while work is paused. Check branch and service state before resuming. Exact resumption means recovering a known point with evidence, not blindly replaying commands.

## Overdrive: use capacity without inventing work

Overdrive applies when the operator has evidence that available quota will expire before being used. Verify the window for the actual account first. An ambiguous announcement or assumed reset time is not enough.

In the originating setup, the instruction is **`/fast` in all Codex terminals participating in the round**. This records that setup's choice, not a promise of availability, speed, price, or quota consumption for every account. The operator checks command support, active mode, and provider conditions. A speed setting does not authorize a reasoning change.

As external context on October 12, 2026, Fast consumes included limits at 2.5 times the Standard rate; purchased credits and Enterprise pay-as-you-go are billed at twice Standard. Check which allowance the account uses before the round. [Codex speed and usage](https://learn.chatgpt.com/docs/agent-configuration/speed).

Capacity goes toward **more parallel BUILD work, audits, preliminary reviews, tests, and documentation**. Each front needs an output and a closure condition: a regression test, impact report, focused diff, or operational guide checked against the code.

The example keeps **coordinators on Sol medium and Luna on high**, following the operator's usual allocation. These are concrete assignments, not universal equivalences across model families. The exception allowing LIVE-gate auditors or difficult designs to move to high applies to assignments that start at medium; Luna is already high. Spare quota is not a reason for blanket escalation.

Concurrency adds integration cost. Isolate branches or worktrees, assign file ownership, and avoid duplicating investigations unless a comparison is intentional. Repeated audit findings provide little value without acceptance criteria and a reviewer.

### Protocol preset and project allocation

Contextual update, October 12, 2026: the Sol medium/Luna high preset above is preserved as part of the original human protocol. The [V4 operational case](/en/entrada/caso-orca-cockpit-multiagente) now separates general direction with Opus, integration with Sol low and package coordination with Sol medium. That allocation serves different functions within that project; it does not automatically amend the protocol or establish a downgrade due to quota scarcity.

The shared rule remains choosing effort by complexity and responsibility while preserving the task's permissions. Quota notices are informational: they do not activate RCT, Overdrive or a provider switch on their own. Likewise, previously authorized small LIVE autonomy does not arise from spare quota.

### Human review is a capacity limit

Before opening another front, the operator should answer:

- What useful output will it produce, and what decision will that enable?
- Can it finish or reach a safe point within the window?
- Is it independent enough to avoid blocking other work?
- Who will review it, and when?

When review is saturated, more agents can turn expiring quota into review debt. Finish tests, consolidate documentation, or close existing work instead. Leaving capacity unused is also valid.

## Two practical scenarios

**Low quota before a migration.** One fix is almost complete, two investigations remain open, and a migration is pending. The operator activates RCT, closes the verifiable fix, and records the investigations. The migration waits unless validation and recovery have a defensible margin. Any available reset is redeemed at that safe boundary.

**Confirmed window with unused capacity.** A BUILD feature needs tests and review. The operator activates Overdrive and assigns independent regression, compatibility, diff-review, and documentation work. Outputs still pass through the same publication gate. None makes deployment automatic.

These are application examples, not measured results. Evaluate the protocols through accepted closures, defects found before LIVE, resumption time, rework, and review load. Percentage consumed provides context rather than the primary success metric.

## A short record before the round

A minimal operator record could look like this:

```yaml
protocol: RCT # or Overdrive
activated_by: human_operator
reason: "Verified quota condition for this round"
quota_source_and_time: "Record the actual observation"
reset_window: "Confirmed or unknown; do not present a guess as fact"
priority_fronts: []
preserved_configurations: []
concurrency_limit: "Based on isolation and review capacity"
next_safe_point: "Verifiable reference"
exit_condition: "Defined by the operator"
```

This is a proposed record, not a file that activates behavior by itself. Exit conditions may include reaching the intended closure, a change in availability, or exhausted review capacity. The operator evaluates them between safe steps.

## Why decide in advance

Use RCT when safe closure and continuity dominate under scarce capacity. Use Overdrive when a confirmed window and useful, absorbable preparation backlog exist. Both retain task-level technical standards and explicit human responsibility.

The goal is to let a provider event change work organization without forcing last-minute decisions about risk, permissions, and quality. Observation and recordkeeping may later be automated. Delegating regime decisions requires additional design and authorization.

### Related reading

- [Choosing models and reasoning effort](/en/entrada/guia-escalado-modelos): match effort to the task.
- [Model, effort, role, and harness](/en/entrada/enrutamiento-modelo-esfuerzo-rol-harness): allocate execution configurations.
- [Comparing CLI harnesses](/en/entrada/comparar-harness-cli-codex-claude-opencode-cline): tools, permissions, and continuity.

RCT and Overdrive rules come from the human protocol behind this editorial. Receipts, the record template, and proposed metrics develop its application; they are not guaranteed native provider features.
