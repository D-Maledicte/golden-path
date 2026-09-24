import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import tailwindcss from '@tailwindcss/vite'

const contentDir = join(process.cwd(), 'content')

/**
 * Las entradas viven en `content/*.md` y se compilan en build (ver
 * `app/composables/useLibrary.ts`). Acá sólo leemos el slug de cada archivo
 * para prerenderizar una ruta real por entrada.
 */
const entrySlugs = existsSync(contentDir)
  ? readdirSync(contentDir)
      .filter(file => file.endsWith('.md'))
      .map(file => readFileSync(join(contentDir, file), 'utf8').match(/^slug:\s*(.+)$/m)?.[1]?.trim())
      .filter((slug): slug is string => Boolean(slug))
  : []

/**
 * Origen canónico del sitio. Lo usan `og:image`, las canónicas, el `sitemap.xml`
 * y el `robots.txt`, así que tiene que ser el dominio real: las plataformas de
 * mensajería no resuelven `og:image` relativas.
 *
 * Orden de resolución:
 *   1. `NUXT_PUBLIC_SITE_URL` — explícita, la que hay que definir en el host.
 *   2. `VERCEL_PROJECT_PRODUCTION_URL` / `VERCEL_URL` — las inyecta Vercel en el
 *      build. Evita que un deploy quede apuntando a un dominio inexistente.
 *   3. Placeholder de desarrollo.
 */
const explicitSiteUrl = process.env.NUXT_PUBLIC_SITE_URL
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL
const siteUrl = (
  explicitSiteUrl ?? (vercelHost ? `https://${vercelHost}` : 'https://golden-path.pages.dev')
).replace(/\/+$/, '')

if (siteUrl === 'https://golden-path.pages.dev') {
  console.warn(
    '\n[golden-path] NUXT_PUBLIC_SITE_URL no está definida.\n'
    + '  og:image, las canónicas y el sitemap van a apuntar al placeholder y las\n'
    + '  previsualizaciones al compartir enlaces no van a funcionar.\n'
    + '  Definila con el dominio real, por ejemplo: NUXT_PUBLIC_SITE_URL=https://ia.dmaledicte.cloud\n',
  )
}

export default defineNuxtConfig({
  compatibilityDate: '2026-09-23',
  devtools: { enabled: true },

  modules: ['@nuxt/icon'],

  css: ['~/assets/css/main.css'],

  /**
   * Los componentes de nxui viven en `app/components/ui/` y el resto en
   * `app/components/`. `pathPrefix: false` los expone por nombre de archivo
   * (`<SpotlightCard>`, `<SiteHero>`) en vez de por ruta completa.
   */
  components: [{ path: '~/components', pathPrefix: false, extensions: ['vue'] }],

  /**
   * `@nuxt/icon` se usa sólo para los iconos que los componentes de nxui
   * referencian como `<Icon name="lucide:*">`. Se empaquetan en build para que
   * el sitio estático no dependa de la API de Iconify en runtime.
   */
  icon: {
    mode: 'svg',
    serverBundle: 'local',
    clientBundle: { scan: true, sizeLimitKb: 0 },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    head: {
      htmlAttrs: { lang: 'es', class: 'dark' },
      titleTemplate: '%s · Golden Path',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#080714' },
        { name: 'color-scheme', content: 'dark' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/assets/favicon.svg' }],
    },
  },

  runtimeConfig: {
    public: { siteUrl },
  },

  /**
   * Los `_nuxt/*` ya salen con `immutable` (Vercel los reconoce por el hash).
   * Estos son los archivos de `public/`, que no están hasheados: cache
   * moderado para no servir una versión vieja durante meses si se reemplazan.
   */
  routeRules: {
    '/og/**': { headers: { 'cache-control': 'public, max-age=86400, stale-while-revalidate=604800' } },
    '/assets/**': { headers: { 'cache-control': 'public, max-age=86400, stale-while-revalidate=604800' } },
    '/content.json': { headers: { 'cache-control': 'public, max-age=3600' } },
    '/llms.txt': { headers: { 'cache-control': 'public, max-age=3600' } },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: true,
      routes: [
        '/', '/glosario', '/entradas', '/conectar', ...entrySlugs.map(slug => `/entrada/${slug}`),
        '/en', '/en/glosario', '/en/entradas', '/en/conectar', ...entrySlugs.map(slug => `/en/entrada/${slug}`),
      ],
    },
  },

  /**
   * Versión en inglés: cada página se registra también bajo `/en` con el mismo
   * componente. El idioma se deriva de la ruta (`useI18n`), no de un plugin.
   */
  hooks: {
    'pages:extend'(pages) {
      for (const page of [...pages]) {
        pages.push({
          ...page,
          name: page.name ? `en-${page.name}` : undefined,
          path: page.path === '/' ? '/en' : `/en${page.path}`,
        })
      }
    },
  },

  typescript: { strict: true, typeCheck: false },
})
