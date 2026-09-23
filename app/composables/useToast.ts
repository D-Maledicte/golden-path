let timer: ReturnType<typeof setTimeout> | undefined

/** Aviso efímero compartido por toda la app (copiar / descargar Markdown). */
export function useToast() {
  const message = useState('toast-message', () => '')

  function show(text: string, duration = 2200) {
    message.value = text
    clearTimeout(timer)
    timer = setTimeout(() => {
      message.value = ''
    }, duration)
  }

  return { message, show }
}
