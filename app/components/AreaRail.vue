<script setup lang="ts">
const area = defineModel<string>({ required: true })

const { areas, countByArea, areaGlyph } = useLibrary()
</script>

<template>
  <aside aria-label="Explorar la biblioteca" class="min-w-0">
    <div class="md:sticky md:top-6">
      <p class="mb-3.5 hidden text-[.78rem] font-bold uppercase tracking-[.16em] text-dim md:block">
        Recorridos
      </p>

      <nav
        class="-mx-4 mb-7 flex gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:mb-0 md:grid md:gap-1.5 md:overflow-visible md:px-0 md:pb-0"
      >
        <button
          v-for="item in areas"
          :key="item"
          type="button"
          :aria-current="area === item ? 'true' : undefined"
          class="flex w-auto shrink-0 items-center gap-2.5 rounded-xl border border-white/7 px-3 py-2.5 text-left text-[.9rem] text-faint transition duration-200 hover:bg-white/3.5 hover:text-ink md:w-full md:border-transparent md:px-3"
          :class="
            area === item
              ? 'border-gold/18! bg-[linear-gradient(90deg,rgba(237,195,94,.11),rgba(168,106,255,.05))] text-ink!'
              : ''
          "
          @click="area = item"
        >
          <span class="w-[22px] shrink-0 text-center text-gold">{{ areaGlyph(item) }}</span>
          <span class="whitespace-nowrap md:whitespace-normal">{{ item }}</span>
          <span class="ml-auto hidden font-mono text-[.7rem] text-dim md:inline">
            {{ countByArea(item) }}
          </span>
        </button>
      </nav>

      <div
        class="mt-8 hidden rounded-2xl border border-cyan/14 bg-cyan/3.5 p-4 md:block"
      >
        <span class="text-cyan">✦</span>
        <p class="mt-1.5 text-[.82rem] leading-[1.55] text-[#8e899d]">
          Cada entrada se puede copiar o descargar en Markdown para pasarle contexto limpio a otro
          agente.
        </p>
        <NuxtLink
          to="/glosario"
          class="mt-3 inline-flex items-center gap-1.5 text-[.8rem] font-semibold text-cyan hover:text-[#a6f5f7]"
        >
          Abrir el glosario
          <Icon name="lucide:arrow-right" class="size-3.5" />
        </NuxtLink>
      </div>
    </div>
  </aside>
</template>
