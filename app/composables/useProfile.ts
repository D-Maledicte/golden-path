/**
 * "Perfil" de quien sigue la guía: sus propias notas en Markdown, agrupadas por
 * entrada. Vive en `localStorage` y se puede exportar/importar como JSON.
 *
 * Con sesión iniciada (Supabase) es local-first: cada cambio se escribe en
 * local y se sube a la tabla `notes`; al iniciar sesión se fusionan ambos
 * lados por `id` y gana el `updatedAt` más reciente. Los borrados son lógicos
 * (`deletedAt`) para que también se propaguen.
 *
 * Se carga recién con la app hidratada para que el HTML prerenderizado y el
 * primer render del cliente coincidan. No se usa `onNuxtReady`: espera a que
 * el navegador quede ocioso, y con la aurora WebGL del hero eso puede no pasar
 * nunca en equipos sin aceleración gráfica (no cargaban sesión ni notas).
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
/** Cuenta con la que se sincronizó por última vez este navegador. */
const OWNER_KEY = 'golden-path:profile-owner'
/** Copia del perfil local tomada antes de fusionarlo con una cuenta por primera vez. */
const BACKUP_KEY = 'golden-path:profile-backup'

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

/** Corre `callback` apenas termina la hidratación (o ya, si terminó). */
function afterHydration(callback: () => void) {
  const nuxtApp = useNuxtApp()
  if (nuxtApp.isHydrating) nuxtApp.hooks.hookOnce('app:suspense:resolve', () => callback())
  else callback()
}

export function useProfile() {
  const profile = useState<Profile>('profile', emptyProfile)
  const syncing = useState('profile-syncing', () => false)
  /** Hay cambios locales que todavía no llegaron a la nube (p. ej. sin conexión). */
  const pending = useState('profile-pending', () => false)
  const auth = useAuth()
  const { user } = auth
  // Se toman acá (no después de un await): useState necesita el contexto de Nuxt.
  const sharing = useSharing()
  const userProfile = useUserProfile()
  const notifications = useNotifications()
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

  /** Cambia el id de una nota local (cuando el suyo no se puede usar en la nube). */
  function reassignId(slug: string, oldId: string): NoteRow | null {
    const list = profile.value.notes[slug]
    const index = list?.findIndex(note => note.id === oldId) ?? -1
    if (!list || index < 0) return null
    const note = { ...list[index]!, id: crypto.randomUUID() }
    const next = [...list]
    next[index] = note
    profile.value = { ...profile.value, notes: { ...profile.value.notes, [slug]: next } }
    persist()
    return toRow(slug, note)
  }

  /**
   * Sube filas a Supabase. Si el lote falla se reintenta fila por fila, así una
   * nota problemática no frena a las demás. Una nota con id inválido o que en
   * la nube pertenece a otra cuenta (p. ej. importada del JSON de otra persona)
   * recibe un id nuevo y se vuelve a subir. Lo que falle igual queda en local y
   * se reintenta en el próximo sync. Devuelve si subió todo.
   */
  async function push(rows: NoteRow[]): Promise<boolean> {
    if (!user.value || !rows.length) return true
    const supabase = await getSupabase()
    if (!supabase) return false
    // Sin conexión no se intenta ni se avisa: queda pendiente y sube al reconectar.
    if (!navigator.onLine) {
      pending.value = true
      return false
    }
    if (!(await supabase.from('notes').upsert(rows)).error) return true

    let ok = true
    for (const row of rows) {
      let { error } = await supabase.from('notes').upsert(row)
      // 42501: fila de otra cuenta (RLS) · 22P02: id que no es un UUID.
      if (error && ['42501', '22P02'].includes(error.code)) {
        const renamed = reassignId(row.entry_slug, row.id)
        if (renamed) ({ error } = await supabase.from('notes').upsert(renamed))
      }
      if (error) ok = false
    }
    if (!ok) {
      pending.value = true
      toast(t('cloud.pushError'), 3500)
    }
    return ok
  }

  /**
   * Fusiona local y nube por id: gana el `updatedAt` más reciente. Nunca borra
   * notas locales: las que no están en la nube se suben. Devuelve si quedó
   * todo sincronizado.
   */
  async function sync(): Promise<boolean> {
    const supabase = await getSupabase()
    if (!supabase || !user.value || syncing.value) return false
    if (!navigator.onLine) {
      pending.value = true
      return false
    }
    syncing.value = true
    try {
      // Sólo las propias: con notas compartidas la base también deja leer las
      // de otros, y esas no se mezclan con el perfil (ver useSharing).
      const { data, error } = await supabase.from('notes').select('*').eq('owner_id', user.value.id)
      if (error) throw error

      // Primera vez que este navegador se fusiona con esta cuenta: copia de respaldo.
      const previousOwner = localStorage.getItem(OWNER_KEY)
      if (previousOwner !== user.value.id && Object.keys(profile.value.notes).length) {
        localStorage.setItem(BACKUP_KEY, JSON.stringify({ ...profile.value, previousOwner, backedUpAt: new Date().toISOString() }))
      }
      // Lo local ya se había sincronizado con OTRA cuenta (sesión vencida sin
      // cerrar): no se mezcla con esta. Queda en la copia de respaldo.
      if (previousOwner && previousOwner !== user.value.id) {
        profile.value = emptyProfile()
        toast(t('cloud.otherAccount'), 6000)
      }
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
      if (!persist()) return false
      const pushed = await push(toPush)
      localStorage.setItem(OWNER_KEY, user.value.id)
      pending.value = !pushed
      return pushed
    } catch {
      pending.value = true
      // Un corte a mitad de camino no amerita aviso: se reintenta al reconectar.
      if (navigator.onLine) toast(t('cloud.syncError'), 3500)
      return false
    } finally {
      syncing.value = false
    }
  }

  if (import.meta.client && !loaded) {
    loaded = true
    afterHydration(async () => {
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
        if (changed && next) {
          setTimeout(() => {
            sync()
            userProfile.load()
          }, 0)
        }
      })

      // Reintentos de lo pendiente: al volver la conexión, al volver a la
      // pestaña y, por las dudas, cada minuto mientras quede algo sin subir.
      const retry = () => {
        if (user.value && (pending.value || !syncing.value)) sync()
      }
      window.addEventListener('online', retry)
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && pending.value) retry()
      })
      setInterval(() => {
        if (pending.value && navigator.onLine) retry()
      }, 60_000)
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

  /**
   * Cierra sesión y limpia las notas de este navegador, para que en una compu
   * compartida no pasen a la cuenta de quien entre después. Sólo limpia si antes
   * logró subir todo; si no, no cierra la sesión y avisa.
   */
  async function signOut(): Promise<boolean> {
    if (!(await sync())) {
      toast(t('cloud.signOutBlocked'), 5000)
      return false
    }
    await auth.signOut()
    sharing.clear()
    userProfile.clear()
    notifications.clear()
    profile.value = emptyProfile()
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(OWNER_KEY)
    } catch {
      // Sin almacenamiento no hay nada que limpiar.
    }
    return true
  }

  /** La copia de respaldo previa a la primera fusión, si existe (se importa como cualquier perfil). */
  function backupJson(): string | null {
    try {
      return localStorage.getItem(BACKUP_KEY)
    } catch {
      return null
    }
  }

  return { profile, total, syncing, pending, notesOf, saveNote, deleteNote, exportJson, importJson, sync, signOut, backupJson }
}

/** Con qué pestaña y nota abrir el modal (p. ej. desde un aviso). */
export interface NotesDialogIntent {
  tab: 'mine' | 'shared' | 'share'
  /** Nota compartida a seleccionar. */
  noteId?: string
}

/** Entrada cuyo modal de notas está abierto (montado una vez en `app.vue`). */
export function useNotesDialog() {
  const slug = useState<string | null>('notes-slug', () => null)
  const intent = useState<NotesDialogIntent | null>('notes-intent', () => null)
  return {
    slug,
    intent,
    show: (value: string, openWith: NotesDialogIntent | null = null) => {
      intent.value = openWith
      slug.value = value
    },
    close: () => {
      slug.value = null
      intent.value = null
    },
  }
}
