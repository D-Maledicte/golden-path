<script setup lang="ts">
import type { TypeFilter } from '~/composables/useLibrary'

const query = defineModel<string>('query', { required: true })
const type = defineModel<TypeFilter>('type', { required: true })

const { types, typeLabel } = useLibrary()
const { show: showPalette } = useCommandPalette()

const input = ref<HTMLInputElement>()

/** Atajo `/` para enfocar la búsqueda, como en el sitio original. */
function onKeydown(event: KeyboardEvent) {
  if (event.key !== '/' || event.metaKey || event.ctrlKey) return
  const active = document.activeElement
  if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) return
  if (document.querySelector('dialog[open]')) return
  event.preventDefault()
  input.value?.focus()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
    <label
      class="flex w-full items-center rounded-2xl border border-white/9 bg-white/3.5 px-3.5 py-1 transition duration-200 focus-within:border-gold/52 focus-within:shadow-[0_0_0_4px_rgba(237,195,94,.08)] sm:w-[min(390px,100%)]"
    >
      <span aria-hidden="true" class="mr-2 text-[1.25rem] text-gold">⌕</span>
      <span class="sr-only">Buscar conceptos</span>
      <input
        ref="input"
        v-model="query"
        type="search"
        autocomplete="off"
        placeholder="Buscar concepto, herramienta o proceso…"
        class="min-w-0 flex-1 bg-transparent py-2.5 text-ink outline-none placeholder:text-[#706b7e]"
      />
      <kbd
        class="rounded-[7px] border border-white/10 bg-black/20 px-1.5 py-0.5 font-mono text-[.7rem] text-[#777182]"
      >
        /
      </kbd>
    </label>

    <button
      type="button"
      class="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/9 bg-white/3.5 px-4 py-2.5 text-[.84rem] text-faint transition duration-200 hover:border-gold/30 hover:text-ink focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-cyan"
      @click="showPalette()"
    >
      <Icon name="lucide:command" class="size-4 text-gold" />
      Paleta de comandos
      <kbd
        class="rounded-[6px] border border-white/10 bg-black/20 px-1.5 py-0.5 font-mono text-[.68rem] text-[#777182]"
      >
        ⌘K
      </kbd>
    </button>
  </div>

  <div class="mt-6 flex flex-wrap gap-2" aria-label="Filtrar por tipo">
    <button
      type="button"
      :aria-pressed="type === 'Todos'"
      class="rounded-full border border-white/8 px-3 py-1.5 text-[.84rem] text-[#918b9f] transition duration-200 hover:border-gold/35 hover:bg-gold/8 hover:text-ink"
      :class="type === 'Todos' ? 'border-gold/35! bg-gold/8! text-ink!' : ''"
      @click="type = 'Todos'"
    >
      Todos
    </button>
    <button
      v-for="item in types"
      :key="item"
      type="button"
      :aria-pressed="type === item"
      class="rounded-full border border-white/8 px-3 py-1.5 text-[.84rem] text-[#918b9f] transition duration-200 hover:border-gold/35 hover:bg-gold/8 hover:text-ink"
      :class="type === item ? 'border-gold/35! bg-gold/8! text-ink!' : ''"
      @click="type = item"
    >
      {{ typeLabel(item) }}
    </button>
  </div>
</template>
