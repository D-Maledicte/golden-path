---
slug: caso-widgets-crm-flujos-guiados
title: Case study — Widgets that turn CRM rules into guided flows
type: case-study
order: 2
summary: Two embedded widgets brought context, validation and automation to the exact point where the team made decisions.
tags: [case-study, crm, widgets, javascript, deluge, n8n, integrations, ux]
related: [backup-versionado-crm, arquitectura-read-only, modelos-guiados-el-entorno-es-la-politica]
area: Casos de producto
glyph: ◆
hue: rgba(236,95,189,.24)
---

# Case study — Widgets that turn CRM rules into guided flows

## The underlying problem

The CRM concentrated data and automations, but some tasks still required knowing too many rules by heart: which options were valid, which limits applied, when an approval was needed and how to report a problem without losing the originating context.

The solution was not to build another separate application. We built embedded widgets that appeared inside the record and turned those rules into guided paths.

## Two paths, one idea

### Selecting and confirming a proposal

The first widget brings together the record’s configuration, the current catalog, payment methods, installments, discounts, additional conditions and a possible counteroffer.

Before allowing a confirmation, it:

- checks that the record is at the right stage;
- filters options by context;
- calculates amounts and installments in real time;
- applies different limits depending on the type of proposal;
- disables incompatible combinations and explains why;
- routes exceptions to the approver role;
- attaches documentation when needed;
- builds a single payload and prevents duplicate submissions.

The interface makes the policy visible while the person is deciding. It does not depend on them remembering an external table or discovering the error after saving.

### Contextual problem reporting

The second widget can be opened from different modules. It detects the source entity and record, retrieves its context and prepares a report linked from the start.

A categorized search replaces a long list and lets you browse or find a problem type regardless of case and accents. The selection must come from the catalog: typing similar text is not enough to submit an ambiguous classification.

It also handles attachments, loading states, partial errors and modules that do not yet have all their fields confirmed. The main flow stays operational even if secondary diagnostic information fails.

## Integration architecture

| Piece | Role |
|---|---|
| HTML/CSS/JavaScript widget | Fast interaction inside the CRM iframe |
| Widget SDK | Page context, reading the record, attachments and closing the popup |
| CRM functions | Prepared data and rules close to the business model |
| Webhook | Explicit output contract |
| n8n | Orchestration of writes and follow-up actions |
| CRM | Source of truth and final traceability |

The boundary was deliberate: the widget guides, validates and presents; the functions retrieve context; the automation coordinates the write. No piece needs to pretend to be the whole system.

## Decisions that paid off

### Rules visible at the right moment

A limit that only exists in documentation arrives too late. Showing it next to the affected control cuts down on trial, error and side questions.

### Proportional blocking

A wrong stage blocks the whole path. An invalid combination blocks only that alternative. A failed attachment is reported without hiding that the main record was already created.

### Mutually exclusive states

Loading, technical error, context not enabled and normal flow have separate screens. This avoids mixed interfaces where it seems possible to confirm while critical information is still missing.

### Robustness in an embedded environment

The SDK and its responses do not always arrive in the ideal shape. We added watchdogs, defensive parsing, double-submit protection and isolated diagnostics so a secondary failure does not break the essential controls.

### Context that travels with the action

The report is born linked to the record it was opened from. That removes the manual search afterward and improves the quality of the information the person solving the problem receives.

## Benefits

- fewer invalid decisions before writing to the CRM;
- commercial policies turned into immediate feedback;
- exceptions routed to the right approver;
- more consistent reports linked to their origin;
- lower cognitive load for the operations team;
- end-to-end traceability between interface, functions, automation and final record;
- a reusable foundation for adding paths without taking users out of their everyday tool.

## The transferable lesson

A good CRM widget is not a prettier form. It is a translation layer between the data model, business policy and human decision.

When the control appears at the point of work, prevention stops depending on perfect training: the environment itself leads toward a valid action.

> Case based on two real implementations. Names, domains, internal modules, catalogs, figures, identifiers and sensitive commercial details have been removed.
