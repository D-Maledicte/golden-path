---
slug: preflight-despliegue-backend
title: Antes de publicar, probá el arranque real
type: guide
order: 12
summary: "Un build exitoso no garantiza que el backend pueda iniciar. Un preflight con el comando de producción y un healthcheck bloqueante cierran esa brecha."
tags: [deploy, backend, preflight, healthcheck, produccion, agentes]
related: [modelos-guiados-el-entorno-es-la-politica, continuidad-y-observabilidad, orquestacion]
area: Gobierno de agentes
glyph: ◉
hue: rgba(237,195,94,.25)
---

# Antes de publicar, probá el arranque real

## El falso positivo del build verde

Un backend puede compilar y aun así fallar al iniciar. El build verifica que sus pasos terminaron; no demuestra que el proceso de producción resuelva sus imports, cargue la configuración, abra el puerto y responda una petición.

En un incidente real, un archivo de entrada terminó con contenido duplicado. La publicación avanzó, pero el servidor entró en un ciclo de fallas por declaraciones repetidas. La recuperación exigió corregir el código y volver a publicar. El problema que importaba ya estaba en el repositorio: faltaba una prueba capaz de verlo antes del deploy.

## Tres controles, tres preguntas distintas

### 1. ¿El archivo de entrada conserva una estructura válida?

Si un generador, un merge o un agente modifica el punto de arranque, revisá el diff y ejecutá la comprobación sintáctica del runtime. Detectá duplicaciones evidentes de imports, inicialización del servidor o bloques completos antes de dar por terminado el cambio.

Esta revisión es específica del proyecto: no alcanza con buscar una cadena repetida y asumir que toda repetición es un error.

### 2. ¿Arranca el comando que usa producción?

Ejecutá el comando de producción en un entorno de prueba con la configuración necesaria. Esperá a que el proceso abra el puerto y hacé una solicitud HTTP a un endpoint liviano. Si el proceso muere o la solicitud falla, la publicación queda bloqueada.

No sustituyas esta comprobación por el modo de desarrollo. Los scripts, variables, bundlers y rutas de imports pueden ser distintos.

Una secuencia mínima, adaptada al proyecto, se parece a esto:

```bash
npm run build
PORT=5000 npm run start
# En otra terminal:
curl --fail --show-error http://127.0.0.1:5000/health
```

El ejemplo supone que existen `start` y `/health`; usá los nombres reales del servicio. El proceso debe poder cerrarse limpiamente al terminar la prueba.

### 3. ¿El despliegue espera una respuesta saludable?

Configurá el healthcheck del hosting para que una publicación sólo se considere lista cuando el backend responde. Una página estática o un proceso iniciado durante un instante no prueban que la API esté operativa.

El endpoint de salud debería ser barato y representar la capacidad que necesitás para servir tráfico. Si depende de servicios externos, distinguí entre **proceso vivo** y **servicio listo** para evitar reinicios causados por una dependencia temporalmente caída.

## El orden importa

1. Revisar el diff del punto de entrada.
2. Correr build y comprobación sintáctica.
3. Levantar el comando real en un entorno de prueba.
4. Probar una respuesta HTTP.
5. Publicar con healthcheck bloqueante.
6. Confirmar la respuesta desde la URL desplegada.

Cada paso responde una pregunta distinta. Un check verde no reemplaza al siguiente.

## Cuando trabaja un agente

El contrato de la tarea tiene que pedir evidencia concreta: comando ejecutado, salida relevante, código de respuesta HTTP y resultado del despliegue. La frase «funciona» no alcanza para cruzar el límite de producción.

Si el preflight falla, el agente corrige y repite la prueba. Si falta configuración que sólo existe en producción, registra qué pudo verificar y qué queda pendiente para un entorno equivalente; no convierte una suposición en aprobación.

## Regla transferible

**La publicación empieza antes del botón de deploy.** Primero hay que demostrar que el mismo programa que va a recibir tráfico puede arrancar y responder. Después, el hosting tiene que negarse a declarar exitoso un despliegue que no supera esa prueba.

> Caso basado en un incidente real. Se omitieron nombres, fechas, repositorios y detalles operativos identificables.
