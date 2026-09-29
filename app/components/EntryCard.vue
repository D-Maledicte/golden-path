<script setup lang="ts">
import type { LibraryEntry } from '~/types/library'

const props = defineProps<{
  entry: LibraryEntry
  index: number
}>()

const emit = defineEmits<{ open: [entry: LibraryEntry] }>()

const { typeLabel, areaLabel } = useLibrary()
const { t } = useI18n()
const { entryPath, copyEntryLink } = useShare()
const { notesOf } = useProfile()
const notes = useNotesDialog()

const noteCount = computed(() => notesOf(props.entry.slug).length)

/** Clic normal abre el lector; con modificadores (nueva pestaña) sigue el enlace. */
function onOpen(event: MouseEvent) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
  event.preventDefault()
  emit('open', props.entry)
}

const actionClass
  = 'relative z-10 grid size-8 cursor-pointer place-items-center rounded-lg border border-white/8 bg-white/3 text-[#8e899d] transition hover:border-gold/35 hover:text-gold focus-visible:outline-[3px] focus-visible:outline-offset-[2px] focus-visible:outline-cyan'
</script>

<template>
  <SpotlightCard
    :spotlight-color="props.entry.hue"
    :border-radius="22"
    :glow-intensity="0.34"
    :border-width="1"
    class="h-full bg-none bg-[linear-gradient(145deg,rgba(25,22,45,.94),rgba(15,14,29,.88))] ring-white/7.5"
  >
    <div class="group relative flex h-full w-full flex-col p-5 text-left">
      <span class="flex items-center justify-between gap-3">
        <span class="font-mono text-[.76rem] font-semibold text-[#5f5a6c]">
          {{ String(props.index + 1).padStart(2, '0') }}
        </span>
        <span class="text-[.71rem] font-bold uppercase tracking-[.08em] text-gold-bright">
          {{ typeLabel(props.entry.type) }}
        </span>
      </span>

      <h3 class="mb-2.5 mt-8 font-display text-[1.35rem] font-medium leading-[1.18] text-ink">
        <!-- El enlace cubre toda la tarjeta (`after:inset-0`); las acciones de
             abajo quedan por encima con `z-10`. -->
        <a
          :href="entryPath(props.entry.slug)"
          class="after:absolute after:inset-0 after:rounded-[22px] after:content-[''] focus-visible:outline-none focus-visible:after:outline-[3px] focus-visible:after:outline-offset-[3px] focus-visible:after:outline-cyan"
          @click="onOpen"
        >
          {{ props.entry.title }}
        </a>
      </h3>

      <p class="m-0 text-[.9rem] leading-[1.55] text-[#aaa5b7]">
        {{ props.entry.summary }}
      </p>

      <span class="mt-auto flex items-center justify-between gap-3 pt-5 text-[.76rem] text-[#756f83]">
        <span>{{ props.entry.glyph }} {{ areaLabel(props.entry.area) }}</span>
        <span class="flex items-center gap-1.5">
          <button
            type="button"
            :class="actionClass"
            :aria-label="t('share.copy')"
            :title="t('share.copy')"
            @click="copyEntryLink(props.entry.slug)"
          >
            <Icon name="lucide:link" class="size-3.5" />
          </button>
          <button
            type="button"
            :class="[actionClass, noteCount ? '!w-auto gap-1 px-2 text-[#cfbafa] !grid-flow-col' : '']"
            :aria-label="noteCount ? t('notes.count', { count: noteCount }) : t('notes.open')"
            :title="noteCount ? t('notes.count', { count: noteCount }) : t('notes.open')"
            @click="notes.show(props.entry.slug)"
          >
            <Icon name="lucide:notebook-pen" class="size-3.5" />
            <span v-if="noteCount" class="font-mono text-[.7rem]">{{ noteCount }}</span>
          </button>
          <span
            class="ml-1 text-[1.25rem] text-gold transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          >
            →
          </span>
        </span>
      </span>
    </div>
  </SpotlightCard>
</template>
