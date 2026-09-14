---
slug: workspaces-y-worktrees
title: Workspaces, proyectos y worktrees
type: concept
order: 2
summary: El proyecto organiza el repositorio, el workspace representa un frente de trabajo y el worktree aporta aislamiento real de archivos y rama.
tags: [orca, git, workspaces, worktrees, paralelismo]
related: [orca-como-ade, orquestacion, agent-terminals]
---

# Workspaces, proyectos y worktrees

## La confusión habitual

Proyecto, workspace y worktree se parecen visualmente, pero cumplen funciones distintas. Entender esa separación evita el clásico desastre de varios agentes editando el mismo checkout.

## Proyecto

Es la referencia estable al repositorio o conjunto relacionado de repositorios. Agrupa los distintos frentes de trabajo y permite aplicar configuración común.

Un proyecto no debería representar una tarea temporal. Es el contenedor duradero desde el que nacen los workspaces.

## Workspace

Es la unidad operativa visible en Orca: un lugar con tabs, paneles, terminales, editores y, normalmente, una tarea o frente asociado.

La jerarquía visual entre workspaces sirve para ordenar la operación, pero no cambia por sí sola la historia de Git. Un workspace hijo puede expresar dependencia o coordinación sin que eso implique una rama apilada.

## Worktree

Es el aislamiento real provisto por Git. Cada worktree tiene:

- su propio directorio;
- su propia rama o referencia;
- sus propios archivos de trabajo;
- sus terminales y agentes asociados.

Por eso Orca es *worktree-native*: cada feature, corrección o auditoría puede vivir en una copia de trabajo separada sin exigir `stash`, cambios constantes de rama ni competencia por los mismos archivos. El ciclo esperado es crear, trabajar, revisar, integrar y archivar.

## Patrón recomendado

### Workspace principal

Mantiene el contexto integral del proyecto, revisa estado y prepara el plan. No se usa como depósito indiscriminado de implementaciones paralelas.

### Workspaces de implementación

Cada uno recibe una tarea concreta, una rama y un alcance de archivos. El agente puede trabajar con autonomía dentro de ese borde.

### Workspace de revisión

Comprueba diffs, pruebas y compatibilidad antes de integrar. Puede ser el principal o uno dedicado según el riesgo.

## El contrato mínimo de una tarea

Antes de lanzar un agente, dejar explícitos:

1. objetivo verificable;
2. rama y worktree asignados;
3. rutas permitidas;
4. archivos o recursos compartidos que no debe tocar;
5. pruebas requeridas;
6. condición de detención y formato del handoff.

## Archivos compartidos: el punto delicado

Un worktree nuevo no hereda automáticamente todo lo ignorado por Git. Dependencias, cachés y secretos locales pueden necesitar configuración específica. Orca permite compartir directorios grandes o copiar archivos ignorados hacia cada worktree, pero conviene distinguir:

- **compartir** para recursos reconstruibles y pesados;
- **copiar** para configuración que cada worktree debe poder modificar sin afectar a los demás;
- **no propagar** secretos innecesarios.

Lockfiles, migraciones, infraestructura y configuración transversal deberían tener un único dueño por ventana de trabajo.

## Beneficio real

El aislamiento no sólo previene conflictos técnicos. También vuelve más fácil comparar alternativas, abandonar una implementación y conservar otra, o auditar un cambio sin ensuciar el checkout principal.

## Referencia

- [Worktrees — Orca Docs](https://www.onorca.dev/docs/model/worktrees)
