/**
 * Estado del lector en superposición. Vive en `useState` para que cualquier
 * página pueda abrir una entrada sin navegar (las tarjetas y la paleta de
 * comandos comparten el mismo overlay, montado una vez en `app.vue`).
 */
export function useReader() {
  const slug = useState<string | null>('reader-slug', () => null)

  const isOpen = computed(() => slug.value !== null)

  return {
    slug,
    isOpen,
    show: (value: string) => {
      slug.value = value
    },
    close: () => {
      slug.value = null
    },
  }
}
