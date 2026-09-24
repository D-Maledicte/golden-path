import { LOCALE_META, messages, type Locale, type MessageKey } from '~/i18n/messages'

/** Prefijo de ruta de cada idioma. El español es el idioma por defecto, sin prefijo. */
const PREFIX: Record<Locale, string> = { es: '', en: '/en' }

/** Idioma de una ruta: todo lo que vive bajo `/en` es inglés. */
export function localeOfPath(path: string): Locale {
  return path === '/en' || path.startsWith('/en/') ? 'en' : 'es'
}

/** Quita el prefijo de idioma: `/en/glosario` → `/glosario`. */
function basePath(path: string): string {
  const stripped = localeOfPath(path) === 'en' ? path.slice(3) : path
  return stripped || '/'
}

/**
 * i18n mínimo del sitio. El idioma no es estado: se deriva de la ruta, así cada
 * URL prerenderizada sale en su idioma y el toggle es un simple enlace.
 */
export function useI18n() {
  const route = useRoute()

  const locale = computed<Locale>(() => localeOfPath(route.path))

  function t(key: MessageKey, params: Record<string, string | number> = {}): string {
    const template = messages[locale.value][key] ?? messages.es[key] ?? key
    return template.replace(/\{(\w+)\}/g, (match, name) => (name in params ? String(params[name]) : match))
  }

  /** Ruta del sitio en el idioma actual: `localePath('/glosario')`. */
  function localePath(path: string, target: Locale = locale.value): string {
    const base = basePath(path)
    const prefix = PREFIX[target]
    return prefix ? (base === '/' ? prefix : `${prefix}${base}`) : base
  }

  /** La ruta actual en otro idioma, conservando query y hash. */
  function switchLocalePath(target: Locale): string {
    const query = route.fullPath.slice(route.path.length)
    return `${localePath(route.path, target)}${query}`
  }

  return {
    locale,
    meta: computed(() => LOCALE_META[locale.value]),
    t,
    localePath,
    switchLocalePath,
  }
}
