---
slug: arquitectura-read-only
title: Read-only as an architectural decision
type: guide
order: 2
summary: Keep backup and analysis without production authority while a separate path allows reviewed, verifiable changes to be deployed.
tags: [read-only, permissions, zoho, security, snapshots]
related: [backup-versionado-crm, mapa-procesos-verificacion, modelos-guiados-el-entorno-es-la-politica]
area: CRM versionado
glyph: ⌁
hue: rgba(87,217,232,.22)
---

# Read-only as an architectural decision

> Updated on October 12, 2026. The initial stage was entirely read-only; the multiuser evolution preserves that boundary for observation and adds a controlled write path.

## Why promising not to write is not enough

For Zoho CRM Deluge functions, creating or updating through the API publishes the change immediately. API V8 distinguishes this behavior from Java, Node.js and Python, which support drafts and separate publication. A `PUT` against Deluge in production can affect active code: do not generalize the draft protection of other runtimes. [Functions in V8](https://www.zoho.com/crm/developer/docs/api/v8/whats-new.html).

That is why reading was not treated as a convention of the script, but as a property of the system. The project evolution changes the scope of that statement: it describes synchronization and analysis, while deployment has its own credentials, commands and conditions.

## The barriers

### Minimal scope

The read token only uses `ZohoCRM.settings.functions.READ`. It has no Create, Update, Publish or Delete. The credential rejects a mutation even if the code attempts one.

### Separate reading and writing

The original client only implemented reading. The deployment stage incorporates mutating operations in an explicit path disabled by default. Describing the entire project as exclusively `GET` would now be incorrect: what must be preserved is that the observation task has no authority to publish.

### A generated tree

`functions/` is a snapshot of the CRM and is not edited by hand. Proposals live in `cambios/`, with their baseline and metadata for review. The separation makes it clear what was observed and what is intended to change; a subsequent synchronization reflects production state again.

### Git as review and provenance

The repository preserves snapshots and now also organizes proposals through pull requests and review owners. Merge and deployment are different steps: having a change in Git does not mean it has been published or that its result has been verified.

## Deployment authority is not inherited

The contributor works with read permissions. The deployment owner needs a credential authorized by CRM scopes and profile, as well as explicitly enabling writes and passing additional checks. The CLI flag prevents accidents; it is not a permission boundary by itself. A person allowed to edit in the CRM interface can still do so outside this convention. In the documented normal path for reviewed changes:

- the function must resolve unambiguously; a colliding `api_name` does not authorize choosing an arbitrary target;
- the file to publish must be tracked, locally unchanged and on `main` aligned with `origin/main`;
- a hash comparison of normalized code detects production changes relative to the baseline used to prepare the proposal;
- after publishing, the code is downloaded and compared with what was sent, either exactly or with normalization.

The CLI also retains an explicit option for files outside `main`; if the baseline header is missing, that path can continue with a warning and without drift protection. Having controls in the repository is therefore not enough: the team must require the reviewed path and treat exceptions as higher-risk decisions.

If production changed in the meantime within the protected path, the proposal must be reviewed again against a current baseline. The comparison detects some code drift before writing; it is not an atomic lock against concurrent changes and does not guarantee that data, connections or associations remained unchanged.

The normalized comparison removes whitespace and parentheses: it can treat different texts as equal and is not a semantic test. If post-write verification fails, the error is reported; there is no automatic rollback. The operation may already have published, and a notification failure does not undo it either.

These controls complement human review. They do not turn Deluge into a runtime with drafts: the risk of immediate publication remains relevant. The documentation records tests without writes and leaves the first real deployment through this path pending; a tested guardrail must not be presented as a complete deployment test.

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

The dead-man’s switch lives outside the scheduler and distinguishes the last run from the last success. It should alert if either signal grows stale: a series of errors must not keep the health signal fresh. If it shared a process with the sync, they would die together and the silence would be ambiguous.

## Reusable principle

**Authority should follow the task: observe with read permissions, propose in a separate space, and publish only through an explicit, reviewed and verifiable path.**
