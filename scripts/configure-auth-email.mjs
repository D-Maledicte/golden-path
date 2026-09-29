/**
 * Configura el envío de emails de Supabase Auth con Resend (SMTP, remitente y
 * límite de envíos).
 *
 * Toca sólo estos campos de la configuración de Auth; el resto (URLs de
 * redirección, proveedores, etc.) queda como está.
 *
 *   node --env-file=.env.supabase scripts/configure-auth-email.mjs
 *
 * Las plantillas NO se tocan acá: se editan en el dashboard de Supabase
 * (Authentication → Emails → Templates) para poder retocarlas sin código.
 * `supabase/templates/magic-link.html` queda como referencia del diseño
 * inicial; subirla pisaría lo editado en el dashboard:
 *
 *   node --env-file=.env.supabase scripts/configure-auth-email.mjs --with-templates
 *
 * Necesita SUPABASE_ACCESS_TOKEN (cuenta personal) y RESEND_API_KEY.
 */
import { readFileSync } from 'node:fs'

const withTemplates = process.argv.includes('--with-templates')

const PROJECT_REF = 'lsubdkjyyhbyvqmhevri'
const { SUPABASE_ACCESS_TOKEN, RESEND_API_KEY } = process.env

if (!SUPABASE_ACCESS_TOKEN || !RESEND_API_KEY) {
  console.error('Faltan SUPABASE_ACCESS_TOKEN o RESEND_API_KEY (usá --env-file=.env.supabase).')
  process.exit(1)
}

const config = {
  smtp_host: 'smtp.resend.com',
  smtp_port: '465',
  smtp_user: 'resend',
  smtp_pass: RESEND_API_KEY,
  smtp_admin_email: 'no-responder@ia.dmaledicte.cloud',
  smtp_sender_name: 'Golden Path',
  // El plan free de Resend permite 100 por día.
  rate_limit_email_sent: 30,
}

if (withTemplates) {
  const template = readFileSync(new URL('../supabase/templates/magic-link.html', import.meta.url), 'utf8')
  const subject = 'Tu link para entrar a Golden Path'
  // La primera vez Supabase manda "confirmación"; después, "magic link".
  Object.assign(config, {
    mailer_subjects_confirmation: subject,
    mailer_templates_confirmation_content: template,
    mailer_subjects_magic_link: subject,
    mailer_templates_magic_link_content: template,
  })
}

const response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`, {
  method: 'PATCH',
  headers: { Authorization: `Bearer ${SUPABASE_ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
  body: JSON.stringify(config),
})

if (!response.ok) {
  console.error(`Supabase respondió ${response.status}: ${await response.text()}`)
  process.exit(1)
}

const applied = await response.json()
for (const key of ['smtp_host', 'smtp_admin_email', 'smtp_sender_name', 'rate_limit_email_sent', 'mailer_subjects_magic_link']) {
  console.log(`${key}: ${applied[key]}`)
}
console.log('Listo: los emails de login salen desde Golden Path <no-responder@ia.dmaledicte.cloud>.')
