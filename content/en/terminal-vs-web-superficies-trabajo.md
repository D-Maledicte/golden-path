---
slug: terminal-vs-web-superficies-trabajo
title: CLI vs. web — the agent inside the project
type: concept
order: 11
summary: "The terminal does not make the model smarter: it places it inside the system it has to understand, modify and verify. The web keeps the edge for thinking, researching and communicating."
tags: [cli, web, terminal, agents, codex, claude-code, opencode, worktrees]
related: [agent-terminals, modelos-guiados-el-entorno-es-la-politica, workspaces-y-worktrees, orquestacion]
area: Gobierno de agentes
glyph: ⌨
hue: rgba(87,217,232,.22)
---

# CLI vs. web — the agent inside the project

## It is not an intelligence contest

Working from Codex, Claude Code or OpenCode in a terminal does not make the model more capable than the one chatting on the web. It changes its **position relative to the work**.

In a web conversation, the model usually receives a question, files the person chose or a copy of the context. In a CLI, the agent can inhabit the repository: read its current state, inspect history, modify files, run commands and observe the result.

The useful difference is not *chat versus code*. It is **handed-over context versus verifiable context**, and **recommendation versus execution loop**.

> The web is a great workbench. The terminal is the workshop wired to the machine.

## What the terminal really enables

### A closed loop

The CLI can go through a complete sequence without a person copying each result:

1. inspect the repository;
2. form a hypothesis;
3. edit on a branch or worktree;
4. run tests, lint or build;
5. read errors and fix them;
6. review the diff;
7. leave a traceable change.

That feedback shrinks the gap between what the model believes and what the system does. A convincing answer can be wrong; a test run against the project provides evidence.

### Native project context

From the terminal, the agent can access —if the environment allows it—:

- the repository’s real structure and files;
- the exact version of dependencies and runtime;
- Git state, branches and worktrees;
- persistent instructions such as `AGENTS.md` or `CLAUDE.md`;
- existing scripts, linters, tests and generators;
- internal tools, hooks, skills and MCP servers;
- logs and development services.

There is no need to manually compress all of that into a prompt. The agent can discover it and cite its evidence.

### Composition and repeatability

A CLI plugs into pipes, scripts, CI, scheduled tasks and non-interactive processes. It also lets you repeat the same method across sessions: prepare a worktree, run an audit, validate a result and produce an artifact.

That makes it especially valuable for a coordinator–workers setup: one terminal keeps the global view and others solve bounded tasks in isolated spaces.

## Where the web is still better

Web interfaces like ChatGPT or Claude are an especially comfortable surface for:

- turning an ambiguous hunch into a well-framed problem;
- researching and cross-checking documentation;
- working with images, documents and heterogeneous sources;
- exploring options before touching a repository;
- writing explanations, proposals and editorial pieces;
- sharing a conversation or result without preparing a local environment;
- delegating long tasks to a cloud agent when the repository is not available locally.

The line is not absolute either. Modern web experiences can connect repositories and run remote agents; CLIs can converse, research and produce documentation. The right question is **where the authoritative context lives and where it makes sense to close the loop**.

## Quick decision map

| Work | Suggested surface | Why |
|---|---|---|
| Explore an idea or compare approaches | Web | Broad conversation and a mix of sources |
| Understand a repo’s exact behavior | CLI | Access to real state and tools |
| Implement a multi-file change | CLI in a worktree | Editing, tests and a traceable diff |
| Produce a portable report or guide | Web, with evidence from the CLI | Better synthesis without losing verification |
| Prototype a visual direction | Web or canvas | More direct visual iteration |
| Integrate the prototype into the product | CLI | Fitting it against components, build and tests |
| Automate a repeatable task | CLI or SDK | Composable, non-interactive execution |
| Operate on production | Human gate and restricted environment | The surface does not replace control |

## The hidden cost of the CLI: authority

The terminal also increases the blast radius. If the process can see SSH keys, cloud tokens, a production database and an unrestricted shell, the agent can act on all of it.

That is why **CLI does not mean safe**. It means close to the system. That closeness is an advantage only when it comes with:

- disposable worktrees or containers;
- minimal, short-lived credentials;
- limited network and hosts;
- explicit `allow`, `ask` and `deny` permissions;
- diff review before merging;
- external blocks on push, deploy and production.

The editorial on [guided models](/en/entrada/modelos-guiados-el-entorno-es-la-politica) develops this idea: instructions steer, but the environment limits.

## The hybrid flow that gets the most out of both

### 1. Frame it on the web

Use the conversation to clarify the goal, audience, constraints, risks and success criteria.

### 2. Discover in a coordinating CLI

Open the project, check the real state and turn the intent into a plan grounded in concrete files, commands and dependencies.

### 3. Execute with isolated workers

Delegate implementations, audits or tests to separate worktrees. Each worker gets a verifiable task and the minimum authority it needs.

### 4. Integrate with evidence

The coordinator reviews diffs, runs the relevant suite and resolves interactions between changes.

### 5. Go back to an editorial surface

Turn the result into a guide, decision or artifact that another person —or their agent— can reuse without inheriting all the operational noise.

## Exit rule

Move from the web to the terminal when the answer depends on the **live state of a system** and needs a loop of inspection, action and verification. Go back to the web when the main value lies in **understanding, deciding or communicating**.

There is no superior surface. There is a surface that is more honest about the task.

## Official sources to go deeper

- [Codex: models and reasoning levels](https://learn.chatgpt.com/docs/models)
- [Claude Code: overview and available surfaces](https://code.claude.com/docs/en/overview)
- [OpenCode: terminal interface](https://opencode.ai/docs/tui/)
- [OpenCode: permissions](https://opencode.ai/docs/permissions/)
