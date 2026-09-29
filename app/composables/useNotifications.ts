/**
 * Avisos de la campana (tabla `notifications`, los crea la base al compartir).
 *
 * Sin tiempo real: se consultan al iniciar sesión, al volver a la pestaña y
 * cada pocos minutos. Si hace falta, Supabase Realtime funciona sobre la misma
 * tabla sin cambiar el modelo.
 */

export interface AppNotification {
  id: string
  kind: 'note_shared'
  actorId: string | null
  actorEmail: string
  actorNickname: string | null
  /** null = compartió todas sus notas. */
  entrySlug: string | null
  /** false cuando el permiso se revocó después del aviso. */
  active: boolean
  createdAt: string
  readAt: string | null
}

const POLL_MS = 3 * 60_000

let started = false

export function useNotifications() {
  const items = useState<AppNotification[]>('notifications', () => [])
  const loading = useState('notifications-loading', () => false)
  const { user } = useAuth()

  const unread = computed(() => items.value.filter(item => !item.readAt).length)

  async function refresh() {
    const supabase = await getSupabase()
    if (!supabase || !user.value || loading.value) return
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('id, kind, actor_id, actor_email, grant_id, entry_slug, created_at, read_at')
        .order('created_at', { ascending: false })
        .limit(40)
      if (error) return
      const actorIds = [...new Set(data.map(row => row.actor_id).filter(Boolean))] as string[]
      // La base sólo devuelve el perfil de quien todavía me comparte algo.
      const { data: profiles } = actorIds.length
        ? await supabase.from('profiles').select('id, nickname').in('id', actorIds)
        : { data: [] }
      const nicknames = new Map((profiles ?? []).map(p => [p.id as string, p.nickname as string | null]))
      items.value = data.map(row => ({
        id: row.id,
        kind: row.kind,
        actorId: row.actor_id,
        actorEmail: row.actor_email,
        actorNickname: row.actor_id ? nicknames.get(row.actor_id) ?? null : null,
        entrySlug: row.entry_slug,
        active: row.grant_id !== null,
        createdAt: row.created_at,
        readAt: row.read_at,
      }))
    } finally {
      loading.value = false
    }
  }

  async function markRead(ids: string[]) {
    const pending = ids.filter(id => items.value.some(item => item.id === id && !item.readAt))
    if (!pending.length) return
    const now = new Date().toISOString()
    items.value = items.value.map(item => (pending.includes(item.id) ? { ...item, readAt: now } : item))
    const supabase = await getSupabase()
    await supabase?.from('notifications').update({ read_at: now }).in('id', pending)
  }

  const markAllRead = () => markRead(items.value.map(item => item.id))

  function clear() {
    items.value = []
  }

  // Consultas periódicas, una sola vez por app. En un scope propio: si no,
  // el watch muere con el primer componente que llamó a este composable.
  if (import.meta.client && !started) {
    started = true
    effectScope(true).run(() => {
      watch(() => user.value?.id, (id) => {
        if (id) refresh()
        else clear()
      }, { immediate: true })
    })
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') refresh()
    })
    setInterval(() => {
      if (document.visibilityState === 'visible') refresh()
    }, POLL_MS)
  }

  return { items, unread, loading, refresh, markRead, markAllRead, clear }
}
