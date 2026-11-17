---
slug: amp-fabrica-agentes-cloud
title: Amp and the cloud agent factory
type: editorial
order: 13
summary: Amp packages agent, machine, context and Git into a single surface. It does not invent multi-agent development, but it turns into a product a practice we usually still build by hand.
tags: [amp, orbs, agents, cloud, orca, github, multi-model, automations]
related: [orquestacion, caso-orca-cockpit-multiagente, workspaces-y-worktrees, guia-escalado-modelos]
area: Gobierno de agentes
glyph: ◌
hue: rgba(87,217,232,.22)
---

# Amp and the cloud agent factory

> Model selector reviewed on November 17, 2026. Amp states a frontier philosophy with no commitment to backward compatibility; models, routing, pricing and features can change quickly.

Amp is not interesting because it invented yet another agent capable of editing files. That space is already crowded. What is appealing is that it tries to turn everything around the agent into a product: the machine where it works, the context it keeps, the repository it modifies, the tests it runs, the agents it coordinates and the continuity needed to finish even when the user’s computer is off.

In other words, Amp sells a tidy version of a factory that many teams still assemble by hand with CLIs, worktrees, persistent sessions, servers and a good deal of operational discipline.

## The agent does not work in a vacuum

A conversation can produce a good idea, but real development requires an environment. You have to clone code, install dependencies, run services, inspect CI, test the application and return reviewable changes.

Amp gathers those pieces around its **Threads** and **Orbs**. A Thread keeps the conversation and the work; an Orb is an isolated remote machine, created for that thread, with its own copy of the repository and its tools. It can keep running when the user closes the laptop, go to sleep when idle and wake up later with files, services and history available.

The novelty is not in any single piece. It is in treating them as a single operating unit:

**agent + context + machine + code + evidence**.

That combination lets you ask for something more demanding than “write this function”. You can ask it to implement the change, bring the system up, test it end to end and leave a branch or pull request with evidence attached.

## Model and effort selector

The [Amp selector](https://ampcode.com/docs/model-selector) lets you pick the model and effort for each thread. **Staff Pick** is a starting point maintained by Amp. When you pick a model, the selector shows its supported effort levels and recommends one. Amp pairs each model with instructions and tools from its harness.

In a model thread, you can change both settings and continue with the next message. The transcript records the switch. When you change models, the first response reads the thread without the old cache, which can make that turn more expensive. Threads started with Claude Code or a plugin agent keep that agent.

For a verifiable change, start at the lowest effort that can reliably pass the tests. If the work gets harder, you can raise effort in the same thread. If you change models, record the switch before comparing cost or quality across runs.

## Two ways to delegate

Amp distinguishes between specialized subagents and full agents running in other Threads.

Internal subagents handle searches, research, reading previous conversations and hard questions for the Oracle. They work with a separate context window and return a summary to the main agent. They keep the central thread clean, although they have clear limits: they do not talk to each other and cannot be steered mid-task.

Delegation between full agents is more ambitious. One agent can start another Thread in an Orb, hand it instructions or files and keep working while it waits for the result. Each thread gets its own conversation, working copy and machine. That enables real fan-out: several investigations, browsers, fixes or projects moving forward in parallel.

The isolation is deliberate. Uncommitted files and changes do not magically appear in the other environments; they have to be transferred or merged explicitly. That friction prevents a fair amount of chaos, but it does not remove the need for a good coordinator.

## Amp versus a cockpit like Orca

Amp and Orca overlap, but they are not exactly the same product.

| Dimension | Cockpit with Orca and CLIs | Amp |
|---|---|---|
| Unit of work | Session, terminal and worktree managed by the user | Thread with a working copy and an isolated Orb |
| Infrastructure | Local machine, WSL, SSH and your own servers | Cloud Orbs, local execution or your own runners |
| Model selection | Explicit and granular by tool | Per-thread model and effort, with Staff Pick as a starting option |
| Coordination | Flexible, visible and hand-built | Built-in delegation between subagents and Threads |
| Continuity | Depends on the processes and hosts you manage | The Orb keeps working and pauses automatically |
| GitHub | Credentials and flow from the local environment | GitHub App, short-lived tokens, branches, PRs and CI built in |
| Platform dependence | Lower: interchangeable pieces | Higher: Orbs, Threads and coordination live in Amp |

Orca works especially well as a **cockpit**. It lets you watch several tools, deliberately choose which CLI and which provider fills each role, step into sessions and keep control over the infrastructure.

Amp works more like a **managed factory**. It delivers disposable remote environments, continuity, isolation and a direct path from the brief to a PR. It cuts operational work in exchange for accepting more of the platform’s decisions and infrastructure.

There is no universal winner. There are two different preferences: governing every piece or buying an execution unit that is already solved.

## GitHub as the control boundary

The GitHub integration is designed to work without spreading permanent tokens inside each Orb. Amp uses a GitHub App and hands out short-lived credentials when Git or `gh` need to talk to it. It can clone private repositories, create branches and pull requests, check CI and sign commits; protection rules still apply as if the user were acting.

It is a reasonable foundation for teams, but the caution stays the same: start with selected repositories, minimal permissions and protected branches. An agent having an isolated machine does not mean it should get access to the whole organization.

## Automating with memory

Amp automations let a Thread wake up once or on a schedule while keeping its history. It can check errors every hour, watch a long process, verify CI after a change or remind you to retire a feature flag.

That is more expressive than an isolated cron job because the agent picks up earlier decisions and evidence. It is also riskier if the brief is vague or the permissions are broad. An agentic automation needs:

- a defined source of evidence;
- minimal permissions;
- an explicit completion condition;
- limits on what it can modify;
- a clear channel for escalating uncertainty.

Continuity does not replace governance. It makes it more important.

## The real cost is not just the model

The [current pricing](https://ampcode.com/docs/pricing) combines monthly tiers and pay-as-you-go, separating agent and tool usage from the Orb allowance. Orbs are metered by the minute, larger sizes use more allowance, and paused Orbs cost nothing.

The selector shows what pays for each model: an eligible subscription, your own API key, or Amp credits. Check the active connection and machine charges separately. A ChatGPT subscription can cover use of OpenAI models, and a Claude subscription lets you start a thread with the Claude Code agent. [Billing in the model selector](https://ampcode.com/docs/model-selector#who-pays).

To evaluate the product, comparing price per token is not enough. You have to measure:

1. time from the brief to a reviewable PR;
2. number of human corrections afterward;
3. percentage of tasks solved on the first try;
4. cost of model, tools and machine;
5. operational work a person no longer has to do;
6. how easy it is to audit how the change came about.

A cheap agent that needs three rounds is not necessarily economical. An Orb that costs cents can save an hour of setup or, if it is oversized and poorly controlled, add spend without improving the result.

## A sensible adoption

Amp should not replace a multi-agent environment that already works overnight. A useful trial is bounded:

- a non-critical repository;
- GitHub access restricted to that repository;
- a medium-sized feature with acceptance criteria and tests;
- a small or medium Orb;
- a comparison against the same kind of task done in the usual cockpit.

The first good fits are self-contained features that end in a PR, long investigations you would rather not run locally and parallel tasks across repositories. Production, broad secrets and automations with the ability to mutate things should come after validating real behavior.

## Verdict

Amp does not remove the need to think about how agents work. It makes that visible as a product.

Its strongest contribution is not promising a miracle model, but recognizing that the quality of agentic development depends as much on the environment as on intelligence: isolation, continuity, tools, permissions, coordination and evidence.

For someone who already built a hand-made cockpit, Amp may feel less like a revolution and more like industrialization. The question is not whether it can write code. The question is how much control is worth keeping and how much operational work is worth delegating to the platform.

---

## Official sources

- [Introduction to Amp](https://ampcode.com/docs)
- [Model Selector](https://ampcode.com/docs/model-selector)
- [Modes & Models](https://ampcode.com/docs/models-and-subagents)
- [Orbs](https://ampcode.com/docs/orbs)
- [Agent to Agent](https://ampcode.com/docs/orbs/agent-to-agent)
- [GitHub & Git](https://ampcode.com/docs/github)
- [Automations](https://ampcode.com/docs/orbs/automations)
- [Pricing](https://ampcode.com/docs/pricing)
