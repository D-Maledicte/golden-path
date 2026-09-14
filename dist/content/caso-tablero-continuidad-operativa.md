---
slug: caso-tablero-continuidad-operativa
title: Caso real — De contador a tablero de continuidad operativa
type: case-study
order: 1
summary: Una herramienta personal creció hasta unir incidentes, salud de servicios y señales progresivas sin llevar credenciales al navegador.
tags: [caso-real, observabilidad, astro, typescript, n8n, incidentes, seguridad]
related: [continuidad-y-observabilidad, caso-orca-cockpit-multiagente]
---

# Caso real — De contador a tablero de continuidad operativa

## El punto de partida

La primera necesidad parecía mínima: mostrar cuánto tiempo había pasado desde el último incidente. Pero un número aislado no explicaba qué había ocurrido, si el problema seguía abierto ni qué parte del entorno estaba afectada.

El producto terminó convirtiéndose en una pequeña central operativa: continuidad, bitácora de incidentes, métricas y salud de varios servicios en una sola superficie.

## La arquitectura que lo hizo posible

| Capa | Tecnología | Responsabilidad |
|---|---|---|
| Interfaz | Astro + Tailwind CSS | Sitio estático rápido, responsive y fácil de desplegar |
| Dominio | TypeScript | Cálculo de continuidad, estados, normalización y fusión de señales |
| Respaldo local | `localStorage` | Conservar acciones cuando la capa remota no responde |
| Integración | n8n | Persistencia de incidentes y ejecución de comprobaciones |
| Persistencia | Data Tables | Sincronización del historial entre dispositivos |
| Entrega | Hosting estático con políticas de seguridad | Publicación del frontend sin secretos embebidos |

La decisión central fue mantener el navegador como consumidor de un contrato acotado. Los accesos autenticados y las credenciales quedaron del lado de la capa de integración, que sólo publicaba estados normalizados.

## De un timestamp a un ciclo de vida

Un incidente no es solamente una fecha de reinicio. Tiene inicio real, momento de reporte, estado, cierre y una nota opcional de resolución.

Modelarlo de esa manera resolvió casos que el contador simple escondía:

- una incidencia abierta detiene la continuidad y evita un falso “todo bien”;
- varias incidencias pueden superponerse;
- el nuevo período sano comienza después del último cierre efectivo;
- registros antiguos pueden seguir leyéndose sin reescribir el historial;
- un corte de conectividad no obliga a perder el alta o el cierre local.

La interfaz pasó de celebrar un número a representar honestamente el estado operativo.

## Salud progresiva, no una espera monolítica

Las comprobaciones se dividieron por grupos y el frontend las solicitó en paralelo. Cada respuesta parcial se fusiona con el estado existente sin borrar servicios que esa rama no observó.

Esto permitió que una caída conocida apareciera apenas se detectaba, aun cuando otras fuentes siguieran demoradas. También exigió reglas explícitas para evitar carreras, datos viejos y estados transitorios engañosos.

### Semántica antes que color

No toda respuesta HTTP exitosa prueba que el servicio esté sano. Un frontend puede devolver su HTML genérico ante una ruta inexistente y producir un falso verde.

Por eso el tablero distingue:

- **operativo:** la señal esperada respondió y su contenido es válido;
- **degradado:** el proceso está vivo, pero todavía no puede atender correctamente;
- **caído:** existe evidencia concreta de indisponibilidad;
- **no verificable:** hubo respuesta, pero no demuestra la condición buscada;
- **sin datos o comprobando:** todavía no existe una lectura suficiente.

Separar liveness de readiness evitó alertar como caída cada reinicio normal. Validar el cuerpo además del código HTTP evitó checks verdes que en realidad no medían nada.

## Seguridad y resiliencia como parte del producto

El endurecimiento no quedó para el final:

- el frontend nunca recibe credenciales de proveedores;
- una política CSP estricta limita la ejecución inesperada;
- las dependencias se auditan y actualizan;
- los endpoints aceptados se normalizan y restringen;
- los estados parciales conservan la última observación válida;
- las animaciones respetan preferencias de movimiento reducido;
- el área con scroll puede recorrerse con teclado.

Los workflows también se trataron como código: se verificaron sus nodos, contratos y recorridos para detectar errores de generación, grupos duplicados y respuestas cruzadas.

## Beneficios obtenidos

- una lectura común para continuidad, incidentes y dependencias;
- detección más temprana gracias a respuestas progresivas;
- menos falsos positivos y falsos verdes;
- continuidad de uso ante fallas temporales de la integración;
- una frontera clara entre visualización pública y acceso autenticado;
- comportamiento comprobable incluso cuando la automatización vive fuera del repositorio tradicional.

## La lección transferible

La observabilidad útil no consiste en sumar checks. Consiste en definir qué prueba cada señal, qué no puede probar y cómo se combinan resultados incompletos sin mentirle al operador.

El contador siguió siendo la imagen central, pero el verdadero producto pasó a ser el modelo de continuidad que había detrás.

> Caso basado en una implementación real. Se removieron nombres, dominios, endpoints, cantidades, proveedores internos y datos operativos identificables.
