---
slug: backup-versionado-crm
title: Versioned backup of CRM functions
type: concept
order: 1
summary: Turn code that only lives inside Zoho CRM into a daily, auditable and browsable snapshot, without ever writing to production.
tags: [zoho-crm, backup, git, deluge, audit]
related: [arquitectura-read-only, mapa-procesos-verificacion, modelos-guiados-el-entorno-es-la-politica]
area: CRM versionado
glyph: ▣
hue: rgba(237,195,94,.25)
---

# Versioned backup of CRM functions

> External product documentation reviewed on October 12, 2026. Historical cases and local operating choices are preserved.

## The problem

The Deluge code behind the automations lives inside Zoho CRM. The current interface provides a Revisions tab with the latest 30 versions; for Deluge, each save creates a revision. That bounded history does not replace an external repository with diffs, analysis and its own retention policy. [Function management](https://www.zoho.com/crm/developer/docs/functions/management.html).

The project downloads the code and metadata of every function, generates a deterministic tree and creates a commit only when something actually changed.

## Four results in a single run

1. **Backup:** complete source code outside the CRM.
2. **History:** `git log`, diffs and blame on previously opaque functions.
3. **Audit:** regenerated reports showing REST surface, test functions, hygiene and literal secrets.
4. **Map:** grouping by business flow so a branch can be analyzed without walking the whole tree by hand.

## Architecture

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

The credential only has `ZohoCRM.settings.functions.READ`. The restriction lives below the code: even if the process tried to update a function, it would have no authority to do so.

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

## The benefit

The CRM stopped being a black box with no memory. Now it is possible to review what changed, audit risks, clone the state for analysis and verify improvements without handing production credentials to every person or agent.
