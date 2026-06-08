<template>
  <div class="min-h-screen flex items-center justify-center bg-sand-50">
    <div class="bg-white p-8 rounded-lg shadow-sm border border-gray-200 w-full max-w-sm">
      <h1 class="text-2xl font-semibold text-gray-900 mb-4">Dashboard</h1>
      <p class="text-sm text-gray-600 mb-4">Welcome, {{ user?.email }}</p>
      <button
        class="py-2.5 px-4 bg-gray-900 text-white rounded-md text-sm font-medium cursor-pointer hover:bg-gray-800 transition-colors duration-[120ms]"
        @click="logout"
      >
        Logout
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { data: session } = await useFetch('/api/auth/user')
const user = computed(() => session.value?.user)

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  navigateTo('/login')
}
</script>
