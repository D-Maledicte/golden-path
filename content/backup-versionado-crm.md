---
slug: backup-versionado-crm
title: Del backup a una plataforma de funciones CRM
type: concept
order: 1
summary: El backup read-only se convirtió en la base de una plataforma interna para analizar, revisar y desplegar funciones CRM con autoridades separadas.
tags: [zoho-crm, backup, git, deluge, auditoria, despliegue]
related: [arquitectura-read-only, mapa-procesos-verificacion, modelos-guiados-el-entorno-es-la-politica]
area: CRM versionado
glyph: ▣
hue: rgba(237,195,94,.25)
---

# Del backup a una plataforma de funciones CRM

> Registros operativos revisados el 17 de noviembre de 2026. La vía de despliegue multiusuario ya tiene uso registrado en producción.

## El problema

El código Deluge de las automatizaciones vive dentro de Zoho CRM. La interfaz actual ya ofrece una pestaña Revisions con las últimas 30 versiones; para Deluge, cada guardado crea una revisión. Ese historial acotado no reemplaza un repositorio externo con diffs, análisis y una política propia de conservación. [Gestión de funciones](https://www.zoho.com/crm/developer/docs/functions/management.html).

El punto de partida fue descargar código y metadata de todas las funciones, generar un árbol determinista y crear un commit sólo cuando algo cambiaba realmente. Esa capa sigue siendo de lectura.

La evolución agregó un recorrido para preparar cambios, revisarlos y publicarlos con una autoridad distinta. El repositorio pasó a funcionar como una pequeña plataforma interna de gestión de funciones: CLI, contratos, controles de Git y una vía explícita de despliegue. La CLI y la revisión en GitHub organizan quién puede proponer, quién puede publicar y qué evidencia exige cada transición.

## Cuatro resultados en una sola corrida

1. **Backup:** código fuente completo fuera del CRM.
2. **Historial:** `git log`, diffs y blame sobre funciones antes opacas.
3. **Auditoría:** reportes regenerados que muestran superficie REST, funciones de prueba, higiene y secretos literales.
4. **Mapa:** agrupación por circuitos de negocio para poder analizar una rama sin recorrer manualmente todo el árbol.

## La capa de observación

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

La credencial de sincronización sólo posee `ZohoCRM.settings.functions.READ`. La restricción vive debajo del código: aunque el proceso intentara actualizar una función, no tendría autoridad para hacerlo.

## Qué volvió visible

El snapshot convirtió intuiciones en inventario. La primera auditoría encontró una superficie relevante de funciones expuestas por REST, automatizaciones de prueba todavía activas, funciones sin documentación y credenciales literales dentro del código.

Las cifras concretas no son necesarias para reutilizar el método. El aprendizaje importante es que esos riesgos no eran observables desde una revisión casual de la interfaz: aparecieron al descargar, normalizar y clasificar el árbol completo.

El snapshot del caso no verificaba todas las asociaciones, por lo que el reporte sólo podía marcar candidatas, no afirmar que una función estuviera en desuso. La interfaz actual de Zoho sí documenta asociaciones, referencias y dependencias en Glance. Consultarlas agrega evidencia; no demuestra que el cliente de backup las descargue ni descarta invocaciones externas. [Gestión de funciones](https://www.zoho.com/crm/developer/docs/functions/management.html).

## La regla de valor

Un backup que cambia todos los días sin cambios reales es ruido. Para que Git cuente una historia útil:

- el JSON ordena sus claves;
- los archivos normalizan saltos de línea;
- los reportes no incluyen timestamps de generación;
- el prune sólo corre si todas las descargas finalizaron;
- la categoría forma parte de la ruta porque `api_name` no es único.

## Del inventario al cambio revisable

La CLI implementa creación o actualización de una función Deluge por vez. Para modificar una existente, el recorrido multiusuario parte de una base obtenida de producción. El cambio se prepara fuera del árbol generado, se versiona como propuesta y pasa por revisión antes de que un responsable habilitado lo despliegue.

```text
Producción → base del cambio → propuesta en cambios/
  → pull request → revisión del responsable → merge
  → controles previos → despliegue explícito
  → nueva descarga y comparación
  → el siguiente snapshot refleja producción → retiro de la propuesta en otro PR
```

La separación evita dos errores distintos: editar un backup como si fuera código listo para publicar y entregar permisos productivos a toda persona que necesita analizarlo. Un colaborador puede preparar una propuesta con acceso de lectura; la publicación pertenece a otro rol.

El recorrido normal documentado exige comprobar la identidad de la función, la procedencia del archivo y que producción no haya cambiado desde la base de la propuesta. La descarga posterior permite comparar lo recibido por el CRM con lo enviado, con una comparación exacta o normalizada. No es una prueba de equivalencia semántica. Existen opciones heredadas para trabajar fuera del recorrido normal, por lo que esas garantías dependen de usarlo con su base y controles completos. Cada barrera tiene un costo: mantener metadata, resolver conflictos y rechazar cambios que antes se habrían pegado directamente en la interfaz. Ese costo compra una revisión reproducible.

## Qué está demostrado y qué queda abierto

Los registros incluyen despliegues en producción en los que se volvió a descargar el código del CRM y se verificó el resultado. Un PR posterior retiró una tanda de propuestas tras compararlas con el snapshot de producción. Para una diferencia de formato se hizo además una comparación directa contra el CRM. Es el cierre del ciclo de propuesta: el árbol generado refleja lo publicado y el archivo que esperaba deploy se puede retirar.

Cada comprobación responde una pregunta. Git registra qué se aprobó. La lectura posterior comprueba qué guardó el CRM bajo el criterio de comparación de la herramienta. El siguiente snapshot deja el código observado disponible para nuevos análisis. Para verificar cómo se comporta la función o si una automatización la invoca, hace falta evidencia del circuito de negocio correspondiente.

## Cuándo conviene este diseño

Tiene sentido cuando varias personas o agentes necesitan analizar y proponer cambios sobre automatizaciones sensibles, mientras la autoridad productiva debe quedar acotada. Un equipo pequeño con cambios excepcionales puede empezar por el backup y la revisión manual: sumar un camino de despliegue antes de definir responsables y verificaciones sólo agrega otra forma de equivocarse.

La condición para avanzar es poder sostener ambas mitades: una fotografía confiable de producción y una publicación explícita que no herede los permisos del análisis. La [arquitectura read-only](/entrada/arquitectura-read-only) explica esa separación; el [mapa de procesos](/entrada/mapa-procesos-verificacion) muestra cómo convertir un hallazgo en trabajo verificable.

## Beneficio obtenido

El equipo puede revisar y proponer cambios sobre una fotografía compartida de producción, con la escritura a cargo del responsable del despliegue. Los registros de publicación y limpieza permiten rastrear la propuesta aprobada hasta el código que devolvió el CRM.
