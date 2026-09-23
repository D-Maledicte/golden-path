---
slug: orquestacion
title: Orquestación en Orca
type: concept
order: 3
summary: "Orquestar no es abrir agentes en paralelo: es repartir autoridad, dependencias, contexto, decisiones y evidencia de finalización."
tags: [orca, orquestacion, multiagente, coordinacion, delegacion]
related: [workspaces-y-worktrees, agent-terminals, caso-orca-cockpit-multiagente]
area: Orca
glyph: ✣
hue: rgba(236,95,189,.24)
---

# Orquestación en Orca

## Paralelismo no es orquestación

Abrir varios agentes al mismo tiempo aumenta capacidad, pero no define quién decide, qué depende de qué ni cuándo una tarea está realmente terminada.

Hay orquestación cuando existen, como mínimo:

- un objetivo común;
- división explícita del trabajo;
- propiedad clara de cada resultado;
- dependencias conocidas;
- canales para preguntas y bloqueos;
- una autoridad de cierre;
- evidencia revisable.

## Dos capas posibles

### Orquestación metodológica

Es el patrón que puede aplicarse hoy usando workspaces y terminales normales:

1. un agente gerente conserva el contexto integral;
2. prepara tareas acotadas;
3. cada implementador trabaja en un worktree aislado;
4. los agentes entregan diff, pruebas, riesgos y pendientes;
5. el gerente revisa e integra;
6. las acciones productivas quedan detrás de una decisión humana.

Esta capa no depende de una función experimental. Su autoridad está en el contrato de trabajo, Git y el proceso de revisión.

### Orquestación nativa de Orca

Orca incorpora una capa estructurada, actualmente experimental, basada en:

- **Run:** contexto durable de coordinación;
- **Task:** unidad de trabajo con estado y dependencias;
- **Dispatch:** intento concreto de ejecutar una tarea en una terminal;
- **Worker:** agente supervisado que realiza ese intento;
- **Message:** comunicación de estado, preguntas, heartbeats y cierres;
- **Decision gate:** decisión pendiente que bloquea el avance.

Esta opción sirve cuando importa seguir un grafo de tareas, registrar ownership o exigir que cada worker cierre formalmente su dispatch. Para un prompt puntual observado por una persona, una terminal común sigue siendo suficiente.

## El rol del gerente

El gerente no debería convertirse en el implementador universal. Su valor está en:

- sostener la visión integral;
- detectar dependencias entre frentes;
- preparar instrucciones que otro agente pueda ejecutar;
- revisar evidencia y compatibilidad;
- decidir qué se integra y qué vuelve a trabajo.

Cuanto más escribe directamente en todos los frentes, más pierde la separación que hace útil al sistema.

## Qué delegar

Delegar funciona bien para tareas que pueden describirse con un borde claro: implementar un endpoint, auditar un módulo, escribir pruebas, comparar alternativas o verificar una migración.

Conviene mantener centralizadas las decisiones que cruzan varias ramas: lockfiles, esquemas compartidos, secretos, migraciones, despliegues y cambios de arquitectura.

## Handoff mínimo de un worker

Una entrega debería contestar:

- qué hizo;
- qué archivos modificó;
- qué pruebas ejecutó;
- qué no pudo comprobar;
- qué riesgos o decisiones quedan;
- qué commit o rama contiene el resultado.

“Terminé” sin evidencia no es una finalización; es apenas una notificación.

## Referencia

- [Orchestration — Orca Docs](https://www.onorca.dev/docs/cli/orchestration)
