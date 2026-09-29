import type { SupabaseClient, User } from '@supabase/supabase-js'

let client: SupabaseClient | null | undefined

/**
 * Cliente de Supabase, sólo en el navegador y sólo si hay clave configurada.
 * Se importa bajo demanda para no sumar el SDK al bundle inicial.
 */
export async function getSupabase(): Promise<SupabaseClient | null> {
  if (!import.meta.client) return null
  if (client !== undefined) return client
  const { supabaseUrl, supabaseAnonKey } = useRuntimeConfig().public
  if (!supabaseUrl || !supabaseAnonKey) return (client = null)
  const { createClient } = await import('@supabase/supabase-js')
  client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: true, detectSessionInUrl: true, flowType: 'pkce' },
  })
  return client
}

/** Sesión actual. `enabled` es falso cuando no hay Supabase configurado. */
export function useAuth() {
  const user = useState<Pick<User, 'id' | 'email'> | null>('auth-user', () => null)
  const enabled = computed(() => Boolean(useRuntimeConfig().public.supabaseAnonKey))

  /** Magic link: vuelve a la misma página con la sesión iniciada. */
  async function signIn(email: string) {
    const supabase = await getSupabase()
    if (!supabase) return { error: 'disabled' }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + window.location.pathname },
    })
    return { error: error?.message ?? null }
  }

  /** GitHub: redirige a autorizar y vuelve a la misma página con la sesión iniciada. */
  async function signInWithGitHub() {
    const supabase = await getSupabase()
    if (!supabase) return { error: 'disabled' }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: window.location.origin + window.location.pathname },
    })
    return { error: error?.message ?? null }
  }

  async function signOut() {
    const supabase = await getSupabase()
    await supabase?.auth.signOut()
    user.value = null
  }

  return { user, enabled, signIn, signInWithGitHub, signOut }
}
