---
slug: hermes-preset-instalacion
title: Hermes installation preset
type: guide
order: 2
summary: "Five decisions to make before setting up Hermes without copying someone else’s infrastructure: hosting, model, channels, concurrency and integrations."
tags: [hermes, setup, hosting, models, mcp]
related: [hermes-agente-operativo, caso-hermes-operaciones]
area: Hermes
glyph: ◇
hue: rgba(168,106,255,.24)
---

# Hermes installation preset

## Before the installer

Setting up Hermes does not start with a command. It starts with five decisions that determine cost, security and usefulness. The preset does not prescribe a provider: it works as a guide for designing the instance to fit the context.

## 1. Hosting

Common options:

- your own new or existing VPS;
- a managed service;
- a cluster or serverless runtime with GPU.

Useful questions:

- Is there already infrastructure with measured headroom?
- What availability does the agent need?
- Who is responsible for uptime, backups and updates?
- Does the network need to reach private systems?

Reusing a VPS lowers cost, but it shares failures and resources with whatever already lives there. Capacity is measured after deploying; it is not guessed from the sales sheet.

## 2. Provider and model

You can use a direct API, an aggregator like OpenRouter or the provider offered by the Hermes ecosystem.

If it is unclear which model fits, the healthiest method is a small benchmark with real queries. Scoring accuracy and cost on the same set avoids choosing by reputation or a friendly demo.

The key should be exclusive to the project. It isolates spend, telemetry, revocation and blast radius.

## 3. Channels

Hermes can connect to WhatsApp, Telegram, Discord, Slack, Teams, Signal, email and other channels. The question is not how many it supports, but who needs access and what information they can receive.

Separating channels by role keeps an administrative alert from ending up in a sales space. The same agent can talk with the team and notify the administrator, but each path needs its own policy.

## 4. Concurrency and resources

Starting with a conservative subagent limit is an operational decision, not a loss of power. Parallelism goes up once there are real metrics for CPU, RAM, latency and cost.

If the infrastructure hosts other services, the agent cannot treat all the resources as its own.

## 5. Integrations

For every MCP or connected tool, state:

- which case it solves;
- whether it needs read or write access;
- which users can trigger it;
- which limits or queues absorb rate limits;
- what evidence each operation leaves.

## Minimum checklist

- [ ] Hosting and operational owner defined.
- [ ] Provider and exclusive key chosen.
- [ ] Channels and roles separated.
- [ ] Initial concurrency bounded.
- [ ] Minimal integrations and permissions reviewed.
- [ ] Secrets kept out of documentation and the repository.
- [ ] Tests for queries, alerts and channel separation.
- [ ] Metrics to decide the next adjustment.
