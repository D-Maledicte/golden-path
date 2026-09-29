import { onClickOutside, useEventListener } from '@vueuse/core'
import type { Ref } from 'vue'

/**
 * Panel flotante anclado a un botón (menú de cuenta, campana de avisos).
 *
 * Con `teleport` el panel va al <body> con posición fija, para que ningún
 * `overflow-hidden` (el hero) lo recorte: se abre arriba del botón si entra en
 * la ventana y, si no, abajo. Sin `teleport` (dentro de un <dialog> modal, que
 * está en la capa superior) queda absoluto sobre el botón.
 */
export function useAnchoredPanel(options: {
  root: Ref<HTMLElement | undefined>
  trigger: Ref<HTMLElement | undefined>
  panel: Ref<HTMLElement | undefined>
  align: () => 'left' | 'right'
  teleport: () => boolean
}) {
  const open = ref(false)
  const style = ref<Record<string, string>>({})

  onClickOutside(options.root, () => (open.value = false), { ignore: [options.panel] })

  async function place() {
    const rect = options.trigger.value?.getBoundingClientRect()
    if (!rect) return
    const horizontal = options.align() === 'right'
      ? { right: `${Math.max(12, window.innerWidth - rect.right)}px` }
      : { left: `${Math.max(12, rect.left)}px` }
    const above = { ...horizontal, bottom: `${window.innerHeight - rect.top + 10}px` }
    // Primero invisible, para medir el alto ya renderizado.
    style.value = { ...above, visibility: 'hidden' }
    await nextTick()
    const height = options.panel.value?.offsetHeight ?? 0
    style.value = rect.top - 10 - height >= 12 ? above : { ...horizontal, top: `${rect.bottom + 10}px` }
  }

  watch(open, (value) => {
    if (value && options.teleport()) place()
  })

  // Con scroll o resize el botón se mueve: se cierra en vez de perseguirlo
  // (salvo el scroll dentro del propio panel).
  useEventListener('scroll', (event: Event) => {
    if (options.teleport() && !options.panel.value?.contains(event.target as Node)) open.value = false
  }, { passive: true, capture: true })
  useEventListener('resize', () => (open.value = false))

  function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && open.value) {
      event.stopPropagation()
      open.value = false
    }
  }

  /** Clases del panel según el modo. */
  const panelClass = computed(() =>
    options.teleport()
      ? 'fixed'
      : ['absolute bottom-[calc(100%+10px)]', options.align() === 'right' ? 'right-0' : 'left-0'],
  )
  const panelStyle = computed(() => (options.teleport() ? style.value : undefined))

  return { open, onKeydown, panelClass, panelStyle }
}
