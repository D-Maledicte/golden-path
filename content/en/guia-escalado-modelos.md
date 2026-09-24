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

> Editorial validity: September 12, 2026. Names, limits and catalogs change; check the official model pages before turning this guide into policy.

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

## OpenAI: Luna, Terra, Sol and Astra

| Model | Suggested role | Recommended tasks | When to move up |
|---|---|---|---|
| GPT-5.6 Luna | Fast, cheap worker | Search, classification, transformations, summaries, tests, documentation and verifiable local changes | The task stops being linear or needs judgment across files |
| GPT-5.6 Terra | Everyday generalist | Normal implementation, moderate debugging, analysis and coordinating a few pieces | It loses dependencies, needs more autonomy or mistakes are expensive |
| GPT-5.6 Sol | Senior worker or coordinator | Complex code, research, tool use and open problems with several constraints | Even with high reasoning it cannot carry the work end to end |
| GPT-6 Astra | Coordinator and judge for the hardest demands | Architecture, extensive synthesis, ambiguous decisions, deep research and long workflows | Reserve it for the hard tail, not as the default |

### When to go from Luna to Sol

Luna is ideal when the task contract fits in a few sentences and the result has a clear check. Before jumping straight to Sol, Terra is usually the natural step for everyday work that already needs interpretation.

Move to Sol when several of these signals show up:

- the change cuts across multiple layers of the system;
- you have to choose between alternatives and explain tradeoffs;
- tests do not fully describe success;
- the agent has to recover from unexpected findings;
- several workers depend on a central decision.

Astra is justified when the problem combines breadth, ambiguity and consequences: it must not only write well, but preserve coherence over a long process and judge the whole.

## Claude: Haiku, Sonnet, Opus and Fable

| Model | Suggested role | Recommended tasks | When to move up |
|---|---|---|---|
| Claude Haiku 4.5 | Fast worker | Classification, extraction, repetitive changes, bounded subagents and high-volume tasks | Consistency is lacking or the work needs reasoning across several pieces |
| Claude Sonnet 5 | Balanced default | Everyday development, analysis, content, tool use and medium-scope agents | The horizon gets longer or the cost of wrong judgment rises |
| Claude Opus 5 | Senior coordinator | Complex agentic coding, broad planning, critical review and high-impact decisions | Opus at high effort still does not close the problem |
| Claude Fable 5.1 | Frontier for the hard tail | Very demanding reasoning and long-horizon agentic work | Use selectively and measure whether it improves the resolution rate |

### When to go from Haiku to Sonnet and from Sonnet to Opus

Haiku works best as an executor of small, checkable units. Sonnet is the general starting point when the task needs to understand intent as well as follow instructions.

Move from Sonnet to Opus when:

- the task does not decompose cleanly;
- it needs to hold many constraints for a long time;
- it coordinates other agents or evaluates their results;
- a plausible mistake can spread through the design;
- retries with Sonnet cost more than one good run with Opus.

Anthropic’s documentation recommends trying more `effort` first when the model has that option. If Opus at its highest levels is not enough, Fable is currently the next step for frontier problems.

## What the reasoning level means

The reasoning level is a deliberation budget, not a magic intelligence multiplier. In general, more reasoning means more time and more tokens, and lets the model explore hypotheses, revisit decisions and hold intermediate steps.

| Conceptual level | Use it for | Avoid it when |
|---|---|---|
| Low or light | Local edits, direct questions and tasks with an obvious path | There is ambiguity or several constraints in tension |
| Medium | Daily development, moderate debugging and reversible decisions | The task is trivial or extremely complex |
| High or extra high | Architecture, elusive bugs, migrations and multi-file synthesis | The result is verified with a simple transformation |
| Max | A single model needs to exhaust a hard investigation | The task could be split better across agents |
| Ultra | The work splits naturally and it pays to delegate to subagents | There is a single indivisible piece or lots of accidental coordination |

In OpenAI, `Max` gives the same model more time; `Ultra` enables a strategy with automatic delegation. In Claude, behavior depends on the model: adaptive thinking and `effort` are soft controls, and Haiku 4.5 supports extended thinking but not the `effort` parameter.

Two warnings:

- high reasoning does not replace context, tools or tests;
- showing the *thinking* text does not, on its own, change how much the model reasons. In OpenCode, `/thinking` controls the display and the model variants control the actual reasoning.

## OpenCode Go: a practical map of the catalog

OpenCode Go brings models from several providers together in a single plan. The following table is an **editorial starting heuristic**, not an official OpenCode benchmark. It groups the current catalog by the kind of work worth evaluating first in our coordinator–workers setup.

| Current family in Go | Suggested starting point | Initial role |
|---|---|---|
| Grok 4.6 | Independent review, broad reasoning and second opinion | Selective coordinator or reviewer |
| GLM 5.3 Flash, 5.3, 5.2, 5.1 | 5.3 Flash for bounded work; 5.3 for planning and cross-cutting changes | Cheap worker; 5.3 as escalation |
| GPT-5.6 Luna | Implementation, refactors, tests and verifiable documentation | General worker |
| Kimi K3, K2.7 Code, K2.6 | K2.7 Code for code; K3 for synthesis and more demanding tasks | Code worker; K3 selectively |
| LongCat 2.0 | Simple maintenance, batches and repeatable tasks | Volume worker |
| MiMo V2.5 and V2.5 Pro | V2.5 for cheap, checkable tasks; Pro when more judgment is needed | Cheap worker |
| MiniMax M3 and M2.7 | M3 as a generalist; M2.7 as an evaluated fallback | General worker |
| Muse Spark 1.3 and 1.2 Contributor | Implementation, tests and docs with a well-defined scope | Bounded contributor |
| Qwen3.8 Max, 3.8 Flash, 3.7 Max, 3.7 Plus, 3.6 Plus | 3.8 Flash for volume; 3.8 Max for planning and review | Worker or reviewer depending on the variant |
| DeepSeek V4.1 Flash, V4 Pro, V4 Flash, V4 Flash Vision Exp | V4.1 Flash for routine work; Pro for debugging/review; Vision for visual inputs | Specialized worker |
| Hy4 preview and Hy3 | Hy4 only in an evaluation sandbox; Hy3 after a test against the repo | Experimental or evaluated worker |

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
- [OpenCode Go: current models, pricing and limits](https://opencode.ai/docs/go/)
- [OpenCode: TUI and reasoning variants](https://opencode.ai/docs/tui/)
