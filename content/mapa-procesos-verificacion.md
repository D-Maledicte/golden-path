---
slug: mapa-procesos-verificacion
title: Del backup al mapa de procesos
type: case-study
order: 3
summary: El mapa de procesos permite analizar sin acceso productivo; la nueva vía de cambios conecta los hallazgos verificables con revisión y despliegue controlado.
tags: [procesos, auditoria, agentes, verificacion, zoho-crm]
related: [backup-versionado-crm, arquitectura-read-only, orquestacion]
area: CRM versionado
glyph: ⌘
hue: rgba(168,106,255,.24)
---

# Del backup al mapa de procesos

> Actualizado el 12 de octubre de 2026. Se preserva la prueba piloto de análisis y se distingue de la posterior etapa de despliegue multiusuario.

## El salto de la segunda etapa

El backup respondía qué código existía. No explicaba cómo se organizaba el negocio, qué funciones componían un circuito ni cómo comprobar que una corrección había sido aplicada.

La segunda etapa agregó tres piezas:

| Pieza | Qué responde |
| --- | --- |
| Diccionario de recursos | Qué funciones usan cada recurso compartido y cuál es el radio de impacto |
| Árbol de procesos | Qué circuitos existen y qué funciones forman cada rama |
| Contrato de análisis | Cómo debe analizarse una rama y qué evidencia entregar |

## Generado y curado

Los datos que cambian se regeneran con cada sincronización. La organización conceptual se expresa mediante reglas mantenidas por personas.

No se escriben listas manuales de funciones dentro de la documentación: envejecen al día siguiente. Una regla absorbe nuevas funciones y el reporte marca las que no encajan en ninguna rama.

## Unidad de trabajo: una rama

El proceso para una persona o agente es deliberadamente acotado:

1. Abrir una copia de trabajo del repositorio.
2. Elegir una rama del árbol de procesos.
3. Seguir el contrato de análisis.
4. Entregar tres artefactos.

| Entregable | Propósito |
| --- | --- |
| `manual-operativo.md` | Explicar el circuito en términos de negocio |
| `mejoras-propuestas.md` | Ordenar hallazgos por consecuencia, anclados a archivo y línea |
| `validar.sh` | Convertir cada hallazgo en un chequeo ejecutable |

En la prueba original, el agente partía de reportes calculados y no de una búsqueda ciega entre más de mil trescientas funciones. Ese tamaño describe el inventario de entonces, no un conteo actualizado. La ventaja del método es acotar el contexto y hacer repetible el análisis.

## El límite que sostiene la calidad

El análisis corrige defectos visibles; no rediseña procesos ni propone migraciones amplias. En una plataforma donde publicar es inmediato, un rediseño grande sobre un circuito que mueve dinero requiere otro nivel de gobierno.

La restricción no queda sólo en el prompt: **todo hallazgo desarrollado debe poder expresarse como un chequeo automático**. Si no se puede verificar, se anota como idea separada y no se presenta como corrección lista.

## Verificación sin IA

Cuando alguien informa que corrigió un hallazgo, no hace falta volver a contratar razonamiento para leer el código. Se ejecuta `validar.sh` contra el snapshot actual.

La prosa envejece; el chequeo se reevalúa. Esta separación reduce supervisión y evita que el informe se convierta en una verdad congelada.

## Del hallazgo a una propuesta desplegable

La nueva etapa agrega continuidad al trabajo: un hallazgo verificable puede convertirse en una propuesta de cambio separada del snapshot, pasar por un pull request y llegar a un responsable con autoridad para desplegar. El mapa ayuda a elegir dónde mirar; el contrato determina qué evidencia entregar; la vía de despliegue gobierna cuándo se permite escribir.

Son verificaciones diferentes:

| Verificación | Qué establece | Qué no establece |
| --- | --- | --- |
| Chequeo del hallazgo | Si el código satisface una condición concreta | Que todo el proceso funcione correctamente |
| Comparación con la base productiva | Si se detecta deriva bajo la comparación normalizada desde que se preparó la propuesta | Cambios borrados por la normalización, equivalencia semántica ni estabilidad de dependencias |
| Descarga posterior al despliegue | Si el código descargado coincide con el enviado bajo la comparación implementada | Que sus efectos de negocio sean los esperados |

Una corrección de idempotencia, por ejemplo, puede tener un chequeo estático que detecte la condición de protección y aun necesitar una prueba de ejecuciones repetidas para demostrar que no duplica efectos. La presencia de `validar.sh` mejora la revisión; no autoriza a confundir inspección de código con validación integral.

La documentación de la etapa multiusuario registra controles probados con escritura deshabilitada y mantiene pendiente el primer despliegue real desde `cambios/`. El circuito completo es la dirección implementada por el proyecto, con esa validación operativa aún abierta. La prueba piloto que sigue demuestra el análisis y sus entregables, no un despliegue posterior.

## Prueba piloto

Una rama sin manual previo fue analizada siguiendo únicamente el contrato. El agente entregó los tres archivos y los hallazgos prioritarios se verificaron contra el código.

La prueba encontró errores de idempotencia, validaciones incompletas y superficie de ejecución externa que requería revisión. Las reglas de anonimización preservan las categorías del problema, pero no publican el circuito, los nombres ni las condiciones exactas del cliente.

El análisis también marcó como no confirmados los puntos que la API no permitía comprobar. Esa disciplina fue parte del éxito, no una limitación a esconder.

## Elegir el siguiente paso

Para un circuito desconocido, conviene empezar por mapa, contrato y chequeos antes de preparar cambios. Cuando el hallazgo ya tiene evidencia, se puede usar la [plataforma de funciones](/entrada/backup-versionado-crm) para organizar la propuesta y la [separación de autoridades](/entrada/arquitectura-read-only) para limitar su publicación. Un rediseño amplio o una condición que el snapshot no permite comprobar necesitan otra investigación; no deben disfrazarse de corrección lista para desplegar.

## Beneficio obtenido

La capacidad de diagnóstico dejó de depender de quien conoce de memoria la organización. El costo central queda en generar el snapshot y los reportes; cada miembro del equipo puede analizar una rama con su propia herramienta y verificar correcciones sin acceso productivo.
