<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>Dashboard</h1>
      <p>Welcome, {{ user?.email }}</p>
      <button @click="logout">Logout</button>
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
