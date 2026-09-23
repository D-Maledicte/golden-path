---
slug: caso-orca-cockpit-multiagente
title: Caso real — Orca como cockpit multiagente
type: case-study
order: 9
summary: Un agente coordinador conserva el contexto integral y delega implementaciones y auditorías a workers especializados en worktrees aislados.
tags: [orca, caso-real, multiagente, worktrees, orquestacion]
related: [orquestacion, workspaces-y-worktrees, continuidad-y-observabilidad]
area: Orca
glyph: ◈
hue: rgba(236,95,189,.24)
---

# Caso real — Orca como cockpit multiagente

## Situación inicial

Un proyecto de transformación digital combinaba integraciones, datos, APIs, seguridad y operación productiva. Una sola conversación podía conservar el contexto, pero se convertía en cuello de botella al abrir varios frentes en paralelo.

La alternativa de lanzar agentes sin estructura tampoco servía: aumentaba el riesgo de cambios superpuestos, decisiones contradictorias y pérdida de contexto al cambiar de sesión.

## Modelo adoptado

### Agente coordinador

Un agente de mayor capacidad opera sobre el workspace principal. Su función es:

- revisar el estado general;
- mantener decisiones y restricciones vigentes;
- preparar el plan;
- dividir el trabajo en unidades verificables;
- revisar implementaciones y auditorías;
- decidir el siguiente frente.

El coordinador no existe para implementar todo. Existe para que cada tarea nazca con contexto suficiente y vuelva con evidencia comparable.

### Implementadores y revisores

Las tareas acotadas se asignan según costo, disponibilidad y fortaleza del agente. Pueden convivir modelos y CLIs distintos sin cambiar la metodología.

Cada worker recibe:

- su propio worktree y rama;
- un alcance explícito;
- restricciones operativas;
- condiciones de finalización;
- una forma esperada de entregar evidencia.

Los agentes de revisión se separan, cuando corresponde, de quienes realizaron la implementación.

## Flujo operativo

1. El coordinador inspecciona el proyecto y prepara una tarea.
2. Se crea un worktree desde una base conocida.
3. El implementador trabaja dentro de su alcance.
4. Entrega cambios, pruebas, riesgos y pendientes.
5. Otro agente o el coordinador revisa el resultado.
6. La integración y cualquier acción productiva permanecen detrás de un gate humano.

## Qué aportó Orca

### Paralelismo comprensible

Los frentes dejaron de ser terminales anónimas. Cada uno quedó ligado a un proyecto, worktree, agente y estado visible.

### Libertad de proveedor

Distintos CLIs convivieron en una misma superficie. El modelo pudo elegirse por tarea sin perder el mapa general del proyecto.

### Aislamiento real

Las implementaciones no compitieron por el mismo checkout. Cada rama podía revisarse, compararse o descartarse sin contaminar el trabajo principal.

### Continuidad

Separar interfaz, proceso, sesión, worktree y estado persistente permitió recuperar trabajo después de interrupciones sin asumir que todo seguía vivo ni tomar acciones destructivas por reflejo.

### Operación remota

La interfaz funcionó como cockpit mientras repositorios y agentes permanecían en un entorno de ejecución central. Otros dispositivos podían actuar como ventanas hacia el mismo estado, sin crear copias divergentes.

## Beneficios obtenidos

- más frentes simultáneos sin compartir archivos de trabajo;
- continuidad del contexto aunque cambiara el implementador;
- selección de modelo por costo y tipo de tarea;
- handoffs más claros y revisables;
- menor dependencia de una sesión o interfaz concreta;
- separación explícita entre planificación, implementación, auditoría y producción.

## La lección transferible

La mejora no vino de “usar muchos modelos”. Vino de diseñar un sistema donde los modelos pueden reemplazarse, las tareas quedan aisladas y el contexto importante no depende de ninguno de ellos.

Orca volvió visible y operable esa arquitectura. La calidad del resultado siguió dependiendo de los contratos de trabajo, Git, las validaciones y la supervisión humana.

> Caso basado en un entorno real. Se removieron nombres de empresa, repositorios, infraestructura, incidentes identificables y datos operativos.
