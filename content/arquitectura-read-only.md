---
slug: arquitectura-read-only
title: Read-only como decisión arquitectónica
type: guide
order: 2
summary: Mantener el backup y el análisis sin autoridad productiva mientras una vía separada permite desplegar cambios revisados y verificables.
tags: [read-only, permisos, zoho, seguridad, snapshots]
related: [backup-versionado-crm, mapa-procesos-verificacion, modelos-guiados-el-entorno-es-la-politica]
area: CRM versionado
glyph: ⌁
hue: rgba(87,217,232,.22)
---

# Read-only como decisión arquitectónica

> Actualizado el 12 de octubre de 2026. La etapa inicial era enteramente read-only; la evolución multiusuario conserva esa frontera para observación y agrega una vía de escritura controlada.

## Por qué no alcanza con prometer que no vamos a escribir

En las funciones Deluge de Zoho CRM, crear o actualizar mediante la API publica el cambio inmediatamente. La API V8 distingue este comportamiento de Java, Node.js y Python, que sí admiten borradores y publicación separada. Un `PUT` sobre Deluge en producción puede afectar código activo: no hay que generalizar la protección de borradores de otros runtimes. [Funciones en V8](https://www.zoho.com/crm/developer/docs/api/v8/whats-new.html).

Por eso la lectura no se planteó como una convención del script, sino como una propiedad del sistema. La evolución del proyecto cambia el alcance de esa frase: describe la sincronización y el análisis, mientras el despliegue tiene credenciales, comandos y condiciones propios.

## Las barreras

### Scope mínimo

El token de lectura usa solamente `ZohoCRM.settings.functions.READ`. No posee Create, Update, Publish ni Delete. La credencial rechaza una mutación aunque el código la intente.

### Lectura y escritura separadas

El cliente original sólo implementaba lectura. La etapa de despliegue incorpora operaciones mutativas en una vía explícita y deshabilitada por defecto. Ya no sería correcto describir todo el proyecto como exclusivamente `GET`: lo que debe conservarse es que la tarea de observación carezca de autoridad para publicar.

### Árbol generado

`functions/` representa una fotografía del CRM y no se edita a mano. Las propuestas viven en `cambios/`, con su base y metadata para revisión. La separación hace visible qué fue observado y qué se quiere cambiar; una sincronización posterior vuelve a reflejar el estado productivo.

### Git como revisión y procedencia

El repositorio conserva snapshots y ahora también organiza propuestas mediante pull requests y responsables de revisión. Merge y despliegue son pasos distintos: tener un cambio en Git no equivale a haberlo publicado ni a haber verificado su resultado.

## La autoridad para desplegar no se hereda

El colaborador trabaja con permisos de lectura. El responsable del despliegue necesita una credencial autorizada por los scopes y el perfil de CRM, además de habilitar expresamente la escritura y pasar controles adicionales. El flag de la CLI evita accidentes; no es por sí solo una frontera de permisos. Una persona autorizada a editar desde la interfaz de CRM todavía puede hacerlo por fuera de esta convención. En el recorrido normal documentado para cambios revisados:

- la función debe resolverse sin ambigüedad; un `api_name` que colisiona no autoriza elegir cualquier destino;
- el archivo a publicar debe estar versionado, sin cambios locales y en `main` alineado con `origin/main`;
- una comparación por hash del código normalizado detecta cambios productivos respecto de la base usada para preparar la propuesta;
- después de publicar se descarga el código y se compara con el enviado, de forma exacta o normalizada.

La CLI también conserva una opción explícita para archivos fuera de `main`; si falta la cabecera de base, esa ruta puede continuar con una advertencia y sin protección contra deriva. Por eso no alcanza con que el repositorio contenga los controles: el equipo debe exigir el recorrido revisado y tratar las excepciones como decisiones de mayor riesgo.

Si producción cambió en el medio dentro del recorrido protegido, la propuesta debe volver a revisarse sobre una base vigente. La comparación permite detectar parte de la deriva de código antes de escribir; no constituye un bloqueo atómico frente a cambios concurrentes ni garantiza que datos, conexiones o asociaciones sigan iguales.

La comparación normalizada elimina espacios y paréntesis: puede considerar iguales textos distintos y no es una prueba semántica. Si la verificación posterior falla, se informa el error; no hay rollback automático. La operación puede haber publicado ya, y un fallo de notificación tampoco la deshace.

Estos controles complementan la revisión humana. Tampoco convierten Deluge en un runtime con borradores: el riesgo de publicación inmediata sigue siendo relevante. La documentación registra pruebas sin escritura y deja pendiente el primer despliegue real de esta vía; no hay que presentar el guardrail probado como una prueba completa del despliegue.

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

El dead-man's switch vive fuera del scheduler y distingue la última ejecución del último éxito. Debe alertar si cualquiera de esas señales envejece: una sucesión de errores no puede mantener fresca la señal de salud. Si compartiera proceso con el sync, morirían juntos y el silencio sería ambiguo.

## Principio reusable

**La autoridad debe seguir a la tarea: observar con permisos de lectura, proponer en un espacio separado y publicar sólo desde una vía explícita, revisada y verificable.**
