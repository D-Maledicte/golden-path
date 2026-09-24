<script setup lang="ts">
const props = defineProps<{ total: number }>()

const { show: showPalette } = useCommandPalette()
const { t, localePath } = useI18n()

/**
 * Capas del hero, de abajo hacia arriba:
 *   0 · ilustración (AVIF/WebP con fallback a PNG)
 *   1 · velo nocturno — baja la obra de tono para que la atmósfera tenga margen
 *   2 · color grade, en `mix-blend-screen` para unir la obra con la paleta
 *   3 · aurora animada, en `mix-blend-screen` sobre el velo
 *   4 · degradado de legibilidad para el texto
 *   5 · grano
 *   6 · marco interior
 *   7 · borde animado
 *  10 · copia y contador
 */
const banner = {
  avif: '/assets/golden-path-banner.avif 2000w, /assets/golden-path-banner-1400.avif 1400w, /assets/golden-path-banner-900.avif 900w',
  webp: '/assets/golden-path-banner.webp 2000w, /assets/golden-path-banner-1400.webp 1400w, /assets/golden-path-banner-900.webp 900w',
  png: '/assets/golden-path-banner.png',
}
</script>

<template>
  <section
    class="relative isolate mx-2.5 mt-2.5 min-h-[430px] overflow-hidden rounded-[22px] border border-[rgba(255,222,135,.22)] shadow-[0_24px_80px_rgba(0,0,0,.42)] sm:mx-[18px] sm:mt-[18px] sm:min-h-[380px] sm:rounded-[30px]"
  >
    <!-- Capa 0 · ilustración -->
    <picture>
      <source :srcset="banner.avif" sizes="100vw" type="image/avif" />
      <source :srcset="banner.webp" sizes="100vw" type="image/webp" />
      <img
        :src="banner.png"
        :alt="t('site.ogAlt')"
        width="2000"
        height="771"
        fetchpriority="high"
        decoding="async"
        class="absolute inset-0 z-0 size-full object-cover object-[center_58%]"
      />
    </picture>

    <!-- Capa 1 · velo nocturno.
         Sin esto la aurora es invisible: `mix-blend-screen` suma luz, y sobre
         una obra ya brillante (el cielo cósmico de la derecha) no hay margen.
         Con un velo leve la atmósfera recupera espacio sin apagar la obra. -->
    <div class="absolute inset-0 z-[1] bg-[#080714]/20"></div>

    <!-- Capa 2 · color grade: une la obra con la paleta del sitio -->
    <div
      class="absolute inset-0 z-[2] bg-[radial-gradient(120%_150%_at_80%_0%,rgba(168,106,255,.42),transparent_58%),radial-gradient(100%_130%_at_6%_100%,rgba(237,195,94,.30),transparent_60%)] mix-blend-screen"
    ></div>

    <!-- Capa 3 · aurora animada (WebGL, sólo cliente) -->
    <ClientOnly>
      <SoftAurora
        class="absolute inset-0 z-[3] mix-blend-screen"
        :speed="0.55"
        :scale="1.35"
        :brightness="1.05"
        color1="#edc35e"
        color2="#a86aff"
        :noise-frequency="2.2"
        :noise-amplitude="1.1"
        :band-height="0.42"
        :band-spread="1.1"
        :octave-decay="0.12"
        :color-speed="0.8"
        :enable-mouse-interaction="true"
        :mouse-influence="0.18"
      />
    </ClientOnly>

    <!-- Capa 4 · sombra para legibilidad (portada del original) -->
    <div
      class="absolute inset-0 z-[4] bg-[linear-gradient(0deg,rgba(6,5,18,.94),rgba(6,5,18,.34)_92%)] sm:bg-[linear-gradient(90deg,rgba(6,5,18,.95)_0%,rgba(7,6,20,.72)_32%,rgba(7,6,20,.10)_68%),linear-gradient(0deg,rgba(6,5,18,.62),transparent_54%)]"
    ></div>

    <!-- Capa 5 · grano -->
    <NoiseTexture class="pointer-events-none absolute inset-0 z-[5]" :opacity="0.05" />

    <!-- Capa 6 · marco interior -->
    <div
      class="pointer-events-none absolute inset-3 z-[6] rounded-[21px] border border-[rgba(255,225,151,.14)]"
    ></div>

    <!-- Capa 7 · borde animado -->
    <BorderBeam
      class="z-[7]"
      :size="220"
      :duration="16"
      color-from="#ffe8a1"
      color-to="#a86aff"
      :border-width="1"
    />

    <!-- Copia -->
    <div
      class="absolute inset-x-5 bottom-8 z-10 sm:inset-x-auto sm:bottom-[42px] sm:left-[clamp(28px,5vw,78px)] sm:w-[min(620px,68%)]"
    >
      <TextAnimate
        :text="t('hero.kicker')"
        animation="fade-in"
        by="word"
        :duration="0.5"
        :delay="0.06"
        class="font-sans text-[.7rem] font-bold uppercase tracking-[.16em] text-gold sm:text-[.78rem]"
      />

      <h1
        class="mb-1 mt-1.5 font-display text-[3.4rem] font-medium leading-[.86] tracking-[-.05em] sm:text-[clamp(3rem,8vw,6.2rem)]"
      >
        <GradientText
          text="Golden Path"
          :colors="['#ffe8a1', '#edc35e', '#a86aff', '#57d9e8']"
          :animation-speed="10"
          direction="diagonal"
        />
      </h1>

      <BlurText
        :text="t('hero.lead')"
        :delay="24"
        :duration="0.5"
        class="max-w-[54ch] gap-x-[.3em] font-sans text-[.94rem] leading-[1.55] text-ink/82 sm:text-[1.04rem]"
      />

      <div class="mt-6 flex flex-wrap items-center gap-3">
        <ShimmerButton
          background="#edc35e"
          shimmer-color="#fffdf5"
          border-radius="999px"
          shimmer-duration="2.6s"
          class="!h-11 !px-6 !text-[.85rem] !font-bold"
          @click="showPalette()"
        >
          <span class="text-[#21180b]">{{ t('hero.search') }}</span>
          <kbd
            class="rounded-md border border-black/15 bg-black/8 px-1.5 py-0.5 font-mono text-[.68rem] text-black/70"
          >
            ⌘K
          </kbd>
        </ShimmerButton>

        <InteractiveHoverButton
          class="!rounded-full !border-gold/25 !bg-white/4 !px-5 !py-2.5 !text-[.85rem] !font-semibold"
          @click="navigateTo(localePath('/entradas'))"
        >
          <span class="text-ink">{{ t('hero.index') }}</span>
          <template #hover>
            <span class="text-[#21180b]">{{ t('hero.indexHover', { total: props.total }) }}</span>
          </template>
        </InteractiveHoverButton>
      </div>
    </div>

    <!-- Contador de entradas -->
    <!-- El wrapper posiciona: `.gs-surface` fija `position: relative` con
         especificidad de scope y gana sobre las utilidades de Tailwind. -->
    <div class="absolute bottom-[30px] right-[34px] z-10 hidden sm:block">
      <GlassSurface
        :width="118"
        :height="92"
        :border-radius="18"
        :border-width="0.08"
        :brightness="42"
        :opacity="0.9"
        :blur="14"
        :displace="0"
        :background-opacity="0.22"
        :saturation="1.1"
        mix-blend-mode="normal"
      >
        <div class="text-center">
          <CountUp
            :to="props.total"
            :duration="1.4"
            class="block font-display text-[1.7rem] leading-none text-gold-bright"
          />
          <span class="mt-1 block text-[.7rem] uppercase tracking-[.12em] text-faint">{{ t('hero.entries') }}</span>
        </div>
      </GlassSurface>
    </div>
  </section>
</template>
