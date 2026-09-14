---
slug: mapa-procesos-verificacion
title: Del backup al mapa de procesos
type: case-study
order: 3
summary: Un repositorio fiel pero mudo se convirtió en una superficie donde cualquier agente puede analizar un circuito y verificar mejoras sin tocar producción.
tags: [procesos, auditoria, agentes, verificacion, zoho-crm]
related: [backup-versionado-crm, arquitectura-read-only, orquestacion]
---

# Del backup al mapa de procesos

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

El agente parte de reportes calculados y no de una búsqueda ciega entre más de mil trescientas funciones. Así se reduce tiempo, costo y variabilidad.

## El límite que sostiene la calidad

El análisis corrige defectos visibles; no rediseña procesos ni propone migraciones amplias. En una plataforma donde publicar es inmediato, un rediseño grande sobre un circuito que mueve dinero requiere otro nivel de gobierno.

La restricción no queda sólo en el prompt: **todo hallazgo desarrollado debe poder expresarse como un chequeo automático**. Si no se puede verificar, se anota como idea separada y no se presenta como corrección lista.

## Verificación sin IA

Cuando alguien informa que corrigió un hallazgo, no hace falta volver a contratar razonamiento para leer el código. Se ejecuta `validar.sh` contra el snapshot actual.

La prosa envejece; el chequeo se reevalúa. Esta separación reduce supervisión y evita que el informe se convierta en una verdad congelada.

## Prueba piloto

Una rama sin manual previo fue analizada siguiendo únicamente el contrato. El agente entregó los tres archivos y los hallazgos prioritarios se verificaron contra el código.

La prueba encontró errores de idempotencia, validaciones incompletas y superficie de ejecución externa que requería revisión. Las reglas de anonimización preservan las categorías del problema, pero no publican el circuito, los nombres ni las condiciones exactas del cliente.

El análisis también marcó como no confirmados los puntos que la API no permitía comprobar. Esa disciplina fue parte del éxito, no una limitación a esconder.

## Beneficio obtenido

La capacidad de diagnóstico dejó de depender de quien conoce de memoria la organización. El costo central queda en generar el snapshot y los reportes; cada miembro del equipo puede analizar una rama con su propia herramienta y verificar correcciones sin acceso productivo.
