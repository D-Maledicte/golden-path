---
slug: orca-bots-que-se-configura
title: "What you configure in an Orca Bot"
type: concept
order: 10
summary: "A bot isn't a long prompt: it's five layers you configure separately (identity, memory, scope, triggers, and permissions), each with its own control and its own way of failing. A real pilot shows what each layer solves and what remains untested."
tags: [orca, bots, memory, connectors, permissions, automations]
related: [orca-bots-grok-bot-dots, caso-orca-cockpit-multiagente, autonomia-con-contrato]
area: Orca
glyph: ⚙
hue: rgba(232,178,87,.24)
---

# What you configure in an Orca Bot

An agent that handles a task well today and remembers nothing tomorrow forces you to repeat the context every session. The opposite problem is worse: an agent that remembers everything, acts in your accounts, and can also take requests from other people. Moving from an agent with worktrees to a bot with continuity and connectors isn't a matter of writing a longer prompt. **A bot is five layers you configure separately: identity, memory, scope, triggers, and permissions.** Each one has its own control and its own way of failing. Configuring it well means deciding which layer solves each problem.

*Orca documentation checked November 20, 2026. The cases come from a real, anonymized pilot run the same day. Anything not tested is marked as proposed or untested.*

## The five layers at a glance

| Layer | Where you configure it | What it controls | How it fails |
| --- | --- | --- | --- |
| Identity | The soul, a Markdown file | Purpose, voice, and prohibitions | The model doesn't follow it: it's text, not an enforced rule |
| Memory | Markdown files in the bot's folder | What it knows between conversations | Stale facts, duplicates, or other people's instructions saved as its own |
| Scope | Connectors and tools | Which identity it acts as in each service | More access than needed, or less than the task requires |
| Triggers | Schedules, events, and webhooks | When it works without anyone writing to it | Noise, empty reports, or events from people who can't ask it anything |
| Permissions | Permission mode and *Who can ask* | What it can do without approval and who directs it | A default that's too broad, or a list that grants more than it seems |

The bot lives in a folder on a single computer (yours or a server paired with Orca), and its soul, memory, and abilities are plain files in that folder. It runs on your sign-in for the agent you picked, and what it reads is sent to that model's provider, as with any agent session. [Bot security](https://orca.dev/docs/bots/security) · [Bots](https://orca.dev/docs/bots).

## Identity: the soul

The soul is a Markdown file with the bot's purpose, its voice, a section on how it works, and a list of things it never does. Orca hands it to the model as instructions; it doesn't enforce it. The operational consequence is that identity is for style and judgment, not for security: a prohibition written in the soul is a request to the model, not a block.

In the pilot, the soul solved two tone issues: the bot tones down its register in work channels, and a blog's public voice isn't the bot's voice, so the soul keeps the two apart. The boundary is whatever isn't style: if something must not happen, such as merging or sending an email, it belongs in the permissions layer or in an external safeguard.

## Memory: a short index and topic files

The bot's memory is also Markdown files in its folder, which you can read and edit, and Orca lets you review the changes made by the nightly memory tidy-up. That tidy-up has no tools: it only replies and can't run commands. [What you can review](https://orca.dev/docs/bots/security) · [What Orca enforces](https://orca.dev/docs/bots/security#what-orca-enforces-and-what-the-bot-is-told).

The format that worked in the pilot was an index with one line per fact, dated, with the detail in topic files. Decisions and preferences are worth keeping. Secrets don't go in, and the documentation says the bot is told not to save them; neither do instructions that arrive in other people's emails, messages, or issues, which the bot should treat as information. Both are instructions to the bot, not rules Orca enforces.

Two cases from the pilot: a rule corrected during the day ("coordinators are ephemeral") was stored as a dated fact, and an old memory that had been duplicated had to be forgotten. That surfaced a behavior observed but not documented on the pages reviewed: a line deleted by hand came back, and what worked was asking the bot to forget it with its command. Take it as an observation of that setup. The general boundary: more memory isn't better judgment; a stale fact stored neatly is still stale.

## Scope: connectors and tools

Each connector changes which identity the bot acts as, and that matters more than the connector's name. According to the [connectors documentation](https://orca.dev/docs/bots/connectors#who-the-bot-acts-as):

- **Slack:** it acts as the bot, through its own Slack app.
- **GitHub and Linear:** it replies as the Orca app where it was asked; other work (commenting elsewhere, labeling, assigning, reviewing, or moving issues) uses your account, and on GitHub it pushes with your own git login.
- **Google:** it acts as you. The Google Cloud app is yours, your Google sign-in stays on your computer, and the bot calls Google directly from there. [Google](https://orca.dev/docs/bots/connectors#google).
- **Webhooks:** they have no identity of their own; they only start an automation.

For other apps there's Composio: Orca keeps the key and the bot never sees it. For MCP servers, web servers have their keys and sign-ins stored encrypted, and Orca adds them to each call; command-run servers take their keys from saved settings that aren't encrypted, readable only by your user. [Other apps and tools](https://orca.dev/docs/bots/connectors) · [Secrets](https://orca.dev/docs/bots/security#secrets).

In the pilot, scope failed in three different ways. The first Composio key tried didn't work, and a read-only key returned a permissions error for what it was asked to do. An MCP server added on another machine couldn't be used from the local session, which may be specific to that setup. And a CRM tool could read and update but not delete, so a test record had to be deleted by hand. The boundary: scope is measured by the effective identity and the operations each tool allows, not by the list of active connectors.

## Triggers: automations and a decision inbox

A bot works without anyone writing to it through three documented paths: schedules (hourly, daily, weekdays, weekly, cron, or RRULE), events from the connectors you added, and webhooks, whose URL you should treat like a password. When the bot needs something from you, the request waits under **Needs you** until you answer. [Schedules](https://orca.dev/docs/bots) · [Webhooks](https://orca.dev/docs/bots/connectors).

The pilot also used one-shot waits and items with buttons as a decision inbox; neither appears on the pages reviewed, so both are listed as observed. The design rule that worked was that reports go out only when there's news, and go to their own chat. The result was an email digest and a technical monitor that moved from running every 30 minutes to every hour, from 9 to 21, in a dedicated chat. The boundary: this is a configuration, not a measurement. The pilot doesn't measure continuity or alert rate.

## Permissions and who can ask

The permission modes are *Ask for approval*, *Accept edits*, *Approve for me*, and *Full access*, depending on what the agent supports. **Orca's default chat permission is Full access.** The documentation recommends switching to *Ask for approval* when other people can ask the bot for things or when it reads mail, issues, or messages from outside. Some agents have no approval modes, and their bots always run in Full access. [Permissions](https://orca.dev/docs/bots/security).

*Who can ask* grants more than it seems: the person you add uses your access, not their own, and can start, steer, approve, and stop the bot's work. Event automations and webhooks don't go through that list: an event rule starts for anyone in a place you and the bot share.

The distinction that organizes this layer is [what Orca enforces and what the bot is only told](https://orca.dev/docs/bots/security#what-orca-enforces-and-what-the-bot-is-told). Orca checks *Who can ask* before the request reaches your computer, keeps the scheduled look-around run read-only, and removes tools from the memory tidy-up. By contrast, approving or merging a PR only when you ask, or drafting an email instead of sending it, are instructions to the bot. The page itself notes that none of these settings is a guarantee.

In the pilot, the bot started read-only and was given specific permissions, with one ok per action. The boundary: an ok in the chat approves an action, it doesn't validate the plan, and it doesn't replace a repository or deployment safeguard.

## Delegated work: workers and skills

Code doesn't happen in the bot's session. It goes to a worker, a Claude Code or Codex session in a new worktree under the bot, and reaches the repository as a branch and pull request to review. [Workers](https://orca.dev/docs/bots/security).

Questions, on the other hand, the team sent to a new session in the main workspace; that's a pilot practice, not an Orca feature, and it follows from the same rule that coordinators are ephemeral. In the pilot, skills were shared between the bot and its workers, and the bot read them at the start of each conversation. That isn't in the [skills documentation](https://orca.dev/docs/cli/skills), so it's listed as observed: if you change a skill, open a new conversation before assuming the bot uses it.

## What wasn't tested

- **SSH.** Access to a VPS with its own keys and a key agent that expires on its own is a proposed design; it wasn't tested with the bot.
- **Continuity over time.** The pilot lasted one day; it says nothing about weeks of memory, routines, or soul drift.
- **Host turned off.** The documentation says Orca Cloud holds a request for up to a day if the computer is asleep and that webhook bodies are kept for up to 7 days. We didn't verify it.

## Where to start

If the bot will be yours alone and won't read third-party content, start with identity and memory: a short soul and a memory index you can review. If it will touch services, add scope one connector at a time and check which identity it acts as before the next one. If it will take requests from other people or read outside mail and issues, configure permissions before adding anyone: *Ask for approval* and a short *Who can ask* list.

The small test: a read-only bot, one connector, a routine that only reports news in its own chat, and one reversible write action with explicit approval. If after a week the memory is still clean and the reports are still useful, only then is it worth adding the next layer.

For a comparison with other ways to sustain an agent, see [Orca Bots, Grok Bot, and Dots](/en/entrada/orca-bots-grok-bot-dots); for branch and review design, the [multi-agent cockpit case](/en/entrada/caso-orca-cockpit-multiagente).
