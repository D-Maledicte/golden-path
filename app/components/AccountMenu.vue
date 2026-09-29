<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

/**
 * Acceso a la cuenta: iniciar sesión con magic link, estado de sincronización
 * de las notas y cierre de sesión. El panel se abre hacia arriba porque vive
 * al pie del hero y del modal de notas.
 */
const props = withDefaults(defineProps<{ align?: 'left' | 'right' }>(), { align: 'right' })

const auth = useAuth()
const { total, syncing, pending, signOut } = useProfile()
const { t } = useI18n()
const { show: toast } = useToast()

const open = ref(false)
const root = ref<HTMLElement>()
onClickOutside(root, () => (open.value = false))

const email = ref('')
const sending = ref(false)
/** Email al que se mandó el link, para la pantalla de "revisá tu correo". */
const sentTo = ref<string | null>(null)

const initial = computed(() => (auth.user.value?.email?.[0] ?? '?').toUpperCase())

const status = computed(() => {
  if (syncing.value) return { label: t('cloud.syncing'), dot: 'bg-cyan animate-pulse' }
  if (pending.value) return { label: t('account.pending'), dot: 'bg-gold' }
  return { label: t('account.synced'), dot: 'bg-[#6fdc9a]' }
})

async function sendLink() {
  const address = email.value.trim()
  if (!address || sending.value) return
  sending.value = true
  const { error } = await auth.signIn(address)
  sending.value = false
  if (error) {
    toast(t('cloud.sendError', { error }), 4000)
    return
  }
  sentTo.value = address
}

async function onSignOut() {
  if (await signOut()) open.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && open.value) {
    event.stopPropagation()
    open.value = false
  }
}

const primaryButton
  = 'inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gold px-4 text-[.84rem] font-bold text-[#21180b] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70 focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-cyan'
const secondaryButton
  = 'inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/11 bg-white/4 px-4 text-[.84rem] font-bold text-ink transition hover:border-white/20 hover:bg-white/7 focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-cyan'
</script>

<template>
  <div v-if="auth.enabled.value" ref="root" class="relative" @keydown="onKeydown">
    <button
      type="button"
      class="inline-flex h-11 cursor-pointer items-center gap-2.5 rounded-full border border-gold/25 bg-[#0d0b1c]/70 pl-2 pr-4 text-[.84rem] font-semibold text-ink backdrop-blur-md transition hover:border-gold/45 hover:bg-[#0d0b1c]/85 focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-cyan"
      :aria-expanded="open"
      aria-haspopup="dialog"
      @click="open = !open"
    >
      <template v-if="auth.user.value">
        <span class="relative grid size-7 place-items-center rounded-full bg-violet/30 font-display text-[.9rem] text-ink">
          {{ initial }}
          <span class="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full ring-2 ring-[#0d0b1c]" :class="status.dot" />
        </span>
        <span class="max-w-[16ch] truncate">{{ auth.user.value.email }}</span>
      </template>
      <template v-else>
        <span class="grid size-7 place-items-center rounded-full bg-gold/15 text-gold">
          <Icon name="lucide:cloud" class="size-4" />
        </span>
        {{ t('account.signIn') }}
      </template>
    </button>

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="translate-y-1 opacity-0"
      leave-active-class="transition duration-100 ease-in"
      leave-to-class="translate-y-1 opacity-0"
    >
      <div
        v-if="open"
        role="dialog"
        :aria-label="t('account.title')"
        class="absolute bottom-[calc(100%+10px)] z-30 w-[min(310px,calc(100vw-40px))] rounded-2xl border border-white/10 bg-[#110f22]/96 p-4 text-left shadow-[0_24px_70px_rgba(0,0,0,.55)] backdrop-blur-xl"
        :class="props.align === 'right' ? 'right-0' : 'left-0'"
      >
        <!-- Con sesión -->
        <template v-if="auth.user.value">
          <p class="m-0 text-[.7rem] font-bold uppercase tracking-[.14em] text-gold">{{ t('account.title') }}</p>
          <p class="mb-0 mt-1.5 truncate text-[.92rem] text-ink">{{ auth.user.value.email }}</p>
          <p class="mb-0 mt-2 flex items-center gap-2 text-[.8rem] text-faint">
            <span class="size-2 shrink-0 rounded-full" :class="status.dot" />
            {{ status.label }}
          </p>
          <p class="mb-0 mt-1 text-[.8rem] text-faint">{{ t('account.notes', { count: total }) }}</p>
          <button type="button" :class="[secondaryButton, 'mt-4']" @click="onSignOut">
            <Icon name="lucide:log-out" class="size-4" />
            {{ t('cloud.signOut') }}
          </button>
        </template>

        <!-- Link enviado -->
        <template v-else-if="sentTo">
          <span class="grid size-10 place-items-center rounded-full bg-gold/15 text-gold">
            <Icon name="lucide:mail-check" class="size-5" />
          </span>
          <p class="mb-0 mt-3 font-display text-[1.15rem] text-ink">{{ t('account.checkTitle') }}</p>
          <p class="mb-0 mt-1.5 text-[.84rem] leading-snug text-faint">
            {{ t('account.checkText', { email: sentTo }) }}
          </p>
          <button type="button" :class="[secondaryButton, 'mt-4']" @click="sentTo = null">
            {{ t('account.otherEmail') }}
          </button>
        </template>

        <!-- Sin sesión -->
        <form v-else @submit.prevent="sendLink">
          <p class="m-0 font-display text-[1.15rem] text-ink">{{ t('account.pitchTitle') }}</p>
          <p class="mb-0 mt-1.5 text-[.84rem] leading-snug text-faint">{{ t('cloud.hint') }}</p>
          <label class="mt-4 block text-[.72rem] font-bold uppercase tracking-[.1em] text-dim" for="account-email">
            {{ t('account.email') }}
          </label>
          <input
            id="account-email"
            v-model="email"
            type="email"
            required
            autocomplete="email"
            :placeholder="t('cloud.emailPlaceholder')"
            class="mt-1.5 h-10 w-full rounded-xl border border-white/11 bg-white/4 px-3 text-[.88rem] text-ink outline-none transition focus:border-gold/50"
          >
          <button type="submit" :class="[primaryButton, 'mt-3']" :disabled="sending">
            <Icon :name="sending ? 'lucide:loader-circle' : 'lucide:send'" class="size-4" :class="sending && 'animate-spin'" />
            {{ t('cloud.send') }}
          </button>
        </form>
      </div>
    </Transition>
  </div>
</template>
