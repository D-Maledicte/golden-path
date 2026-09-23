<script setup lang="ts">
const { message } = useToast()
</script>

<template>
  <div
    role="status"
    aria-live="polite"
    class="pointer-events-none fixed bottom-[92px] right-[22px] z-100 max-w-[min(360px,calc(100vw-44px))] rounded-xl border border-gold/25 bg-[#17132a] px-4 py-3 text-ink shadow-[0_24px_80px_rgba(0,0,0,.42)] transition duration-200"
    :class="message ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-3.5 scale-[.98] opacity-0'"
  >
    <span v-if="message">{{ message }}</span>
  </div>
</template>
