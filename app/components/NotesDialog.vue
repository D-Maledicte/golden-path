<script setup lang="ts">
import type MarkdownIt from 'markdown-it'
import type { ProfileNote } from '~/composables/useProfile'
import { downloadText } from '~/lib/utils'

const dialogState = useNotesDialog()
const { bySlug } = useLibrary()
const { notesOf, saveNote, deleteNote, exportJson, importJson, backupJson } = useProfile()
const { t } = useI18n()
const { show: toast } = useToast()

const entry = computed(() => (dialogState.slug.value ? bySlug(dialogState.slug.value) : undefined))
const notes = computed(() => (entry.value ? notesOf(entry.value.slug) : []))

const selectedId = ref<string | null>(null)
const selected = computed(() => notes.value.find(note => note.id === selectedId.value) ?? notes.value[0])

/** Borrador del editor: `id` presente = editando una nota existente. */
const draft = ref<{ id?: string, name: string, body: string } | null>(null)

/* markdown-it se carga recién al abrir el modal; `html: false` porque el
   Markdown es del usuario. */
const md = shallowRef<MarkdownIt>()
async function ensureMarkdown() {
  if (md.value) return
  const { default: MarkdownItCtor } = await import('markdown-it')
  md.value = new MarkdownItCtor({ html: false, linkify: true, typographer: true })
}
const selectedHtml = computed(() => (selected.value && md.value ? md.value.render(selected.value.body) : ''))

const dialog = ref<HTMLDialogElement>()

function sync() {
  const el = dialog.value
  if (!el) return
  if (entry.value && !el.open) {
    selectedId.value = null
    draft.value = null
    ensureMarkdown()
    el.showModal()
  } else if (!entry.value && el.open) {
    el.close()
  }
}

watch([entry, dialog], sync, { flush: 'post' })
onMounted(sync)

function startNew() {
  draft.value = { name: '', body: '' }
}

function startEdit(note: ProfileNote) {
  draft.value = { id: note.id, name: note.name, body: note.body }
}

function commitDraft() {
  if (!entry.value || !draft.value || !draft.value.body.trim()) return
  const saved = saveNote(entry.value.slug, draft.value)
  if (saved) {
    selectedId.value = saved.id
    draft.value = null
    toast(t('notes.saved'))
  }
}

function remove(note: ProfileNote) {
  if (!entry.value || !confirm(t('notes.confirmDelete', { name: note.name }))) return
  deleteNote(entry.value.slug, note.id)
  selectedId.value = null
  toast(t('notes.deleted'))
}

async function onUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (!entry.value || !input.files) return
  let last: ProfileNote | null = null
  for (const file of Array.from(input.files)) {
    last = saveNote(entry.value.slug, { name: file.name, body: await file.text() }) ?? last
  }
  input.value = ''
  if (last) {
    selectedId.value = last.id
    draft.value = null
    toast(t('notes.saved'))
  }
}

function exportProfile() {
  const date = new Date().toISOString().slice(0, 10)
  downloadText(exportJson(), `golden-path-perfil-${date}.json`, 'application/json;charset=utf-8')
  toast(t('notes.exported'))
}

/* Se lee al abrir el modal: localStorage no existe en el prerender. */
const hasBackup = ref(false)
watch(entry, () => {
  hasBackup.value = import.meta.client && Boolean(backupJson())
})

function downloadBackup() {
  const backup = backupJson()
  if (backup) downloadText(backup, 'golden-path-perfil-respaldo.json', 'application/json;charset=utf-8')
}

async function onImport(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  const count = importJson(await file.text())
  toast(count === null ? t('notes.importError') : t('notes.imported', { count }), 3000)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && entry.value) {
    event.preventDefault()
    if (draft.value) draft.value = null
    else dialogState.close()
  }
}

const buttonClass
  = 'rounded-xl border border-white/11 bg-white/4 px-3.5 py-2 text-[.84rem] font-bold text-ink transition hover:brightness-110 focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-cyan'
</script>

<template>
  <dialog
    v-if="entry"
    ref="dialog"
    class="reader-dialog m-auto w-[min(1280px,calc(100%-28px))] max-h-[calc(100vh-28px)] overflow-hidden rounded-[25px] border border-violet/25 bg-abyss p-0 text-ink shadow-[0_30px_100px_rgba(0,0,0,.7)]"
    aria-labelledby="notes-title"
    @cancel.prevent
    @keydown="onKeydown"
    @click.self="dialogState.close()"
  >
    <div class="flex max-h-[calc(100vh-28px)] flex-col">
      <header class="flex items-start justify-between gap-6 border-b border-white/7 px-5 py-6 sm:px-[clamp(22px,4vw,44px)]">
        <div class="min-w-0">
          <p class="mb-1.5 truncate text-[.78rem] font-bold uppercase tracking-[.16em] text-[#cfbafa]">
            {{ t('notes.kicker', { title: entry.title }) }}
          </p>
          <h2 id="notes-title" class="m-0 font-display text-[clamp(1.5rem,3.4vw,2.2rem)] font-medium leading-[1.1]">
            {{ t('notes.title') }}
          </h2>
          <p class="mb-0 mt-2 text-[.88rem] text-faint">{{ t('notes.lead') }}</p>
        </div>
        <button
          type="button"
          :aria-label="t('notes.close')"
          class="grid size-[42px] shrink-0 cursor-pointer place-items-center rounded-full border border-white/10 bg-white/4 text-[1.8rem] leading-none transition hover:border-gold/35 hover:text-gold focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-cyan"
          @click="dialogState.close()"
        >
          ×
        </button>
      </header>

      <div class="grid min-h-0 flex-1 lg:grid-cols-2">
        <!-- La entrada de la guía -->
        <section class="hidden min-h-0 overflow-y-auto border-r border-white/7 px-5 py-6 sm:px-8 lg:block">
          <p class="mb-4 text-[.72rem] font-bold uppercase tracking-[.14em] text-gold">{{ t('notes.guide') }}</p>
          <article class="prose-golden" v-html="entry.html" />
        </section>

        <!-- Las notas propias -->
        <section class="flex min-h-0 flex-col overflow-y-auto px-5 py-6 sm:px-8">
          <div class="flex flex-wrap items-center gap-2">
            <p class="m-0 mr-auto text-[.72rem] font-bold uppercase tracking-[.14em] text-[#cfbafa]">{{ t('notes.yours') }}</p>
            <label :class="[buttonClass, 'cursor-pointer']">
              {{ t('notes.upload') }}
              <input type="file" accept=".md,.markdown,.txt,text/markdown,text/plain" multiple class="sr-only" @change="onUpload">
            </label>
            <button type="button" :class="buttonClass" @click="startNew">{{ t('notes.new') }}</button>
          </div>

          <div v-if="notes.length && !draft" class="mt-4 flex flex-wrap gap-2">
            <button
              v-for="note in notes"
              :key="note.id"
              type="button"
              class="max-w-full truncate rounded-[10px] border px-3 py-1.5 text-[.82rem] transition focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-cyan"
              :class="note.id === selected?.id ? 'border-violet/50 bg-violet/16 text-ink' : 'border-white/9 bg-white/3 text-[#aaa5b7] hover:bg-white/6'"
              @click="selectedId = note.id"
            >
              {{ note.name }}
            </button>
          </div>

          <form v-if="draft" class="mt-4 flex flex-1 flex-col gap-3" @submit.prevent="commitDraft">
            <input
              v-model="draft.name"
              type="text"
              :placeholder="t('notes.namePlaceholder')"
              class="rounded-xl border border-white/11 bg-white/4 px-3.5 py-2 text-[.9rem] text-ink outline-none focus:border-violet/50"
            >
            <textarea
              v-model="draft.body"
              :placeholder="t('notes.bodyPlaceholder')"
              class="min-h-[320px] flex-1 resize-y rounded-xl border border-white/11 bg-white/4 p-3.5 font-mono text-[.84rem] leading-relaxed text-ink outline-none focus:border-violet/50"
            />
            <div class="flex gap-2">
              <button type="submit" :class="[buttonClass, 'border-violet/40 bg-violet/14']" :disabled="!draft.body.trim()">
                {{ t('notes.save') }}
              </button>
              <button type="button" :class="buttonClass" @click="draft = null">{{ t('notes.cancel') }}</button>
            </div>
          </form>

          <template v-else-if="selected">
            <div class="mt-5 flex items-center gap-2 border-b border-white/7 pb-3">
              <span class="mr-auto truncate font-mono text-[.78rem] text-dim">
                {{ selected.name }} · {{ new Date(selected.updatedAt).toLocaleDateString() }}
              </span>
              <button type="button" class="text-[.8rem] text-cyan underline-offset-4 hover:underline" @click="startEdit(selected)">
                {{ t('notes.edit') }}
              </button>
              <button type="button" class="text-[.8rem] text-[#e88] underline-offset-4 hover:underline" @click="remove(selected)">
                {{ t('notes.delete') }}
              </button>
            </div>
            <!-- Markdown del usuario renderizado con `html: false`. -->
            <article class="prose-golden mt-5" v-html="selectedHtml" />
          </template>

          <p v-else class="mt-10 rounded-[18px] border border-dashed border-white/10 px-5 py-10 text-center text-faint">
            {{ t('notes.empty') }}
          </p>
        </section>
      </div>

      <footer class="flex flex-wrap items-center justify-end gap-2 border-t border-white/7 px-5 py-4 sm:px-[clamp(22px,4vw,44px)]">
        <AccountMenu class="mr-auto" align="left" />
        <button v-if="hasBackup" type="button" class="text-[.8rem] text-dim underline-offset-4 hover:text-ink hover:underline" :title="t('cloud.backupHint')" @click="downloadBackup">
          {{ t('cloud.backup') }}
        </button>
        <label :class="[buttonClass, 'cursor-pointer']">
          {{ t('notes.import') }}
          <input type="file" accept=".json,application/json" class="sr-only" @change="onImport">
        </label>
        <button type="button" :class="[buttonClass, 'border-gold/25 bg-gold/8 text-gold-bright']" @click="exportProfile">
          {{ t('notes.export') }}
        </button>
      </footer>
    </div>
  </dialog>
</template>
