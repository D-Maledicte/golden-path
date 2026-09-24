<script setup lang="ts">
import { motion } from 'motion-v'
import { LOCALES, LOCALE_META } from '~/i18n/messages'

const { locale, t, switchLocalePath } = useI18n()

const activeIndex = computed(() => LOCALES.indexOf(locale.value))
</script>

<template>
  <!-- El wrapper posiciona: `.gs-surface` fija `position: relative` con
       especificidad de scope y gana sobre las utilidades de Tailwind. -->
  <nav :aria-label="t('locale.label')" class="fixed right-4 top-4 z-40 sm:right-6 sm:top-6">
    <GlassSurface
      :width="104"
      :height="42"
      :border-radius="999"
      :border-width="0.08"
      :brightness="42"
      :opacity="0.9"
      :blur="14"
      :displace="0"
      :background-opacity="0.28"
      :saturation="1.1"
      mix-blend-mode="normal"
    >
      <div class="relative grid w-full grid-cols-2 p-1">
        <!-- Pill que se desliza bajo el idioma activo -->
        <motion.span
          aria-hidden="true"
          class="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full border border-gold/40 bg-[linear-gradient(135deg,rgba(255,232,161,.24),rgba(168,106,255,.16))] shadow-[0_0_18px_rgba(237,195,94,.22)]"
          :initial="false"
          :animate="{ x: `${activeIndex * 100}%` }"
          :transition="{ type: 'spring', stiffness: 420, damping: 34 }"
        />
        <NuxtLink
          v-for="code in LOCALES"
          :key="code"
          :to="switchLocalePath(code)"
          :hreflang="LOCALE_META[code].htmlLang"
          :lang="LOCALE_META[code].htmlLang"
          :aria-current="code === locale ? 'true' : undefined"
          :aria-label="t('locale.switchTo', { language: LOCALE_META[code].name })"
          class="relative z-10 rounded-full py-1.5 text-center font-mono text-[.74rem] font-bold tracking-[.12em] transition-colors duration-200 focus-visible:outline-[3px] focus-visible:outline-offset-[2px] focus-visible:outline-cyan"
          :class="code === locale ? 'text-gold-bright' : 'text-faint hover:text-ink'"
        >
          {{ LOCALE_META[code].label }}
        </NuxtLink>
      </div>
    </GlassSurface>
  </nav>
</template>
