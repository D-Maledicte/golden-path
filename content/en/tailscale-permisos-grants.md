---
slug: tailscale-permisos-grants
title: "Tailscale: permissions you can explain"
type: guide
order: 15
summary: "Design grants by identity, destination, and port; test allowed and denied access; separate networking, SSH, and application permissions."
tags: [tailscale, grants, acl, ssh, security, policy]
related: [tailscale-red-privada-identidad, tailscale-entorno-agentes, acceso-portatil-orca]
area: Gobierno de agentes
glyph: ⚿
hue: rgba(168,106,255,.24)
---

# Tailscale: permissions you can explain

## Membership is not a permission model

The first prototype connects two devices and celebrates that they can see each other. An environment with agents, VPS instances, and internal dashboards needs a more precise question: **which identity may initiate a connection to which destination on which port?**

Tailscale recommends **grants** for these permissions. Each grant defines `src`, `dst`, and network (`ip`) or application (`app`) capabilities. Connections without an allowing rule are denied. There is a catch: a new tailnet commonly starts with an *allow all* policy. Review and replace that broad rule before assuming least privilege. [Grants](https://tailscale.com/docs/features/access-control/grants) · [Default ACL policy](https://tailscale.com/docs/features/access-control/acls)

## Draw the policy before editing it

Consider a laptop, a development host, and a VPS. The goal is laptop → host for SSH, host → VPS for HTTPS, and no laptop access to the VPS database.

| Source | Destination | Port | Decision |
| --- | --- | --- | --- |
| Work laptop | Development host | TCP 22 | Allow |
| Development host | Internal API on VPS | TCP 443 | Allow |
| Work laptop | Database on VPS | TCP 5432 | Deny |

One schematic implementation using grants is:

```json
{
  "tagOwners": {
    "tag:dev-host": ["autogroup:admin"],
    "tag:internal-api": ["autogroup:admin"]
  },
  "grants": [
    {
      "src": ["person@example.com"],
      "dst": ["tag:dev-host"],
      "ip": ["tcp:22"]
    },
    {
      "src": ["tag:dev-host"],
      "dst": ["tag:internal-api"],
      "ip": ["tcp:443"]
    }
  ]
}
```

Adapt this example: the identity and names are fictitious, and the devices must actually be assigned those tags. Review existing grants and ACLs before applying a real policy. A broad existing rule can still allow traffic: policies add permissions; they do not offer a `deny` rule to subtract access granted elsewhere. [Grant syntax](https://tailscale.com/docs/reference/syntax/grants) · [Tags](https://tailscale.com/docs/features/tags)

## SSH has two operating modes

**Regular SSH over Tailscale** keeps the host's `sshd`, local users, and SSH keys; the tailnet provides a private route, while the grant permits the port. **Tailscale SSH** lets Tailscale manage SSH authentication and authorization on supported nodes, with separate `ssh` policy rules and options such as `check`. Opening TCP 22 with a grant does not configure Tailscale SSH. Tailscale SSH also cannot connect to a machine that only sits behind a subnet router. [Tailscale SSH](https://tailscale.com/docs/features/tailscale-ssh)

If the existing Orca SSH workflow works, keeping it while restricting the network route is a reasonable first step. Migrating to Tailscale SSH deserves its own test of users, sessions, and recovery.

## Test that the boundary exists

Start with **Preview rules** to inspect a user's reachable destinations and add policy tests for expected connections. Then test from a real device: SSH into the allowed host, and attempt the restricted port on a destination that is **online and listening**. A timeout to an offline machine proves nothing about the policy. [Editing and previewing policies](https://tailscale.com/docs/features/tailnet-policy-file/manage-tailnet-policies)

For diagnosis, `tailscale ping --tsmp` tests connectivity before access controls; `tailscale ping --icmp` includes access controls. If both work but the application fails, check the port, service, and its own permissions. Use the actual protocol to test a particular port: ping cannot prove that TCP 22 or 443 is permitted.

The result should fit in one sentence: “this identity can reach this service on this port, and cannot reach that one.” The [agent environment case](/entrada/tailscale-entorno-agentes) shows where to place those connections.
