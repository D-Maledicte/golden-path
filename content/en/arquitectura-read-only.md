---
slug: arquitectura-read-only
title: Read-only as an architectural decision
type: guide
order: 2
summary: Design the backup so it cannot publish to Zoho, even if a script, an instruction or an agent tries to cross the line.
tags: [read-only, permissions, zoho, security, snapshots]
related: [backup-versionado-crm, modelos-guiados-el-entorno-es-la-politica]
area: CRM versionado
glyph: ⌁
hue: rgba(87,217,232,.22)
---

# Read-only as an architectural decision

## Why promising not to write is not enough

Deluge has no draft stage equivalent to a review environment. Creating or updating a function publishes the change immediately. A badly executed `PUT` is a production deploy with no safety net.

That is why reading was not treated as a convention of the script, but as a property of the system.

## The barriers

### Minimal scope

The token only uses `ZohoCRM.settings.functions.READ`. It has no Create, Update, Publish or Delete. The credential rejects a mutation even if the code attempts one.

### A client with no mutating operations

The project implements only `GET` requests. Destructive endpoints are documented to understand the risk, but they are not part of the client.

### A generated tree

`functions/` is a snapshot of the CRM. It is not edited by hand or used as a deploy source. A valid change is made in Zoho and shows up in the next sync.

### Git as history, not as a publish button

The repository keeps snapshots and enables analysis. It is not wired to a pipeline that automatically publishes functions back to the CRM.

## Decisions that prevent fake backups

- The path includes the category and `api_name`; the name alone can collide.
- The run aborts on a collision instead of silently overwriting.
- Pruning is disabled if any download failed.
- Without a readable previous snapshot, the fallback is a full download.
- If the expected count does not match the pagination, no partial snapshot is saved.

## The awkward case of secrets

Source code may contain literal credentials. Before the first push, scan the tree and decide on each finding:

1. rotate and remove the credential;
2. version it in a private repository if the risk was accepted;
3. temporarily exclude the file and document that it has no backup.

A cloud provider credential may be detected and revoked automatically when pushed. Excluding it avoids that breakage, but creates explicit debt: the function stops having history.

## Quiet operation, active monitoring

A normal run with no changes creates no commit and sends no notification. Silence is healthy only if there is a separate control that notices when the signal stops arriving.

The dead-man’s switch lives outside the scheduler and alerts when the agreed threshold passes without a confirmed run. If it shared a process with the sync, they would die together and the silence would be ambiguous.

## Reusable principle

**When writing has an irreversible effect, the barrier has to live in the credential and the topology, not in the good behavior of the code.**
