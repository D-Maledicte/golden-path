---
slug: jev-decisiones-estructuradas
title: "Jev: small decisions inside large systems"
type: concept
order: 13
summary: "What a structured-decision model does and where it belongs: routing, classification, scoring and gates before state changes."
tags: [jev, decisions, routing, scoring, agents, architecture]
related: [caso-jev-director-narrativo, modelos-guiados-el-entorno-es-la-politica, orquestacion]
area: Gobierno de agentes
glyph: ◈
hue: rgba(168,106,255,.24)
---

# Jev: small decisions inside large systems

## A different question from “write me an answer”

Many steps in an AI application do not need another paragraph. They need to know **what to do next**: which team to send a request to, whether a claim is supported, which candidate to review first or whether it is worth calling a more expensive model.

[Jev 1.13](https://openrouter.ai/typesafe/jev-1.13), by TypeSafe, is designed for that kind of decision. It takes text or structured state and returns typed answers, not free prose. The [System One documentation](https://docs.typesafe.ai/concepts/system-one) distinguishes three primitives:

| Primitive | Question | Answer |
| --- | --- | --- |
| **Choice** | Which of these options best describes the case? | One option and probabilities |
| **Score** | Where does the case fall on a defined scale? | A score over the configured levels |
| **Noul** | Is this condition met? | A probability between 0 and 1 |

The application defines the options and criteria. Jev judges a state within that frame; the code decides which action follows, with its own rules and permissions.

## Four places where it makes sense to try it

### Routing and classification

An incoming request might go to technical support, billing or manual review. If the choice is ambiguous, the application can ask Jev for a category and send low-confidence cases to a person. The same idea works for classifying incidents or separating useful signals from noise in a queue.

### Scoring and ranking candidates

When there is already a bounded list of options, Jev can score which ones look most relevant: retrieved memories, alerts or tasks to review. It pays to shrink the set with cheap filters first; asking for a decision over the whole base increases cost and noise.

### Gates before persisting

A generative LLM can extract data from a conversation, but writing a claim does not make it a fact. A gate can assess whether there is evidence, whether the data looks durable or whether it contradicts what is already recorded. Mutations still go through the system’s validation and idempotency.

### Escalation between models

If the task only requires choosing between known routes, you may not need to call a long-reasoning model. Jev can help route clear cases and leave the hard ones for another model or a human review. The real savings are measured alongside routing errors: making a call cheaper at the cost of losing important cases would be a terrible trade.

## Confidence is not permission

A high probability does not prove that an individual answer is correct. TypeSafe describes calibration as a property measured over sets of predictions, not as a per-case guarantee. You have to test with domain data, real languages and hard examples before choosing thresholds.

Also, *Score* uses the configured scale: if the criteria have five levels, its raw value should not be read as a number between 0 and 1 without normalizing it. And a well-formed decision does not, on its own, authorize a send, a write or a publication.

The useful architecture usually has four pieces: **relevant state → bounded question → typed answer → deterministic rule**. Decisions are logged so hits and misses can be compared; when the provider fails, the application picks an explicit fallback.

## Which use turned out to be concrete

In an interactive fiction v2 we tried Jev as part of a Director that watches scenes and decides which relationships, facts, themes and promises leave consequences. There the question was not “write a better scene”, but “what actually changed and who can remember it?”.

The design, the fixes found during testing and their limits are in [the narrative Director case](/en/entrada/caso-jev-director-narrativo). It is one example of application; routing, scoring and gates are other starting points that need their own evaluation.
