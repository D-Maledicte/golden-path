---
slug: caso-jev-director-narrativo
title: "Case: a Director that separates narration from memory"
type: case-study
order: 3
summary: "An orchestrated architecture where one model writes the scene, Jev decides its consequences and an event log rebuilds what each character can remember."
tags: [jev, narrative, memory, agents, events, case-study]
related: [jev-decisiones-estructuradas, orquestacion, continuidad-y-observabilidad]
area: Casos de producto
glyph: ◉
hue: rgba(236,95,189,.24)
---

# Case: a Director that separates narration from memory

## The problem that showed up after writing

In an interactive fiction app, the generative model could produce scenes and dialogue. The challenge was keeping the consequences: who discovered a secret, which promise was left pending, how a relationship changed and which theme was still open.

A long chat is not a stable source for reconstructing all of that. Repeating the whole history to the narrator eats context and does not guarantee it can tell a lasting fact from an interpretation or an everyday gesture. v2 added a **Director** that observes every turn and keeps a narrative state separate from the prose.

## The orchestration

The flow splits responsibilities:

1. **Narrator:** writes the scene and returns actions with the characters identified.
2. **Candidate builder:** builds relationship pairs from those identifiers. A small compiler proposes claims about facts, themes and promises.
3. **Jev:** answers typed questions about relationship changes, narrative categories, equivalence with recorded matters and who found out.
4. **Domain code:** turns valid decisions into events, limits their effect and rebuilds state through `replay`.
5. **Next-turn context:** summarizes what matters for the narrator and retrieves only the memories that belong to that point in the story.

The Director has a core of events and reducers with no model calls; the part that queries Jev lives separately. That way the state logic can be tested without a network and you can check where each consequence came from.

## Relationships: a moment mattering does not mean everything changes

Candidates are directed pairs between the protagonist and the other characters present. Direction matters: A’s trust in B can change even if B’s trust in A does not. The first call to Jev asks, in batch, whether there was a genuine change; a second call evaluates dimension, direction and magnitude only for the selected candidates.

Tests showed that a pleasant gesture could get too much weight if you only looked at the intensity of the moment. The calculation added two more signals: the probability that the relationship actually changed and whether someone learned something new about the other person. An everyday coffee and a revelation leave different marks.

The code caps the maximum delta per scene and flips the sign when it relates to tension: improving a relationship can lower tension while trust or closeness go up. It also correctly normalizes *Score* before applying the change; the raw value represents the criteria scale defined in the question.

## Facts: knowing something is not the same as being nearby

For the narrative state, a compiler proposes third-person claims. Jev classifies them as a lasting fact, an open theme, a promise or nothing. Then it compares candidates against what is already recorded and against others from the same turn to avoid semantic duplicates.

The question “who found out?” is asked separately. A character being in the scene does not mean they heard a private conversation or understood an allusion. If they find out several turns later, the list of those who know **the same fact** is updated; no new identical fact is invented.

The resulting events feed a log from which the state is rebuilt. The summary the narrator receives includes facts known to someone present, relationships expressed in words and pending matters. Memories are also filtered by timeline: a future event or one that happened only on another branch does not get in. That last filter is a code rule, not a Jev decision.

## What the test lets us claim

The Director is implemented on a v2 branch and was calibrated with hand-annotated story fragments. There was also a blind comparison of the narrator’s response with and without the Director’s summary on a real session: **20 pairs; 7 preferences for the version with the summary, 5 for the one without it and 8 ties**. It is limited evidence of coherence; it does not show a clear improvement in writing quality.

Attributing who knows what still fails in implicit scenes; in manual tests, a generative model used as a judge solved some examples better. Conditional promises also go undetected, and a network failure when querying Jev can still cut the turn short. v2 is under evaluation, with work pending before treating it as a finished solution.

## The architectural decision

The separation leaves a readable contract: **one model writes, another helps decide what consequences there were, and the code determines what gets recorded and what can be remembered**. Jev contributes structured decisions where the question is small and verifiable; the Director contributes rules, traceability and temporal limits.

The value of the case is not in adding a model to the pipeline. It is in being able to point to a turn, a decision and an event when the story remembers something it should not, or forgets something that did happen.

> Case based on a working v2 under evaluation. Product, characters, sessions and repository details were anonymized; the figures come from a limited comparative test, not a production measurement.
