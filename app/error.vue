<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const isNotFound = computed(() => props.error.statusCode === 404)

useHead({ title: isNotFound.value ? 'Sendero no encontrado' : 'Algo se rompió' })
</script>

<template>
  <div class="relative isolate flex min-h-screen items-center justify-center overflow-hidden px-4">
    <ClientOnly>
      <DotGrid
        class="absolute inset-0 z-0"
        :dot-size="3"
        :gap="28"
        base-color="#2b2452"
        active-color="#a86aff"
        :proximity="150"
        :shock-radius="220"
        :shock-strength="5"
        :max-speed="2400"
      />
    </ClientOnly>

    <div class="relative z-10 max-w-[46ch] text-center">
      <span class="text-[2.5rem] text-gold">◇</span>
      <p class="mt-4 font-mono text-[.8rem] tracking-[.2em] text-dim">
        {{ props.error.statusCode }}
      </p>
      <h1 class="mt-2 font-display text-[clamp(2rem,5vw,3rem)] font-medium leading-tight">
        {{ isNotFound ? 'Ese sendero no existe' : 'Algo se rompió en el camino' }}
      </h1>
      <p class="mt-4 text-faint">
        {{
          isNotFound
            ? 'La entrada que buscás no está en la biblioteca. Probá desde el catálogo o el índice completo.'
            : 'Ocurrió un error inesperado. Volver al catálogo suele resolverlo.'
        }}
      </p>
      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          class="rounded-xl border border-gold/30 bg-gold/10 px-4 py-2.5 font-bold text-gold-bright transition hover:bg-gold/18"
          @click="clearError({ redirect: '/' })"
        >
          Volver al catálogo
        </button>
        <NuxtLink
          to="/entradas"
          class="rounded-xl border border-white/11 bg-white/4 px-4 py-2.5 font-bold text-ink transition hover:brightness-110"
        >
          Ver el índice completo
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
