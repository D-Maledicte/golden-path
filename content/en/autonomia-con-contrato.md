---
slug: autonomia-con-contrato
title: "Autonomy with a contract: aligning scope, permissions, and tools"
type: editorial
order: 21
summary: "Permission to act, an enabled tool, and readiness to deliver are three different things. How to connect them without turning autonomy into unrestricted access."
tags: [agents, permissions, sandbox, codex, claude-code, autonomy, delivery]
related: [modelos-guiados-el-entorno-es-la-politica, comparar-harness-cli-codex-claude-opencode-cline, orquestacion, arquitectura-read-only]
area: Gobierno de agentes
glyph: ⚿
hue: rgba(237,195,94,.25)
---

# Autonomy with a contract: aligning scope, permissions, and tools

*Documentation and operational review: October 20, 2026. This review does not establish end-to-end validation in the sessions executing the work.*

## When “you have my permission” is not enough

The coordinator understands the task, the task owner has authorized a bounded operation, and a procedure exists. Yet when it reaches the command, the client rejects it. The agent explains the authorization, the owner repeats it, and the tool blocks it again.

A technical permission may be missing, the classification may be wrong, or the operation may genuinely exceed its scope. From the terminal, these can look alike; resolving them requires different decisions. Enabling every command only hides the problem.

The case behind this editorial revealed another failure: after a day spent unblocking small operations, a package that was not yet ready reached the LIVE window. According to its owner, the concern was not just the unfinished work, but that the package was handed over without acknowledging why it was still unready.

**Useful autonomy needs an executable path for authorized work and enough evidence to decide when to deliver it.**

## Aligning three layers

**Scope** defines the outcome, resources, effects, and exclusions. “Work on the portal” is ambiguous; “modify this feature, test locally, and prepare a review, without publishing or querying real data” supports concrete decisions.

The **harness**, the client that organizes the agent’s tools, evaluates calls, rules, and approvals. The model’s understanding of an authorization does not mean the CLI is configured to execute it.

The **environment** determines what the process can actually reach: files, networks, identities, and remote permissions. It can block a call the client allows, or technically permit much more than the task authorizes.

As a design principle:

> Usable autonomy = authorized scope ∩ harness policy ∩ environment capabilities ∩ currently valid preconditions.

A README provides context, but does not grant system permissions. An identity with full access does not expand the task either. The documentation for [Claude Code](https://code.claude.com/docs/en/sandbox-environments) and [Codex](https://learn.chatgpt.com/docs/sandboxing) distinguishes permission decisions from execution isolation.

### “Auto” depends on the client

In **Claude Code**, Auto uses a classifier for certain actions that reach review, rather than universally approving every call. Rules retain the precedence **deny > ask > allow**: a specific authorization does not, by itself, override a broader prohibition. Infrastructure context helps interpret operations, but does not act as a firewall. [Modes](https://code.claude.com/docs/en/permission-modes), [rules](https://code.claude.com/docs/en/permissions), and [Auto configuration](https://code.claude.com/docs/en/auto-mode-config).

In **Codex**, auto-review changes who evaluates eligible requests; it does not automatically expand writable directories or network access. Nor does it routinely review every action that is already allowed. Prefix rules control execution matches, not the full impact of the authorized program. Broadly allowing an interpreter or an extensible tool deserves particular care. [Auto-review](https://learn.chatgpt.com/docs/sandboxing/auto-review) and [execution rules](https://learn.chatgpt.com/docs/agent-configuration/rules).

A profile should therefore not be transferred between clients just because their settings have similar names. Check the version, effective configuration, and managed policies in the session that will execute the work.

## Designing capabilities, not just command lists

“Can use curl” describes a tool. “Can query the status of a staging application, using a read-only identity, a fixed destination, and defined output fields” describes a capability.

A capability contract is an architectural pattern that must translate into actual controls. At a minimum, it addresses:

- **Operation and resource:** what it can do, in which project and environment.
- **Identity and data:** which privileges it uses, what it can read or modify, and what it can export.
- **Execution path:** the reviewed implementation, accepted parameters, and possible effects.
- **Conditions:** validity, limits, and decisions that require returning to the task owner.
- **Evidence:** how the outcome is verified without exposing secrets.

It must cover the full workflow: inspect, validate, acquire exclusive access when needed, execute, verify, report, and stop. Authorizing the main operation while blocking its readback leaves the path incomplete.

In one observed case, removing shell access from a read-only worker also removed its mechanism for reporting completion. The solution is a limited completion channel, not restoring a general-purpose terminal for convenience. Likewise, closing a window or a PTY does not prove that a shared process has stopped: an explicit check is required.

### A shared foundation, distinct profiles

An integration backend, a portal, and a repository of CRM functions can share tools without sharing a blast radius. A reasonable initial separation would be:

- Backend: local editing and tests; remote queries and deployments as independent capabilities.
- Portal: development and builds; preview separate from publication and access to real data.
- CRM functions: tests with fixtures; real-data reads separate from functions that write, send messages, or trigger automations.

In the reviewed case, documentation distinguishing context, general policy, and per-repository configuration has already been integrated. The portal also incorporated its operational context, without changing settings or granting permissions. This is concrete progress in documentation, not validation of three effective profiles: the settings live outside those repositories, and what each session actually loaded still needs to be checked.

## Using a credential without exposing it

Authorizing an authenticated query does not authorize reading, printing, or copying its key. Where possible, a trusted intermediary retains the credential, validates the destination and parameters, executes the operation, and returns only what is needed, using a least-privilege identity.

An ordinary environment variable does not hide a secret from code running with it. A wrapper does not automatically protect it either: **if the agent can modify the wrapper and then execute it with credentials, it can change what the wrapper does with them**. The privileged implementation needs protection from its caller, restricted parameters, and validated destinations.

Claude Code documents specific credential-protection mechanisms, with requirements and limits. They should not be assumed to be active or applicable to every tool; shell isolation does not automatically cover all hooks, MCP servers, and related processes either. [Credentials and sandboxing](https://code.claude.com/docs/en/sandboxing), [isolation scope](https://code.claude.com/docs/en/sandbox-environments).

The wrapper must be a verifiable interface, never a disguise for getting a rejected command through.

## Unblocking a permission requires checking current conditions

In this case, authorized operations on an environment named Development were classified as Production Deploy. Some blocks were resolved through authorized decisions and narrowly scoped adjustments. That does not make the operation harmless: LIVE surfaces were involved.

**LIVE describes something someone uses today, not the environment’s product label.**

The opposite risk also emerged: resuming after a block was lifted with stale conditions. During the pause, a lock may have been released, the candidate may have changed, or a STOP instruction may have arrived. A successful postflight does not retroactively fix that missing control.

Before continuing, review subsequent messages and restrictions, confirm scope and identity, reacquire any necessary exclusive access, and renew checks that may have expired. In a multiagent system, communicating an authorization to the coordinator does not automatically update its workers’ open sessions either.

To diagnose a rejection, record the action, destination, effect, and the layer that produced it, without sensitive arguments. If the scope is insufficient, clarify it with the task owner; if an identity lacks access, seek the minimum role; if an explicit rule applies, review it with whoever is authorized to change it. An apparently incorrect classification must be checked against evidence and corrected through an authorized route.

Changing the command, path, or agent to obtain the same prohibited effect circumvents the boundary. A valid alternative must be materially safer or have an authorized decision approving the boundary change. [Auto-review criteria](https://learn.chatgpt.com/docs/sandboxing/auto-review).

## Reaching LIVE requires a prepared handoff

The reviewed operating policy separates four states that are often conflated:

| State | What it establishes | What remains to be demonstrated |
| --- | --- | --- |
| Prepared locally | Tests, parity where applicable, rollback, and candidate audit | Receipt by the integrator and authorization to apply |
| Received and integrated | Intake and incorporation of the candidate | Remote application and outcome |
| Applied and verified | Execution and immediate postflight | Acceptance of the next natural cycle, if part of the commitment |
| Accepted | Evidence of the committed outcome | Does not authorize another task or expand scope |

The coordinator cannot announce “ready for the window” based solely on its own “ready locally.” It must cross-check that claim against the integrator’s receipt, PR status, and cross-audit. Permission to apply remains independent.

If part of the original acceptance is missing, the task stays open unless its scope is explicitly reduced. A HOLD must state what is missing, who can resolve it, and what independent work can continue. This avoids both unnecessarily stopping every workstream and presenting an incomplete package simply because the scheduled time has arrived.

### What a gate actually guarantees

The reviewed implementation adds a concrete control to the deployment wrappers: a closed-schema JSON declaration containing a ready status, a passed audit, a delta identifier, and parity and rollback references. It rejects pending, incomplete, or invalid declarations, while retaining an explicit, temporary transition for certain previously applied packages.

The code, tests, and version-controlled audits were cross-checked, without running a new deployment or rerunning those tests. The control reduces the ambiguity of free-form prose, but has an important limit: **validating the structure of a record does not prove its contents are true**.

In that code, the audit identifier is validated for format, not for existence or correspondence with the current candidate. The parity and rollback references do not run the checks they refer to either. Consistency between the evidence and the change still depends on coordination and auditing.

The precise conclusion is that the wrapper prevents certain incomplete declarations from being accepted. It does not guarantee full readiness. Binding verifiable receipts to the audited artifact and checking that they remain valid would be a possible hardening measure, still only proposed. It would not replace behavioral tests or acceptance through the natural cycle either.

## Validating the contract before trusting it

A successful execution proves one path, not its boundaries. It is worth validating the contract like an API:

- **Positive tests:** the capability works with a minimum-privilege identity, in the intended session and environment, without improvised intervention or secrets in the output.
- **Negative tests:** it rejects other projects, destinations, parameters, and out-of-scope effects. Test these in a controlled environment, without exfiltrating real secrets or trying dangerous mutations in production.
- **Lifecycle tests:** it responds correctly to pauses, revocation, STOP, and changes to the executable artifact.

Rule-matching tests help review matching behavior; they do not certify the security of the authorized program. [Testing rules in Codex](https://learn.chatgpt.com/docs/agent-configuration/rules).

Useful outcome measures include confirmed false positives, unplanned interventions, executions with expired preconditions, and packages returned for missing evidence. Counting only how many questions were avoided rewards autonomy that may be shifting the problem into production.

## A clear path with verifiable boundaries

This pattern is useful when multiple identities, tools, or delivery stages are involved. It requires maintaining controls and evidence, so start with the highest-impact capabilities rather than multiplying documents for every command.

The case already shows integrated documentation and executable controls. What remains is to validate the effective configuration for each session and repository, its positive and negative boundaries, and a complete delivery in which the audited candidate matches what was received, applied, and accepted.

**The Golden Path does not remove gates: it makes them correspond to real risks.** Permission allows progress within a scope; a control reduces specific errors; evidence demonstrates when the work is ready to reach LIVE.

### Further reading on Golden Path

- [Guided models: the environment is the policy](/en/entrada/modelos-guiados-el-entorno-es-la-politica).
- [Comparing CLI harnesses](/en/entrada/comparar-harness-cli-codex-claude-opencode-cline).
- [Orchestration in Orca](/en/entrada/orquestacion).
- [Read-only as an architectural decision](/en/entrada/arquitectura-read-only).
