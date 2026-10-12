---
slug: backup-versionado-crm
title: From backup to a CRM function platform
type: concept
order: 1
summary: The read-only backup became the foundation of an internal platform for analyzing, reviewing and deploying CRM functions with separate authorities.
tags: [zoho-crm, backup, git, deluge, audit, deployment]
related: [arquitectura-read-only, mapa-procesos-verificacion, modelos-guiados-el-entorno-es-la-politica]
area: CRM versionado
glyph: ▣
hue: rgba(237,195,94,.25)
---

# From backup to a CRM function platform

> Updated on October 12, 2026 with the internal evolution known as V2, documented in the project as the multiuser deployment stage. Implemented capabilities and pending tests are distinguished below.

## The problem

The Deluge code behind the automations lives inside Zoho CRM. The current interface provides a Revisions tab with the latest 30 versions; for Deluge, each save creates a revision. That bounded history does not replace an external repository with diffs, analysis and its own retention policy. [Function management](https://www.zoho.com/crm/developer/docs/functions/management.html).

The starting point was downloading the code and metadata of every function, generating a deterministic tree and creating a commit only when something actually changed. That layer remains read-only.

The next stage added a path for preparing changes, reviewing them and publishing with a different authority. The repository became a small internal function-management platform: a CLI, contracts, Git controls and an explicit deployment path. The CLI and GitHub review organize who can propose, who can publish and what evidence each transition requires.

## Four results in a single run

1. **Backup:** complete source code outside the CRM.
2. **History:** `git log`, diffs and blame on previously opaque functions.
3. **Audit:** regenerated reports showing REST surface, test functions, hygiene and literal secrets.
4. **Map:** grouping by business flow so a branch can be analyzed without walking the whole tree by hand.

## The observation layer

```text
Daily scheduler
  → Node.js sync
  → Zoho CRM API in read mode
  → generated, normalized tree
  → commit only on change
  → private Git repository
  → result webhook
  → alert only when there is a problem
```

The synchronization credential only has `ZohoCRM.settings.functions.READ`. The restriction lives below the code: even if the process tried to update a function, it would have no authority to do so.

## What it made visible

The snapshot turned hunches into an inventory. The first audit found a significant surface of functions exposed over REST, test automations still active, undocumented functions and literal credentials inside the code.

The exact figures are not needed to reuse the method. The important lesson is that these risks were not observable from a casual look at the interface: they appeared when downloading, normalizing and classifying the full tree.

The snapshot in this case did not verify every association, so the report could only flag candidates, not claim that a function was unused. Zoho’s current interface does document associations, references and dependencies in Glance. Consulting them adds evidence; it does not show that the backup client downloads them or rule out external invocations. [Function management](https://www.zoho.com/crm/developer/docs/functions/management.html).

## The value rule

A backup that changes every day without real changes is noise. For Git to tell a useful story:

- the JSON sorts its keys;
- files normalize line endings;
- reports do not include generation timestamps;
- pruning only runs if every download finished;
- the category is part of the path because `api_name` is not unique.

## From inventory to a reviewable change

The CLI implements creation or updating of one Deluge function at a time. For an existing function, the multiuser path starts from a baseline obtained from production. The change is prepared outside the generated tree, versioned as a proposal and reviewed before an authorized owner deploys it.

```text
Production → change baseline → proposal in cambios/
  → pull request → owner review → merge
  → preflight checks → explicit deployment
  → download again and compare
```

This separation avoids two different mistakes: editing a backup as though it were code ready to publish, and giving production permissions to everyone who needs to analyze it. A contributor can prepare a proposal with read access; publication belongs to another role.

The documented normal path requires checking function identity, file provenance and whether production changed since the proposal's baseline. Downloading again lets the tool compare what the CRM received with what was sent, using exact or normalized comparison. This is not a test of semantic equivalence. Legacy options allow work outside the normal path, so these guarantees depend on following it with its baseline and full controls. Every barrier has a cost: maintaining metadata, resolving conflicts and rejecting changes that previously could have been pasted directly into the interface. That cost buys reproducible review.

## What is demonstrated and what remains open

The internal documentation reviewed describes the implementation of this path and records tests of its controls with writes disabled. It also leaves the first real deployment from the changes directory and contributor onboarding pending. This is therefore an implemented capability with incomplete operational validation, rather than a production workflow already proven end to end.

The write is not an atomic transaction with automatic rollback: if the subsequent comparison fails, the tool reports the problem and requires inspection. Reading back checks content; it does not by itself test business-flow behavior, associations or a function's external effects. Those outcomes need specific tests and observation after the change.

## When this design makes sense

It fits when several people or agents need to analyze and propose changes to sensitive automations while production authority must remain bounded. A small team making occasional changes can start with backup and manual review: adding a deployment path before defining owners and checks only adds another way to make mistakes.

The prerequisite for going further is sustaining both halves: a reliable picture of production and an explicit publication path that does not inherit analysis permissions. The [read-only architecture](/en/entrada/arquitectura-read-only) explains that separation; the [process map](/en/entrada/mapa-procesos-verificacion) shows how to turn a finding into verifiable work.

## The benefit

The backup had already made it possible to review changes, audit risks and analyze state without distributing production credentials. The next stage uses that foundation to organize the path from a finding to publication. The observed benefit of reading is preserved; closing the full deployment loop remains subject to the pending tests.
