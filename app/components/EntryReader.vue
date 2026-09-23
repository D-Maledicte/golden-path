<script setup lang="ts">
const reader = useReader()
const { bySlug } = useLibrary()

const entry = computed(() => (reader.slug.value ? bySlug(reader.slug.value) : undefined))

const dialog = ref<HTMLDialogElement>()
const frame = ref<HTMLElement>()

function sync() {
  const el = dialog.value
  if (!el) return
  if (entry.value && !el.open) {
    el.showModal()
    frame.value?.scrollTo({ top: 0 })
  } else if (!entry.value && el.open) {
    el.close()
  }
}

watch([entry, dialog], sync, { flush: 'post' })
onMounted(sync)

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && entry.value) {
    event.preventDefault()
    reader.close()
  }
}
</script>

<template>
  <dialog
    v-if="entry"
    ref="dialog"
    class="reader-dialog m-auto w-[min(930px,calc(100%-28px))] max-h-[calc(100vh-28px)] overflow-hidden rounded-[25px] border border-gold/22 bg-abyss p-0 text-ink shadow-[0_30px_100px_rgba(0,0,0,.7)]"
    aria-labelledby="reader-title"
    @cancel.prevent="reader.close()"
    @keydown="onKeydown"
    @click.self="reader.close()"
  >
    <div ref="frame" class="max-h-[calc(100vh-28px)] overflow-y-auto">
      <header
        class="sticky top-0 z-4 flex items-start justify-between gap-6 border-b border-white/7 bg-abyss/92 px-5 py-7 backdrop-blur-xl sm:px-[clamp(22px,5vw,54px)] sm:pb-5"
      >
        <div class="min-w-0">
          <p class="mb-1.5 text-[.78rem] font-bold uppercase tracking-[.16em] text-gold">
            {{ entry.area }}
          </p>
          <h2
            id="reader-title"
            class="m-0 font-display text-[clamp(1.65rem,4vw,2.65rem)] font-medium leading-[1.08]"
          >
            {{ entry.title }}
          </h2>
        </div>
        <button
          type="button"
          aria-label="Cerrar lectura"
          class="grid size-[42px] shrink-0 cursor-pointer place-items-center rounded-full border border-white/10 bg-white/4 text-[1.8rem] leading-none transition hover:border-gold/35 hover:text-gold focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-cyan"
          @click="reader.close()"
        >
          ×
        </button>
      </header>

      <div class="px-5 pb-14 pt-8 sm:px-[clamp(22px,5vw,72px)]">
        <EntryArticle :entry="entry" variant="reader" />
      </div>
    </div>
  </dialog>
</template>
