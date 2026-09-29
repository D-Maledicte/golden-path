import { copyText } from '~/lib/utils'

/** Enlace público de una entrada (`/entrada/<slug>`) en el idioma actual. */
export function useShare() {
  const config = useRuntimeConfig()
  const { t, localePath } = useI18n()
  const { show: toast } = useToast()

  const entryPath = (slug: string) => localePath(`/entrada/${slug}`)

  /** En el navegador usa el origen real (sirve también en previews y en dev). */
  function entryUrl(slug: string) {
    const origin = import.meta.client ? window.location.origin : config.public.siteUrl
    return `${origin}${entryPath(slug)}`
  }

  async function copyEntryLink(slug: string) {
    await copyText(entryUrl(slug))
    toast(t('share.copied'))
  }

  return { entryPath, entryUrl, copyEntryLink }
}
