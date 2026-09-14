---
slug: arquitectura-read-only
title: Read-only como decisión arquitectónica
type: guide
order: 2
summary: Diseñar el backup para que no pueda publicar en Zoho, incluso si un script, una instrucción o un agente intentan cruzar el límite.
tags: [read-only, permisos, zoho, seguridad, snapshots]
related: [backup-versionado-crm, modelos-guiados-el-entorno-es-la-politica]
---

# Read-only como decisión arquitectónica

## Por qué no alcanza con prometer que no vamos a escribir

En Deluge no existe una etapa de draft equivalente a un entorno de revisión. Crear o actualizar una función publica el cambio de inmediato. Un `PUT` mal ejecutado es un deploy productivo sin red de contención.

Por eso la lectura no se planteó como una convención del script, sino como una propiedad del sistema.

## Las barreras

### Scope mínimo

El token usa solamente `ZohoCRM.settings.functions.READ`. No posee Create, Update, Publish ni Delete. La credencial rechaza una mutación aunque el código la intente.

### Cliente sin operaciones mutativas

El proyecto implementa exclusivamente solicitudes `GET`. Los endpoints destructivos se documentan para entender el riesgo, pero no forman parte del cliente.

### Árbol generado

`functions/` representa una fotografía del CRM. No se edita a mano ni se usa como origen de despliegue. Una modificación válida se realiza en Zoho y aparece en la siguiente sincronización.

### Git como historia, no como botón de publish

El repositorio conserva snapshots y permite análisis. No está conectado a una tubería que publique automáticamente funciones de vuelta al CRM.

## Decisiones que evitan backups falsos

- La ruta incluye categoría y `api_name`; el nombre solo puede colisionar.
- La corrida aborta ante una colisión en vez de sobrescribir en silencio.
- El prune se desactiva si hubo una descarga fallida.
- Sin snapshot previo legible, el fallback es una descarga completa.
- Si el conteo esperado no coincide con la paginación, no se guarda una foto parcial.

## El caso incómodo de los secretos

El código fuente puede contener credenciales literales. Antes del primer push hay que escanear el árbol y decidir cada hallazgo:

1. rotar y retirar la credencial;
2. versionar en repositorio privado si el riesgo fue aceptado;
3. excluir temporalmente el archivo y documentar que queda sin backup.

Una credencial de proveedor cloud puede ser detectada y revocada automáticamente al subirla. Excluir evita esa rotura, pero crea una deuda explícita: la función deja de tener historia.

## Operación silenciosa, vigilancia activa

Una corrida normal sin cambios no crea commit ni manda una notificación. El silencio es saludable sólo si existe un control separado que detecta cuando la señal deja de llegar.

El dead-man's switch vive fuera del scheduler y alerta cuando se supera el umbral acordado sin una ejecución confirmada. Si compartiera proceso con el sync, morirían juntos y el silencio sería ambiguo.

## Principio reusable

**Cuando escribir tiene un efecto irreversible, la barrera tiene que estar en la credencial y en la topología, no en la buena conducta del código.**
