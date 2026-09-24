<script setup lang="ts">
defineProps<{ total: number }>()

const year = new Date().getFullYear()

const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mjmartel/', icon: 'lucide:linkedin' },
  { label: 'GitHub', href: 'https://github.com/D-Maledicte', icon: 'lucide:github' },
]
</script>

<template>
  <footer
    class="mx-4 flex flex-col items-start justify-between gap-6 border-t border-gold/15 px-0 py-6 font-display text-[.86rem] text-dim sm:mx-[clamp(22px,5vw,74px)] sm:flex-row sm:items-center sm:pb-[30px]"
  >
    <div class="space-y-1.5">
      <p>
        © {{ year }} · All rights reserved · Autor
        <span class="text-faint">D_Maledicte</span>
      </p>
      <p class="text-[.78rem] text-dim/80">
        {{ total }} entradas ·
        <NuxtLink to="/entradas" class="text-cyan underline-offset-4 hover:underline">índice completo</NuxtLink>
        ·
        <NuxtLink to="/glosario" class="text-cyan underline-offset-4 hover:underline">glosario</NuxtLink>
        ·
        <a href="/content.json" class="text-cyan underline-offset-4 hover:underline">JSON</a>
        ·
        <NuxtLink to="/conectar" class="text-cyan underline-offset-4 hover:underline">MCP para agentes</NuxtLink>
      </p>
    </div>

    <nav class="flex items-center gap-2" aria-label="Redes sociales de D_Maledicte">
      <a
        v-for="social in socials"
        :key="social.label"
        :href="social.href"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="social.label"
        :title="social.label"
        class="grid size-[42px] place-items-center rounded-full border border-white/8 bg-white/2.5 text-[#918b9f] transition duration-200 hover:-translate-y-0.5 hover:border-gold/32 hover:bg-gold/6 hover:text-gold-bright focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-cyan"
      >
        <Icon :name="social.icon" class="size-[25px]" />
      </a>
    </nav>
  </footer>
</template>
