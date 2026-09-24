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

## The problem

The Deluge code behind the automations lives inside Zoho CRM. The interface offers no queryable history equivalent to Git, and an edit replaces the previous state. Without an external copy, recovering a version depends on memory, stray files or luck.

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

The API does not report where a function is attached. That is why the report can flag candidates, but cannot claim a function is unused.

## The value rule

A backup that changes every day without real changes is noise. For Git to tell a useful story:

- the JSON sorts its keys;
- files normalize line endings;
- reports do not include generation timestamps;
- pruning only runs if every download finished;
- the category is part of the path because `api_name` is not unique.

## The benefit

The CRM stopped being a black box with no memory. Now it is possible to review what changed, audit risks, clone the state for analysis and verify improvements without handing production credentials to every person or agent.
