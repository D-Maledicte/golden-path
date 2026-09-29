<script setup lang="ts">
import type MarkdownIt from 'markdown-it'
import type { ProfileNote } from '~/composables/useProfile'
import { downloadText } from '~/lib/utils'

const dialogState = useNotesDialog()
const { bySlug } = useLibrary()
const { notesOf, saveNote, deleteNote, exportJson, importJson, backupJson } = useProfile()
const auth = useAuth()
const sharing = useSharing()
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

/* Pestañas de la columna derecha: mis notas, las que me comparten y a quién comparto. */
type Tab = 'mine' | 'shared' | 'share'
const tab = ref<Tab>('mine')

const sharedNotes = computed(() => (entry.value ? sharing.sharedOf(entry.value.slug) : []))
const sharedSelectedId = ref<string | null>(null)
const sharedSelected = computed(
  () => sharedNotes.value.find(note => note.id === sharedSelectedId.value) ?? sharedNotes.value[0],
)
const sharedHtml = computed(() => (sharedSelected.value && md.value ? md.value.render(sharedSelected.value.body) : ''))

/* Invitar a leer. */
const inviteEmail = ref('')
const inviteScope = ref<'entry' | 'all'>('entry')
const inviting = ref(false)
const entryGrants = computed(() => (entry.value ? sharing.grantsFor(entry.value.slug) : []))

async function invite() {
  if (!entry.value || !inviteEmail.value.trim() || inviting.value) return
  inviting.value = true
  const error = await sharing.share(inviteEmail.value, inviteScope.value === 'all' ? null : entry.value.slug)
  inviting.value = false
  if (error) {
    toast(t(`share.error.${error}`), 4000)
    return
  }
  toast(t('share.invited', { email: inviteEmail.value.trim().toLowerCase() }), 3500)
  inviteEmail.value = ''
}

async function revokeGrant(id: string, email: string) {
  if (!confirm(t('share.confirmRevoke', { email }))) return
  toast((await sharing.revoke(id)) ? t('share.revoked') : t('share.error.error'), 3000)
}

// Al abrir el modal (o al iniciar sesión con él abierto) se refresca lo compartido.
watch([entry, () => auth.user.value?.id], ([current, userId]) => {
  if (current && userId) sharing.refresh()
})

const dialog = ref<HTMLDialogElement>()

function sync() {
  const el = dialog.value
  if (!el) return
  if (entry.value && !el.open) {
    selectedId.value = null
    sharedSelectedId.value = null
    draft.value = null
    tab.value = 'mine'
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
          <div class="mb-5 flex gap-1 rounded-xl border border-white/8 bg-white/2 p-1" role="tablist">
            <button
              v-for="item in ([
                { id: 'mine', label: t('notes.yours') },
                { id: 'shared', label: sharedNotes.length ? `${t('share.withMe')} · ${sharedNotes.length}` : t('share.withMe') },
                { id: 'share', label: t('share.tab') },
              ] as const)"
              :key="item.id"
              type="button"
              role="tab"
              :aria-selected="tab === item.id"
              class="flex-1 cursor-pointer truncate rounded-lg px-2.5 py-2 text-[.78rem] font-bold transition focus-visible:outline-[3px] focus-visible:outline-offset-[2px] focus-visible:outline-cyan"
              :class="tab === item.id ? 'bg-violet/18 text-ink' : 'text-[#8e899d] hover:text-ink'"
              @click="tab = item.id"
            >
              {{ item.label }}
            </button>
          </div>

          <template v-if="tab === 'mine'">
          <div class="flex flex-wrap items-center gap-2">
            <span class="mr-auto" />
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
          </template>

          <!-- Compartidas conmigo: sólo lectura -->
          <template v-else-if="tab === 'shared'">
            <p v-if="!auth.user.value" class="mt-6 rounded-[18px] border border-dashed border-white/10 px-5 py-10 text-center text-faint">
              {{ t('share.needLoginShared') }}
            </p>
            <p v-else-if="!sharedNotes.length" class="mt-6 rounded-[18px] border border-dashed border-white/10 px-5 py-10 text-center text-faint">
              {{ sharing.loading.value ? t('cloud.syncing') : t('share.emptyShared') }}
            </p>
            <template v-else>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="note in sharedNotes"
                  :key="note.id"
                  type="button"
                  class="max-w-full truncate rounded-[10px] border px-3 py-1.5 text-[.82rem] transition focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-cyan"
                  :class="note.id === sharedSelected?.id ? 'border-cyan/45 bg-cyan/12 text-ink' : 'border-white/9 bg-white/3 text-[#aaa5b7] hover:bg-white/6'"
                  @click="sharedSelectedId = note.id"
                >
                  {{ note.name }}
                </button>
              </div>
              <div v-if="sharedSelected" class="mt-5 flex items-center gap-2 border-b border-white/7 pb-3 text-[.78rem]">
                <Icon name="lucide:eye" class="size-3.5 shrink-0 text-cyan" />
                <span class="truncate text-dim">
                  {{ t('share.readOnlyFrom', { email: sharedSelected.ownerEmail }) }} · {{ new Date(sharedSelected.updatedAt).toLocaleDateString() }}
                </span>
              </div>
              <!-- Markdown ajeno renderizado con `html: false`. -->
              <article class="prose-golden mt-5" v-html="sharedHtml" />
            </template>
          </template>

          <!-- Compartir mis notas -->
          <template v-else>
            <p v-if="!auth.user.value" class="mt-6 rounded-[18px] border border-dashed border-white/10 px-5 py-10 text-center text-faint">
              {{ t('share.needLogin') }}
            </p>
            <template v-else>
              <p class="m-0 text-[.86rem] leading-relaxed text-faint">{{ t('share.lead') }}</p>
              <form class="mt-4 grid gap-3" @submit.prevent="invite">
                <input
                  v-model="inviteEmail"
                  type="email"
                  required
                  :placeholder="t('cloud.emailPlaceholder')"
                  class="h-10 rounded-xl border border-white/11 bg-white/4 px-3 text-[.88rem] text-ink outline-none transition focus:border-violet/50"
                >
                <div class="grid gap-2 sm:grid-cols-2">
                  <label
                    v-for="option in (['entry', 'all'] as const)"
                    :key="option"
                    class="flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 text-[.82rem] transition"
                    :class="inviteScope === option ? 'border-violet/45 bg-violet/10 text-ink' : 'border-white/9 bg-white/2 text-[#aaa5b7] hover:bg-white/4'"
                  >
                    <input v-model="inviteScope" type="radio" name="invite-scope" :value="option" class="mt-0.5 accent-[#a86aff]">
                    <span>
                      <span class="block font-bold">{{ t(option === 'entry' ? 'share.scopeEntry' : 'share.scopeAll') }}</span>
                      <span class="mt-0.5 block text-[.76rem] text-dim">{{ t(option === 'entry' ? 'share.scopeEntryHint' : 'share.scopeAllHint') }}</span>
                    </span>
                  </label>
                </div>
                <button type="submit" :class="[buttonClass, 'inline-flex items-center justify-center gap-2 border-violet/40 bg-violet/14']" :disabled="inviting">
                  <Icon name="lucide:user-plus" class="size-4" />
                  {{ t('share.invite') }}
                </button>
              </form>

              <p class="mb-2 mt-7 text-[.72rem] font-bold uppercase tracking-[.14em] text-dim">{{ t('share.whoCanRead') }}</p>
              <p v-if="!entryGrants.length" class="m-0 text-[.84rem] text-faint">{{ t('share.nobody') }}</p>
              <ul v-else class="m-0 grid list-none gap-2 p-0">
                <li
                  v-for="grant in entryGrants"
                  :key="grant.id"
                  class="flex items-center gap-3 rounded-xl border border-white/8 bg-white/2 px-3 py-2.5"
                >
                  <span class="grid size-7 shrink-0 place-items-center rounded-full bg-cyan/15 font-display text-[.85rem] text-cyan">
                    {{ grant.grantee_email[0]?.toUpperCase() }}
                  </span>
                  <span class="min-w-0 flex-1">
                    <span class="block truncate text-[.86rem] text-ink">{{ grant.grantee_email }}</span>
                    <span class="block text-[.74rem] text-dim">{{ grant.entry_slug ? t('share.scopeEntry') : t('share.scopeAll') }}</span>
                  </span>
                  <button
                    type="button"
                    class="shrink-0 cursor-pointer rounded-lg px-2 py-1 text-[.78rem] text-[#e88] transition hover:bg-[#e88]/10"
                    @click="revokeGrant(grant.id, grant.grantee_email)"
                  >
                    {{ t('share.revoke') }}
                  </button>
                </li>
              </ul>
              <p class="mb-0 mt-4 text-[.76rem] leading-relaxed text-dim">{{ t('share.notice') }}</p>
            </template>
          </template>
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
