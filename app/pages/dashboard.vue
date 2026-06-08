<template>
  <!-- App shell: sidebar + main -->
  <div class="grid h-screen overflow-hidden bg-sand-50 text-gray-900 text-sm" style="grid-template-columns: 248px 1fr">

    <!-- SIDEBAR -->
    <aside class="flex flex-col h-full px-3 py-4 gap-0.5 bg-sand-50">

      <!-- Brand -->
      <div class="flex items-center gap-2.5 px-2 pb-3.5 pt-1.5">
        <!-- <img src="/honeloop-mark.svg" alt="" class="w-[26px] h-[26px]" /> -->
        <span class="text-[20px] font-semibold tracking-tight"><b>flowiz.</b></span>
      </div>

      <!-- Search -->
      <!-- <div class="flex items-center gap-2 h-9 px-2.5 mb-2 rounded-lg cursor-text text-gray-500 bg-sand-200">
        <Icon name="lucide:search" :size="15" class="text-gray-400" />
        <span class="flex-1 text-[13px]">Search questions</span>
        <kbd class="font-mono text-[11px] text-gray-400 bg-sand-300 rounded px-1.5 py-px">/</kbd>
      </div> -->

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
          @click="activeNav = n.id; selectedSessionId = null"
        >
          <Icon :name="n.icon" :size="16" class="text-gray-600" />
          {{ n.label }}
          <span v-if="n.count != null" class="ml-auto font-mono text-[11px] text-gray-400">{{ n.count }}</span>
        </button>

        <!-- Recent sessions — sub-items under Progress -->
        <template v-if="recentSessions.length">
          <div class="font-mono text-[10px] tracking-[0.06em] uppercase text-gray-400 px-2.5 pt-3 pb-1">Recent Flows</div>
          <button
            v-for="s in recentSessions"
            :key="s.id"
            :class="[
              'flex items-center gap-2 w-full px-2.5 py-[5px] rounded-lg text-left border-none cursor-pointer transition-colors duration-[120ms]',
              selectedSessionId === s.id
                ? 'bg-sand-400 font-medium'
                : 'bg-transparent hover:bg-sand-200',
            ]"
            @click="resumeSession(s)"
          >
            <span
              class="w-1.5 h-1.5 rounded-full flex-none"
              :class="s.completedAt ? 'bg-gray-300' : 'bg-gray-500'"
            />
            <span class="flex-1 text-sm font-[450] text-gray-900 truncate">{{ s.flowName }}</span>
            <span class="ml-auto font-mono text-[11px] text-gray-400 flex-none">{{ s.questionsAnswered }}/{{ s.goalQuestions }}</span>
          </button>
        </template>
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
          <div class="flex-1 min-w-0">
            <div class="text-sm font-semibold text-gray-900 leading-snug">{{ user?.email }}</div>
            <div class="text-xs text-gray-500 mt-px">0 day streak</div>
          </div>
          <div class="flex-none w-9 h-9 rounded-full flex items-center justify-center bg-sand-300">
            <HlAvatar :initials="userInitials" :size="28" />
          </div>
        </button>
      </div>
    </aside>

    <!-- Click-away overlay for user menu -->
    <div v-if="userMenuOpen" class="fixed inset-0 z-[99]" @click="userMenuOpen = false" />

    <!-- MAIN -->
    <main class="h-full overflow-y-auto bg-sand-50" :class="(activeNav === 'skills' || activeNav === 'flows') && !activeFlow ? 'flex items-start' : 'flex items-center justify-center'">
      <div class="w-full max-w-[680px] px-12 pt-8 pb-9 mx-auto">

        <!-- Skills catalogue -->
        <template v-if="activeNav === 'skills' && !activeFlow">
          <SkillsCatalogue />
        </template>

        <!-- Flows management -->
        <template v-else-if="activeNav === 'flows' && !activeFlow">
          <FlowsPage />
        </template>

        <!-- Active flow session -->
        <template v-else-if="activeFlow">
          <FlowSession :flow="activeFlow" :initial-question="activeInitialQuestion" @exit="onFlowExit" @finish="onFlowFinish" @question-answered="onQuestionAnswered" />
        </template>

        <!-- Today: active flow card (PRD Practice page) -->
        <template v-else>
          <PracticeCard
            @start="onStartSession"
            @go-to-flows="activeNav = 'flows'"
          />
        </template>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'auth' })

const { data: authData } = await useFetch<{ user: { email: string } | null }>('/api/auth/user')
const user = computed(() => authData.value?.user)

const userDisplayName = computed(() => {
  const email = user.value?.email ?? ''
  return email.split('@')[0] || email
})

const userInitials = computed(() => {
  return userDisplayName.value.slice(0, 2).toUpperCase()
})

const userMenuOpen = ref(false)

const todayLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

const QUOTES = [
  'Interviews reward the prepared mind.',
  'One question a day keeps the panic away.',
  'Clarity comes from doing, not just reading.',
  'Every concept you struggle with today is one less surprise in the room.',
  'The best time to review was yesterday. The second best time is now.',
  'Hard questions are just easy questions you haven\'t seen enough times.',
  'Slow is smooth, smooth is fast.',
  'You don\'t rise to the level of the challenge — you fall to the level of your preparation.',
  'Consistency beats intensity every single week.',
  'A short session today still counts.',
  'The gap between you and the job is just reps.',
  'Understanding why is worth ten times memorizing what.',
  'Build the habit, the skill follows.',
  'Even five minutes sharpens the edge.',
  'Systems thinking is a superpower. Practice it daily.',
  'The candidate who can explain trade-offs wins.',
  'Confidence is just preparation with good posture.',
  'Own your weak spots before an interviewer finds them.',
  'Depth over breadth, every time.',
  'Show your reasoning — that\'s what they\'re really hiring.',
  'Problems you\'ve seen before are puzzles. Problems you haven\'t are adventures.',
  'The best engineers ask better questions, not just give faster answers.',
  'Design for the next engineer, not just the next deadline.',
  'Mastery is just novelty that became familiar.',
  'Your streak is proof that small bets compound.',
  'Read the question twice. Answer it once. Correctly.',
  'Thinking out loud is a skill. Practice it here.',
  'The nervous energy in an interview is just excitement in disguise.',
  'Every hard problem has a simpler version. Start there.',
  'Today\'s question is tomorrow\'s muscle memory.',
]

const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000)
const quoteOffset = ref(0)
const dailyQuote = computed(() => QUOTES[(dayOfYear + quoteOffset.value) % QUOTES.length])

async function logout() {
  userMenuOpen.value = false
  await $fetch('/api/auth/logout', { method: 'POST' })
  await navigateTo('/login')
}

const navItems = [
  { id: 'today',    label: 'Daily Practice', icon: 'lucide:sun',         count: null },
  { id: 'flows',    label: 'Flows',    icon: 'lucide:git-branch',  count: null },
  { id: 'skills',   label: 'Skills',   icon: 'lucide:layers',      count: null },
  { id: 'progress', label: 'Progress', icon: 'lucide:trending-up', count: null },
]
const activeNav = ref('today')

import type { EssentialFlow } from '~/components/FlowPicker.vue'

const activeFlow = ref<EssentialFlow | null>(null)
const activeSessionId = ref<number | null>(null)
const activeInitialQuestion = ref(0)
const selectedSessionId = ref<number | null>(null)
const activeDailyGoal = ref(5)
const dailyGoalReached = ref(false)

// Sessions
interface RecentSession {
  id: number
  flowId: number | null
  flowName: string
  predefinedKey: string | null
  questionsAnswered: number
  goalQuestions: number
  difficulty: string
  startedAt: string
  lastActivityAt: string
  completedAt: string | null
}

const { data: sessionsData, refresh: refreshSessions } = await useFetch<RecentSession[]>('/api/sessions/recent')
const recentSessions = computed(() => sessionsData.value ?? [])

async function onStartSession({ flow, goal, difficulty }: {
  flow: { id?: number; dbId?: number | null; name: string; predefinedKey?: string | null; key?: string }
  goal: number
  difficulty: string
}) {
  const flowDbId = ('id' in flow && typeof flow.id === 'number') ? flow.id : (flow.dbId ?? null)
  const predefinedKey = flow.predefinedKey ?? flow.key ?? null
  const flowKey = predefinedKey ?? 'system-design'

  activeDailyGoal.value = goal
  dailyGoalReached.value = false

  // Create session record
  const session = await $fetch<RecentSession>('/api/sessions', {
    method: 'POST',
    body: { flowId: flowDbId, flowName: flow.name, goalQuestions: goal, difficulty },
  })
  activeSessionId.value = session.id

  // Map to EssentialFlow shape FlowSession expects
  activeFlow.value = {
    id: flowKey,
    path: '',
    title: flow.name,
    description: '',
    duration: '',
    difficulty,
    promptTypes: [],
  }
}

async function onQuestionAnswered(count: number) {
  await $fetch('/api/daily', { method: 'PATCH', body: { questionsAnswered: count } })
  if (!dailyGoalReached.value && count >= activeDailyGoal.value) {
    dailyGoalReached.value = true
    await $fetch('/api/daily', { method: 'PATCH', body: { completedAt: new Date().toISOString() } })
  }
}

async function onFlowExit(questionsAnswered: number) {
  if (activeSessionId.value !== null) {
    await $fetch(`/api/sessions/${activeSessionId.value}`, {
      method: 'PATCH',
      body: { questionsAnswered },
    })
    await refreshSessions()
  }
  activeFlow.value = null
  activeSessionId.value = null
  selectedSessionId.value = null
  dailyGoalReached.value = false
  if (!activeNav.value) activeNav.value = 'today'
}

async function onFlowFinish() {
  if (activeSessionId.value !== null) {
    const session = recentSessions.value.find(s => s.id === activeSessionId.value)
    await $fetch(`/api/sessions/${activeSessionId.value}`, {
      method: 'PATCH',
      body: { questionsAnswered: session?.goalQuestions ?? 0, completed: true },
    })
    await refreshSessions()
  }
  if (!dailyGoalReached.value) {
    await $fetch('/api/daily', { method: 'PATCH', body: { completedAt: new Date().toISOString() } })
  }
  activeFlow.value = null
  activeSessionId.value = null
  selectedSessionId.value = null
  dailyGoalReached.value = false
  if (!activeNav.value) activeNav.value = 'today'
}

function resumeSession(s: RecentSession) {
  const flowKey = s.predefinedKey ?? 'system-design'
  activeInitialQuestion.value = s.completedAt ? 0 : s.questionsAnswered
  activeSessionId.value = s.id
  selectedSessionId.value = s.id
  activeFlow.value = {
    id: flowKey,
    path: '',
    title: s.flowName,
    description: '',
    duration: '',
    difficulty: s.difficulty,
    promptTypes: [],
  }
  activeNav.value = ''
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return days === 1 ? 'yesterday' : `${days}d ago`
}

</script>
