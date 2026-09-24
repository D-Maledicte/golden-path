---
slug: opendesign-integracion-local-cli-proxy
title: OpenDesign across Windows, WSL, plans and proxies
type: editorial
order: 2
summary: Local-first does not always mean a single environment. When the interface lives on Windows and the agents in WSL, choosing between CLI, BYOK and proxy defines spend, sessions and risk surface.
tags: [opendesign, windows, wsl, local-cli, byok, proxy, codex, claude-code, opencode-go]
related: [opendesign-direccion-visual-agentes, setup-windows-wsl, hosts-ssh, continuidad-y-observabilidad]
area: Diseño agéntico
glyph: ⌁
hue: rgba(87,217,232,.22)
---

# OpenDesign across Windows, WSL, plans and proxies

> Editorial validity: September 14, 2026. Authentication mechanisms, models and limits depend on each provider and can change.

“Local-first” sounds like a single computer. On Windows with WSL, however, one computer contains two environments that share resources but not necessarily executables, credentials or sessions.

The OpenDesign app can live on Windows while Codex, Claude Code, OpenCode and the repositories live inside Ubuntu. On screen everything looks local; from the daemon’s point of view they are different worlds.

That boundary defines much more than the installation. It defines who runs the model, where credentials are stored and which quota each generation counts against.

## Three paths to a model

OpenDesign can reach a model through three conceptual routes:

| Route | Authentication | Spend |
|---|---|---|
| Local CLI | The installed agent’s session | Quota of the plan tied to the CLI |
| BYOK / custom provider | API key | The provider’s API account or balance |
| OpenDesign Cloud | OpenDesign account | Credits included or purchased there |

If OpenDesign launches a Codex CLI authenticated with ChatGPT, the work is deducted from the Codex quota. If it launches Claude Code authenticated with Pro or Max, it consumes that plan. If it gets a key in the providers panel, it is no longer using the CLI’s session: it is making API calls.

The interface does not change this rule. The actual path the request takes decides it.

## Why a CLI installed in WSL may not show up

A daemon started by a Windows app inspects the Windows environment. It does not necessarily see:

- binaries installed inside Linux;
- the WSL shell’s `PATH`;
- configuration under the Ubuntu home;
- OAuth sessions stored by the Linux CLIs;
- variables exported in `.bashrc` or `systemd` services.

That is why having `codex`, `claude` or `opencode` working from Ubuntu does not guarantee OpenDesign Desktop will list them as Local CLI.

The most direct fix that keeps the native app is duplicating the CLIs on Windows and authenticating them there. The installations stay separate, even though they consume the same plan quota.

```text
OpenDesign Desktop on Windows
        ↓
Native Codex / Claude Code
        ↓
ChatGPT and Claude quotas
```

The alternative is running the OpenDesign daemon inside WSL and opening its interface from the Windows browser. That way the daemon shares the filesystem, PATH and credentials with the existing agents.

```text
Windows browser
        ↓
OpenDesign daemon in WSL
        ↓
WSL CLIs and repositories
```

## The proxy as a deliberate bridge

There is a third option: expose an OpenAI-compatible proxy in WSL and configure it as a custom provider.

```text
OpenDesign on Windows
        ↓
Local proxy on 127.0.0.1
        ↓
External provider
```

This path does not automatically reuse the Codex or Claude quota. OpenDesign thinks it is talking to an API; the proxy decides which provider and credential to use behind it.

The pattern is especially well suited to services that publish API endpoints and keys, such as OpenCode Go. It lets you adapt protocols, normalize models and add the stable session identifier Go asks for routing and prompt caching.

A proxy is not necessarily a hack. It can become a control boundary:

- it hides the real credential from the client;
- it applies model allowlists;
- it adds session headers;
- it sanitizes logs;
- it enforces limits and timeouts;
- it keeps every app from knowing the final provider.

But every added responsibility also turns the proxy into infrastructure someone has to maintain.

## Sessions: the detail that changes the result

A compatible endpoint does not guarantee a correctly identified conversation. OpenCode Go asks for a stable session per conversation, through native client information or the `x-opencode-session` header.

The proxy must avoid two extremes:

- generating a new ID on every request, losing continuity and caching;
- reusing a single global ID, mixing projects and conversations.

The right unit is usually an OpenDesign thread or project:

```text
x-opencode-session = hash(project_id + conversation_id)
```

The derivation must not include prompts, secrets or the API key.

## Real credential versus local credential

When OpenDesign requires filling in an API key field for a custom provider, there are two possible designs.

### Forward the real key

OpenDesign stores the provider key and sends it to the proxy, which forwards it.

It is simple, but the credential is stored and travels through more components.

### Separate the credentials

OpenDesign uses a random local token. The proxy validates it and fetches the real key from its own protected environment.

```text
OpenDesign        → local token
Proxy             → validates the local token
External provider → receives the real key
```

This separation limits the impact of an export, an accidental log or a client-side failure. For a stable installation it is the preferable option.

## Minimum rules for a local proxy

A bridge like this should meet at least these conditions:

1. listen only on loopback unless there is an explicit need;
2. not log `Authorization`, full bodies or sensitive variables;
3. keep a stable session per conversation;
4. declare an identifiable `User-Agent`;
5. allow only the models it needs;
6. use timeouts and size limits;
7. fail visibly, without silently switching providers;
8. keep a minimal health and model-discovery test.

Binding it to `0.0.0.0` turns a local bridge into a service reachable from the network. That decision demands authentication, a firewall and a different review.

## Quotas follow the actual provider

The rule for understanding spend is to follow the whole request:

```text
Who ultimately received the authenticated call?
```

- Codex CLI with a ChatGPT session: Codex quota.
- Claude Code with a Pro/Max session: Claude quota.
- OpenAI or Anthropic API: API billing.
- Proxy to OpenCode Go: Go’s included limits.
- Go with balance fallback enabled: Zen balance after the limit.
- OpenDesign Cloud: OpenDesign credits.

The model label in the interface can be misleading. An OpenAI model served by OpenCode Go does not consume the ChatGPT plan; it consumes the allowance of the provider that served the request.

## A reasonable architecture for a hybrid environment

To keep existing sessions and separate spend, one possible layout is:

| Path | Use |
|---|---|
| OpenDesign → Codex on Windows | Work deducted from the Codex plan |
| OpenDesign → Claude Code on Windows | Work deducted from the Claude plan |
| OpenDesign → WSL proxy → OpenCode Go | Cheap models under Go’s limits |
| Orca → WSL CLIs | Existing development and coordination |

Duplicating CLIs is not elegant, but it keeps the boundaries clear. Moving the whole daemon to WSL reduces duplication, although it gives up part of the native app’s convenience.

## Verdict

Local integration does not depend only on two processes living on the same computer. It depends on them sharing the right environment.

Installing the CLIs on Windows is the simplest route for OpenDesign Desktop to consume plan quotas. Running the daemon in WSL is the most coherent route for reusing existing installations. A proxy is the most flexible route when the provider offers an API and we need to control sessions, credentials or compatibility.

No option always wins. The right decision comes from choosing what we want to preserve: desktop convenience, existing sessions, traffic control or credential isolation.

---

## Official sources

- [OpenDesign](https://open-design.ai/)
- [OpenDesign Quickstart](https://github.com/nexu-io/open-design/blob/main/QUICKSTART.md)
- [Agent adapters](https://open-design.ai/agents/)
- [OpenCode Go](https://opencode.ai/docs/go/)
