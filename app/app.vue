<script setup lang="ts">
const config = useRuntimeConfig()
const route = useRoute()
const { locale, meta, t, localePath } = useI18n()
/** Ambos idiomas tienen las mismas entradas (lo valida el build de contenido). */
const total = useLibrary().entries.length

/** Tarjeta de previsualización por defecto (la obra completa, 1200x630). */
const defaultOgImage = `${config.public.siteUrl}/og/golden-path.jpg`

/** Canónica de toda página, derivada de la ruta. */
const canonical = computed(() => {
  const path = route.path === '/' ? '/' : route.path.replace(/\/+$/, '')
  return `${config.public.siteUrl}${path}`
})

/** Cada página existe en los dos idiomas: se declaran como alternativas. */
const alternate = (target: 'es' | 'en') => `${config.public.siteUrl}${localePath(route.path, target)}`

useHead({
  htmlAttrs: { lang: () => meta.value.htmlLang },
  titleTemplate: title => (title ? `${title} · Golden Path` : 'Golden Path'),
  link: [
    { rel: 'canonical', href: canonical },
    { rel: 'alternate', hreflang: 'es', href: () => alternate('es') },
    { rel: 'alternate', hreflang: 'en', href: () => alternate('en') },
    { rel: 'alternate', hreflang: 'x-default', href: () => alternate('es') },
    { rel: 'alternate', type: 'application/json', href: () => localePath('/content.json'), title: () => t('site.jsonTitle') },
  ],
})

useSeoMeta({
  description: () => t('site.description'),
  ogSiteName: 'Golden Path',
  ogLocale: () => meta.value.og,
  ogLocaleAlternate: () => (locale.value === 'es' ? ['en_US'] : ['es_AR']),
  ogImage: defaultOgImage,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: () => t('site.ogAlt'),
  twitterCard: 'summary_large_image',
  twitterImage: defaultOgImage,
})
</script>

<template>
  <div class="min-h-screen">
    <a
      href="#biblioteca"
      class="fixed left-4 top-4 z-100 -translate-y-[180%] rounded-full bg-gold px-4 py-2.5 font-semibold text-[#171018] transition-transform focus:translate-y-0"
    >
      {{ t('site.skip') }}
    </a>

    <LocaleToggle />

    <!-- `useLibrary` toma el idioma al montarse: al cambiarlo se remonta todo
         lo que depende de la biblioteca. -->
    <div :key="locale">
      <div class="mx-auto w-[min(1500px,100%)]">
        <NuxtPage />
        <SiteFooter :total="total" />
      </div>

      <GlossaryPanel />
      <EntryReader />
      <SearchCommand />
    </div>
    <ToastHost />
  </div>
</template>
