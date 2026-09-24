<script setup lang="ts">
import type { LibraryEntry } from '~/types/library'

const { entries, areas, areaGlyph, areaLabel, typeLabel } = useLibrary()
const { t, localePath } = useI18n()
const reader = useReader()

const grouped = computed(() =>
  areas
    .filter(area => area !== 'Toda la biblioteca')
    .map(area => ({
      area,
      items: entries.filter((entry: LibraryEntry) => entry.area === area),
    }))
    .filter(group => group.items.length > 0),
)

useHead({ title: t('index.title') })
useSeoMeta({
  description: t('index.description', { count: entries.length }),
  ogTitle: `${t('index.title')} · Golden Path`,
  ogType: 'website',
})
</script>

<template>
  <main id="biblioteca" class="px-4 pb-20 pt-6 md:px-[clamp(22px,5vw,74px)] md:pb-24">
    <header class="relative mb-14 overflow-hidden rounded-[22px] border border-gold/18 p-8 md:p-12">
      <ClientOnly>
        <DotGrid
          class="absolute inset-0 z-0"
          :dot-size="3"
          :gap="24"
          base-color="#2b2452"
          active-color="#edc35e"
          :proximity="130"
          :speed-trigger="90"
          :shock-radius="200"
          :shock-strength="4"
          :max-speed="2600"
          :return-duration="1.6"
        />
      </ClientOnly>
      <div class="relative z-10">
        <HyperText
          :text="t('index.kicker')"
          :duration="700"
          class="font-sans text-[.78rem] font-bold uppercase tracking-[.16em] text-gold"
        />
        <h1 class="mb-0 mt-2 font-display text-[clamp(2.2rem,5vw,3.4rem)] font-medium leading-[1.05]">
          {{ t('index.title') }}
        </h1>
        <p class="mt-4 max-w-[52ch] text-faint">
          {{ t('index.lead', { count: entries.length }) }}
        </p>
        <NuxtLink
          :to="localePath('/')"
          class="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/11 bg-white/4 px-4 py-2.5 font-bold text-ink transition hover:brightness-110"
        >
          {{ t('index.back') }}
        </NuxtLink>
      </div>
    </header>

    <div class="space-y-14">
      <section v-for="group in grouped" :key="group.area" :aria-labelledby="`area-${group.area}`">
        <div class="mb-5 flex items-baseline gap-3 border-b border-white/7 pb-3">
          <span class="text-gold">{{ areaGlyph(group.area) }}</span>
          <h2 :id="`area-${group.area}`" class="m-0 font-display text-[1.7rem] font-medium">
            {{ areaLabel(group.area) }}
          </h2>
          <span class="ml-auto font-mono text-[.75rem] text-dim">{{ group.items.length }}</span>
        </div>

        <ul class="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
          <li v-for="entry in group.items" :key="entry.slug">
            <NuxtLink
              :to="localePath(`/entrada/${entry.slug}`)"
              class="group flex h-full flex-col rounded-2xl border border-white/7.5 bg-white/2 p-4 transition hover:-translate-y-0.5 hover:border-gold/25 hover:bg-white/4"
            >
              <span class="text-[.68rem] font-bold uppercase tracking-[.08em] text-gold-bright">
                {{ typeLabel(entry.type) }}
              </span>
              <span class="mt-2 font-display text-[1.08rem] leading-snug text-ink">
                {{ entry.title }}
              </span>
              <span class="mt-2 text-[.82rem] leading-snug text-[#8e899d]">
                {{ entry.summary }}
              </span>
            </NuxtLink>
          </li>
        </ul>
      </section>
    </div>

    <p class="mt-14 text-[.84rem] text-dim">
      {{ t('index.lookingFor') }}
      <NuxtLink :to="localePath('/glosario')" class="text-cyan underline-offset-4 hover:underline">
        {{ t('index.toGlossary') }}
      </NuxtLink>
      ·
      <button type="button" class="text-cyan underline-offset-4 hover:underline" @click="reader.show(entries[0]!.slug)">
        {{ t('index.openReader') }}
      </button>
    </p>
  </main>
</template>
