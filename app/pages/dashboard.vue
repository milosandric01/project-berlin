<template>
  <!-- App shell: sidebar + main -->
  <div class="grid h-screen overflow-hidden bg-sand-50 text-gray-900 text-sm" style="grid-template-columns: 248px 1fr">

    <!-- SIDEBAR -->
    <aside class="flex flex-col h-full px-3 py-4 gap-0.5 bg-sand-50">

      <!-- Brand -->
      <div class="flex items-center gap-1 px-2 pb-3.5 pt-1.5">
        <img src="/logo.svg" alt="flowiz" width="28" height="28" style="image-rendering: pixelated;" />
        <span class="text-[20px] font-semibold tracking-tight"><b>Flowiz</b></span>
      </div>

      <!-- Nav -->
      <div class="flex flex-col gap-0.5">
        <button
          v-for="n in navItems"
          :key="n.id"
          :class="[
            'flex items-center gap-2.5 whitespace-nowrap h-[32px] px-2.5 rounded-lg text-sm cursor-pointer border-none text-left transition-[background,color] duration-[120ms]',
            n.id === activeNav
              ? 'font-medium text-gray-900 bg-sand-400'
              : 'font-[450] text-gray-900 bg-transparent hover:bg-sand-200',
          ]"
          @click="activeNav = n.id"
        >
          <Icon :name="n.icon" :size="16" class="text-gray-900" />
          {{ n.label }}
          <span v-if="n.id === 'streak' && streak > 0" class="ml-auto font-mono text-[11px] text-gray-500">{{ streak }}</span>
        </button>
      </div>

      <div class="flex-1" />

      <!-- User card -->
      <div class="relative">
        <!-- User menu -->
        <div v-if="userMenuOpen" class="absolute bottom-[calc(100%+4px)] left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-md p-1 z-[100]">
          <button class="flex items-center gap-2 w-full px-2.5 py-[7px] rounded-md text-[13.5px] text-gray-900 bg-transparent border-none cursor-pointer hover:bg-[#F5F5F5] text-left" @click="logout">
            <Icon name="lucide:log-out" :size="14" class="text-gray-600" />
            Sign out
          </button>
        </div>

        <button
          class="flex items-center justify-between w-full px-3.5 py-3 rounded-xl border border-sand-400 cursor-pointer font-[inherit] text-left transition-colors duration-[120ms] mb-1 bg-sand-100 hover:bg-sand-200"
          @click="userMenuOpen = !userMenuOpen"
        >
          <div class="flex items-center gap-2.5 flex-1 min-w-0">
            <div class="min-w-0">
              <div class="text-sm font-semibold text-gray-900 leading-snug truncate">{{ userDisplayName }}</div>
              <div class="text-[11px] text-gray-500 mt-px">{{ currentLevel.name }}</div>
            </div>
          </div>
          <LevelBadge :rank="currentLevel.rank" :size="32" class="flex-none" />
        </button>
      </div>
    </aside>

    <!-- Click-away overlay for user menu -->
    <div v-if="userMenuOpen" class="fixed inset-0 z-[99]" @click="userMenuOpen = false" />

    <!-- MAIN -->
    <main class="h-full overflow-y-auto bg-sand-50 flex items-start justify-center">
      <div class="w-full max-w-[680px] px-12 pt-8 pb-9 mx-auto">

        <StreakPage v-if="activeNav === 'streak'" />
        <TopicHistory v-else-if="activeNav === 'history'" />
        <TopicToday v-else-if="todayData" :data="todayData" @refresh="refreshToday" />

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { getLevelForStreak } from '~/utils/levels'

definePageMeta({ layout: false, middleware: 'auth' })

const { data: authData } = await useFetch<{ user: { email: string; firstName: string | null; lastName: string | null } | null }>('/api/auth/user')
const user = computed(() => authData.value?.user)

const userDisplayName = computed(() => {
  if (user.value?.firstName) return user.value.firstName
  const email = user.value?.email ?? ''
  return email.split('@')[0] || email
})

const userInitials = computed(() => userDisplayName.value.slice(0, 2).toUpperCase())

const userMenuOpen = ref(false)

interface TodayQuestion { prompt: string; options: string[]; answer?: number; explanation?: string }
interface TodayTopic { slug: string; title: string; subtitle: string; category: string; readMinutes: number; articleHtml: string; questions: TodayQuestion[] }
interface TodayProgress { articleRead: boolean; questionsCorrect: number; questionsTotal: number; completedAt: string | null }
interface TodayData {
  state: 'available' | 'in_progress' | 'done_today' | 'queue_empty'
  streak: number
  longestStreak: number
  position: number
  totalTopics: number
  reveal: boolean
  nextUnlocksAt: string | null
  topic: TodayTopic | null
  progress: TodayProgress | null
}

const { data: todayData, refresh: refreshToday } = await useFetch<TodayData>('/api/topics/today')
const streak = computed(() => todayData.value?.streak ?? 0)
const currentLevel = computed(() => getLevelForStreak(streak.value))

const navItems = [
  { id: 'today', label: 'Today\'s practice', icon: 'lucide:sun' },
  { id: 'history', label: 'Timeline', icon: 'lucide:git-commit-vertical' },
  { id: 'streak', label: 'Streak', icon: 'lucide:flame' },
]
const activeNav = ref('today')

async function logout() {
  userMenuOpen.value = false
  await $fetch('/api/auth/logout', { method: 'POST' })
  await navigateTo('/login')
}
</script>
