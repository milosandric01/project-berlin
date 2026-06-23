<template>
  <div class="min-h-screen bg-sand-50 text-gray-900 font-sans">

    <!-- Nav -->
    <nav class="max-w-3xl mx-auto flex items-center px-6 py-6">
      <div class="flex items-center gap-1">
        <img src="/logo.svg" alt="flowiz" width="28" height="28" style="image-rendering: pixelated;" />
        <span class="text-xl font-semibold tracking-tight">Flowiz</span>
      </div>
    </nav>

    <!-- Hero -->
    <section class="max-w-3xl mx-auto px-6 pt-16 pb-20 text-center">
      <h1 class="text-[clamp(28px,4vw,44px)] font-bold leading-[1.1] tracking-tight text-gray-900 mb-5 max-w-[600px] mx-auto">
        Daily practice for new era software engineers
      </h1>

      <p class="text-[15px] text-gray-500 leading-relaxed max-w-[480px] mx-auto mb-10">
        One focused topic per day. Read, answer, build your streak. Flowiz helps engineers grow consistently — without the noise.
      </p>

      <!-- Waitlist -->
      <div id="waitlist" class="scroll-mt-20">
        <form v-if="!joined" class="flex gap-2.5 justify-center flex-wrap max-w-[440px] mx-auto" @submit.prevent="submit">
          <input
            v-model="email"
            type="email"
            placeholder="you@work.com"
            required
            class="flex-1 min-w-[220px] h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl outline-none transition-all placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
          />
          <button
            type="submit"
            :disabled="loading"
            class="h-11 px-5 text-sm font-semibold text-white bg-gray-900 rounded-xl border-none cursor-pointer transition-all hover:bg-gray-800 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {{ loading ? 'Joining…' : 'Join the waitlist' }}
          </button>
        </form>

        <div v-else class="inline-flex items-center gap-2.5 px-5 py-3 bg-white border border-gray-200 rounded-xl">
          <span class="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-none">
            <Icon name="lucide:check" :size="14" class="text-emerald-600" />
          </span>
          <span class="text-sm font-medium text-gray-900">{{ alreadyJoined ? "You're already on the list." : "You're on the list. We'll reach out before launch." }}</span>
        </div>

        <p v-if="error" class="mt-2.5 text-xs text-red-600">{{ error }}</p>
        <p class="text-xs text-gray-400 mt-4">No spam. Just a heads-up when your daily practice is ready.</p>
      </div>
    </section>

    <!-- How it works -->
    <section class="max-w-3xl mx-auto px-6 pb-24">
      <div class="grid sm:grid-cols-3 gap-4">
        <div class="bg-white rounded-2xl border border-gray-100 px-5 py-5">
          <div class="w-8 h-8 rounded-lg bg-sand-200 flex items-center justify-center mb-3">
            <Icon name="lucide:book-open" :size="16" class="text-gray-600" />
          </div>
          <h3 class="text-[14px] font-semibold text-gray-900 mb-1">Read</h3>
          <p class="text-[13px] text-gray-500 leading-relaxed">A short, focused article on one engineering concept. Takes 2–3 minutes.</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 px-5 py-5">
          <div class="w-8 h-8 rounded-lg bg-sand-200 flex items-center justify-center mb-3">
            <Icon name="lucide:check-circle" :size="16" class="text-gray-600" />
          </div>
          <h3 class="text-[14px] font-semibold text-gray-900 mb-1">Answer</h3>
          <p class="text-[13px] text-gray-500 leading-relaxed">Test your understanding with targeted questions. Get immediate feedback.</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 px-5 py-5">
          <div class="w-8 h-8 rounded-lg bg-sand-200 flex items-center justify-center mb-3">
            <Icon name="lucide:flame" :size="16" class="text-gray-600" />
          </div>
          <h3 class="text-[14px] font-semibold text-gray-900 mb-1">Streak</h3>
          <p class="text-[13px] text-gray-500 leading-relaxed">Build consistency day by day. Small effort compounds into real depth.</p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="max-w-3xl mx-auto px-6 pb-8 text-center">
      <p class="text-xs text-gray-400">&copy; {{ new Date().getFullYear() }} Flowiz. Built for engineers who want to keep growing.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Flowiz | Daily practice for new era software engineers',
  description: 'One focused topic per day. Read, answer, build your streak. Flowiz helps engineers grow consistently without the noise.',
  ogTitle: 'Flowiz | Daily practice for new era software engineers',
  ogDescription: 'One focused topic per day. Read, answer, build your streak. Flowiz helps engineers grow consistently without the noise.',
  ogUrl: 'https://flowiz.dev',
  ogType: 'website',
  ogSiteName: 'Flowiz',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Flowiz | Daily practice for new era software engineers',
  twitterDescription: 'One focused topic per day. Read, answer, build your streak. Flowiz helps engineers grow consistently without the noise.',
})

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
