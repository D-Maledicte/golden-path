---
slug: workspaces-y-worktrees
title: Workspaces, projects and worktrees
type: concept
order: 2
summary: The project organizes the repository, the workspace represents a work front and the worktree provides real isolation of files and branch.
tags: [orca, git, workspaces, worktrees, parallelism]
related: [orca-como-ade, orquestacion, agent-terminals]
area: Orca
glyph: ⑂
hue: rgba(87,217,232,.22)
---

# Workspaces, projects and worktrees

## The usual confusion

Project, workspace and worktree look alike, but they serve different purposes. Understanding that separation avoids the classic disaster of several agents editing the same checkout.

## Project

The stable reference to the repository or related set of repositories. It groups the different work fronts and lets you apply shared configuration.

A project should not represent a temporary task. It is the durable container that workspaces are born from.

## Workspace

The visible operating unit in Orca: a place with tabs, panes, terminals, editors and, usually, an associated task or front.

The visual hierarchy between workspaces helps organize the operation, but it does not change Git history on its own. A child workspace can express dependency or coordination without implying a stacked branch.

## Worktree

The real isolation provided by Git. Each worktree has:

- its own directory;
- its own branch or ref;
- its own working files;
- its associated terminals and agents.

That is why Orca is *worktree-native*: each feature, fix or audit can live in a separate working copy without requiring `stash`, constant branch switching or competition over the same files. The expected cycle is create, work, review, merge and archive.

## Recommended pattern

### Main workspace

Holds the full project context, reviews state and prepares the plan. It is not used as an indiscriminate dump for parallel implementations.

### Implementation workspaces

Each one gets a concrete task, a branch and a file scope. The agent can work autonomously within that boundary.

### Review workspace

Checks diffs, tests and compatibility before merging. It can be the main one or a dedicated one depending on the risk.

## The minimum contract for a task

Before launching an agent, make these explicit:

1. a verifiable goal;
2. the assigned branch and worktree;
3. allowed paths;
4. shared files or resources it must not touch;
5. required tests;
6. the stop condition and handoff format.

## Shared files: the delicate point

A new worktree does not automatically inherit everything Git ignores. Dependencies, caches and local secrets may need specific setup. Orca lets you share large directories or copy ignored files into each worktree, but it is worth distinguishing:

- **share** heavy, rebuildable resources;
- **copy** configuration that each worktree must be able to modify without affecting the others;
- **do not propagate** unnecessary secrets.

Lockfiles, migrations, infrastructure and cross-cutting configuration should have a single owner per work window.

## The real benefit

Isolation does not only prevent technical conflicts. It also makes it easier to compare alternatives, drop one implementation and keep another, or audit a change without dirtying the main checkout.

## Reference

- [Worktrees — Orca Docs](https://www.onorca.dev/docs/model/worktrees)
