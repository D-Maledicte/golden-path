---
slug: setup-windows-wsl
title: Orca Desktop con Windows y WSL
type: guide
order: 7
summary: Patrón de referencia para separar la interfaz de escritorio del entorno Linux donde viven repositorios, runtimes y agentes.
tags: [orca, setup, windows, wsl, ssh]
related: [hosts-ssh, agent-terminals, acceso-portatil-orca]
---

# Orca Desktop con Windows y WSL

## El patrón

Orca Desktop puede vivir en Windows mientras el trabajo real se ejecuta dentro de WSL. La separación permite conservar una interfaz nativa sin trasladar repositorios, dependencias y CLIs al filesystem de Windows.

| Capa | Responsabilidad |
| --- | --- |
| Windows | Interfaz de Orca y selección del host |
| WSL/Linux | Git, repositorios, runtimes y agentes CLI |
| SSH local | Puente controlado entre la interfaz y el entorno |

## Decisiones importantes

### Repositorios en Linux

Los proyectos se mantienen dentro del filesystem de WSL. Esto reduce fricción con permisos, watchers, rendimiento y herramientas diseñadas para Linux.

### Identidad SSH exclusiva

Orca usa una clave dedicada. No hace falta reutilizar una identidad personal con mayor alcance: una credencial específica simplifica revocación y auditoría.

### Agentes instalados en el host real

Cada CLI debe estar instalado y autenticado dentro de WSL. Que una herramienta funcione en Windows no implica que exista ni comparta sesión dentro de Linux.

### Primera prueba en modo lectura

Antes de habilitar edición, se pide al agente que identifique el framework y cite el archivo donde lo verificó. La prueba prueba simultáneamente conexión, ruta, CLI y acceso al repositorio sin modificar nada.

## Preparar trabajo paralelo

- un worktree y una rama por tarea;
- un único responsable para recursos compartidos;
- alcance y validaciones escritos antes de ejecutar;
- revisión humana antes de merge o deploy;
- credenciales limitadas al host y al proyecto necesarios.

## Checklist portable

- [ ] El servicio SSH del entorno Linux está activo.
- [ ] Orca usa una clave exclusiva.
- [ ] El host local conecta sin depender de una terminal abierta.
- [ ] Los repositorios se abren desde el filesystem Linux.
- [ ] Los agentes están disponibles y autenticados en ese host.
- [ ] La prueba de solo lectura terminó con Git limpio.
- [ ] La estrategia de worktrees está definida.

Los comandos exactos dependen de la distribución, la versión de WSL y la política de seguridad. La guía conserva el diseño; la implementación se valida contra la documentación vigente de cada herramienta.
