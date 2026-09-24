<script setup lang="ts">
import { glossaryFor } from '~/data/glossary'

const open = ref(false)
const query = ref('')
const searchInput = ref<HTMLInputElement>()
const reader = useReader()
const { locale, t } = useI18n()
const glossary = glossaryFor(locale.value)

const sorted = computed(() =>
  [...glossary].sort((a, b) => a.term.localeCompare(b.term, locale.value)),
)

const matches = computed(() => {
  const needle = query.value.trim().toLocaleLowerCase(locale.value)
  if (!needle) return sorted.value
  return sorted.value.filter(item =>
    `${item.term} ${item.definition}`.toLocaleLowerCase(locale.value).includes(needle),
  )
})

const countLabel = computed(() => {
  if (!query.value.trim()) return t('glossary.count', { count: glossary.length })
  const total = matches.value.length
  return t(total === 1 ? 'glossary.result' : 'glossary.results', { count: total })
})

function openPanel() {
  open.value = true
  nextTick(() => searchInput.value?.focus())
}

function closePanel() {
  open.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !open.value) return
  closePanel()
}

function readInContext(slug: string) {
  closePanel()
  reader.show(slug)
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Magnet class="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6" :padding="80" :magnet-strength="7">
    <button
      type="button"
      :aria-expanded="open"
      aria-controls="glossary-panel"
      class="flex items-center gap-2.5 rounded-full border border-[rgba(255,232,161,.32)] bg-[rgba(23,20,44,.92)] py-2 pl-2 pr-4 font-bold text-ink shadow-[0_14px_42px_rgba(0,0,0,.48)] backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(255,232,161,.62)] hover:bg-[#211c3c] focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-cyan"
      @click="open ? closePanel() : openPanel()"
    >
      <span
        class="grid size-9 place-items-center rounded-full bg-[linear-gradient(135deg,var(--color-gold-bright),var(--color-gold))] font-display text-[.9rem] text-[#21180b]"
      >
        Aa
      </span>
      <span>{{ t('glossary.title') }}</span>
    </button>
  </Magnet>

  <section
    id="glossary-panel"
    :aria-hidden="!open"
    aria-labelledby="glossary-title"
    class="fixed bottom-20 right-4 z-39 flex max-h-[min(620px,calc(100vh-118px))] w-[min(390px,calc(100vw-32px))] flex-col rounded-[22px] border border-gold/24 bg-[rgba(14,12,28,.97)] p-5 shadow-[0_28px_85px_rgba(0,0,0,.62)] backdrop-blur-xl transition duration-200 sm:right-6 sm:bottom-22"
    :class="
      open
        ? 'visible translate-y-0 scale-100 opacity-100'
        : 'invisible translate-y-3 scale-[.98] opacity-0'
    "
  >
    <header class="flex items-start justify-between gap-4">
      <div>
        <p class="mb-1 text-[.68rem] font-bold uppercase tracking-[.16em] text-gold">
          {{ t('glossary.kicker') }}
        </p>
        <h2 id="glossary-title" class="m-0 font-display text-[2rem] font-medium">{{ t('glossary.title') }}</h2>
      </div>
      <button
        type="button"
        :aria-label="t('glossary.close')"
        class="grid size-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/4 text-[1.45rem] leading-none transition hover:border-gold/35 hover:text-gold"
        @click="closePanel"
      >
        ×
      </button>
    </header>

    <label
      class="mt-4 flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/3.5 px-3 transition focus-within:border-gold/52 focus-within:shadow-[0_0_0_4px_rgba(237,195,94,.08)]"
    >
      <span aria-hidden="true" class="text-[1.2rem] text-gold">⌕</span>
      <span class="sr-only">{{ t('glossary.searchLabel') }}</span>
      <input
        ref="searchInput"
        v-model="query"
        type="search"
        autocomplete="off"
        :placeholder="t('glossary.placeholder')"
        class="w-full min-w-0 bg-transparent py-3 text-ink outline-none placeholder:text-[#716b80]"
      />
    </label>

    <p aria-live="polite" class="mb-2 ml-0.5 mt-3 text-[.74rem] tracking-[.05em] text-[#777184]">
      {{ countLabel }}
    </p>

    <div
      class="min-h-20 overflow-y-auto overscroll-contain pr-1.5 [scrollbar-color:rgba(237,195,94,.3)_transparent]"
    >
      <template v-if="matches.length">
        <article
          v-for="item in matches"
          :key="item.term"
          class="border-t border-white/7 py-4"
        >
          <h3 class="mb-1.5 font-display text-[1.12rem] font-medium text-gold-bright">
            {{ item.term }}
          </h3>
          <p class="m-0 text-[.88rem] leading-[1.55] text-[#aaa5b7]">{{ item.definition }}</p>
          <button
            v-if="item.slug"
            type="button"
            class="mt-2.5 text-[.8rem] text-cyan transition hover:text-[#a6f5f7]"
            @click="readInContext(item.slug)"
          >
            {{ t('glossary.inContext') }}
          </button>
        </article>
      </template>
      <div v-else class="px-3 py-8 text-center text-faint">
        <span class="text-[1.5rem] text-gold">◇</span>
        <p class="mt-2">{{ t('glossary.empty') }}</p>
      </div>
    </div>
  </section>
</template>
