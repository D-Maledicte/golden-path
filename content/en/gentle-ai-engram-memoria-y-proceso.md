---
slug: gentle-ai-engram-memoria-y-proceso
title: "Gentle AI and Engram: memory and process for coding agents"
type: editorial
order: 14
summary: "What an environment configurator contributes and what persistent memory solves when agent work spans sessions, tools and projects."
tags: [gentle-ai, engram, memory, agents, governance, workflow]
related: [orquestacion, continuidad-y-observabilidad, modelos-guiados-el-entorno-es-la-politica]
area: Gobierno de agentes
glyph: ◈
hue: rgba(168,106,255,.24)
---

# Gentle AI and Engram: memory and process for coding agents

## The problem does not begin when the agent makes a mistake

An agent can complete a task and, in a new session, ask again about decisions the team already made. It can also recall an obsolete rule, apply a heavyweight process to a tiny change, or deliver code without verifiable evidence. These are different failures: continuity, context freshness and proof of the result.

The [Gentleman Programming](https://gentlemanprogramming.com/) ecosystem offers two related pieces. **Gentle AI** configures the coding agents you already use with memory, workflow, skills and review components. **Engram** supplies persistent memory that different agents can query. One organizes the environment; the other carries knowledge across sessions. You can evaluate either without adopting the whole ecosystem.

## Gentle AI: configuring how work gets done

[Gentle AI](https://github.com/Gentleman-Programming/gentle-ai) is a configurator, not a model or a new agent. It prepares integrations for tools such as Claude Code, OpenCode and Codex, with components and presets that let you choose how much governance the environment needs. Its [intended usage guide](https://github.com/Gentleman-Programming/gentle-ai/blob/main/docs/intended-usage.md) describes **Organic Driven Development (ODD)** as the everyday path: inspect the project, keep understood changes lightweight, verify the outcome and leave a recoverable feature record when work grows.

That proportionality matters. If fixing a label requires the same ritual as migrating a module, the team eventually ignores the ritual. For larger work, a feature record and current progress let another session resume without reconstructing everything from commits and chats.

| Layer | Question it answers | Expected evidence |
| --- | --- | --- |
| Configuration | Which tools and rules does this agent have? | Installed components and environment diagnosis |
| Process | How is this task explored, implemented and resumed? | Scope, decisions and current state |
| Verification | Which behavior was checked? | Relevant tests, review or checks |
| Memory | What should the next session retrieve? | Observations with context and project |

Review and TDD modes can add a useful barrier, but their value depends on the change and the quality of the tests. A tidy workflow does not turn a superficial check into evidence.

## Engram: remember decisions instead of recording everything

[Engram](https://github.com/Gentleman-Programming/engram) is a local memory system for agents, built as a Go binary with SQLite and full-text search. It exposes a CLI, MCP server, HTTP API and TUI. An agent can save and search observations about decisions, discoveries, fixed bugs and project conventions. The documentation describes **curated memory**, not an indiscriminate log of every conversation.

Suppose a portal treats long CRM IDs as strings to avoid precision loss in JavaScript. After a session, saving “CRM IDs remain strings in the API, sorting and exports; inspect the adapter before normalizing them” is more useful than retaining a hundred messages where the subject appeared. The next session can retrieve the decision, check that it still matches the code and proceed.

That last check is essential. A memory is a clue with provenance, not a higher-priority instruction or the repository's source of truth. If the contract changes, update or replace the observation. Engram groups memories by project and offers optional sync, which also means deciding who can write, what may be stored and how conflicting decisions are resolved.

## A sweet spot for a multi-agent environment

When a coordinator delegates to different models, each worker should receive only the context it needs: goal, boundaries, repository state and relevant decisions. Engram can help retrieve those decisions; Gentle AI can provide repeatable configuration and workflow. Coordination and permission to change things still belong to the system directing the work and the people accountable for it.

A practical pilot would be:

1. Pick **one repository** with decisions that regularly need explaining again.
2. Save a few useful observations: contracts, conventions, difficult bugs and architectural reasons. Link them to current code or documentation.
3. Have the agent search at the start and **verify every retrieved memory** before using it.
4. Across several tasks, measure repeated explanations avoided, relevant memories retrieved and stale ones found.
5. Add workflow or review components only where the frequency and risk of changes warrant them.

The number of saved memories is a poor success measure. The useful signal is whether the next person or agent makes a sound decision with less reconstruction and visible evidence.

## The limit that determines whether it helps

Persistent memory has its own debt: obsolete information that sounds persuasive. Process can become bureaucracy when applied without regard to scale. Keep **memory**, **current state**, **proof** and **permission** separate. An observation alone does not authorize a production write; a checklist does not prove the right command ran.

Gentle AI and Engram are worth examining when the real pain is repeatedly explaining context, losing decisions between tools or struggling to resume delegated work. Testing them separately with simple measures can give the environment continuity without turning every task into a ceremony.
