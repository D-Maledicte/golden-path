<script setup lang="ts">
const { entries } = useLibrary()
const config = useRuntimeConfig()

/** Tarjeta de previsualización por defecto (la obra completa, 1200x630). */
const defaultOgImage = `${config.public.siteUrl}/og/golden-path.jpg`

useHead({
  titleTemplate: title => (title ? `${title} · Golden Path` : 'Golden Path'),
  link: [{ rel: 'alternate', type: 'application/json', href: '/content.json', title: 'Biblioteca completa en JSON' }],
})

useSeoMeta({
  description:
    'Golden Path: conceptos, patrones y aprendizajes transferibles para diseñar entornos donde los agentes hacen buen trabajo sin llevarse producción puesta.',
  ogSiteName: 'Golden Path',
  ogLocale: 'es_AR',
  ogImage: defaultOgImage,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt:
    'Una figura con túnica blanca camina hacia un horizonte dorado en un paisaje egipcio psicodélico',
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
      Ir a la biblioteca
    </a>

    <div class="mx-auto w-[min(1500px,100%)]">
      <NuxtPage />
      <SiteFooter :total="entries.length" />
    </div>

    <GlossaryPanel />
    <EntryReader />
    <SearchCommand />
    <ToastHost />
  </div>
</template>
