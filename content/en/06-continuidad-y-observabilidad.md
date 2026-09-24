---
slug: continuidad-y-observabilidad
title: Continuity, recovery and observability
type: concept
order: 6
summary: Orca preserves layout and scrollback, and can keep agents alive as long as the daemon survives; critical state must still exist outside the interface.
tags: [orca, sessions, recovery, observability, daemon]
related: [agent-terminals, hosts-ssh, caso-orca-cockpit-multiagente]
area: Orca
glyph: ◌
hue: rgba(237,195,94,.25)
---

# Continuity, recovery and observability

## What continuity means

Continuity is not a chat staying open. It is being able to answer, after an interruption:

- what was being done;
- on which branch and worktree;
- which processes are still alive;
- what evidence was produced;
- where it makes sense to resume from.

Orca restores workspaces, tabs, splits, focus and scrollback. As long as the host daemon survives, it can also keep agent processes alive even if the Desktop window closes or restarts.

## The physical limit

If the whole host goes down —reboot, power cut, kernel panic— the processes end. When it comes back, the layout and the last scrollback can be restored, but not the execution that was in memory.

That is why there are three different levels:

1. **Visual state:** layout, tabs and scrollback.
2. **Process state:** CLI agent and PTY kept alive by the daemon.
3. **Work state:** Git, files, commits, documentation and handoff.

Only the third one survives a total outage independently and lets you rebuild with confidence.

## What we learned recovering sessions

In real recoveries we had to tell apart a crashed interface, a stopped Orca service, an agent that was still alive and a healthy worktree whose conversation could no longer be resumed.

Before killing processes or cleaning up workspaces, it pays to look at the state of the runtime, the session, the branch, the worktree and Git. The goal is not to rebuild the whole infrastructure from memory: it is to identify which layer failed and preserve the ones that are still healthy.

The rule is simple: **identify first, intervene second**.

## Per-pane observability

Orca’s stable identifiers let you relate workspace, worktree, tab and terminal to the process running there. That relationship is enough to build read-only observability without controlling the agent’s session.

This was the basis for visualizing agents outside Orca without controlling or modifying their sessions. Observability stays separate from operational authority.

## Continuity documentation

Every important stage of work should leave a short summary outside the scrollback:

- the current goal;
- decisions made;
- branch and worktree;
- modified files;
- validations performed;
- risks and open items;
- exact instructions to resume.

The transcript explains how you got here. The handoff says where you are.

## The real benefit

Recovery stops being “open windows until something looks familiar”. It becomes a layer-by-layer diagnosis that lets you preserve live agents, rescue work and avoid destructive clean-ups driven by anxiety. Nothing worse than killing the wrong manager in a hurry.

## Reference

- [Session restore — Orca Docs](https://www.onorca.dev/docs/model/session-restore)
