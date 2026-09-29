/**
 * "Perfil" de quien sigue la guía: sus propias notas en Markdown, agrupadas por
 * entrada. Vive sólo en `localStorage` y se puede exportar/importar como JSON.
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
}

export interface Profile {
  version: 1
  notes: Record<string, ProfileNote[]>
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

let loaded = false

export function useProfile() {
  const profile = useState<Profile>('profile', emptyProfile)
  const { t } = useI18n()
  const { show: toast } = useToast()

  if (import.meta.client && !loaded) {
    loaded = true
    onNuxtReady(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        const parsed = stored ? parseProfile(JSON.parse(stored)) : null
        if (parsed) profile.value = parsed
      } catch {
        // Almacenamiento bloqueado o JSON corrupto: se arranca vacío.
      }
    })
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile.value))
      return true
    } catch {
      toast(t('notes.storageError'), 3500)
      return false
    }
  }

  const notesOf = (slug: string) => profile.value.notes[slug] ?? []

  const total = computed(() => Object.values(profile.value.notes).reduce((sum, list) => sum + list.length, 0))

  function saveNote(slug: string, input: { id?: string, name: string, body: string }) {
    const now = new Date().toISOString()
    const list = [...notesOf(slug)]
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
    return persist() ? note : null
  }

  function deleteNote(slug: string, id: string) {
    const list = notesOf(slug).filter(note => note.id !== id)
    const notes = { ...profile.value.notes }
    if (list.length) notes[slug] = list
    else delete notes[slug]
    profile.value = { ...profile.value, notes }
    persist()
  }

  function exportJson() {
    return JSON.stringify({ ...profile.value, exportedAt: new Date().toISOString() }, null, 2)
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
    let count = 0
    for (const [slug, list] of Object.entries(incoming.notes)) {
      const byId = new Map((notes[slug] ?? []).map(note => [note.id, note]))
      for (const note of list) byId.set(note.id, note)
      notes[slug] = [...byId.values()]
      count += list.length
    }
    profile.value = { ...profile.value, notes }
    return persist() ? count : null
  }

  return { profile, total, notesOf, saveNote, deleteNote, exportJson, importJson }
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
