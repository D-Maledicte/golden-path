<script setup lang="ts">
import type { LibraryEntry } from '~/types/library'
import type { TypeFilter } from '~/composables/useLibrary'

const { entries, filter, areaGlyph, areaLabel } = useLibrary()
const { t } = useI18n()
const reader = useReader()

const area = ref('Toda la biblioteca')
const type = ref<TypeFilter>('Todos')
const query = ref('')

const results = computed(() => filter({ area: area.value, type: type.value, query: query.value }))

const heading = computed(() => {
  const needle = query.value.trim()
  if (needle) return t('home.resultsFor', { query: needle })
  if (area.value === 'Toda la biblioteca') return t('home.pickDoor')
  return t('home.explore', { area: areaLabel(area.value) })
})

function clearFilters() {
  area.value = 'Toda la biblioteca'
  type.value = 'Todos'
  query.value = ''
}

function openEntry(entry: LibraryEntry) {
  reader.show(entry.slug)
}

useHead({ title: t('home.title') })
useSeoMeta({
  description: t('home.description'),
  ogTitle: `Golden Path · ${t('home.title')}`,
  ogDescription: t('home.ogDescription'),
  ogType: 'website',
})
</script>

<template>
  <div>
    <SiteHero :total="entries.length" />

    <main
      id="biblioteca"
      class="grid gap-7 px-4 pb-20 pt-9 md:grid-cols-[190px_minmax(0,1fr)] md:gap-[clamp(24px,4vw,64px)] md:px-[clamp(22px,5vw,74px)] md:pb-[90px] xl:grid-cols-[230px_minmax(0,1fr)]"
    >
      <AreaRail v-model="area" />

      <section class="min-w-0" aria-labelledby="catalog-title">
        <div class="grid items-end gap-6 md:flex md:justify-between">
          <div>
            <p class="m-0 text-[.78rem] font-bold uppercase tracking-[.16em] text-gold">
              {{ area === 'Toda la biblioteca' ? areaLabel(area) : `${areaGlyph(area)} ${areaLabel(area)}` }}
            </p>
            <h2
              id="catalog-title"
              class="mb-0 mt-1.5 font-display text-[clamp(1.9rem,4vw,3.2rem)] font-medium leading-tight"
            >
              {{ heading }}
            </h2>
          </div>
        </div>

        <div class="mt-7">
          <CatalogControls v-model:query="query" v-model:type="type" />
        </div>

        <div class="mt-6 grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3" aria-live="polite">
          <EntryCard
            v-for="(entry, index) in results"
            :key="entry.slug"
            :entry="entry"
            :index="index"
            @open="openEntry"
          />
        </div>

        <div
          v-if="!results.length"
          class="rounded-[22px] border border-dashed border-white/10 px-5 py-14 text-center"
        >
          <span class="text-[2rem] text-gold">◇</span>
          <h3 class="mb-1.5 mt-3 font-display text-[1.5rem] font-medium">
            {{ t('home.emptyTitle') }}
          </h3>
          <p class="text-faint">{{ t('home.emptyText') }}</p>
          <button
            type="button"
            class="mt-5 rounded-xl border border-white/11 bg-white/4 px-3.5 py-2 font-bold text-ink transition hover:brightness-110"
            @click="clearFilters"
          >
            {{ t('home.clear') }}
          </button>
        </div>
      </section>
    </main>
  </div>
</template>
