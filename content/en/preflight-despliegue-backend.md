---
slug: preflight-despliegue-backend
title: Before publishing, test the real startup
type: guide
order: 12
summary: "A successful build does not guarantee the backend can start. A preflight with the production command and a blocking healthcheck close that gap."
tags: [deploy, backend, preflight, healthcheck, production, agents]
related: [modelos-guiados-el-entorno-es-la-politica, continuidad-y-observabilidad, orquestacion]
area: Gobierno de agentes
glyph: ◉
hue: rgba(237,195,94,.25)
---

# Before publishing, test the real startup

## The false positive of a green build

A backend can compile and still fail to start. The build verifies that its steps finished; it does not prove that the production process resolves its imports, loads its configuration, opens the port and answers a request.

In a real incident, an entry file ended up with duplicated content. The deploy went ahead, but the server entered a crash loop because of repeated declarations. Recovery required fixing the code and publishing again. The problem that mattered was already in the repository: what was missing was a test able to see it before the deploy.

## Three checks, three different questions

### 1. Does the entry file keep a valid structure?

If a generator, a merge or an agent modifies the startup point, review the diff and run the runtime’s syntax check. Catch obvious duplications of imports, server initialization or whole blocks before calling the change done.

This review is project-specific: it is not enough to search for a repeated string and assume every repetition is an error.

### 2. Does the command production uses actually start?

Run the production command in a test environment with the configuration it needs. Wait for the process to open the port and make an HTTP request to a lightweight endpoint. If the process dies or the request fails, the deploy is blocked.

Do not replace this check with development mode. Scripts, variables, bundlers and import paths can differ.

A minimal sequence, adapted to the project, looks like this:

```bash
npm run build
PORT=5000 npm run start
# In another terminal:
curl --fail --show-error http://127.0.0.1:5000/health
```

The example assumes `start` and `/health` exist; use the service’s real names. The process must be able to shut down cleanly when the test ends.

### 3. Does the deploy wait for a healthy response?

Configure the hosting healthcheck so a deploy is only considered ready when the backend responds. A static page or a process that started for an instant does not prove the API is operational.

The health endpoint should be cheap and represent the capability you need to serve traffic. If it depends on external services, distinguish between **process alive** and **service ready** to avoid restarts caused by a temporarily unavailable dependency.

## Order matters

1. Review the entry point diff.
2. Run the build and the syntax check.
3. Start the real command in a test environment.
4. Test an HTTP response.
5. Publish with a blocking healthcheck.
6. Confirm the response from the deployed URL.

Each step answers a different question. A green check does not replace the next one.

## When an agent is doing the work

The task contract has to ask for concrete evidence: the command run, relevant output, the HTTP response code and the deploy result. The phrase “it works” is not enough to cross the production boundary.

If the preflight fails, the agent fixes and repeats the test. If configuration is missing that only exists in production, it records what it could verify and what is left pending for an equivalent environment; it does not turn an assumption into approval.

## From local tests to published effects

Operational case records reviewed on October 12, 2026 add another version of the same problem. An n8n integration had passed 56 tests, an audit and static review, but had not executed its actual HTTP node. The first real request to the already published workflow failed in its HTTP node. This was a result in that circuit and configuration, not a universal n8n defect or proof that tests were useless: the path producing the effect was missing from coverage.

Later acceptance records documented two runs: change an authorized parameter, publish, read back the state and check the webhook response; then restore, **publish again** and verify that the webhook recovered its original behavior. Restoring a definition without checking the active version did not close the loop.

This evidence was read in project records, not reproduced for this editorial. It also did not cover control-hook failures or timeouts. The current distinction is useful for any handoff: **locally ready is not applied; applied is not accepted**. An immediate postflight proves a specific condition; when the objective depends on routine use, observe the agreed natural operating cycle before closing. See [the cockpit's evolution](/en/entrada/caso-orca-cockpit-multiagente).

## Transferable rule

**Publishing starts before the deploy button.** First you have to prove that the same program that will receive traffic can start and respond. Then the hosting has to refuse to declare a deploy successful if it does not pass that test.

> Case based on a real incident. Names, dates, repositories and identifiable operational details were omitted.
