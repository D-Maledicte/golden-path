---
slug: orca-bots-grok-bot-dots
title: "Orca Bots, Grok Bot, and Dots: where should your agent live?"
type: editorial
order: 25
summary: "Three ways to sustain work between conversations. A real Orca Bots pilot shows what changes when the agent lives close to the code, and why a chat approval is not enough to protect production."
tags: [orca, grok-bot, dots, governance, automations, permissions]
related: [orca-t3-code-capy, caso-orca-cockpit-multiagente, autonomia-con-contrato]
area: Gobierno de agentes
glyph: ⚿
hue: rgba(87,217,232,.24)
---

# Orca Bots, Grok Bot, and Dots: where should your agent live?

An agent that can read an alert, see what changed, and update the team is already doing more than answering questions. Once it can also publish a workflow or open a terminal, the underlying decision changes: **where does it run, whose credentials does it use, and who can stop it from touching production?** That's where Orca Bots, Grok Bot, and Dots diverge.

*Documentation checked November 20, 2026. The Orca examples come from a real, anonymized pilot. The Grok Bot and Dots comparison is based on official documentation, not equivalent production tests.*

## What Orca Bots add to the cockpit

A worktree isolates code changes; a bot owns a responsibility across sessions. In Orca, that responsibility has a folder, behavior instructions, editable memory, and routines. The bot runs with the agent and account you configured on your computer or a paired server. Slack, GitHub, Linear, and webhook requests can arrive through Orca Cloud; that doesn't mean the bot runs there. If the host is asleep, remote requests may queue. Local files don't mean local-only processing, either: what the agent reads can reach its model provider. [Bots](https://orca.dev/docs/bots) · [Orca security](https://orca.dev/docs/bots/security).

For a team already using branches and worktrees, the appeal is tangible: the bot can take a request where the team talks and return reviewable work in the development environment. Continuity belongs to the bot; it doesn't require leaving a coordinator's session open forever. The tradeoff is that someone has to operate the host, its sessions, and the connectors' effective permissions.

## What the pilot showed

- **Repair and verification.** A signup workflow was returning 401. Authentication for the CRM function switched to OAuth2 without changing the request method. The workflow was published, a test signup passed, and the result was reported to the team. The follow-up found that the 401 stopped signup before account creation and found no partial signups, so there was no replay. A 401 doesn't prove a key expired: [Zoho documents that its Functions key does not expire](https://www.zoho.com/crm/developer/docs/functions/security.html).
- **Approving a plan doesn't validate it.** Before that fix, the operator had approved a different plan: change the request method and use a personal credential. Evidence from another agent that knew that CRM contradicted it: some calls worked with the original method and a different credential. The bot stopped, asked again with the new evidence, and applied the second plan.
- **Secrets that pass through no one.** In a separate reporting workflow, the bot helped review a scheduled task. The read-only user's password and the function's token were generated inside the database, from server-side random bytes, and stored in the vault: the bot saved them without seeing them. The operator only copied them into the function's secrets panel, which the bot's tools couldn't reach. The bot tested the function by calling it from the database itself, with the token read from the vault, and then deleted the copy of the password.
- **Dry runs versus writes.** In that workflow, the dry run returned data without writing; a later real run produced a persisted result. These checks are not interchangeable: an HTTP 200 in test mode verifies neither the schedule nor the write. And a test against production also writes: the signup that confirmed the 401 fix created a real record in the CRM, which had to be deleted by hand because the bot's tool could read and update but not delete.
- **Configured routines, not measured reliability.** The pilot configured an email digest and a technical monitor that should only report changes. It did not measure uptime, alert quality, or behavior with the host offline. Bot SSH access was not tested.

The transferable lesson isn't to connect everything. It's to close the loop between an alert, evidence, a scoped change, and verification. A credential label and its effective identity are different things: before approving an action, know which account will actually perform it.

## Three centers of gravity

| Question | Orca Bots | Grok Bot | Dots |
| --- | --- | --- | --- |
| Where does the work run? | On your computer or paired server, with the agent you configured. | A managed persistent computer; a user's personal Bots share it. A Team Bot's shared chats have their own environment. | The dot's cloud computer; you can enable your own computer or use a Codex environment when a task calls for one. |
| What carries across sessions? | File-based memory and instructions, routines and triggers. Code changes can arrive as a branch and PR. | Bots organized by responsibility, time- or event-based routines, and reviewed shared memory for Team Bots. Can also delegate code to Cursor Cloud Agents. | ChatGPT context, recurring tasks, and background research. The conversation remains the place to review results and steer the work. |
| Where would I start? | Engineering incidents that cross chat, the repo, and the runtime, if you already operate the stack. | Cross-app work that benefits from managed hosting, especially for a team. | Following through across several personal or work commitments without requiring every request to start in a repo. |

Sources: [Orca bots and permissions](https://orca.dev/docs/bots/security); Grok Bot [architecture](https://docs.x.ai/grok-bot/how-grok-bot-works), [Team Bots](https://docs.x.ai/grok-bot/team-bots), and [routines](https://docs.x.ai/grok-bot/skills-routines-and-automations); [OpenAI's guide to Dots](https://help.openai.com/en/articles/20001530-getting-started-with-your-dot). Orca lets you pick a supported agent; [Grok Bot routes models without a per-task model picker](https://docs.x.ai/grok-bot/faq). That matters when you want to hold the runtime and agent constant across trials.

## The LIVE gate is not the chat approval button

New Orca chats inherit the global permission mode unless overridden for the bot. Open chats retain their previous mode. With an agent that supports *Ask for approval*, the requester can approve; *Who can ask* does not on its own cover webhooks or event automations. The pilot showed that the list also grants more than it seems: adding someone lets them use the bot as the owner, with the owner's connected accounts, not just chat with it. And identity changes by channel: in Slack the bot speaks with its own identity; in GitHub and the issue tracker it acts as the owner. [Grok Bot](https://docs.x.ai/grok-bot/approvals-security-and-privacy) uses *Auto Review* and *Ask first* rules to review actions in chat. In [Dots](https://openai.com/index/introducing-dots/), application access and approval rules are also separate controls. The pilot adds another reason: a plan approved in chat was wrong, and what corrected it was new evidence, not the button. None of these controls replaces external enforcement that requires a human reviewer for production.

For a first use, I'd try **Orca for alert → diagnosis → PR**, **Grok Bot for a team's cross-app process**, and **Dots for follow-through across commitments**. Run the same test for all three: synthetic data, scoped reads, a reversible proposal, and a harmless sandbox write that should be denied or ask for approval. For LIVE, the bot's identity should not be able to bypass repository or deployment protections. The test is simple: the agent can finish its part without deciding on its own that the work is in production.

For branch and review design, see the [multi-agent cockpit case study](/en/entrada/caso-orca-cockpit-multiagente).
