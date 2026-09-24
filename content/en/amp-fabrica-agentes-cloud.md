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

> Editorial validity: September 13, 2026. Amp states a frontier philosophy with no commitment to backward compatibility; models, routing, pricing and features can change quickly.

Amp is not interesting because it invented yet another agent capable of editing files. That space is already crowded. What is appealing is that it tries to turn everything around the agent into a product: the machine where it works, the context it keeps, the repository it modifies, the tests it runs, the agents it coordinates and the continuity needed to finish even when the user’s computer is off.

In other words, Amp sells a tidy version of a factory that many teams still assemble by hand with CLIs, worktrees, persistent sessions, servers and a good deal of operational discipline.

## The agent does not work in a vacuum

A conversation can produce a good idea, but real development requires an environment. You have to clone code, install dependencies, run services, inspect CI, test the application and return reviewable changes.

Amp gathers those pieces around its **Threads** and **Orbs**. A Thread keeps the conversation and the work; an Orb is an isolated remote machine, created for that thread, with its own copy of the repository and its tools. It can keep running when the user closes the laptop, go to sleep when idle and wake up later with files, services and history available.

The novelty is not in any single piece. It is in treating them as a single operating unit:

**agent + context + machine + code + evidence**.

That combination lets you ask for something more demanding than “write this function”. You can ask it to implement the change, bring the system up, test it end to end and leave a branch or pull request with evidence attached.

## The Dial: choose effort before brand

Amp organizes capability through a four-level selector: `low`, `medium`, `high` and `ultra`. The idea is to choose by difficulty and the cost of being wrong, not to fall in love with a model’s name.

| Mode | Practical reading |
|---|---|
| `low` | Small changes, tests and refactors with an obvious outcome |
| `medium` | Everyday development with some ambiguity or several steps |
| `high` | Delicate work that should arrive close to a final review |
| `ultra` | Architecture, migrations and open problems across several systems |

Behind each position, Amp can combine a main model, reasoning level, tools, instructions, subagents and an **Oracle** that provides a second opinion. Automatic routing changes when better models appear, while the intent of the mode stays stable.

The abstraction is healthy: an organization should not rewrite its policy every time the provider ranking changes. “Use high capability when a subtle omission would be expensive” ages better than “always use model X”.

That said, Amp does not force you to hand over all control. You can pin models and effort separately for the main agent, the Oracle and the subagents, and define custom modes through plugins.

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
| Model selection | Explicit and granular per tool | Routing by difficulty, with the option to pin it |
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

Amp separates the use of agents and tools from the compute cost of Orbs. You can connect compatible subscriptions, use your own keys or spend Amp credits. Orbs are billed per minute by CPU and memory and stop costing money while paused.

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
- [The Dial](https://ampcode.com/docs/the-dial)
- [Modes & Models](https://ampcode.com/docs/models-and-subagents)
- [Orbs](https://ampcode.com/docs/orbs)
- [Agent to Agent](https://ampcode.com/docs/orbs/agent-to-agent)
- [GitHub & Git](https://ampcode.com/docs/github)
- [Automations](https://ampcode.com/docs/orbs/automations)
- [Pricing](https://ampcode.com/docs/pricing)
