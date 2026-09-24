<script setup lang="ts">
import { glossaryFor } from '~/data/glossary'

const reader = useReader()
const { locale, t, localePath } = useI18n()
const glossary = glossaryFor(locale.value)

const sorted = computed(() =>
  [...glossary].sort((a, b) => a.term.localeCompare(b.term, locale.value)),
)

const terms = computed(() => sorted.value.map(item => item.term))
const selected = ref(0)

function goTo(index: number) {
  selected.value = index
  const term = sorted.value[index]
  if (!term) return
  document.getElementById(`term-${slugify(term.term)}`)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

useHead({ title: t('glossary.title') })
useSeoMeta({
  description: t('glossary.description', { count: glossary.length }),
  ogTitle: `${t('glossary.title')} · Golden Path`,
  ogType: 'website',
})
</script>

<template>
  <main id="biblioteca" class="px-4 pb-20 pt-6 md:px-[clamp(22px,5vw,74px)] md:pb-24">
    <header class="mb-12 max-w-[52ch]">
      <p class="mb-2 text-[.78rem] font-bold uppercase tracking-[.16em] text-gold">
        {{ t('glossary.kicker') }}
      </p>
      <h1 class="m-0 font-display text-[clamp(2.2rem,5vw,3.4rem)] font-medium leading-[1.05]">
        {{ t('glossary.title') }}
      </h1>
      <p class="mt-4 text-faint">
        {{ t('glossary.lead', { count: glossary.length }) }}
      </p>
      <NuxtLink
        :to="localePath('/')"
        class="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/11 bg-white/4 px-4 py-2.5 font-bold text-ink transition hover:brightness-110"
      >
        {{ t('index.back') }}
      </NuxtLink>
    </header>

    <ScrollReveal
      :text="t('glossary.reveal')"
      :base-opacity="0.16"
      :blur-strength="3"
      :base-rotation="2"
      class="mb-12 max-w-[24ch] font-display text-ink"
    />

    <div class="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
      <aside class="hidden lg:block">
        <div class="sticky top-6">
          <AnimatedList
            :items="terms"
            :initial-selected-index="0"
            :display-scrollbar="false"
            class="!w-full"
            @select="(_item: string, index: number) => goTo(index)"
          />
        </div>
      </aside>

      <section class="min-w-0">
        <dl class="grid gap-3.5 sm:grid-cols-2">
          <div
            v-for="item in sorted"
            :id="`term-${slugify(item.term)}`"
            :key="item.term"
            class="scroll-mt-6 rounded-2xl border border-white/7.5 bg-white/2 p-5"
          >
            <dt class="font-display text-[1.15rem] font-medium text-gold-bright">
              {{ item.term }}
            </dt>
            <dd class="m-0 mt-2 text-[.9rem] leading-[1.6] text-[#aaa5b7]">
              {{ item.definition }}
            </dd>
            <dd v-if="item.slug" class="m-0 mt-3">
              <button
                type="button"
                class="text-[.82rem] font-semibold text-cyan transition hover:text-[#a6f5f7]"
                @click="reader.show(item.slug!)"
              >
                {{ t('glossary.inContext') }}
              </button>
            </dd>
          </div>
        </dl>
      </section>
    </div>
  </main>
</template>
