<script setup lang="ts">
const route = useRoute()
const { bySlug, areaGlyph } = useLibrary()
const reader = useReader()

const slug = computed(() => String(route.params.slug ?? ''))
const entry = computed(() => bySlug(slug.value))

if (!entry.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Esa entrada no existe en la biblioteca',
    fatal: true,
  })
}

useHead({
  title: () => entry.value?.title ?? 'Entrada',
})

useSeoMeta({
  description: () => entry.value?.summary ?? '',
  ogTitle: () => `${entry.value?.title ?? ''} · Golden Path`,
  ogDescription: () => entry.value?.summary ?? '',
  ogType: 'article',
  articleSection: () => entry.value?.area,
  articleTag: () => entry.value?.tags ?? [],
})

const config = useRuntimeConfig()

useHead({
  link: [{ rel: 'canonical', href: () => `${config.public.siteUrl}/entrada/${slug.value}` }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: () =>
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: entry.value?.title,
          description: entry.value?.summary,
          articleSection: entry.value?.area,
          keywords: entry.value?.tags?.join(', '),
          inLanguage: 'es',
          url: `${config.public.siteUrl}/entrada/${slug.value}`,
          isPartOf: {
            '@type': 'CollectionPage',
            name: 'Golden Path',
            url: config.public.siteUrl,
          },
        }),
    },
  ],
})
</script>

<template>
  <main v-if="entry" id="biblioteca" class="px-4 pb-20 pt-6 md:px-[clamp(22px,5vw,74px)] md:pb-24">
    <nav class="mb-8 flex flex-wrap items-center gap-2 text-[.82rem] text-dim" aria-label="Migas de pan">
      <NuxtLink to="/" class="text-cyan underline-offset-4 hover:underline">Biblioteca</NuxtLink>
      <span aria-hidden="true">/</span>
      <span>{{ areaGlyph(entry.area) }} {{ entry.area }}</span>
    </nav>

    <header class="mb-10 max-w-[46rem]">
      <p class="mb-2 text-[.78rem] font-bold uppercase tracking-[.16em] text-gold">
        {{ entry.area }}
      </p>
      <h1 class="m-0 font-display text-[clamp(2.2rem,5.5vw,3.6rem)] font-medium leading-[1.05] tracking-[-.02em]">
        {{ entry.title }}
      </h1>
      <BlurText
        :text="entry.summary"
        :delay="16"
        :duration="0.4"
        class="mt-5 gap-x-[.3em] font-sans text-[1.05rem] leading-[1.6] text-faint"
      />
    </header>

    <EntryArticle :entry="entry" variant="page" />

    <div class="mt-16 flex flex-wrap gap-3">
      <NuxtLink
        to="/"
        class="rounded-xl border border-white/11 bg-white/4 px-4 py-2.5 font-bold text-ink transition hover:brightness-110"
      >
        ← Volver a la biblioteca
      </NuxtLink>
      <button
        type="button"
        class="rounded-xl border border-gold/25 bg-gold/8 px-4 py-2.5 font-bold text-gold-bright transition hover:bg-gold/14"
        @click="reader.show(entry.slug)"
      >
        Abrir en el lector
      </button>
    </div>
  </main>
</template>
