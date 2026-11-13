---
slug: guia-escalado-modelos
title: Choosing a model and reasoning level
type: guide
order: 12
summary: A practical guide to assigning coordinators and workers, raising reasoning before paying for a bigger model and scaling up when a real capability gap appears.
tags: [models, reasoning, openai, claude, opencode-go, coordinator, workers]
related: [orquestacion, terminal-vs-web-superficies-trabajo, modelos-guiados-el-entorno-es-la-politica, caso-orca-cockpit-multiagente]
area: Gobierno de agentes
glyph: △
hue: rgba(168,106,255,.24)
---

# Choosing a model and reasoning level

> Reviewed on November 12, 2026. Names, limits and catalogs change; check the official model pages before turning this guide into policy. Recommendations are editorial heuristics, not our own benchmarks.

## The decision does not start with the brand

Choosing a model means assigning capability to a task. Before looking at the selector, answer:

1. Is the task well specified?
2. Can the result be verified automatically?
3. How much context and how many dependencies must it hold?
4. Does a mistake cost a local fix or a wrong architecture decision?
5. Does it need to produce work, coordinate it or judge it?

A worker with a bounded goal, clear tests and little context does not need the biggest model. A coordinator that has to keep the intent, spot conflicts between five changes and decide what to merge can justify it.

The economic rule is **cost per solved task**, not cost per token. A cheap model that gets into loops, fails tests or needs three retries can end up more expensive than a better one used once.

## The right ladder

Before switching families or moving up to the premium model:

1. improve the specification and acceptance criteria;
2. reduce the scope or split the work;
3. provide the missing tools and context;
4. raise the reasoning level one notch;
5. only then scale up the model.

Raising reasoning helps when the model **can** solve the problem but needs to explore more. Moving up a model helps when there is a **capability gap**: it misses relationships, cannot hold the horizon, misjudges tradeoffs or repeats the same kind of mistake.

## OpenAI: four profiles, not a single ladder

| Model | Suggested role | Recommended tasks | When to move up |
|---|---|---|---|
| GPT-6 Luna | Fast, efficient worker | Extraction, summaries, tests, documentation and verifiable local changes | The task needs sustained judgment across files |
| GPT-6.1 Terra | Fast writing and visual-work specialist | Proposals, charts, screenshots and work in supported apps | The task needs more sustained reasoning or complex integration |
| GPT-6.1 Sol | Strong generalist or coordinator, when available | Complex code, research, tool use and agentic workflows with several constraints | Even with high reasoning it cannot carry the work end to end |
| GPT-6 Astra | Coordinator and judge for the hardest demands | Architecture, extensive synthesis, ambiguous decisions, deep research and long workflows | Reserve it for the hard tail, not as the default |

### When to go from Luna to Sol

Luna is ideal when the task contract fits in a few sentences and the result has a clear check. Sol is the next step for work that needs interpretation, autonomy and coordination.

Move to Sol when several of these signals show up:

- the change cuts across multiple layers of the system;
- you have to choose between alternatives and explain tradeoffs;
- tests do not fully describe success;
- the agent has to recover from unexpected findings;
- several workers depend on a central decision.

Astra is justified when the problem combines breadth, ambiguity and consequences: it must not only write well, but preserve coherence over a long process and judge the whole.

Terra is not a mandatory step between Luna and Sol: choose by workload. Try Terra for interpreting a dashboard and drafting a proposal, Sol for complex cross-component changes, and Astra for ambiguous end-to-end decisions. These are starting heuristics, not guarantees.

GPT-6.1 Terra requires Codex CLI 0.159.0 or later (`codex -m gpt-6.1-terra`). GPT-6.1 Sol has a default context window of 500,000 tokens in Codex and ChatGPT Work; that is not a usage allowance or a substitute for context selection. Availability depends on plan, client and workspace. These recommendations apply to Work and Codex, not necessarily Chat. [Models and availability](https://learn.chatgpt.com/docs/models?surface=app).

## Claude: Haiku, Sonnet, Opus and Fable

Haiku 5.5 was released on October 7 and Sonnet 5.5 on September 28, 2026. These are Anthropic catalog versions; each provider and harness must expose them separately. [Haiku](https://platform.claude.com/docs/en/models/haiku-5-5/overview) · [Sonnet](https://platform.claude.com/docs/en/models/sonnet-5-5/overview).

| Model | Suggested role | Recommended tasks | When to move up |
|---|---|---|---|
| Claude Haiku 5.5 | Fast worker | Classification, extraction, repetitive changes, bounded subagents and high-volume tasks | Consistency is lacking or the work needs reasoning across several pieces |
| Claude Sonnet 5.5 | Balanced default | Everyday development, analysis, content, tool use and medium-scope agents | The horizon gets longer or the cost of wrong judgment rises |
| Claude Opus 5.5 | Senior coordinator | Complex agentic coding, broad planning, critical review and high-impact decisions | Opus at high effort still does not close the problem |
| Claude Fable 5.2 | Frontier for the hard tail | Very demanding reasoning and long-horizon agentic work | Use selectively and measure whether it improves the resolution rate |

### When to go from Haiku to Sonnet and from Sonnet to Opus

Haiku works best as an executor of small, checkable units. Sonnet is a practical starting point when the task needs to understand intent as well as follow instructions. Anthropic currently recommends starting with Opus 5.5 for most workloads; this guide instead prioritizes cost per accepted task in a worker orchestration.

Move from Sonnet to Opus when:

- the task does not decompose cleanly;
- it needs to hold many constraints for a long time;
- it coordinates other agents or evaluates their results;
- a plausible mistake can spread through the design;
- retries with Sonnet cost more than one good run with Opus.

Anthropic’s documentation recommends trying more `effort` first when the model has that option. If Opus at its highest levels is not enough, Fable is currently the next step for frontier problems.

Fable 5.2, released November 9, replaces 5.1 as the frontier reference. Its specifications list 1M context, 128K maximum output, and base API prices of USD 8/40 per million input/output tokens, before caching, batch or other terms. Adaptive thinking is always on. **It requires 30-day data retention and is not available under ZDR unless Anthropic expressly authorizes it**: it is not a transparent replacement for a zero-retention workflow. [Fable 5.2 specifications](https://platform.claude.com/docs/en/models/fable-5-2/overview).

## What the reasoning level means

The reasoning level is a deliberation budget, not a magic intelligence multiplier. In general, more reasoning means more time and more tokens, and lets the model explore hypotheses, revisit decisions and hold intermediate steps.

| Conceptual level | Use it for | Avoid it when |
|---|---|---|
| Low or light | Local edits, direct questions and tasks with an obvious path | There is ambiguity or several constraints in tension |
| Medium | Daily development, moderate debugging and reversible decisions | The task is trivial or extremely complex |
| High or extra high | Architecture, elusive bugs, migrations and multi-file synthesis | The result is verified with a simple transformation |
| Max | A single model needs to exhaust a hard investigation | The task could be split better across agents |
| Ultra | The work splits naturally and it pays to delegate to subagents | There is a single indivisible piece or lots of accidental coordination |

In Codex, `Max` gives the same model more time; `Ultra` can delegate to subagents. GPT-6 Luna supports up to Max, without Ultra. In Claude, behavior depends on the model: adaptive thinking and `effort` are soft controls. Haiku 5.5 supports adaptive thinking and `effort`, unlike Haiku 4.5. [Haiku 5.5 specifications](https://platform.claude.com/docs/en/models/haiku-5-5/overview).

### Calibrate per model instead of copying settings

For Work and Codex, OpenAI recommends starting Sol at the client's default effort, Luna at `High`, and Astra at `Light` (`low` in the CLI). Increase it when evaluation shows insufficient planning or checking. [Official guidance](https://learn.chatgpt.com/docs/models?surface=app).

Claude uses `low`, `medium`, `high`, `xhigh` and `max`, without exact equivalence to Codex presets. Haiku 5.5 defaults to `medium`; Sonnet 5.5 defaults to `high`, but start well-specified agentic coding at `medium`. Opus 5.5 defaults to `medium`. Start Fable 5.2 at `high`, try `xhigh` for especially demanding long-running work, and reserve `max` for measured quality gains that justify the time and tokens. Re-evaluate effort when upgrading versions. [Claude effort](https://platform.claude.com/docs/en/build-with-claude/effort).

Two warnings:

- high reasoning does not replace context, tools or tests;
- showing the *thinking* text does not, on its own, change how much the model reasons. In OpenCode V2, `provider/model#variant` selects options such as effort or token budget; names and effects depend on model and provider. [Variants](https://opencode.ai/v2/docs/models/).

## OpenCode Go: a practical map of the catalog

As of November 12, OpenCode offers Go (USD 10/month), Go Plus (USD 40/month) and Go Teams (USD 20/member/month). Go and Plus serve single-member workspaces; Teams covers multi-member workspaces with individual allowances, excluding service accounts. The following table is an **editorial starting heuristic**, not a benchmark. Catalog presence does not prove task suitability: evaluate new models against your repository before assigning stable roles. [Plans and catalog](https://dev.opencode.ai/docs/console/go/).

| Go catalog options | Suggested starting point | Initial role |
|---|---|---|
| Grok 4.7 | Independent review and second opinion | Selective reviewer |
| GLM 5.3 Flash, 5.3, 5.2 | 5.3 Flash for bounded work; 5.3 for planning and cross-cutting changes | Cheap worker; 5.3 as escalation |
| GPT-6 Luna and GPT-5.6 Luna | GPT-6 Luna for implementation, refactors, tests and verifiable docs; 5.6 as a tested fallback | General worker |
| Gemini 4 Argon | Compare on real tasks before assigning a stable role | Under evaluation |
| Kimi K3.1 Pro, K3, K2.7 Code | K2.7 Code for code; evaluate K3.1 Pro against K3 on demanding tasks | Code worker; Pro under evaluation |
| LongCat 2.0 | Simple maintenance, batches and repeatable tasks | Volume worker |
| MiMo V2.6 Flash and Pro; V2.5 and Pro | V2.6 Flash for cheap, checkable tasks; Pro when more judgment is needed; V2.5 as fallback | Cheap worker |
| MiniMax M3.1 Flash and M3 | Evaluate Flash on bounded tasks and M3 on broader context | Evaluated general worker |
| Muse Spark 1.3 and 1.2 Contributor (limited regions) | Implementation, tests and docs with a well-defined scope | Bounded contributor |
| Qwen3.8 Max, 3.8 Flash, 3.7 Plus | 3.8 Flash for volume; 3.8 Max for planning and review | Worker or reviewer depending on the variant |
| DeepSeek V4.1 Flash and V4 Pro | Flash for routine work; Pro for debugging and review after evaluation | Specialized worker |
| Hy4, Hy4 preview and Hy3 | Evaluate stable Hy4 separately; keep preview off the critical path | Evaluated or experimental worker |
| Step 5 Preview | Do not assume a preview model is free | Isolated evaluation |
| Beam Free, Iceman Contributor Free and LongCat 2.5 Free | Temporary availability; check regions and training terms before sending data | Temporary experimentation |
| Claude Haiku 5.5 | Extraction, classification and bounded subagents | Volume worker |

Allowances are dollar amounts per model and plan. Five-hour, weekly and monthly windows represent 20%, 50% and 100% of the monthly limit. Request counts are estimates, not guarantees. Responses report `opencode.allowance`. Cheap models can have smaller allowances; free variants and discounts are temporary. Do not base policy on a promotion. [Catalog and limits](https://dev.opencode.ai/docs/console/go/).

### Privacy before capability

Workspace privacy settings apply to Go. By default, paid endpoints that train on requests are blocked and allowed regions are Europe and the United States; the docs describe a Global exception for requests from China in workspaces without saved settings. Owners or admins can enable restricted endpoints. Do not expand regions just to unlock a model without checking the data it will receive.

| Models or family through Go | Declared training use | Declared retention |
|---|---|---|
| Grok 4.7, GPT-6/5.6 Luna, Claude Haiku 5.5 | No | 30 days |
| Gemini 4 Argon, GLM, Kimi, MiMo, Qwen, MiniMax, Hy and LongCat | No | 0 days in the current table |
| Muse Spark Contributor and Iceman Contributor Free | Yes | Not ZDR |
| Beam Free | No | 30 days |
| DeepSeek V4.1 Flash and V4 Pro | No | 0 days under a monthly renewable agreement |

DeepSeek and LongCat 2.5 Free require Global regions; the latter is hosted in China. Muse Contributor requires enabling paid endpoints that train on requests. DeepSeek's ZDR agreement is valid through **November 30, 2026**: recheck before relying on it in policy. These are Go service and endpoint conditions, not universal model properties. [Privacy and restrictions](https://dev.opencode.ai/docs/console/go/#privacy).

### How to use this table without falling in love with the ranking

For each family that looks promising, build a small set of real tasks:

- reading and explaining an architecture;
- a local change with tests;
- a multi-file bug;
- a diff review with planted errors;
- a task that must stop at a sensitive permission.

Measure resolution rate, retries, time, cost and respect for the contract. The final choice can differ per repository: a model that is excellent at coding can be a mediocre coordinator, and a very convincing one can ignore operational limits if the environment does not enforce them.

Older catalog versions are useful as a fallback when an integration or behavior has been validated, but they should not be kept out of inertia. `preview` or `Exp` variants should stay off the critical path until they pass your own evaluation.

## Recommended assignment in an orchestration

| Responsibility | Minimum useful capability | Escalation |
|---|---|---|
| Read-only discovery | Fast model with low reasoning | Move up if it misses important relationships |
| Isolated change with tests | Cheap worker with low or medium reasoning | Improve the contract; then move up the model |
| Multi-file bug | Generalist with medium or high reasoning | Escalate if it repeats failed hypotheses |
| Coordinating several workers | Strong model with high reasoning | Frontier model if it cannot integrate the big picture |
| Security or architecture audit | Strong model plus a second opinion from another family | Escalate on disagreement or incomplete evidence |
| Irreversible action | No model decides alone | Human gate and external enforcement |

## A simple policy to start with

1. Pick the smallest model that can reasonably close the task.
2. Assign workers by verifiable units, not by the model’s prestige.
3. Raise reasoning when exploration is missing; move up the model when capability is missing.
4. Reserve the frontier model for coordination, judgment and hard exceptions.
5. Compare families with the same set of repository tests.
6. Record model, effort, retries and result to learn from real usage.
7. Keep permissions and credentials independent of the chosen model.

The selector is not a hierarchy of employees. It is a gearbox: the best gear is the one that delivers enough control and power without spending complexity where it adds no value.

## Official sources

- [OpenAI: recommended models and reasoning levels](https://learn.chatgpt.com/docs/models)
- [OpenAI: latest model guide](https://developers.openai.com/api/docs/guides/latest-model)
- [Anthropic: current overview of Claude models](https://platform.claude.com/docs/en/models/overview)
- [Anthropic: choosing a model](https://platform.claude.com/docs/en/about-claude/models/choosing-a-model)
- [Anthropic: optimizing for cost and intelligence](https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence)
- [Anthropic: thinking, effort and cost](https://platform.claude.com/docs/en/build-with-claude/thinking-steering-and-cost)
- [Anthropic: Fable 5.2 limits and retention](https://platform.claude.com/docs/en/models/fable-5-2/overview)
- [Anthropic: effort levels by model](https://platform.claude.com/docs/en/build-with-claude/effort)
- [OpenCode Go: current models, pricing, privacy and limits](https://dev.opencode.ai/docs/console/go/)
- [OpenCode V2: models and reasoning variants](https://opencode.ai/v2/docs/models/)
