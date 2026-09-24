<script setup lang="ts">
import type { LibraryEntry } from '~/types/library'

const props = defineProps<{
  entry: LibraryEntry
  index: number
}>()

const emit = defineEmits<{ open: [entry: LibraryEntry] }>()

const { typeLabel, areaLabel } = useLibrary()
</script>

<template>
  <SpotlightCard
    :spotlight-color="props.entry.hue"
    :border-radius="22"
    :glow-intensity="0.34"
    :border-width="1"
    class="h-full bg-none bg-[linear-gradient(145deg,rgba(25,22,45,.94),rgba(15,14,29,.88))] ring-white/7.5"
  >
    <button
      type="button"
      class="group flex h-full w-full cursor-pointer flex-col p-5 text-left focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-cyan"
      @click="emit('open', props.entry)"
    >
      <span class="flex items-center justify-between gap-3">
        <span class="font-mono text-[.76rem] font-semibold text-[#5f5a6c]">
          {{ String(props.index + 1).padStart(2, '0') }}
        </span>
        <span class="text-[.71rem] font-bold uppercase tracking-[.08em] text-gold-bright">
          {{ typeLabel(props.entry.type) }}
        </span>
      </span>

      <h3 class="mb-2.5 mt-8 font-display text-[1.35rem] font-medium leading-[1.18] text-ink">
        {{ props.entry.title }}
      </h3>

      <p class="m-0 text-[.9rem] leading-[1.55] text-[#aaa5b7]">
        {{ props.entry.summary }}
      </p>

      <span class="mt-auto flex items-center justify-between gap-3 pt-5 text-[.76rem] text-[#756f83]">
        <span>{{ props.entry.glyph }} {{ areaLabel(props.entry.area) }}</span>
        <span
          class="text-[1.25rem] text-gold transition-transform duration-200 group-hover:translate-x-1"
        >
          →
        </span>
      </span>
    </button>
  </SpotlightCard>
</template>
