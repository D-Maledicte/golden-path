<script setup lang="ts">
/**
 * Perfil de la cuenta. Se abre solo en el primer login ('welcome', se puede
 * saltear) y desde el menú de cuenta ('edit'). Montado una vez en `app.vue`.
 */
const auth = useAuth()
const { account, dialog, saveNickname, skipOnboarding } = useUserProfile()
const { t } = useI18n()
const { show: toast } = useToast()

const el = ref<HTMLDialogElement>()
const value = ref('')
const saving = ref(false)
const error = ref<string | null>(null)

const welcome = computed(() => dialog.value === 'welcome')

watch([dialog, el], () => {
  const node = el.value
  if (!node) return
  if (dialog.value && !node.open) {
    value.value = account.value?.nickname ?? ''
    error.value = null
    node.showModal()
  } else if (!dialog.value && node.open) {
    node.close()
  }
}, { flush: 'post' })

async function submit() {
  if (saving.value) return
  saving.value = true
  const result = await saveNickname(value.value)
  saving.value = false
  if (result) {
    error.value = t(`profile.error.${result}`)
    return
  }
  dialog.value = null
  toast(t('profile.saved'))
}

function close() {
  if (welcome.value) skipOnboarding()
  else dialog.value = null
}

const buttonClass
  = 'inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 text-[.84rem] font-bold transition focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-cyan disabled:cursor-wait disabled:opacity-70'
</script>

<template>
  <dialog
    v-if="auth.user.value"
    ref="el"
    class="reader-dialog m-auto w-[min(440px,calc(100%-28px))] rounded-[22px] border border-gold/22 bg-abyss p-0 text-ink shadow-[0_30px_100px_rgba(0,0,0,.7)]"
    aria-labelledby="profile-title"
    @cancel.prevent="close"
  >
    <form class="p-6 sm:p-7" @submit.prevent="submit">
      <span class="grid size-11 place-items-center rounded-full bg-gold/15 text-gold">
        <Icon :name="welcome ? 'lucide:sparkles' : 'lucide:user-round'" class="size-5" />
      </span>
      <h2 id="profile-title" class="mb-0 mt-4 font-display text-[1.6rem] font-medium leading-tight">
        {{ welcome ? t('profile.welcomeTitle') : t('profile.title') }}
      </h2>
      <p class="mb-0 mt-2 text-[.88rem] leading-relaxed text-faint">
        {{ welcome ? t('profile.welcomeLead') : t('profile.lead') }}
      </p>

      <label for="profile-nickname" class="mt-6 block text-[.72rem] font-bold uppercase tracking-[.1em] text-dim">
        {{ t('profile.nickname') }}
      </label>
      <input
        id="profile-nickname"
        v-model="value"
        type="text"
        autocomplete="nickname"
        maxlength="24"
        :placeholder="t('profile.nicknamePlaceholder')"
        :aria-invalid="Boolean(error)"
        aria-describedby="profile-nickname-hint"
        class="mt-1.5 h-11 w-full rounded-xl border bg-white/4 px-3.5 text-[.95rem] text-ink outline-none transition focus:border-gold/50"
        :class="error ? 'border-[#e88]/60' : 'border-white/11'"
        @input="error = null"
      >
      <p id="profile-nickname-hint" class="mb-0 mt-1.5 text-[.76rem]" :class="error ? 'text-[#e88]' : 'text-dim'">
        {{ error ?? t('profile.nicknameHint') }}
      </p>

      <div class="mt-5 rounded-xl border border-white/8 bg-white/2 px-3.5 py-3">
        <p class="m-0 text-[.72rem] font-bold uppercase tracking-[.1em] text-dim">{{ t('profile.email') }}</p>
        <p class="mb-0 mt-1 truncate text-[.9rem] text-ink">{{ auth.user.value.email }}</p>
        <p class="mb-0 mt-1 text-[.76rem] leading-snug text-dim">{{ t('profile.emailHint') }}</p>
      </div>

      <div class="mt-6 flex flex-wrap justify-end gap-2">
        <button type="button" :class="[buttonClass, 'border border-white/11 bg-white/4 text-ink hover:bg-white/7']" @click="close">
          {{ welcome ? t('profile.skip') : t('notes.cancel') }}
        </button>
        <button type="submit" :class="[buttonClass, 'bg-gold text-[#21180b] hover:brightness-110']" :disabled="saving">
          {{ t('notes.save') }}
        </button>
      </div>
    </form>
  </dialog>
</template>
