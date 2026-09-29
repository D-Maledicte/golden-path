/**
 * Habilita el login con GitHub en Supabase Auth.
 *
 * Toca sólo los campos del proveedor GitHub; el resto de la configuración de
 * Auth queda como está.
 *
 *   node --env-file=.env.supabase scripts/configure-auth-github.mjs
 *
 * Necesita SUPABASE_ACCESS_TOKEN (cuenta personal), GITHUB_CLIENT_ID y
 * GITHUB_CLIENT_SECRET (OAuth App con callback
 * https://lsubdkjyyhbyvqmhevri.supabase.co/auth/v1/callback).
 */
const PROJECT_REF = 'lsubdkjyyhbyvqmhevri'
const { SUPABASE_ACCESS_TOKEN, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env

if (!SUPABASE_ACCESS_TOKEN || !GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
  console.error('Faltan SUPABASE_ACCESS_TOKEN, GITHUB_CLIENT_ID o GITHUB_CLIENT_SECRET (usá --env-file=.env.supabase).')
  process.exit(1)
}

const response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`, {
  method: 'PATCH',
  headers: { Authorization: `Bearer ${SUPABASE_ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    external_github_enabled: true,
    external_github_client_id: GITHUB_CLIENT_ID,
    external_github_secret: GITHUB_CLIENT_SECRET,
  }),
})

if (!response.ok) {
  console.error(`Supabase respondió ${response.status}: ${await response.text()}`)
  process.exit(1)
}

const applied = await response.json()
console.log(`external_github_enabled: ${applied.external_github_enabled}`)
console.log(`external_github_client_id coincide: ${applied.external_github_client_id === GITHUB_CLIENT_ID}`)
console.log(`site_url (sin cambios): ${applied.site_url}`)
