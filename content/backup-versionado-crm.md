---
slug: backup-versionado-crm
title: Backup versionado de funciones CRM
type: concept
order: 1
summary: Convertir código que sólo vive dentro de Zoho CRM en un snapshot diario, auditable y navegable, sin escribir jamás sobre producción.
tags: [zoho-crm, backup, git, deluge, auditoria]
related: [arquitectura-read-only, mapa-procesos-verificacion, modelos-guiados-el-entorno-es-la-politica]
area: CRM versionado
glyph: ▣
hue: rgba(237,195,94,.25)
---

# Backup versionado de funciones CRM

## El problema

El código Deluge de las automatizaciones vive dentro de Zoho CRM. La interfaz no ofrece un historial consultable equivalente a Git y una edición reemplaza el estado anterior. Sin una copia externa, recuperar una versión depende de memoria, archivos sueltos o suerte.

El proyecto descarga código y metadata de todas las funciones, genera un árbol determinista y crea un commit sólo cuando algo cambió realmente.

## Cuatro resultados en una sola corrida

1. **Backup:** código fuente completo fuera del CRM.
2. **Historial:** `git log`, diffs y blame sobre funciones antes opacas.
3. **Auditoría:** reportes regenerados que muestran superficie REST, funciones de prueba, higiene y secretos literales.
4. **Mapa:** agrupación por circuitos de negocio para poder analizar una rama sin recorrer manualmente todo el árbol.

## Arquitectura

```text
Scheduler diario
  → sync Node.js
  → API de Zoho CRM en modo lectura
  → árbol generado y normalizado
  → commit sólo ante cambio
  → repositorio Git privado
  → webhook de resultado
  → alerta únicamente ante problema
```

La credencial sólo posee `ZohoCRM.settings.functions.READ`. La restricción vive debajo del código: aunque el proceso intentara actualizar una función, no tendría autoridad para hacerlo.

## Qué volvió visible

El snapshot convirtió intuiciones en inventario. La primera auditoría encontró una superficie relevante de funciones expuestas por REST, automatizaciones de prueba todavía activas, funciones sin documentación y credenciales literales dentro del código.

Las cifras concretas no son necesarias para reutilizar el método. El aprendizaje importante es que esos riesgos no eran observables desde una revisión casual de la interfaz: aparecieron al descargar, normalizar y clasificar el árbol completo.

La API no informa dónde está asociada una función. Por eso el reporte puede marcar candidatas, pero no afirmar que una función esté en desuso.

## La regla de valor

Un backup que cambia todos los días sin cambios reales es ruido. Para que Git cuente una historia útil:

- el JSON ordena sus claves;
- los archivos normalizan saltos de línea;
- los reportes no incluyen timestamps de generación;
- el prune sólo corre si todas las descargas finalizaron;
- la categoría forma parte de la ruta porque `api_name` no es único.

## Beneficio obtenido

El CRM dejó de ser una caja negra sin memoria. Ahora es posible revisar qué cambió, auditar riesgos, clonar el estado para análisis y comprobar mejoras sin entregar credenciales productivas a cada persona o agente.
