<template>
  <div class="min-h-screen flex items-center justify-center bg-sand-50">
    <div class="bg-white p-8 rounded-lg shadow-sm border border-gray-200 w-full max-w-sm">
      <h1 class="text-2xl font-semibold text-gray-900 mb-6">Register</h1>
      <form class="flex flex-col gap-3" @submit.prevent="register">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          required
          class="px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          required
          class="px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
        />
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          required
          class="px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
        />
        <p v-if="error" class="text-red-600 text-xs">{{ error }}</p>
        <button
          type="submit"
          :disabled="loading"
          class="mt-2 py-2.5 bg-gray-900 text-white rounded-md text-sm font-medium cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors duration-[120ms]"
        >
          {{ loading ? 'Creating account...' : 'Register' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'guest' })

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)

async function register() {
  error.value = ''
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }
  loading.value = true
  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    })
    navigateTo('/')
  } catch (e: any) {
    error.value = e.data?.message || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>
