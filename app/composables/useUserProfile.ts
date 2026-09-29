/**
 * Perfil de la cuenta (tabla `profiles`): por ahora, un nickname opcional.
 *
 * En el primer login se ofrece completarlo (`needsOnboarding`); se puede
 * saltear y editar después desde el menú de cuenta.
 */

export interface UserProfile {
  nickname: string | null
  onboarded_at: string | null
}

export type ProfileError = 'taken' | 'invalid' | 'error'

/** Mismo patrón que el CHECK de la base: 3 a 24 caracteres, letras, números y `_ . -`. */
export const NICKNAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_.-]{1,22}[A-Za-z0-9]$/

export function useUserProfile() {
  const account = useState<UserProfile | null>('user-profile', () => null)
  const loadedFor = useState<string | null>('user-profile-for', () => null)
  /** Diálogo de perfil: 'welcome' en el primer login, 'edit' desde el menú. */
  const dialog = useState<'welcome' | 'edit' | null>('user-profile-dialog', () => null)
  const { user } = useAuth()

  const nickname = computed(() => account.value?.nickname ?? null)

  /** Carga el perfil de la sesión actual y abre la bienvenida si hace falta. */
  async function load() {
    const supabase = await getSupabase()
    if (!supabase || !user.value || loadedFor.value === user.value.id) return
    loadedFor.value = user.value.id
    const { data, error } = await supabase
      .from('profiles')
      .select('nickname, onboarded_at')
      .eq('id', user.value.id)
      .maybeSingle()
    if (error) {
      loadedFor.value = null
      return
    }
    account.value = data ?? { nickname: null, onboarded_at: null }
    if (!account.value.onboarded_at) dialog.value = 'welcome'
  }

  async function upsert(fields: Partial<UserProfile>): Promise<ProfileError | null> {
    const supabase = await getSupabase()
    if (!supabase || !user.value) return 'error'
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: user.value.id, ...fields, updated_at: new Date().toISOString() })
      .select('nickname, onboarded_at')
      .single()
    if (error) return error.code === '23505' ? 'taken' : error.code === '23514' ? 'invalid' : 'error'
    account.value = data
    return null
  }

  /** Guarda el nickname (vacío = sin nickname) y da por hecha la bienvenida. */
  function saveNickname(value: string) {
    const trimmed = value.trim()
    if (trimmed && !NICKNAME_PATTERN.test(trimmed)) return Promise.resolve<ProfileError>('invalid')
    return upsert({ nickname: trimmed || null, onboarded_at: account.value?.onboarded_at ?? new Date().toISOString() })
  }

  /** "Ahora no": no se vuelve a ofrecer. */
  async function skipOnboarding() {
    dialog.value = null
    await upsert({ onboarded_at: new Date().toISOString() })
  }

  function clear() {
    account.value = null
    loadedFor.value = null
    dialog.value = null
  }

  return { account, nickname, dialog, load, saveNickname, skipOnboarding, clear }
}
