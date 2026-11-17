---
slug: caso-orca-cockpit-multiagente
title: Caso real — Orca como cockpit multiagente
type: case-study
order: 9
summary: La evolución de un coordinador único a dirección, integración y paquetes separados, con auditoría cruzada y aceptación verificable.
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

## Modelo inicial adoptado

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

## Flujo operativo inicial

1. El coordinador inspecciona el proyecto y prepara una tarea.
2. Se crea un worktree desde una base conocida.
3. El implementador trabaja dentro de su alcance.
4. Entrega cambios, pruebas, riesgos y pendientes.
5. Otro agente o el coordinador revisa el resultado.
6. La integración y cualquier acción productiva permanecen detrás de un gate humano.

## Evolución del caso: V4, octubre de 2026

La documentación V4, revisada el 12 de octubre de 2026, separa responsabilidades que antes se concentraban en un solo coordinador. El diseño anterior queda como historia del caso; la distribución vigente distingue tres niveles:

| Nivel | Asignación del entorno | Responsabilidad |
| --- | --- | --- |
| Dirección general | Opus | Conversación con la persona, prioridades y decisiones transversales |
| Integración | Sol con esfuerzo low | Reconstruir estado, ordenar dependencias e integrar evidencia de los paquetes |
| Coordinación de paquete | Sol con esfuerzo medium u Opus con esfuerzo low | Conducir una capacidad acotada hasta su aceptación |

Son asignaciones de este proyecto, no una recomendación universal ni una equivalencia entre modelos. Para implementación LIVE se usa Luna con esfuerzo high o Sonnet; la auditoría cambia a la familia opuesta al implementador. El paquete también puede seguir un esquema invertido: Opus coordina, Sonnet implementa y Sol audita. La revisión cruzada aporta una segunda perspectiva junto con las pruebas.

La unidad vigente es **una capacidad, una tarea de Notion, una rama y un worktree**. Implementación, correcciones y auditoría comparten esa rama y ese checkout. El auditor trabaja en modo lectura y registra un veredicto independiente sobre el candidato. El paralelismo ocurre entre capacidades y el coordinador de paquete conserva la responsabilidad hasta el handoff a integración.

**BUILD/LIVE y el gate de tres partes ya existían en V3.** V4 admite cambios LIVE acotados a una sección, con el contrato intacto, sin borrados y con rollback de un paso. El gate exige paridad contra el CRM, rollback ejecutable y auditoría cruzada. Los wrappers de despliegue de Catalyst exigen un `gate.json` para este recorrido LIVE y rechazan un gate pendiente o incompleto. Los borrados y tombstones siguen requiriendo permiso humano explícito.

La dirección general recibe una bandeja de decisiones agrupadas por urgencia: incidentes, destrabes y asuntos sin apuro. El integrador reúne evidencia; no interrumpe a la persona por cada avance ni convierte una decisión pendiente en permiso implícito.

### Del merge al resultado aceptado

Una prueba local, un PR integrado y una comprobación en producción acreditan hechos distintos. Un paquete de activación por fases pasó las pruebas locales y la auditoría cruzada y se integró con el gate operativo y la aplicación LIVE todavía pendientes. El handoff dejó identificado el candidato, las verificaciones hechas y la decisión que quedaba para integración.

El equipo registra cuándo el paquete quedó listo local, cuándo se integró y aplicó, qué se observó en la verificación inmediata tras el despliegue (postflight) y si hubo aceptación en el ciclo real acordado. El handoff deja el último hito demostrado, el remanente, el responsable y la próxima evidencia necesaria.

Al retomar, cruzá workers y worktrees activos con Git, la tarea y los sistemas que muestran qué está corriendo. La [guía de continuidad](/entrada/continuidad-y-observabilidad) explica dónde buscar cada evidencia. Los ejemplos se basan en registros anonimizados del proyecto revisados el 17 de noviembre de 2026.

## Qué aportó Orca

### Paralelismo comprensible

Los frentes dejaron de ser terminales anónimas. Cada uno quedó ligado a un proyecto, worktree, agente y estado visible.

### Libertad de proveedor

Distintos CLIs convivieron en una misma superficie. El modelo pudo elegirse por tarea sin perder el mapa general del proyecto.

### Aislamiento real

Cada capacidad conservó su propio checkout. Dentro de él, un implementador y un auditor en modo lectura podían trabajar sobre el mismo candidato y su evidencia.

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
