# Golden Path

Biblioteca editorial sobre cómo diseñar entornos donde los agentes hacen buen
trabajo sin llevarse producción puesta: conceptos, patrones, guías y casos reales
anonimizados sobre Orca, Hermes, Amp, OpenDesign y el gobierno de agentes.

Recreación en **Nuxt 4 (SSG)** del sitio estático original, preservando la
maquetación y la estructura editorial, con la capa visual reconstruida sobre
**[nxui](https://nxui.geoql.in/docs)**.

---

## Stack

| Pieza | Versión | Rol |
| --- | --- | --- |
| Nuxt | 4.5 | SSG + rutas prerenderizadas |
| Vue | 3.5 | `<script setup>` + TypeScript |
| Tailwind CSS | 4.3 | utilidades y tokens de diseño |
| nxui | 243 componentes | capa visual animada |
| motion-v | 2.4 | animaciones (dependencia de nxui) |
| markdown-it + Shiki | 15 / 4.4 | compilación del Markdown en build |
| gray-matter | 4.0 | frontmatter validado |

El sitio se genera 100% estático: **26 rutas prerenderizadas** (portada, índice,
glosario y 23 entradas), sin backend ni base de datos.

---

## Puesta en marcha

Requiere Node 22. El proyecto fija la versión con `.nvmrc`.

```bash
nvm use            # Node 22
npm install
npm run dev        # http://localhost:3000
```

### Build de producción

```bash
npm run generate   # genera .output/public (estático puro)
npm run preview    # sirve el resultado del build
```

`.output/public` se puede subir a cualquier hosting estático (Cloudflare Pages,
Netlify, Vercel, S3, nginx). Definí `NUXT_PUBLIC_SITE_URL` para que el
`sitemap.xml`, el `robots.txt` y las etiquetas canónicas usen el dominio real:

```bash
NUXT_PUBLIC_SITE_URL=https://tu-dominio.com npm run generate
```

## Deploy

El build para un hosting puramente estático es:

| | |
| --- | --- |
| **Build command** | `npm run generate` |
| **Publish directory** | `.output/public` |
| **Variable recomendada** | `NUXT_PUBLIC_SITE_URL=https://tu-dominio.com` |

Sirve para Cloudflare Pages, Netlify, S3 o cualquier hosting estático. Los
pre-scripts de npm (`pregenerate`) compilan el contenido antes del build, así que
no hace falta ningún paso extra.

> **En Vercel** no hace falta configurar nada: su integración de Nuxt corre
> `npm run build` y aplica el preset `vercel`, que también prerenderiza las 26
> rutas (por `nitro.prerender`). El resultado son páginas estáticas servidas
> desde el CDN más una función de respaldo que sólo atiende rutas inexistentes.
> Si querés un deploy 100 % estático sin función, se puede forzar, pero hay que
> verificar que Vercel tome `.output/public`.

> **Definí `NUXT_PUBLIC_SITE_URL`.** No es cosmético: las tarjetas de
> previsualización se referencian con URL absoluta, y las plataformas de mensajería
> no pueden resolver una relativa. Sin esa variable, al compartir un enlace no
> aparece imagen. También la usan las canónicas, el `sitemap.xml` y el
> `robots.txt`.

El workflow `.github/workflows/build.yml` valida el build en cada push y sube el
resultado como artefacto, para poder desplegarlo a mano si hiciera falta.

> Para **GitHub Pages** hay que tener en cuenta el subpath: un project site vive
> en `https://usuario.github.io/golden-path/`, y las rutas absolutas del sitio
> (`/assets/...`, `/_nuxt/...`) necesitan `app.baseURL: '/golden-path/'`. Con un
> dominio propio no hace falta.

### Qué no se versiona

`app/generated/`, `public/content.json`, `public/sitemap.xml` y
`public/robots.txt` son **artefactos generados** por
`scripts/build-content.mjs` y están en `.gitignore`. Se recrean solos en cada
`dev`, `build`, `generate` y `preview`.

Las tarjetas de `public/og/` sí se versionan: cambian poco y conviene que sean
estables (no dependen de las fuentes que tenga el runner de CI). Regeneralas con
`npm run og` cuando cambies títulos o agregues una entrada.

---

## Estructura

```
content/                  23 entradas en Markdown (fuente de verdad editorial)
app/
  app.vue                 shell: skip-link, páginas, footer, glosario, lector, paleta
  assets/css/main.css     paleta, tokens shadcn-vue, prosa editorial
  components/             componentes del sitio (SiteHero, EntryCard, …)
  components/ui/          componentes de nxui (vendorizados, sin modificar)
  composables/            useLibrary, useReader, useToast, useCommandPalette…
  data/glossary.ts        los 24 términos del glosario
  generated/entries.ts    AUTO-GENERADO — no editar a mano
  lib/utils.ts            `cn()` (clsx + tailwind-merge)
  pages/                  index, entrada/[slug], entradas, glosario
  types/library.ts        tipos compartidos
public/                   favicon, content.json, sitemap.xml, robots.txt
scripts/                  pipeline de contenido, imágenes y vendorizado de nxui
```

---

## Pipeline de contenido

`scripts/build-content.mjs` compila `content/*.md` a `app/generated/entries.ts`
y se ejecuta solo, antes de `dev`, `build`, `generate` y `preview`.

Qué hace:

1. Parsea el frontmatter con **YAML real** (`gray-matter`), no con un split
   casero. Si un archivo tiene frontmatter inválido, lo reporta con nombre y
   motivo en lugar de romper el build en silencio.
2. Renderiza el Markdown con **markdown-it** + **Shiki** usando un tema derivado
   de la paleta del sitio. Soporta listas anidadas, tablas, code spans y bloques
   de código con resaltado.
3. Agrega `id` a cada `h2`/`h3` y extrae los encabezados para el índice lateral.
4. Elimina el `h1` inicial del cuerpo (la página ya aporta el título) para no
   duplicar encabezados.
5. Valida `slug`, `title`, `summary`, `type`, `area` y que cada `related`
   resuelva a una entrada existente.
6. Genera además `public/content.json` (la biblioteca completa en JSON, para
   pasarle contexto a otro agente), `public/sitemap.xml` y `public/robots.txt`.

### Agregar una entrada

Creá `content/mi-entrada.md`:

```markdown
---
slug: mi-entrada
title: Mi entrada
type: concept          # concept | guide | editorial | case-study
order: 3               # orden dentro del área
summary: "Una frase. Si contiene dos puntos, va entre comillas."
tags: [orca, agentes]
related: [orca-como-ade, orquestacion]
area: Orca             # debe existir en AREA_ORDER
glyph: ◉
hue: rgba(237,195,94,.25)
---

# Mi entrada

## Primera sección

Texto…
```

Después: `npm run content` (o simplemente `npm run dev`).

> **Importante:** los valores con `: ` o ` #` deben ir entre comillas. Es YAML,
> no un formato casero.

---

## Componentes de nxui

Los 19 componentes usados se vendorizaron en `app/components/ui/` con
`npm run nxui`, que los descarga del **servidor MCP remoto** de nxui
(`https://nxui.geoql.in/mcp`). Quedan **sin modificar**, tal como los publica el
registry, para poder re-descargarlos o actualizarlos sin conflictos.

| Componente | Dónde se usa |
| --- | --- |
| `soft-aurora` | fondo animado del hero (WebGL vía `ogl`) |
| `noise-texture` | grano sobre el hero |
| `border-beam` | borde recorrido por un haz en el hero |
| `gradient-text` | título "Golden Path" |
| `text-animate` | eyebrow del hero |
| `blur-text` | entradilla del hero y resumen en las páginas de entrada |
| `count-up` | contador de entradas |
| `glass-surface` | badge de entradas del hero |
| `spotlight-card` | tarjetas del catálogo (glow con el `hue` de cada entrada) |
| `star-border` | pastilla de tipo en el lector y las páginas de entrada |
| `shimmer-button` | CTAs primarios (buscar, descargar `.md`) |
| `interactive-hover-button` | CTA secundario del hero |
| `animated-toc` | índice lateral de la entrada, con riel SVG animado |
| `animated-list` | índice de términos del glosario |
| `magnet` | botón flotante del glosario |
| `dot-grid` | fondo de `/entradas` y del 404 |
| `command-menu` | paleta de comandos (⌘K) |
| `hyper-text` | kicker de `/entradas` |
| `scroll-reveal` | encabezado de `/glosario` |

Para agregar otro:

```bash
npm run nxui        # editar COMPONENTS en scripts/fetch-nxui.mjs primero
```

### Dos adaptaciones necesarias

Los componentes de nxui asumen un entorno Nuxt con ciertos módulos. Ninguno se
modificó; en su lugar se proveyó lo que esperan:

- **`<Icon name="lucide:*">`** → módulo `@nuxt/icon` con `serverBundle: 'local'`
  y `@iconify-json/lucide`, para que los iconos viajen en el bundle y el sitio
  estático no dependa de la API de Iconify en runtime.
- **`useColorMode()`** (lo usa `ShimmerButton`) → `app/composables/useColorMode.ts`
  es un shim *dark-only*. El sitio no tiene modo claro; si algún día se agrega
  `@nuxtjs/color-mode`, se borra el shim y listo.

Además, `scripts/fetch-nxui.mjs` omite los `index.ts` del registry: colisionan
con el nombre del componente principal en el auto-import de Nuxt.

---

## Sistema de diseño

La paleta original se preservó sin cambios, expuesta como tokens de Tailwind v4
en `app/assets/css/main.css`:

| Token | Valor | Uso |
| --- | --- | --- |
| `--color-night` | `#080714` | fondo |
| `--color-ink` | `#f8f3e3` | texto principal |
| `--color-gold` / `--color-gold-bright` | `#edc35e` / `#ffe8a1` | acento primario |
| `--color-violet` | `#a86aff` | acento secundario |
| `--color-cyan` | `#57d9e8` | enlaces |
| `--color-magenta` | `#ec5fbd` | acento terciario |
| `--color-faint` / `--color-dim` | `#aaa4bc` / `#777184` | texto secundario |

El modo oscuro es permanente: la clase `.dark` vive fija en `<html>` y
`@custom-variant dark` la conecta con los `dark:` de nxui. También se definen los
tokens shadcn-vue (`--background`, `--foreground`, `--muted`, `--border`, …) que
consumen los componentes vendorizados.

---

## Scripts

| Script | Qué hace |
| --- | --- |
| `npm run dev` | desarrollo con HMR |
| `npm run generate` | build estático completo |
| `npm run preview` | sirve `.output/public` |
| `npm run content` | recompila `content/*.md` → `entries.ts` + artefactos |
| `npm run og` | regenera las tarjetas de previsualización en `public/og/` |
| `npm run nxui` | re-descarga los componentes de nxui vía MCP |
| `npm run optimize` | genera AVIF/WebP del banner del hero |
| `npm run migrate` | migra contenido desde el export original |

---

## Diferencias con el sitio original

El port preserva la maquetación (hero, riel de recorridos, catálogo de tarjetas,
lector en superposición, glosario flotante, footer) y el contenido palabra por
palabra. Además corrige defectos del original:

- **Bugs del renderer Markdown.** El sitio original tenía un renderer propio que
  aplicaba negrita/itálica *después* de envolver en `<code>`, así que
  `` `*deploy*` `` se convertía en `<code><em>deploy</em></code>` (los asteriscos
  literales desaparecían) y los enlaces con `*` en la URL rompían el `href`. Con
  markdown-it eso no ocurre, y además ahora funcionan las listas anidadas y las
  tablas anchas.
- **Frontmatter YAML inválido.** Tres `summary` contenían `: ` sin comillas, lo
  que es YAML inválido. El parser casero del original lo tapaba; ahora están
  citados y el build valida.
- **SEO y previsualización.** El original no tenía `og:*`, canónicas,
  `robots.txt`, `sitemap.xml` ni datos estructurados, y el cuerpo de las entradas
  no estaba en el HTML. Ahora hay una ruta real por entrada, prerenderizada, con
  metadatos completos y JSON-LD (`Article`). Además cada entrada tiene su propia
  tarjeta de previsualización de 1200×630 (`npm run og`), así que al compartir un
  enlace se ve la obra con el título de esa entrada.
- **Doble `h1`.** El `h1` del Markdown duplicaba el de la página; se elimina en
  build.
- **Banner del hero.** El PNG del repositorio original estaba **truncado**: la
  secuencia de chunks cortaba a los ~415 KB de 786 KB, sin chunk `IEND`, y el
  stream `IDAT` no descomprimía. Se reemplazó por el master válido (2000×771) y
  se generaron variantes AVIF/WebP: la obra pasa de 3,1 MB a **99 KB** en AVIF de
  1400 px, un 97 % menos.
- **Sin `LICENSE`** pese a que el footer dice "All rights reserved". Se agregó.
- **Accesibilidad**: se mantienen skip-link, `aria-live`, foco visible,
  `prefers-reduced-motion` y `<dialog>` nativo del original.

### Ilustración del hero

El hero combina la obra con la capa atmosférica de nxui **encima**, en
`mix-blend-screen`, para sumar luz sin taparla:

```
0 · ilustración (AVIF/WebP, fallback PNG)
1 · color grade + aurora animada (SoftAurora), mix-blend-screen
2 · degradado de legibilidad para el texto
3 · grano (NoiseTexture)
4 · marco interior
5 · borde animado (BorderBeam)
```

Para cambiar la ilustración:

1. Reemplazá `public/assets/golden-path-banner.png`.
2. `npm run optimize` → regenera AVIF y WebP en 2000, 1400 y 900 px.

El `<picture>` ya tiene `srcset`, `sizes`, `width`/`height` y
`fetchpriority="high"` configurados.

> La obra trae un "GOLDEN PATH" horneado en el centro que convive con el `<h1>`
> del hero. Es deliberado. Si algún día se quiere evitar la repetición, la banda
> del título está en las filas ~13-24 % de la altura: recortar
> `Math.round(height * 0.255)` px desde arriba la elimina (a costa de cortar las
> cabezas de los colosos laterales).

---

## Notas de entorno

- **`npm install` en WSL con npm 10.8 falla.** npm no detecta bien la libc y
  descarta `@rolldown/binding-linux-x64-gnu`, con lo que `nuxt prepare` rompe con
  `Cannot find module '@rolldown/binding-linux-x64-gnu'`. Solución: usar Node 22
  con npm 11+ (`nvm use`, ver `.nvmrc`) o instalar el binding a mano.
- **Peso.** El bundle incluye el HTML y el Markdown crudo de las 23 entradas para
  que el lector abra sin peticiones y el "copiar/descargar contexto" sea
  instantáneo. Son ~258 KB gzip de JS+CSS en total; la portada baja ~120 KB.
  Si algún día molesta, el siguiente paso es servir el HTML del cuerpo por
  entrada y dejar en el bundle sólo los metadatos.
