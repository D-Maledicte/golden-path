/**
 * Notas compartidas en sólo lectura (tabla `note_grants`, ver migración
 * `20260929120000_note_grants.sql`).
 *
 * - Lo que yo comparto: permisos por email, para una entrada o para todas.
 * - Lo que me comparten: notas de otros que la base me deja leer.
 *
 * Quién puede leer qué lo decide RLS en la base; esto sólo lo muestra. Las
 * notas ajenas viven sólo en memoria: nunca se escriben en localStorage.
 */

export interface NoteGrant {
  id: string
  grantee_email: string
  /** null = todas mis notas. */
  entry_slug: string | null
  created_at: string
}

export interface SharedNote {
  id: string
  ownerId: string
  entrySlug: string
  name: string
  body: string
  updatedAt: string
  ownerEmail: string
  /** Nickname del dueño, si lo definió (la base sólo lo muestra a sus invitados). */
  ownerNickname: string | null
}

export function useSharing() {
  const grants = useState<NoteGrant[]>('sharing-grants', () => [])
  const shared = useState<SharedNote[]>('sharing-shared', () => [])
  const loading = useState('sharing-loading', () => false)
  const { user } = useAuth()

  /** Recarga lo que comparto y lo que me comparten. */
  async function refresh() {
    const supabase = await getSupabase()
    if (!supabase || !user.value || loading.value) return
    loading.value = true
    try {
      const me = user.value.id
      const [mine, received, notes] = await Promise.all([
        supabase.from('note_grants').select('id, grantee_email, entry_slug, created_at').eq('owner_id', me).order('created_at'),
        supabase.from('note_grants').select('owner_id, owner_email').neq('owner_id', me),
        supabase.from('notes').select('id, entry_slug, name, body, updated_at, owner_id').neq('owner_id', me).is('deleted_at', null),
      ])
      if (!mine.error) grants.value = mine.data as NoteGrant[]
      if (!received.error && !notes.error) {
        const emails = new Map((received.data ?? []).map(g => [g.owner_id as string, g.owner_email as string]))
        const { data: profiles } = emails.size
          ? await supabase.from('profiles').select('id, nickname').in('id', [...emails.keys()])
          : { data: [] }
        const nicknames = new Map((profiles ?? []).map(p => [p.id as string, p.nickname as string | null]))
        shared.value = (notes.data ?? []).map(row => ({
          id: row.id,
          ownerId: row.owner_id,
          entrySlug: row.entry_slug,
          name: row.name,
          body: row.body,
          updatedAt: row.updated_at,
          ownerEmail: emails.get(row.owner_id) ?? '',
          ownerNickname: nicknames.get(row.owner_id) ?? null,
        }))
      }
    } finally {
      loading.value = false
    }
  }

  /** Invita a leer. `slug` null = todas mis notas. Devuelve un código de error o null. */
  async function share(email: string, slug: string | null): Promise<'self' | 'duplicate' | 'invalid' | 'error' | null> {
    const supabase = await getSupabase()
    if (!supabase || !user.value) return 'error'
    const address = email.trim().toLowerCase()
    if (address === user.value.email?.toLowerCase()) return 'self'
    const { data, error } = await supabase
      .from('note_grants')
      .insert({ grantee_email: address, entry_slug: slug })
      .select('id, grantee_email, entry_slug, created_at')
      .single()
    if (error) return error.code === '23505' ? 'duplicate' : error.code === '23514' ? 'invalid' : 'error'
    grants.value = [...grants.value, data as NoteGrant]
    return null
  }

  async function revoke(id: string) {
    const supabase = await getSupabase()
    if (!supabase) return false
    const { error } = await supabase.from('note_grants').delete().eq('id', id)
    if (!error) grants.value = grants.value.filter(grant => grant.id !== id)
    return !error
  }

  const sharedOf = (slug: string) => shared.value.filter(note => note.entrySlug === slug)
  const grantsFor = (slug: string) => grants.value.filter(grant => grant.entry_slug === null || grant.entry_slug === slug)

  /** Al cerrar sesión no queda nada ajeno en memoria. */
  function clear() {
    grants.value = []
    shared.value = []
  }

  return { grants, shared, loading, refresh, share, revoke, sharedOf, grantsFor, clear }
}
