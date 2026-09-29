<script setup lang="ts">
import type { AppNotification } from '~/composables/useNotifications'

/**
 * Campana de avisos. Al tocar un aviso abre el modal de notas de esa entrada
 * en "Compartidas conmigo", con la nota de quien compartió seleccionada.
 */
const props = withDefaults(defineProps<{ align?: 'left' | 'right' }>(), { align: 'right' })

const auth = useAuth()
const { items, unread, markRead, markAllRead } = useNotifications()
const sharing = useSharing()
const notesDialog = useNotesDialog()
const { bySlug } = useLibrary()
const { t, locale } = useI18n()
const { show: toast } = useToast()

const root = ref<HTMLElement>()
const trigger = ref<HTMLElement>()
const panel = ref<HTMLElement>()
const { open, onKeydown, panelClass, panelStyle } = useAnchoredPanel({
  root,
  trigger,
  panel,
  align: () => props.align,
  teleport: () => true,
})

const actorName = (item: AppNotification) => item.actorNickname ?? item.actorEmail

function message(item: AppNotification) {
  const actor = actorName(item)
  if (!item.entrySlug) return t('notify.sharedAll', { actor })
  return t('notify.sharedEntry', { actor, title: bySlug(item.entrySlug)?.title ?? item.entrySlug })
}

const relative = computed(() => new Intl.RelativeTimeFormat(locale.value, { numeric: 'auto' }))
function ago(date: string) {
  const minutes = Math.round((Date.parse(date) - Date.now()) / 60_000)
  if (Math.abs(minutes) < 60) return relative.value.format(minutes, 'minute')
  const hours = Math.round(minutes / 60)
  if (Math.abs(hours) < 24) return relative.value.format(hours, 'hour')
  return relative.value.format(Math.round(hours / 24), 'day')
}

const opening = ref<string | null>(null)

async function openItem(item: AppNotification) {
  markRead([item.id])
  if (!item.active) {
    toast(t('notify.revoked'), 3500)
    return
  }
  opening.value = item.id
  await sharing.refresh()
  opening.value = null
  const fromActor = sharing.shared.value.filter(note => note.ownerId === item.actorId)
  // Una entrada puntual, o la primera con notas si compartió todas.
  const note = item.entrySlug ? fromActor.find(n => n.entrySlug === item.entrySlug) : fromActor[0]
  const slug = item.entrySlug ?? note?.entrySlug
  if (!slug || !bySlug(slug)) {
    toast(t('notify.nothingYet', { actor: actorName(item) }), 3500)
    return
  }
  open.value = false
  notesDialog.show(slug, { tab: 'shared', noteId: note?.id })
}
</script>

<template>
  <div v-if="auth.user.value" ref="root" class="relative" @keydown="onKeydown">
    <button
      ref="trigger"
      type="button"
      class="relative grid size-11 cursor-pointer place-items-center rounded-full border border-gold/25 bg-[#0d0b1c]/70 text-ink backdrop-blur-md transition hover:border-gold/45 hover:bg-[#0d0b1c]/85 focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-cyan"
      :aria-label="unread ? t('notify.labelUnread', { count: unread }) : t('notify.label')"
      :aria-expanded="open"
      aria-haspopup="dialog"
      @click="open = !open"
    >
      <Icon name="lucide:bell" class="size-[18px]" :class="unread && 'text-gold'" />
      <span
        v-if="unread"
        class="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-gold px-1 font-mono text-[.66rem] font-bold text-[#21180b] ring-2 ring-[#0d0b1c]"
      >
        {{ unread > 9 ? '9+' : unread }}
      </span>
    </button>

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="translate-y-1 opacity-0"
        leave-active-class="transition duration-100 ease-in"
        leave-to-class="translate-y-1 opacity-0"
      >
        <div
          v-if="open"
          ref="panel"
          role="dialog"
          :aria-label="t('notify.title')"
          class="z-[120] max-h-[min(460px,calc(100vh-24px))] w-[min(340px,calc(100vw-24px))] overflow-y-auto rounded-2xl border border-white/10 bg-[#110f22]/96 p-2 text-left shadow-[0_24px_70px_rgba(0,0,0,.55)] backdrop-blur-xl"
          :class="panelClass"
          :style="panelStyle"
          @keydown="onKeydown"
        >
          <div class="flex items-center justify-between gap-3 px-2.5 pb-2 pt-1.5">
            <p class="m-0 text-[.7rem] font-bold uppercase tracking-[.14em] text-gold">{{ t('notify.title') }}</p>
            <button
              v-if="unread"
              type="button"
              class="cursor-pointer text-[.76rem] text-cyan underline-offset-4 hover:underline"
              @click="markAllRead()"
            >
              {{ t('notify.markAll') }}
            </button>
          </div>

          <p v-if="!items.length" class="m-0 px-2.5 pb-5 pt-3 text-center text-[.84rem] text-faint">
            {{ t('notify.empty') }}
          </p>

          <ul v-else class="m-0 grid list-none gap-0.5 p-0">
            <li v-for="item in items" :key="item.id">
              <button
                type="button"
                class="flex w-full cursor-pointer items-start gap-3 rounded-xl px-2.5 py-2.5 text-left transition hover:bg-white/5 focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-cyan"
                :class="!item.active && 'opacity-60'"
                @click="openItem(item)"
              >
                <span class="relative mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-violet/25 font-display text-[.9rem] text-ink">
                  {{ actorName(item)[0]?.toUpperCase() }}
                  <span v-if="!item.readAt" class="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-gold ring-2 ring-[#110f22]" />
                </span>
                <span class="min-w-0 flex-1">
                  <span class="block text-[.84rem] leading-snug" :class="item.readAt ? 'text-faint' : 'text-ink'">
                    {{ message(item) }}
                  </span>
                  <span class="mt-1 flex items-center gap-1.5 text-[.72rem] text-dim">
                    <Icon v-if="opening === item.id" name="lucide:loader-circle" class="size-3 animate-spin" />
                    {{ item.active ? ago(item.createdAt) : t('notify.revokedShort') }}
                  </span>
                </span>
              </button>
            </li>
          </ul>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
