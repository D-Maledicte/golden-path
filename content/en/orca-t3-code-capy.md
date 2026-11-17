---
slug: orca-t3-code-capy
title: Orca, T3 Code and Capy — where to coordinate your agents
type: editorial
order: 24
summary: "Three ways to divide work among coding agents. When to keep Orca as your cockpit, what to try in T3 Code, and what to hand off to Capy around a pull request."
tags: [orca, t3-code, capy, orchestration, worktrees, governance]
related: [caso-orca-cockpit-multiagente, orquestacion, enrutamiento-modelo-esfuerzo-rol-harness]
area: Gobierno de agentes
glyph: ⚿
hue: rgba(87,217,232,.24)
---

# Orca, T3 Code and Capy — where to coordinate your agents

If you already have an agent assigning tasks, implementers working on separate branches, and a review before integration, switching tools is worth it when it simplifies a specific part of the workflow. **Orca is the baseline for running that system from your development environment. T3 Code is the most direct way to test what changes when delegation is recorded across threads. Capy is best suited to work that can keep moving around a pull request while the team is doing something else.**

*Documentation reviewed on November 17, 2026. The starting point is an Orca case already documented in Golden Path. The assessment of T3 Code and Capy draws on documented capabilities and proposes a practical trial.*

## What an alternative would have to replace

In the [Orca cockpit case study](https://ia.dmaledicte.cloud/en/entrada/caso-orca-cockpit-multiagente), the original coordinator assigned work to agents using different CLIs. The workflow evolved into three distinct responsibilities: overall direction, integration, and coordination of individual work packages. Each implementation had a branch and a worktree, a Git checkout with its own working directory. A separate agent could handle review. BUILD and LIVE had different rules, and production exceptions depended on previously authorized scope. Merging a pull request, applying the change, and accepting it after observing its behavior were separate milestones.

Switching costs show up in those relationships. Can the coordinator still choose who implements and who reviews? After an interruption, can they reconstruct what moved forward? When an agent finishes, does the task still wait for the relevant decision? Starting two sessions with the same prompt covers only a small part of that workflow.

## How the three tools handle the work

| Question | Orca | T3 Code | Capy |
| --- | --- | --- | --- |
| What does it organize first? | The workspace, with terminals, files, and agents tied to a repository and worktree. | The thread, with durable history and a provider connected to the environment. | The thread and its pending work, including PR tracking and events. A Captain brings together several threads in a project. |
| Where does work run? | In your own environment, including WSL or an SSH host depending on how you configure it. | On the machine running the T3 server, with providers configured in that environment. | On a Linux VM per cloud thread or on a linked device. The Windows desktop guide documents Git for Windows. |
| How is a task isolated? | One worktree per task in the standard workflow. | A worktree when creating a thread or when local delegation explicitly asks for isolation. Delegation shares the checkout by default. | Local threads can use the current checkout, an existing worktree, or a new one. Cloud subagents can share their parent's machine and working tree or get a fresh VM. |
| What goes back to the coordinator? | In the case study, evidence comes back through the handoff and Git. The experimental layer adds tasks, messages, and gates. | MCP delegation records the parent–child relationship, task state, and returned result. | A subagent returns a summary. A Captain coordinates threads in its project and gathers decisions and blockers in a digest. |
| Where do you verify authority? | In the environment's effective permissions and in the rules for integration and LIVE. | In thread and provider permissions, along with Git and deployment controls. | In account access, repository scope, and GitHub and deployment rules. Cloud mode uses the GitHub App to access repositories. |

## Orca keeps the development environment within reach

Orca puts the worktree, terminal, and diff close at hand. That helps when someone needs to intervene in the same environment as the agents, for example to reproduce a failure in WSL or inspect a host over SSH. You can also assign a different CLI to each role and review the work in Git after a conversation is interrupted. [Orca worktrees](https://orca.dev/docs/model/worktrees) · [Terminal and WSL](https://orca.dev/docs/terminal)

Keeping that picture current takes work. Local checkouts, dependencies, and processes consume resources. If important details ended up in different terminals, the coordinator has to piece the state back together. Orca documents an experimental orchestration layer with Runs, tasks, workers, and gates. Check its availability in the build you plan to use. The Golden Path case study demonstrates the worktree and handoff workflow, which already produces evidence you can recover from Git. [Orca orchestration](https://orca.dev/docs/cli/orchestration) · [Cockpit case study](https://ia.dmaledicte.cloud/en/entrada/caso-orca-cockpit-multiagente)

## T3 Code puts delegation into the thread history

T3 makes sense when the friction is keeping track of what the coordinator asked each worker to do and what came back. Its orchestration MCP documents child threads with tracked state and returned results, plus options for selecting providers and models. A coordinator can also operate from outside T3 through its MCP server, with access limited to the capabilities it has been granted. That gives you a way to try one work package with your existing coordinator and see how the handoff changes. [T3 Code delegation](https://github.com/pingdotgg/t3code/blob/main/docs/orchestration-v2/orchestrator-mcp-server.md#delegate_task) · [Outside agents](https://github.com/pingdotgg/t3code/blob/main/docs/user/outside-agents.md)

**Ask for a worktree when delegating local edits.** The default shares the checkout. A new worktree starts at the parent's commit, so uncommitted changes stay outside the task. In a linked environment, direct delegation uses the remote project's checkout. To start an isolated thread there, the documentation specifies launching it with a worktree strategy. Before moving a whole work package, I'd check how each provider applies permissions and which options from T3's main branch are available in the build installed in WSL. [Delegation and launch contract](https://github.com/pingdotgg/t3code/blob/main/docs/orchestration-v2/orchestrator-mcp-server.md) · [Permission modes](https://github.com/pingdotgg/t3code/blob/main/docs/user/permission-modes.md)

## Capy can follow a pull request through review

Capy fits when a task can be expressed as an outcome you can verify in GitHub. A cloud thread has its own Linux VM and can resume when CI finishes or review feedback arrives. For a scoped dependency update with reproducible tests, the agent can prepare the change, open a PR, and handle a failed CI run within the agreed scope. A Captain extends that idea to a whole project by coordinating threads, maintaining a plan, and gathering decisions that need attention in a digest. A Captain and its crew operate with access tied to the owner, which matters when choosing who sets one up. [Quickstart](https://docs.capy.ai/quickstart) · [Background work](https://docs.capy.ai/async-work) · [Captains](https://docs.capy.ai/captains)

Adoption depends on the execution environment. In the cloud, you need to prepare dependencies and authorize the GitHub App for the selected repositories. The disk persists through sleep, running processes stop, and a VM rebuild can lose unpushed changes. Desktop mode uses the device's tools and credentials and avoids the cloud machine-time charge. To reproduce a workflow built around Ubuntu under WSL, I'd check compatibility with that distribution, its paths, and its CLIs before assuming equivalent behavior. [Cloud machines](https://docs.capy.ai/machines) · [Desktop and devices](https://docs.capy.ai/desktop)

## A trial that could change the decision

I'd use a test repository with CI and two comparable low-risk tasks. I'd keep the starting point and acceptance tests fixed and use the same model wherever all three products offer it. Each task would have an implementer and a reviewer and end with a PR awaiting a human decision. I'd pause during CI, leave a review comment, and return to the session to reconstruct the state from the available evidence. In Capy, I'd limit the installation to the test repository. Across all three, I'd protect the branch and keep deployment permissions outside the agent's environment so the approval gate can be verified.

| What to measure | What to look for |
| --- | --- |
| Human intervention | Active minutes and the number of times someone had to resend context, move work, or wake a thread. |
| Recovery | Time to identify the commit, CI status, owner, and next decision after the pause. |
| Isolation and authorization | Branch and directory for each implementer. Evidence that integration still requires approval. |
| Evidence and cost | PR, actual diff scope, tests, review findings, and model usage. Include VM minutes when using the cloud. |

**I'd keep Orca as the base for the mixed-CLI workflow that already works.** I'd test T3 Code first on a work package coordinated across two workers in WSL. If it reduces manual handoffs and makes it possible to recover the state and verify the approval gate, it earns a second trial on a real BUILD package. I'd test Capy in parallel on a task whose progress depends on CI and PR review. If it cuts manual follow-up with scoped access and enough evidence to make a decision, it has a place even if the rest of the coordination stays in Orca.
