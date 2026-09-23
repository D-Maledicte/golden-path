<script setup lang="ts">
const { entries } = useLibrary()

useHead({
  titleTemplate: title => (title ? `${title} · Golden Path` : 'Golden Path'),
  meta: [
    {
      name: 'description',
      content:
        'Golden Path: conceptos, patrones y aprendizajes transferibles para diseñar entornos donde los agentes hacen buen trabajo sin llevarse producción puesta.',
    },
  ],
  link: [{ rel: 'alternate', type: 'application/json', href: '/content.json', title: 'Biblioteca completa en JSON' }],
})
</script>

<template>
  <div class="min-h-screen">
    <a
      href="#biblioteca"
      class="fixed left-4 top-4 z-100 -translate-y-[180%] rounded-full bg-gold px-4 py-2.5 font-semibold text-[#171018] transition-transform focus:translate-y-0"
    >
      Ir a la biblioteca
    </a>

    <div class="mx-auto w-[min(1500px,100%)]">
      <NuxtPage />
      <SiteFooter :total="entries.length" />
    </div>

    <GlossaryPanel />
    <EntryReader />
    <SearchCommand />
    <ToastHost />
  </div>
</template>
