---
slug: modelos-guiados-el-entorno-es-la-politica
title: Guided models — the environment is the policy
type: concept
order: 10
summary: Working safely with an agent depends less on the model remembering to ask for permission and more on the harness, the operating system and the credentials making it impossible to act outside the intended scope.
tags: [agents, permissions, sandbox, codex, claude-code, opencode, security]
related: [orquestacion, agent-terminals, workspaces-y-worktrees]
area: Gobierno de agentes
glyph: ⚿
hue: rgba(237,195,94,.25)
---

# Guided models — the environment is the policy

## Core idea

A guided model is an agent that is allowed to reason and propose broadly, but whose ability to act is trimmed by an environment designed to require human intervention at the sensitive points.

Safety should not depend on the model “remembering” to ask. An instruction like *ask me before installing anything* improves the expected behavior, but it is not a barrier. If the harness lets it run any command, the process has access to credentials and the network reaches production, the action is still technically possible.

Disaster prevention comes from how well the place where the agent works is built:

- which tools it can invoke;
- which actions require approval;
- which paths it can read or write;
- which network it can reach;
- which credentials exist in its process;
- which branch or worktree it can modify;
- which commands are blocked even if the model asks for them.

The master rule is simple: **instructions steer; the environment limits**.

## The four layers of control

### 1. Instructions

They define intent and method:

- goal;
- scope;
- allowed files;
- actions it must check first;
- required tests;
- stop conditions.

They are essential for producing good work, but they are a soft policy. The model can misread a sentence, forget a restriction after a long conversation or believe an action is an obvious consequence of the goal.

### 2. Harness

The CLI or environment that translates the model’s decisions into real actions: Codex, Claude Code, OpenCode or another agent.

The harness can:

- hide a tool;
- allow it;
- block it;
- ask for approval;
- limit filesystem and network;
- log what happened.

This is the first enforcement layer. If `ssh`, `git push` or an edit are set to `deny`, the model should not be able to turn its intent into that action through the normal tool.

### 3. Execution environment

It includes the operating system, container, sandbox, user, worktree and connectivity.

An agent can have permission to run a shell and still be contained if:

- it runs as an unprivileged user;
- it can only write inside a worktree;
- it has no access to sensitive sockets;
- it cannot reach the Internet;
- production hosts are unreachable from that network.

This layer protects you even when the harness is misconfigured or an unforeseen path appears.

### 4. External authority

The credentials and permissions of the target system:

- a read-only token;
- an SSH key for a development host, not production;
- a database user without write permissions;
- a cloud account without deploy capability;
- branch protection and mandatory review.

It is the last net. Even if the agent escapes the previous layers, it should not hold authority to perform an action it never needed.

## A concrete case: GLM 5.3 from OpenCode

In an OpenCode session with GLM 5.3, the agent could install a library or connect over SSH without asking. It only stopped if the instruction explicitly told it to request permission first.

The behavior is not explained solely by the model’s personality. In OpenCode, most permissions currently start at `allow`; the Build agent has broad access, and both installing dependencies and running `ssh` go through `bash`. If `bash` is enabled, there is no mandatory pause between the decision and the execution.

The instruction “ask me first” added a convention. The environment still allowed acting without it.

The durable solution is not writing a more dramatic threat into the prompt. It is configuring `bash` so sensitive actions are `ask` or `deny`, and removing from the environment the credentials the agent does not need.

## Do not confuse model, provider and harness

Using a model outside OpenAI or Anthropic does not mean being left without controls. If GLM, DeepSeek, Qwen or any other model runs inside OpenCode, tool calls still go through OpenCode and can be subject to its permissions.

What changes is the degree of integration and predictability:

- some models understand the CLI’s approval states better;
- some respect negative instructions more consistently;
- some propose more aggressive actions to complete the task;
- some harnesses offer more sophisticated sandboxes, profiles or reviewers.

That is why the model must not be the boundary. The policy has to survive a change of provider.

## How the different CLIs express control

### Codex

Codex separates two dimensions that are often mixed up:

1. **Sandbox:** what the execution can reach.
2. **Approval policy:** when it must stop and ask for authorization.

The three classic sandbox levels are:

- `read-only`;
- `workspace-write`;
- `danger-full-access`.

But that is not the same as three complete operating modes. Approval is configured separately through policies such as `on-request`, `never` or granular per-category controls. There are also built-in permission profiles such as `:read-only`, `:workspace` and `:danger-full-access`.

The value of this separation is that you can allow editing inside the workspace and, at the same time, require approval for an escalation or flatly reject certain kinds of request.

### Claude Code

Claude Code offers interaction modes such as:

- `default`, shown as Manual;
- `acceptEdits`;
- `plan`;
- `bypassPermissions` when enabled;
- `auto` in versions that support it.

On top of those modes, rules let you classify tools or commands as allow, ask or deny. `bypassPermissions` should not be confused with “working faster”: it removes pauses and only makes sense inside a container or VM where the scope is already controlled from outside.

### OpenCode

OpenCode uses `allow`, `ask` and `deny` permissions, configurable globally and per agent. It can apply rules to editing, shell, access to external directories, web, skills and subagents, even distinguishing commands through patterns.

Its Plan agent restricts edits and bash, but the Build agent starts from a much more permissive profile. The `--auto` mode approves whatever would have been `ask`, although it still respects explicit `deny` rules.

The conclusion is not that OpenCode lacks control. It is that **you have to design it**: its defaults prioritize fluency and do not automatically represent a conservative policy.

## A portable guided-work profile

Rather than memorizing mode names that change between tools, it is better to define stable capabilities.

### Observer

- read the repository;
- search and analysis;
- no editing;
- no mutating shell;
- no private network;
- no write credentials.

Use: discovery, audit, planning and review.

### Guided implementer

- writes only inside the worktree;
- broad read access to the project;
- safe local commands allowed;
- installing dependencies with approval;
- SSH, deploy, push and migrations with approval or blocked;
- no access to production secrets.

Use: everyday development with human intervention on surface-level changes.

### Bounded implementer

- autonomy inside a disposable worktree;
- an allowlist of commands and destinations;
- no access to other repositories;
- no production credentials;
- integration through PR and review.

Use: well-specified tasks that are easy to validate.

### Isolated autonomous

- broad permissions inside a disposable container or VM;
- controlled network;
- minimal, short-lived secrets;
- no direct access to production;
- output through artifacts, commits or PRs.

Use: long jobs where manual pauses cost more than recreating the environment.

## A conservative example for OpenCode

This profile allows local exploration, asks before editing or installing and blocks access that should not happen from a regular worker:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "*": "ask",
    "read": "allow",
    "glob": "allow",
    "grep": "allow",
    "list": "allow",
    "lsp": "allow",
    "edit": "ask",
    "external_directory": "deny",
    "bash": {
      "*": "ask",
      "git status*": "allow",
      "git diff*": "allow",
      "git log*": "allow",
      "rg *": "allow",
      "npm install*": "ask",
      "pnpm add*": "ask",
      "ssh *": "ask",
      "scp *": "ask",
      "rsync *": "ask",
      "docker *": "ask",
      "git push*": "deny",
      "sudo *": "deny",
      "rm -rf *": "deny",
      "*deploy*": "deny"
    }
  }
}
```

OpenCode evaluates rules by match and the last matching rule wins, which is why the catch-all comes first and the exceptions after.

This example is an editorial baseline, not a universal configuration. Each project must declare its safe commands and forbidden operations. A pattern as broad as `*deploy*` can also block innocent commands containing that text; the real policy has to be tested with the CLI and version in use.

## How to prepare an environment before launching the agent

1. Create an exclusive branch and worktree.
2. Choose the capability profile: observer, guided, bounded or isolated.
3. Configure allow, ask and deny in the harness.
4. Run the agent as a user without unnecessary privileges.
5. Remove credentials and variables that do not belong to the task.
6. Limit the network and reachable hosts.
7. Protect merge, deploy and production outside the agent.
8. Test an allowed action, one that should ask and one that is blocked.
9. Only then hand over the real goal.

The negative test is key. Seeing `git status` work does not prove `ssh production` is blocked.

## What the instruction should say even when barriers exist

Enforcement prevents unauthorized actions, but a good instruction reduces pointless attempts and improves reasoning:

```text
You are working in a guided environment.

You may inspect the repository and run read-only local validations.
Before editing, installing dependencies, using a private network or opening an SSH connection,
explain why it is needed and request approval.

Do not push, deploy, run migrations or make external changes.
If a necessary action is blocked, do not look for an alternative route:
stop and hand over the proposed command or change for human review.
```

The most important sentence is **do not look for an alternative route**. A goal-oriented agent can read a block as a technical obstacle it should solve. The instruction makes clear that, in this context, the block is a governance decision.

## Signs of a badly designed environment

- the agent can connect to any host because it inherited every SSH key;
- it can install packages with no lockfile or diff review;
- it knows production secrets for a purely local task;
- a “plan mode” keeps effective shell or editing;
- the only protection is a sentence inside the prompt;
- the same agent can implement, approve, push and deploy;
- the allowed path gets tested, but the block never does;
- switching models forces you to rebuild the whole policy.

## Transferable principle

A good environment does not try to guess whether the model will be obedient. It assumes any model can make mistakes, forget context or chase the goal with too much enthusiasm.

The quality of the model determines how much useful work it produces inside the perimeter. **The quality of the environment determines how much damage it can do outside it.**

## References

- [Codex — configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference)
- [Claude Code — permissions](https://docs.anthropic.com/en/docs/claude-code/permissions)
- [OpenCode — permissions](https://opencode.ai/docs/permissions/)
- [OpenCode — agents](https://opencode.ai/docs/agents)
