/** Estado compartido de la paleta de comandos (⌘K). */
export function useCommandPalette() {
  const open = useState('command-palette-open', () => false)

  return {
    open,
    show: () => {
      open.value = true
    },
    hide: () => {
      open.value = false
    },
    toggle: () => {
      open.value = !open.value
    },
  }
}
