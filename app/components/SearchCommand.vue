<script setup lang="ts">
import type { CommandItem } from '~/components/ui/command-menu/types'

const { open } = useCommandPalette()
const { entries, areaGlyph, areaLabel } = useLibrary()
const { t, localePath } = useI18n()
const reader = useReader()

const items = computed<CommandItem[]>(() => [
  {
    label: t('palette.index'),
    icon: 'lucide:list',
    group: t('palette.nav'),
    onSelect: () => navigateTo(localePath('/entradas')),
  },
  {
    label: t('palette.glossary'),
    icon: 'lucide:book-a',
    group: t('palette.nav'),
    onSelect: () => navigateTo(localePath('/glosario')),
  },
  ...entries.map(entry => ({
    label: entry.title,
    icon: 'lucide:file-text',
    group: `${areaGlyph(entry.area)} ${areaLabel(entry.area)}`,
    onSelect: () => reader.show(entry.slug),
  })),
])
</script>

<template>
  <CommandMenu
    v-model:open="open"
    :items="items"
    brand-name="Golden Path"
    :placeholder="t('catalog.placeholder')"
    :empty-message="t('home.emptyTitle')"
  />
</template>
