---
slug: caso-widgets-crm-flujos-guiados
title: Caso real — Widgets que convierten reglas del CRM en flujos guiados
type: case-study
order: 2
summary: Dos widgets embebidos llevaron contexto, validaciones y automatización al punto exacto donde el equipo tomaba decisiones.
tags: [caso-real, crm, widgets, javascript, deluge, n8n, integraciones, ux]
related: [backup-versionado-crm, arquitectura-read-only, modelos-guiados-el-entorno-es-la-politica]
---

# Caso real — Widgets que convierten reglas del CRM en flujos guiados

## El problema de fondo

El CRM concentraba datos y automatizaciones, pero algunas tareas seguían exigiendo conocer demasiadas reglas de memoria: qué opciones eran válidas, qué límites aplicaban, cuándo correspondía una aprobación y cómo reportar un problema sin perder el contexto de origen.

La solución no fue crear otra aplicación separada. Se construyeron widgets embebidos que aparecían dentro del registro y convertían esas reglas en recorridos guiados.

## Dos recorridos, una misma idea

### Selección y confirmación de una propuesta

El primer widget reúne configuración del registro, catálogo vigente, medios de pago, cuotas, descuentos, condiciones adicionales y una eventual contraoferta.

Antes de permitir una confirmación:

- verifica que el registro esté en la etapa correcta;
- filtra las opciones por contexto;
- calcula importes y cuotas en tiempo real;
- aplica límites distintos según el tipo de propuesta;
- deshabilita combinaciones incompatibles y explica el motivo;
- deriva excepciones al rol aprobador;
- adjunta documentación cuando corresponde;
- arma un payload único y evita envíos duplicados.

La interfaz hace visible la política mientras la persona decide. No depende de que recuerde una tabla externa ni de que descubra el error después de guardar.

### Reporte contextual de problemas

El segundo widget puede abrirse desde distintos módulos. Detecta la entidad y el registro de origen, recupera su contexto y prepara un reporte vinculado desde el comienzo.

Un buscador con categorías reemplaza una lista extensa y permite explorar o encontrar un tipo de problema ignorando mayúsculas y tildes. La selección debe provenir del catálogo: escribir texto parecido no alcanza para enviar una clasificación ambigua.

También contempla adjuntos, estados de carga, errores parciales y módulos que todavía no tienen todos sus campos confirmados. El flujo principal permanece operativo aunque falle información secundaria de diagnóstico.

## Arquitectura de integración

| Pieza | Función |
|---|---|
| Widget HTML/CSS/JavaScript | Interacción rápida dentro del iframe del CRM |
| SDK de widgets | Contexto de página, lectura del registro, adjuntos y cierre del popup |
| Funciones del CRM | Datos preparados y reglas cercanas al modelo de negocio |
| Webhook | Contrato explícito de salida |
| n8n | Orquestación de escrituras y acciones posteriores |
| CRM | Fuente de verdad y trazabilidad final |

La frontera fue deliberada: el widget guía, valida y presenta; las funciones recuperan contexto; la automatización coordina la escritura. Ninguna pieza necesita fingir que es todo el sistema.

## Decisiones que dieron resultado

### Reglas visibles en el momento correcto

Un límite que sólo existe en documentación llega tarde. Mostrarlo junto al control afectado reduce ensayo, error y consultas laterales.

### Bloqueos proporcionales

Una etapa incorrecta bloquea el recorrido completo. Una combinación inválida bloquea sólo esa alternativa. Un fallo al adjuntar se informa sin ocultar que el registro principal ya fue creado.

### Estados mutuamente excluyentes

Carga, error técnico, contexto no habilitado y flujo normal tienen pantallas separadas. Esto evita interfaces mezcladas donde parece posible confirmar mientras todavía falta información crítica.

### Robustez en un entorno embebido

El SDK y sus respuestas no siempre llegan con la forma ideal. Se agregaron watchdogs, parseo defensivo, protección contra doble envío y aislamiento de diagnósticos para que una falla secundaria no rompa los controles esenciales.

### Contexto que viaja con la acción

El reporte nace relacionado con el registro desde el cual se abrió. Eso elimina la búsqueda manual posterior y mejora la calidad de la información que recibe quien resuelve el problema.

## Beneficios obtenidos

- menos decisiones inválidas antes de escribir en el CRM;
- políticas comerciales convertidas en feedback inmediato;
- excepciones encaminadas al aprobador correcto;
- reportes más consistentes y vinculados a su origen;
- menor carga cognitiva para el equipo operativo;
- trazabilidad de extremo a extremo entre interfaz, funciones, automatización y registro final;
- una base reutilizable para sumar recorridos sin sacar al usuario de su herramienta cotidiana.

## La lección transferible

Un buen widget de CRM no es un formulario más lindo. Es una capa de traducción entre el modelo de datos, la política del negocio y la decisión humana.

Cuando el control aparece en el punto de trabajo, la prevención deja de depender de capacitación perfecta: el propio entorno conduce hacia una acción válida.

> Caso basado en dos implementaciones reales. Se removieron nombres, dominios, módulos internos, catálogos, cifras, identificadores y detalles comerciales sensibles.
