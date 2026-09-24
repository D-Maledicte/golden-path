<script setup lang="ts">
import type { LibraryEntry } from '~/types/library'

const props = withDefaults(
  defineProps<{
    entry: LibraryEntry
    /** `page` muestra el índice lateral; `reader` es el overlay estrecho. */
    variant?: 'page' | 'reader'
  }>(),
  { variant: 'page' },
)

const { relatedOf, typeLabel } = useLibrary()
const { show: toast } = useToast()
const reader = useReader()
const { t, localePath } = useI18n()

const related = computed(() => relatedOf(props.entry))
const tocActive = ref(0)

const tocItems = computed(() =>
  props.entry.headings.map(heading => ({
    label: heading.label,
    depth: heading.depth - 2,
  })),
)

function scrollToHeading(index: number) {
  const heading = props.entry.headings[index]
  if (!heading) return
  document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

async function copyMarkdown() {
  try {
    await navigator.clipboard.writeText(props.entry.raw)
    toast(t('entry.copied'))
  } catch {
    const area = document.createElement('textarea')
    area.value = props.entry.raw
    document.body.appendChild(area)
    area.select()
    document.execCommand('copy')
    area.remove()
    toast(t('entry.copied'))
  }
}

function downloadMarkdown() {
  const blob = new Blob([props.entry.raw], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${props.entry.slug}.md`
  link.click()
  URL.revokeObjectURL(url)
  toast(t('entry.downloaded'))
}
</script>

<template>
  <div
    class="grid gap-10"
    :class="props.variant === 'page' ? 'lg:grid-cols-[minmax(0,1fr)_260px]' : ''"
  >
    <div class="min-w-0">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <StarBorder color="#edc35e" speed="7s" :thickness="1">
          <span
            class="block rounded-full px-3.5 py-1.5 text-[.71rem] font-bold uppercase tracking-[.08em] text-gold-bright"
          >
            {{ typeLabel(props.entry.type) }}
          </span>
        </StarBorder>

        <div class="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            class="rounded-xl border border-white/11 bg-white/4 px-3.5 py-2 text-[.84rem] font-bold text-ink transition hover:brightness-110 focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-cyan"
            @click="copyMarkdown"
          >
            {{ t('entry.copy') }}
          </button>

          <ShimmerButton
            background="#edc35e"
            shimmer-color="#fffdf5"
            border-radius="12px"
            shimmer-duration="3.2s"
            class="!h-10 !px-4 !text-[.84rem] !font-bold"
            @click="downloadMarkdown"
          >
            <span class="text-[#21180b]">{{ t('entry.download') }}</span>
          </ShimmerButton>

          <NuxtLink
            v-if="props.variant === 'reader'"
            :to="localePath(`/entrada/${props.entry.slug}`)"
            class="rounded-xl border border-cyan/25 bg-cyan/6 px-3.5 py-2 text-[.84rem] font-bold text-cyan transition hover:bg-cyan/12"
            @click="reader.close()"
          >
            {{ t('entry.openPage') }}
          </NuxtLink>
        </div>
      </div>

      <!-- El HTML viene de Markdown propio compilado en build (markdown-it con
           `html: false`), no de entrada de usuario. -->
      <article class="prose-golden mt-9" v-html="props.entry.html" />

      <footer v-if="related.length" class="mt-14 border-t border-white/7 pt-6">
        <p class="mb-3 text-[.75rem] font-bold uppercase tracking-[.14em] text-[#777184]">
          {{ t('entry.continue') }}
        </p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="item in related"
            :key="item.slug"
            type="button"
            class="rounded-[10px] border border-violet/23 bg-violet/6 px-3 py-2 text-[.86rem] text-[#cfbafa] transition hover:bg-violet/14 focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-cyan"
            @click="reader.show(item.slug)"
          >
            {{ item.title }}
          </button>
        </div>
      </footer>
    </div>

    <aside v-if="props.variant === 'page' && tocItems.length" class="hidden lg:block">
      <div class="sticky top-6">
        <AnimatedToc
          v-model="tocActive"
          :items="tocItems"
          :row-height="52"
          :indent="16"
          :title="t('entry.toc')"
          class="toc-compact"
          @select="scrollToHeading"
        />
      </div>
    </aside>
  </div>
</template>
