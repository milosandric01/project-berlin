<template>
  <div class="flex min-h-[100dvh] w-full flex-col antialiased">
    <!-- ============ UPPER HALF — the problem (dark) ============ -->
    <section class="relative flex flex-[0.9] flex-col items-center justify-end overflow-hidden bg-[#0a0a0a] px-6 pb-12 pt-16 text-white sm:pb-14">
      <div class="relative z-10 mx-auto max-w-2xl text-center">
        <h1 class="text-[20px] font-semibold leading-[1.3] tracking-tight text-white sm:text-[28px]">
          <span class="block">Imagine working at the same company for 5&nbsp;years…</span>
          <span class="block text-white/90">and then getting laid off.</span>
        </h1>

        <div class="mt-8 flex flex-wrap justify-center gap-2 sm:mt-10 sm:gap-2.5">
          <span
            v-for="(t, i) in thoughts"
            :key="i"
            class="rounded-full border border-white/15 bg-white/[0.08] px-3.5 py-1.5 text-[13px] font-normal leading-snug text-white/75 sm:text-[14px]"
          >
            {{ t }}
          </span>
        </div>
      </div>
    </section>

    <!-- ============ LOWER HALF — the solution (light, dashboard style) ============ -->
    <section class="flex flex-[1.1] flex-col items-center justify-start bg-sand-50 px-6 pb-16 pt-12 text-gray-900 sm:pt-14">
      <div class="mx-auto w-full max-w-md text-center">
        <div class="flex items-center justify-center gap-2.5">
          <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f97316] shadow-sm sm:h-11 sm:w-11">
            <svg viewBox="0 0 24 24" fill="none" class="h-6 w-6 sm:h-[26px] sm:w-[26px]" aria-hidden="true">
              <path
                d="M4 15c2.5 0 3.5-6 6-6s3.5 6 6 6 2.6-2.4 4-3"
                stroke="white"
                stroke-width="2.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span class="text-[28px] font-extrabold tracking-tight sm:text-[34px]">Flowiz</span>
        </div>

        <p class="mx-auto mt-4 max-w-md text-base font-medium leading-relaxed text-gray-700 sm:text-lg">
          Your daily AI practice assistent that keeps you warmed up for any technical
          interview, when it matters the most.
        </p>

        <div class="mt-8">
          <form
            v-if="!joined"
            class="flex flex-col gap-2.5 sm:flex-row"
            @submit.prevent="submit"
          >
            <input
              v-model="email"
              type="email"
              required
              placeholder="your@email.com"
              class="h-11 flex-1 rounded-lg border border-gray-200 bg-white px-4 text-[14px] text-gray-900 placeholder:text-gray-400 focus:border-[#f97316] focus:outline-none focus:ring-2 focus:ring-[#f97316]/25"
            />
            <button
              type="submit"
              :disabled="loading"
              class="h-11 w-full rounded-lg bg-[#f97316] px-5 text-[14px] font-medium text-white transition-colors duration-[120ms] hover:bg-[#ea580c] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {{ loading ? 'Joining…' : 'Join the waitlist' }}
            </button>
          </form>

          <p v-else class="mt-5 flex items-center justify-center gap-2 rounded-lg border border-green-500/30 bg-green-100 px-4 py-3 text-[14px] font-medium text-green-600">
            <Icon name="lucide:check-circle-2" class="h-[18px] w-[18px]" />
            {{ alreadyJoined ? "You're already on the list." : "You're on the list." }}
          </p>

          <p v-if="error" class="mt-3 text-[13px] text-red-600">{{ error }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const thoughts = [
  'I haven\'t interviewed in 5 years.',
  'Where do I even start?',
  'I\'ve been on the same stack for years.',
  'I\'ll need weeks to get back up to speed.',
  'I don\'t even know what they ask anymore.',
]

const email = ref('')
const loading = ref(false)
const joined = ref(false)
const alreadyJoined = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  loading.value = true
  try {
    const res = await $fetch<{ ok: boolean, alreadyJoined: boolean }>('/api/waitlist/subscribe', {
      method: 'POST',
      body: { email: email.value },
    })
    alreadyJoined.value = res.alreadyJoined
    joined.value = true
  } catch (e: any) {
    error.value = e.data?.message || 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
