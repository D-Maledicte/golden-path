---
slug: opendesign-direccion-visual-agentes
title: OpenDesign and the visual direction of agents
type: editorial
order: 1
summary: Models can already build interfaces. The problem is getting them to stop improvising the visual identity on every run. OpenDesign proposes turning that direction into portable files.
tags: [opendesign, design-md, design, agents, skills, templates, visual-direction]
related: [opendesign-integracion-local-cli-proxy, modelos-guiados-el-entorno-es-la-politica, orquestacion, terminal-vs-web-superficies-trabajo]
area: Diseño agéntico
glyph: ✦
hue: rgba(236,95,189,.24)
---

# OpenDesign and the visual direction of agents

> Editorial validity: September 14, 2026. OpenDesign evolves quickly; check adapters, catalog and requirements in the official documentation before setting them as policy.

Coding agents learned to build interfaces before they learned to sustain a visual identity. They can turn a brief into HTML, CSS and working components, but they still tend to design each run as if it were the first: they invent a palette, change the type scale, alter the spacing and end up back at the same generic dashboard with floating cards.

OpenDesign starts from a more interesting thesis than “AI designs now”: **the capability already exists, but it lacks a persistent visual direction and a production method**.

It does not introduce a new model. It installs as a layer around the agents we already use —Codex, Claude Code, OpenCode, Cursor, Gemini CLI, Hermes and others— and turns them into the engines of a local design workspace.

## Separating what to build from how it should look

In a traditional prompt, product and aesthetics usually get mixed up:

> Make a modern, elegant, dark dashboard, with metrics, filters and a premium style.

The description seems sufficient until you need a second screen, a presentation or an email with the same brand. Then the drift appears: each agent interprets “modern” differently.

OpenDesign splits the process into pieces:

| Piece | Responsibility |
|---|---|
| Brief | Goal, audience and content |
| Skill | Working method and production rules |
| Template | Type and structure of the artifact |
| `DESIGN.md` | The visual identity to preserve |
| Agent | Reasoning and execution |

The combination keeps the visual language constant while the artifact changes. The same system can steer a landing page, a dashboard, a mobile prototype or a deck without describing the brand from scratch again.

## `DESIGN.md` as a visual contract

The most valuable piece of the approach is `DESIGN.md`: a file that encodes decisions about color, typography, hierarchy, composition, spacing, surfaces, components and constraints.

It is not just a collection of tokens. It can express judgment:

- what should feel dense or light;
- when to use an editorial typeface;
- which treatments are forbidden;
- how hierarchy is built;
- which traits make the brand recognizable;
- how much motion is acceptable;
- how to avoid the visual clichés of generated content.

OpenDesign can extract that system from screenshots, Figma, a URL or a repository and store it next to the project. From then on, the direction no longer lives only in the memory of a conversation or in a person’s eye.

That file can be versioned, reviewed and used with different agents. Swapping Codex for Claude Code should not require rebuilding the identity; neither should swapping a landing page for a presentation.

## From a conversation to a production line

The proposed flow is:

```text
brief → template → direction → DESIGN.md → artifact → handoff → memory
```

The agent receives the visual system and the relevant instructions, writes real files and updates an isolated preview. The result can continue as code or be exported, depending on the format, to HTML, ZIP, PDF, PPTX or video.

This changes the unit of value. It is no longer only about generating an attractive screen, but about building a process capable of producing a coherent family of artifacts.

## A creative director, not a new employee

OpenDesign does not replace the agent that implements. Nor does it automatically replace Figma or a designer.

Its role is closer to a shared creative director’s:

- it provides a persistent visual direction;
- it selects methods and templates;
- it hands the agent specialized context;
- it shows the result inside a visual workspace;
- it accumulates preferences and confirmed artifacts.

The model still solves and writes. OpenDesign shapes the ground on which it makes those decisions.

This distinction matters because agentic design does not improve only by buying a bigger model. It also improves by reducing the number of visual decisions the model has to improvise.

## Where it fits next to Figma

OpenDesign is closer to an agent-driven visual IDE than to a traditional collaborative canvas.

| OpenDesign favors | Figma favors |
|---|---|
| Generation from intent | Direct visual manipulation |
| Artifacts born as code | Freeform design on a canvas |
| Systems portable across agents | Mature component libraries |
| Automation and repetition | Precise comments and redlines |
| Direct handoff to engineering | Multi-person visual collaboration |

There is no need to pick one as an absolute replacement for the other. A team can explore and produce in OpenDesign, review or refine in Figma when the kind of work calls for it and bring the confirmed decisions back into the portable system.

## The value for a multi-agent factory

In an environment where different agents play different roles, `DESIGN.md` works as a shared policy. The coordinator can define the direction; a worker produces the first artifact; another reviews accessibility; another integrates it into the product. They all read the same visual contract.

This lets you separate responsibilities:

```text
Orca or cockpit      → coordinates sessions and projects
Codex / Claude       → reason and implement
OpenDesign           → keeps visual direction and methods
GitHub               → versions the result
Figma                → enables manual review when needed
Hosting              → publishes the artifact
```

OpenDesign does not need to take over the whole factory to be useful. It can come in as a specialty, just like a security agent, a browser or a testing tool.

## The limit of enthusiasm

The project is ambitious: it combines a desktop app, a local daemon, adapters for many CLIs, skills, plugins, MCP, multimedia generation and previews. Each integration adds value, but also failure surface.

Also, a huge catalog does not guarantee uniform quality. Community skills and plugins should be treated as third-party code and instructions, especially when the agent has access to the filesystem and the terminal.

Open source does not mean zero cost either. The app can be free, but every generation consumes the quota or credits of the selected agent and provider.

## Verdict

OpenDesign deserves attention because it goes after the exact point where assisted development usually loses quality: **inconsistency between runs**.

Models already know how to produce interfaces. The hard part is teaching them which decisions they should not make again, which identity they must preserve and how to transfer that judgment to another agent and another format.

By turning visual direction into versionable files, OpenDesign moves design from the ephemeral prompt into the project’s infrastructure. That idea matters more than any template in its catalog.

---

## Official sources

- [OpenDesign](https://open-design.ai/)
- [Official repository](https://github.com/nexu-io/open-design)
- [Quickstart](https://github.com/nexu-io/open-design/blob/main/QUICKSTART.md)
- [Agent adapters](https://open-design.ai/agents/)
