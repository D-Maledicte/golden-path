<script setup lang="ts">
import type { CommandItem } from '~/components/ui/command-menu/types'

const { open } = useCommandPalette()
const { entries, areaGlyph } = useLibrary()
const reader = useReader()

const items = computed<CommandItem[]>(() => [
  {
    label: 'Ver el índice completo',
    icon: 'lucide:list',
    group: 'Navegación',
    onSelect: () => navigateTo('/entradas'),
  },
  {
    label: 'Abrir el glosario',
    icon: 'lucide:book-a',
    group: 'Navegación',
    onSelect: () => navigateTo('/glosario'),
  },
  ...entries.map(entry => ({
    label: entry.title,
    icon: 'lucide:file-text',
    group: `${areaGlyph(entry.area)} ${entry.area}`,
    onSelect: () => reader.show(entry.slug),
  })),
])
</script>

<template>
  <CommandMenu
    v-model:open="open"
    :items="items"
    brand-name="Golden Path"
    placeholder="Buscar concepto, herramienta o proceso…"
    empty-message="No apareció nada por ese sendero"
  />
</template>
