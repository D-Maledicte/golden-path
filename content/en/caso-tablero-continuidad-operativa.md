---
slug: caso-tablero-continuidad-operativa
title: Case study — From counter to operational continuity dashboard
type: case-study
order: 1
summary: A personal tool grew to combine incidents, service health and progressive signals without bringing credentials into the browser.
tags: [case-study, observability, astro, typescript, n8n, incidents, security]
related: [continuidad-y-observabilidad, caso-orca-cockpit-multiagente]
area: Casos de producto
glyph: ◌
hue: rgba(87,217,232,.22)
---

# Case study — From counter to operational continuity dashboard

## The starting point

The first need seemed minimal: show how much time had passed since the last incident. But an isolated number did not explain what had happened, whether the problem was still open or which part of the environment was affected.

The product ended up becoming a small operations center: continuity, an incident log, metrics and the health of several services on a single surface.

## The architecture that made it possible

| Layer | Technology | Responsibility |
|---|---|---|
| Interface | Astro + Tailwind CSS | Fast, responsive static site that is easy to deploy |
| Domain | TypeScript | Continuity calculation, states, normalization and signal merging |
| Local fallback | `localStorage` | Keep actions when the remote layer does not respond |
| Integration | n8n | Incident persistence and running checks |
| Persistence | Data Tables | Syncing history across devices |
| Delivery | Static hosting with security policies | Publishing the frontend with no embedded secrets |

The central decision was to keep the browser as the consumer of a narrow contract. Authenticated access and credentials stayed on the integration layer’s side, which only published normalized states.

## From a timestamp to a lifecycle

An incident is not just a reset date. It has a real start, a reporting time, a status, a closure and an optional resolution note.

Modeling it that way solved cases the simple counter was hiding:

- an open incident stops the continuity count and avoids a false “all good”;
- several incidents can overlap;
- the new healthy period starts after the last effective closure;
- old records can still be read without rewriting history;
- a connectivity outage does not force you to lose the local creation or closure.

The interface went from celebrating a number to honestly representing the operational state.

## Progressive health, not a monolithic wait

Checks were split into groups and the frontend requested them in parallel. Each partial response is merged with the existing state without erasing services that branch did not observe.

This let a known outage show up as soon as it was detected, even while other sources were still slow. It also required explicit rules to avoid races, stale data and misleading transient states.

### Semantics before color

Not every successful HTTP response proves the service is healthy. A frontend can return its generic HTML for a nonexistent route and produce a false green.

That is why the dashboard distinguishes:

- **operational:** the expected signal responded and its content is valid;
- **degraded:** the process is alive but cannot serve correctly yet;
- **down:** there is concrete evidence of unavailability;
- **unverifiable:** there was a response, but it does not prove the condition being checked;
- **no data or checking:** there is not yet a sufficient reading.

Separating liveness from readiness avoided alerting every normal restart as an outage. Validating the body as well as the HTTP code avoided green checks that did not actually measure anything.

## Security and resilience as part of the product

Hardening was not left for the end:

- the frontend never receives provider credentials;
- a strict CSP limits unexpected execution;
- dependencies are audited and updated;
- accepted endpoints are normalized and restricted;
- partial states keep the last valid observation;
- animations respect reduced-motion preferences;
- the scrolling area can be navigated with the keyboard.

Workflows were also treated as code: their nodes, contracts and paths were checked to catch generation errors, duplicated groups and crossed responses.

## Benefits

- a shared reading of continuity, incidents and dependencies;
- earlier detection thanks to progressive responses;
- fewer false positives and false greens;
- continued use during temporary integration failures;
- a clear boundary between public visualization and authenticated access;
- verifiable behavior even when the automation lives outside the traditional repository.

## The transferable lesson

Useful observability is not about adding checks. It is about defining what each signal proves, what it cannot prove and how incomplete results are combined without lying to the operator.

The counter remained the central image, but the real product became the continuity model behind it.

> Case based on a real implementation. Names, domains, endpoints, quantities, internal providers and identifiable operational data have been removed.
