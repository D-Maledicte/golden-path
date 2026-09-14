---
slug: orca-como-ade
title: Orca como ADE y plano de control
type: concept
order: 1
summary: Orca organiza agentes, repositorios y entornos de ejecución; no sustituye al modelo ni decide por sí solo cómo debe trabajar el equipo.
tags: [orca, ade, agentes, control-plane]
related: [workspaces-y-worktrees, orquestacion, agent-terminals]
---

# Orca como ADE y plano de control

## La idea en una frase

Orca es un **Agent Development Environment**: una interfaz para ejecutar y supervisar distintos agentes de código sobre proyectos reales, cada uno con su propia terminal, sesión y espacio de trabajo.

No aporta un “cerebro” nuevo. Los cerebros siguen siendo Codex, Claude Code, OpenCode, Pi u otros agentes CLI. Orca aporta el lugar donde se ve quién está trabajando, sobre qué rama, en qué host y con qué estado.

## Qué problema resuelve

Cuando los agentes viven en terminales sueltas, la coordinación queda en la memoria del operador:

- qué agente estaba en cada repositorio;
- cuál tenía permiso para editar;
- qué rama correspondía a cada tarea;
- cuál terminó y cuál espera una decisión;
- dónde quedó una sesión después de cerrar una ventana o cambiar de equipo.

Orca vuelve visible ese estado y lo ata a entidades concretas: proyecto, workspace, worktree, terminal, sesión y host.

## Tres planos distintos

### Agente

Es el ejecutor: Codex, Claude Code, OpenCode u otro CLI. Razona, usa herramientas y modifica archivos según sus permisos.

### Entorno de ejecución

Es la máquina donde realmente viven el repositorio, Git, las dependencias y las credenciales. Puede ser la PC local, WSL, una máquina por SSH o un Orca Server remoto.

### Plano de control

Es Orca Desktop. Permite abrir, ordenar, observar y retomar el trabajo sin trasladar necesariamente el código a la máquina desde la que se mira.

Separar estos planos es la primera gran ganancia conceptual: **la interfaz puede cerrarse o cambiar de dispositivo sin que el entorno de desarrollo tenga que mudarse**.

## Qué no hace por sí solo

Orca habilita trabajo paralelo, pero no garantiza una buena orquestación. Cinco agentes abiertos en cinco paneles pueden producir cinco veces más conflicto si comparten alcance, rama o archivos sensibles.

El valor aparece cuando se suma una metodología:

- un responsable de contexto y planificación;
- tareas acotadas;
- un worktree por implementación;
- límites explícitos sobre archivos compartidos;
- revisión, pruebas y decisión humana antes de integrar.

## Cuándo conviene

Orca gana sentido cuando hay varios proyectos, agentes o tareas simultáneas; cuando el entorno corre en Linux pero la interfaz se usa desde Windows; o cuando hace falta recuperar contexto después de interrupciones frecuentes.

Para una única consulta rápida en un repositorio pequeño, una terminal común puede alcanzar. Orca empieza a pagar su complejidad cuando el problema deja de ser “hablar con un agente” y pasa a ser **administrar un sistema de trabajo con agentes**.

## Resultado buscado

El objetivo no es tener más agentes encendidos. Es aumentar el trabajo útil en paralelo sin perder trazabilidad, aislamiento ni capacidad de frenar.

## Referencias

- [Orca — repositorio oficial](https://github.com/stablyai/orca)
- [Agents & sessions](https://www.onorca.dev/docs/model/agents-sessions)
