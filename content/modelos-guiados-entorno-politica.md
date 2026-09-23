---
slug: modelos-guiados-el-entorno-es-la-politica
title: Modelos guiados — el entorno es la política
type: concept
order: 10
summary: Trabajar con un agente de forma segura depende menos de que el modelo recuerde pedir permiso y más de que el harness, el sistema operativo y las credenciales hagan imposible actuar fuera del alcance previsto.
tags: [agentes, permisos, sandbox, codex, claude-code, opencode, seguridad]
related: [orquestacion, agent-terminals, workspaces-y-worktrees]
area: Gobierno de agentes
glyph: ⚿
hue: rgba(237,195,94,.25)
---

# Modelos guiados — el entorno es la política

## Idea central

Un modelo guiado es un agente al que se le permite razonar y proponer con amplitud, pero cuya capacidad de actuar está recortada por un entorno diseñado para exigir intervención humana en los puntos sensibles.

La seguridad no debería depender de que el modelo “se acuerde” de preguntar. Una instrucción como *pedime permiso antes de instalar algo* mejora el comportamiento esperado, pero no constituye una barrera. Si el harness permite ejecutar cualquier comando, el proceso tiene acceso a credenciales y la red alcanza producción, la acción sigue siendo técnicamente posible.

La prevención de desastre surge de qué tan bien está armado el lugar donde trabaja el agente:

- qué herramientas puede invocar;
- qué acciones requieren aprobación;
- qué rutas puede leer o escribir;
- qué red puede alcanzar;
- qué credenciales existen en su proceso;
- qué rama o worktree puede modificar;
- qué comandos están bloqueados aunque el modelo los solicite.

La regla madre es simple: **las instrucciones orientan; el entorno limita**.

## Las cuatro capas de control

### 1. Instrucciones

Definen intención y método:

- objetivo;
- alcance;
- archivos permitidos;
- acciones que debe consultar;
- pruebas requeridas;
- condiciones de detención.

Son imprescindibles para producir buen trabajo, pero son una política blanda. El modelo puede interpretar mal una frase, olvidar una restricción después de una conversación larga o creer que una acción es una consecuencia obvia del objetivo.

### 2. Harness

Es el CLI o entorno que traduce decisiones del modelo en acciones reales: Codex, Claude Code, OpenCode u otro agente.

El harness puede:

- ocultar una herramienta;
- permitirla;
- bloquearla;
- pedir aprobación;
- limitar filesystem y red;
- registrar qué ocurrió.

Esta es la primera capa de enforcement. Si `ssh`, `git push` o una edición están en `deny`, el modelo no debería poder convertir su intención en esa acción mediante la herramienta normal.

### 3. Entorno de ejecución

Incluye el sistema operativo, contenedor, sandbox, usuario, worktree y conectividad.

Un agente puede tener permiso de ejecutar shell y aun así estar contenido si:

- corre como usuario sin privilegios;
- sólo puede escribir dentro de un worktree;
- no tiene acceso a sockets sensibles;
- no puede salir a Internet;
- los hosts productivos no son alcanzables desde esa red.

Esta capa protege incluso cuando el harness está mal configurado o aparece una vía no contemplada.

### 4. Autoridad externa

Son las credenciales y permisos del sistema destino:

- token read-only;
- clave SSH de un host de desarrollo, no de producción;
- usuario de base sin permisos de escritura;
- cuenta cloud sin capacidad de deploy;
- branch protection y revisión obligatoria.

Es la última red. Aunque el agente escape de las capas anteriores, no debería poseer autoridad para realizar una acción que nunca necesitó.

## Un caso concreto: GLM 5.3 desde OpenCode

En una sesión de OpenCode con GLM 5.3, el agente podía instalar una librería o conectarse por SSH sin consultar. Sólo frenaba si la instrucción le pedía expresamente solicitar permiso primero.

El comportamiento no se explica únicamente por la personalidad del modelo. En OpenCode, la mayoría de los permisos parten actualmente de `allow`; el agente Build tiene acceso amplio y tanto instalar dependencias como ejecutar `ssh` pasan por `bash`. Si `bash` está habilitado, no hay una pausa obligatoria entre la decisión y la ejecución.

La instrucción “preguntame antes” agregaba una convención. El entorno seguía permitiendo actuar sin ella.

La solución durable no es redactar una amenaza más dramática en el prompt. Es configurar `bash` para que las acciones sensibles sean `ask` o `deny`, y quitar del entorno las credenciales que el agente no necesita.

## No confundir modelo, proveedor y harness

Usar un modelo externo a OpenAI o Anthropic no implica quedar sin controles. Si GLM, DeepSeek, Qwen o cualquier otro modelo corre dentro de OpenCode, las llamadas a herramientas siguen pasando por OpenCode y pueden quedar sometidas a sus permisos.

Lo que cambia es el grado de integración y previsibilidad:

- algunos modelos entienden mejor los estados de aprobación del CLI;
- algunos respetan con mayor consistencia instrucciones negativas;
- algunos proponen acciones más agresivas para completar la tarea;
- algunos harnesses ofrecen sandboxes, perfiles o revisores más sofisticados.

Por eso el modelo no debe ser la frontera. La política tiene que sobrevivir al cambio de proveedor.

## Cómo expresan el control los distintos CLIs

### Codex

Codex separa dos dimensiones que suelen mezclarse:

1. **Sandbox:** qué puede alcanzar la ejecución.
2. **Approval policy:** cuándo debe detenerse y pedir autorización.

Los tres niveles clásicos del sandbox son:

- `read-only`;
- `workspace-write`;
- `danger-full-access`.

Pero eso no equivale a tres modos completos de operación. La aprobación se configura aparte mediante políticas como `on-request`, `never` o controles granulares por categoría. También existen perfiles de permisos integrados como `:read-only`, `:workspace` y `:danger-full-access`.

El valor de esta separación es que se puede permitir edición dentro del workspace y, al mismo tiempo, exigir aprobación para una escalada o rechazar directamente ciertas clases de solicitud.

### Claude Code

Claude Code ofrece modos de interacción como:

- `default`, mostrado como Manual;
- `acceptEdits`;
- `plan`;
- `bypassPermissions` cuando está habilitado;
- `auto` en versiones que lo soportan.

Además de esos modos, las reglas permiten clasificar herramientas o comandos como allow, ask o deny. `bypassPermissions` no debe confundirse con “trabajar más rápido”: elimina pausas y sólo tiene sentido dentro de un contenedor o VM donde el alcance ya esté controlado por afuera.

### OpenCode

OpenCode usa permisos `allow`, `ask` y `deny`, configurables globalmente y por agente. Puede aplicar reglas a edición, shell, acceso a directorios externos, web, skills y subagentes, incluso discriminando comandos mediante patrones.

Su agente Plan restringe ediciones y bash, pero el agente Build parte de un perfil mucho más permisivo. El modo `--auto` aprueba lo que hubiera quedado en `ask`, aunque sigue respetando reglas explícitas en `deny`.

La conclusión no es que OpenCode carezca de control. Es que **hay que diseñarlo**: sus defaults priorizan fluidez y no representan automáticamente una política conservadora.

## Un perfil portable de trabajo guiado

Más que memorizar nombres de modos que cambian entre herramientas, conviene definir capacidades estables.

### Observador

- lectura del repositorio;
- búsqueda y análisis;
- sin edición;
- sin shell mutativo;
- sin red privada;
- sin credenciales de escritura.

Uso: discovery, auditoría, planificación y revisión.

### Implementador guiado

- escritura sólo dentro del worktree;
- lectura amplia del proyecto;
- comandos locales seguros permitidos;
- instalación de dependencias con aprobación;
- SSH, deploy, push y migraciones con aprobación o bloqueo;
- sin acceso a secretos productivos.

Uso: desarrollo cotidiano con intervención humana en cambios de superficie.

### Implementador acotado

- autonomía dentro de un worktree descartable;
- allowlist de comandos y destinos;
- sin acceso a otros repositorios;
- sin credenciales productivas;
- integración mediante PR y revisión.

Uso: tareas bien especificadas y fáciles de validar.

### Autónomo aislado

- permisos amplios dentro de un contenedor o VM descartable;
- red controlada;
- secretos efímeros y mínimos;
- ningún acceso directo a producción;
- salida mediante artifacts, commits o PR.

Uso: trabajos largos donde las pausas manuales cuestan más que recrear el entorno.

## Ejemplo conservador para OpenCode

Este perfil permite exploración local, pregunta antes de editar o instalar y bloquea accesos que no deberían ocurrir desde un worker común:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "*": "ask",
    "read": "allow",
    "glob": "allow",
    "grep": "allow",
    "list": "allow",
    "lsp": "allow",
    "edit": "ask",
    "external_directory": "deny",
    "bash": {
      "*": "ask",
      "git status*": "allow",
      "git diff*": "allow",
      "git log*": "allow",
      "rg *": "allow",
      "npm install*": "ask",
      "pnpm add*": "ask",
      "ssh *": "ask",
      "scp *": "ask",
      "rsync *": "ask",
      "docker *": "ask",
      "git push*": "deny",
      "sudo *": "deny",
      "rm -rf *": "deny",
      "*deploy*": "deny"
    }
  }
}
```

OpenCode evalúa reglas por coincidencia y prevalece la última que coincide, por eso el catch-all aparece primero y las excepciones después.

Este ejemplo es una base editorial, no una configuración universal. Cada proyecto debe declarar sus comandos seguros y sus operaciones prohibidas. Un patrón demasiado amplio como `*deploy*` también puede bloquear comandos inocentes con ese texto; la política real debe probarse con el CLI y versión utilizados.

## Cómo preparar un entorno antes de lanzar el agente

1. Crear una rama y worktree exclusivos.
2. Elegir el perfil de capacidad: observador, guiado, acotado o aislado.
3. Configurar allow, ask y deny en el harness.
4. Ejecutar el agente con un usuario sin privilegios innecesarios.
5. Retirar credenciales y variables que no correspondan a la tarea.
6. Limitar red y hosts accesibles.
7. Proteger merge, deploy y producción fuera del agente.
8. Probar una acción permitida, una que deba preguntar y una bloqueada.
9. Recién entonces entregar el objetivo real.

La prueba negativa es clave. Ver que `git status` funciona no demuestra que `ssh producción` esté bloqueado.

## Qué debe decir la instrucción aunque existan barreras

El enforcement evita acciones no autorizadas, pero una buena instrucción reduce intentos inútiles y mejora el razonamiento:

```text
Trabajás en un entorno guiado.

Podés inspeccionar el repositorio y ejecutar validaciones locales de solo lectura.
Antes de editar, instalar dependencias, usar red privada o iniciar una conexión SSH,
explicá por qué es necesario y solicitá aprobación.

No realices push, deploy, migraciones ni cambios externos.
Si una acción necesaria está bloqueada, no busques una vía alternativa:
detenete y entregá el comando o cambio propuesto para revisión humana.
```

La frase más importante es **no busques una vía alternativa**. Un agente orientado a completar objetivos puede interpretar un bloqueo como un obstáculo técnico que debe resolver. La instrucción aclara que, en este contexto, el bloqueo es una decisión de gobierno.

## Señales de un entorno mal diseñado

- el agente puede conectarse a cualquier host porque heredó todas las claves SSH;
- puede instalar paquetes sin que exista lockfile o revisión del diff;
- conoce secretos productivos para una tarea puramente local;
- un “modo plan” conserva shell o edición efectiva;
- la única protección es una frase dentro del prompt;
- el mismo agente puede implementar, aprobar, pushear y desplegar;
- se prueba el camino permitido, pero nunca el bloqueo;
- cambiar de modelo obliga a reconstruir toda la política.

## Principio transferible

Un buen entorno no intenta adivinar si el modelo será obediente. Parte de que cualquier modelo puede equivocarse, olvidar contexto o perseguir el objetivo con demasiado entusiasmo.

La calidad del modelo determina cuánto trabajo útil produce dentro del perímetro. **La calidad del entorno determina cuánto daño puede producir fuera de él.**

## Referencias

- [Codex — referencia de configuración](https://learn.chatgpt.com/docs/config-file/config-reference)
- [Claude Code — permisos](https://docs.anthropic.com/en/docs/claude-code/permissions)
- [OpenCode — permisos](https://opencode.ai/docs/permissions/)
- [OpenCode — agentes](https://opencode.ai/docs/agents)
