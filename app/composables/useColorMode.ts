/**
 * Shim dark-only para el `useColorMode()` que espera `ShimmerButton` de nxui
 * (el componente asume `@nuxtjs/color-mode`).
 *
 * Golden Path es dark-only por diseño: no hay modo claro ni preferencia
 * persistida, y la clase `.dark` vive fija en <html>. Si algún día se agrega
 * `@nuxtjs/color-mode`, borrar este archivo y la dependencia real toma control.
 */
export function useColorMode() {
  return useState<'dark' | 'light'>('color-mode', () => 'dark')
}
