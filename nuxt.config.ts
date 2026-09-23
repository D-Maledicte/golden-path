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

const siteUrl = process.env.NUXT_PUBLIC_SITE_URL ?? 'https://golden-path.pages.dev'

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

  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: true,
      routes: ['/', '/glosario', '/entradas', ...entrySlugs.map(slug => `/entrada/${slug}`)],
    },
  },

  typescript: { strict: true, typeCheck: false },
})
