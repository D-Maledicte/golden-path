/**
 * "Perfil" de quien sigue la guía: sus propias notas en Markdown, agrupadas por
 * entrada. Vive en `localStorage` y se puede exportar/importar como JSON.
 *
 * Con sesión iniciada (Supabase) es local-first: cada cambio se escribe en
 * local y se sube a la tabla `notes`; al iniciar sesión se fusionan ambos
 * lados por `id` y gana el `updatedAt` más reciente. Los borrados son lógicos
 * (`deletedAt`) para que también se propaguen.
 *
 * Se carga recién con la app hidratada (`onNuxtReady`) para que el HTML
 * prerenderizado y el primer render del cliente coincidan.
 */

export interface ProfileNote {
  id: string
  name: string
  body: string
  createdAt: string
  updatedAt: string
  /** Borrado lógico: se conserva para sincronizar, no se muestra. */
  deletedAt?: string | null
}

export interface Profile {
  version: 1
  notes: Record<string, ProfileNote[]>
}

interface NoteRow {
  id: string
  entry_slug: string
  name: string
  body: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

const STORAGE_KEY = 'golden-path:profile'

const emptyProfile = (): Profile => ({ version: 1, notes: {} })

function isNote(value: unknown): value is ProfileNote {
  const note = value as ProfileNote
  return (
    typeof note === 'object' && note !== null
    && typeof note.id === 'string' && typeof note.name === 'string' && typeof note.body === 'string'
  )
}

/** Valida lo que venga de `localStorage` o de un archivo importado. */
function parseProfile(raw: unknown): Profile | null {
  const data = raw as Profile
  if (typeof data !== 'object' || data === null || typeof data.notes !== 'object' || data.notes === null) return null
  const notes: Profile['notes'] = {}
  for (const [slug, list] of Object.entries(data.notes)) {
    if (!Array.isArray(list)) return null
    const valid = list.filter(isNote).map(note => ({
      ...note,
      createdAt: note.createdAt ?? new Date().toISOString(),
      updatedAt: note.updatedAt ?? note.createdAt ?? new Date().toISOString(),
    }))
    if (valid.length) notes[slug] = valid
  }
  return { version: 1, notes }
}

const toRow = (slug: string, note: ProfileNote): NoteRow => ({
  id: note.id,
  entry_slug: slug,
  name: note.name,
  body: note.body,
  created_at: note.createdAt,
  updated_at: note.updatedAt,
  deleted_at: note.deletedAt ?? null,
})

const fromRow = (row: NoteRow): ProfileNote => ({
  id: row.id,
  name: row.name,
  body: row.body,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  deletedAt: row.deleted_at,
})

/** Todas las notas (incluidas las borradas) como `slug → nota` por id. */
function flatten(profile: Profile) {
  const byId = new Map<string, { slug: string, note: ProfileNote }>()
  for (const [slug, list] of Object.entries(profile.notes)) {
    for (const note of list) byId.set(note.id, { slug, note })
  }
  return byId
}

let loaded = false

export function useProfile() {
  const profile = useState<Profile>('profile', emptyProfile)
  const syncing = useState('profile-syncing', () => false)
  const { user } = useAuth()
  const { t } = useI18n()
  const { show: toast } = useToast()

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile.value))
      return true
    } catch {
      toast(t('notes.storageError'), 3500)
      return false
    }
  }

  /** Sube filas a Supabase; si falla queda en local y se reintenta en el próximo sync. */
  async function push(rows: NoteRow[]) {
    if (!user.value || !rows.length) return
    const supabase = await getSupabase()
    const { error } = (await supabase?.from('notes').upsert(rows)) ?? {}
    if (error) toast(t('cloud.pushError'), 3500)
  }

  /** Fusiona local y nube por id: gana el `updatedAt` más reciente. */
  async function sync() {
    const supabase = await getSupabase()
    if (!supabase || !user.value || syncing.value) return
    syncing.value = true
    try {
      const { data, error } = await supabase.from('notes').select('*')
      if (error) throw error
      const local = flatten(profile.value)
      const remote = new Map((data as NoteRow[]).map(row => [row.id, row]))
      const toPush: NoteRow[] = []
      const merged: Profile['notes'] = {}
      const add = (slug: string, note: ProfileNote) => (merged[slug] ??= []).push(note)

      for (const [id, { slug, note }] of local) {
        const row = remote.get(id)
        if (!row || Date.parse(note.updatedAt) > Date.parse(row.updated_at)) {
          toPush.push(toRow(slug, note))
          add(slug, note)
        } else {
          add(row.entry_slug, fromRow(row))
        }
        remote.delete(id)
      }
      for (const row of remote.values()) add(row.entry_slug, fromRow(row))

      profile.value = { version: 1, notes: merged }
      persist()
      await push(toPush)
    } catch {
      toast(t('cloud.syncError'), 3500)
    } finally {
      syncing.value = false
    }
  }

  if (import.meta.client && !loaded) {
    loaded = true
    onNuxtReady(async () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        const parsed = stored ? parseProfile(JSON.parse(stored)) : null
        if (parsed) profile.value = parsed
      } catch {
        // Almacenamiento bloqueado o JSON corrupto: se arranca vacío.
      }

      const supabase = await getSupabase()
      if (!supabase) return
      supabase.auth.onAuthStateChange((_event, session) => {
        const next = session?.user ? { id: session.user.id, email: session.user.email } : null
        const changed = next?.id !== user.value?.id
        user.value = next
        // Fuera del callback: supabase-js no admite llamadas a la API adentro.
        if (changed && next) setTimeout(sync, 0)
      })
    })
  }

  const notesOf = (slug: string) => (profile.value.notes[slug] ?? []).filter(note => !note.deletedAt)

  const total = computed(() => Object.keys(profile.value.notes).reduce((sum, slug) => sum + notesOf(slug).length, 0))

  function saveNote(slug: string, input: { id?: string, name: string, body: string }) {
    const now = new Date().toISOString()
    const list = [...(profile.value.notes[slug] ?? [])]
    const index = input.id ? list.findIndex(note => note.id === input.id) : -1
    const name = input.name.trim() || 'nota.md'
    let note: ProfileNote
    if (index >= 0) {
      note = { ...list[index]!, name, body: input.body, updatedAt: now }
      list[index] = note
    } else {
      note = { id: crypto.randomUUID(), name, body: input.body, createdAt: now, updatedAt: now }
      list.push(note)
    }
    profile.value = { ...profile.value, notes: { ...profile.value.notes, [slug]: list } }
    if (!persist()) return null
    push([toRow(slug, note)])
    return note
  }

  function deleteNote(slug: string, id: string) {
    const now = new Date().toISOString()
    let removed: ProfileNote | undefined
    const list = (profile.value.notes[slug] ?? []).map((note) => {
      if (note.id !== id) return note
      removed = { ...note, deletedAt: now, updatedAt: now }
      return removed
    })
    profile.value = { ...profile.value, notes: { ...profile.value.notes, [slug]: list } }
    persist()
    if (removed) push([toRow(slug, removed)])
  }

  /** El export no incluye las notas borradas. */
  function exportJson() {
    const notes: Profile['notes'] = {}
    for (const slug of Object.keys(profile.value.notes)) {
      const list = notesOf(slug)
      if (list.length) notes[slug] = list.map(({ deletedAt: _, ...note }) => note)
    }
    return JSON.stringify({ version: 1, notes, exportedAt: new Date().toISOString() }, null, 2)
  }

  /** Suma las notas importadas a las existentes; las de mismo id se reemplazan. */
  function importJson(text: string): number | null {
    let incoming: Profile | null
    try {
      incoming = parseProfile(JSON.parse(text))
    } catch {
      return null
    }
    if (!incoming) return null
    const notes = { ...profile.value.notes }
    const rows: NoteRow[] = []
    let count = 0
    for (const [slug, list] of Object.entries(incoming.notes)) {
      const byId = new Map((notes[slug] ?? []).map(note => [note.id, note]))
      for (const note of list) {
        byId.set(note.id, note)
        rows.push(toRow(slug, note))
      }
      notes[slug] = [...byId.values()]
      count += list.length
    }
    profile.value = { ...profile.value, notes }
    if (!persist()) return null
    push(rows)
    return count
  }

  return { profile, total, syncing, notesOf, saveNote, deleteNote, exportJson, importJson, sync }
}

/** Entrada cuyo modal de notas está abierto (montado una vez en `app.vue`). */
export function useNotesDialog() {
  const slug = useState<string | null>('notes-slug', () => null)
  return {
    slug,
    show: (value: string) => {
      slug.value = value
    },
    close: () => {
      slug.value = null
    },
  }
}
