---
slug: hermes-agente-operativo
title: Hermes as an operational agent
type: concept
order: 1
summary: A self-hosted agent that brings queries and alerts to the channels where the team works, without turning every interaction into a technical session.
tags: [hermes, agents, channels, mcp, automation]
related: [hermes-preset-instalacion, caso-hermes-operaciones, modelos-guiados-el-entorno-es-la-politica]
area: Hermes
glyph: ✦
hue: rgba(236,95,189,.24)
---

# Hermes as an operational agent

## The core idea

Hermes is useful when the agent’s value is not only in talking to a technical person, but in **being available inside an operational loop**: taking questions from a shared channel, querying connected systems and sending alerts before someone remembers to look at a dashboard.

It does not replace Codex, Claude Code or OpenCode. It is a different kind of product. Development CLIs live close to the repository; Hermes lives close to the team and its channels.

## What problem it solves

Many internal capabilities end up concentrated in whoever has CRM access, knows a query or pays for a tool seat. Hermes lets you wrap those capabilities in a more accessible conversational interface:

- questions about operational data from WhatsApp, Slack or Discord;
- proactive notices triggered by cron or events;
- separation between team channels and administrative notifications;
- access to systems through MCP integrations with controlled scope;
- continuous operation on your own or managed infrastructure.

The important leap is going from **an assistant that answers when called** to **an agent that is part of the work system**.

## Where it adds value

### Distributed access

The team asks from a channel it already uses, without learning a new interface or opening a technical session. This does not remove access control: it requires allowlists, clear identities and different capabilities per user or channel.

### Proactivity

A passive event in a queue or a Signals system becomes an actionable alert. The automation has to tell operational information apart from sensitive notices and choose the right channel for each.

### Integration

Hermes can use connected tools to query the CRM, databases, documentation or services. The value is not in adding every possible MCP, but in choosing the minimum that solves the case and granting the least privilege needed.

## What it does not solve on its own

Installing Hermes does not define:

- where to host it;
- which model to use;
- who can talk to it;
- which tools it can run;
- how many subagents to launch;
- how to handle failures and secrets.

Those decisions are part of the product. An agent reachable by more people amplifies usefulness, but also risk surface and spend.

## Design principle

**The agent should bring capabilities closer to the team without bringing unnecessary authority along.**

A sales question may need read access to the CRM. It does not need to edit records, reach production over SSH or know credentials. The experience is designed from that limit, not from everything that could technically be connected.
