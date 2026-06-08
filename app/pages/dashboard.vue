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
      <div class="flex flex-col gap-1">
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
          <Icon :name="n.icon" :size="16" class="text-gray-600" />
          {{ n.label }}
          <span v-if="n.count != null" class="ml-auto font-mono text-[11px] text-gray-400">{{ n.count }}</span>
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
          <div class="flex-1 min-w-0">
            <div class="text-sm font-semibold text-gray-900 leading-snug">{{ user?.email }}</div>
            <div class="text-xs text-gray-500 mt-px">{{ STREAK.current }} day streak</div>
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
    <main class="h-full overflow-y-auto bg-sand-50" :class="activeNav === 'skills' && !activeFlow ? 'flex items-start' : 'flex items-center justify-center'">
      <div class="w-full max-w-[680px] px-12 pt-8 pb-9 mx-auto">

        <!-- Skills catalogue -->
        <template v-if="activeNav === 'skills' && !activeFlow">
          <SkillsCatalogue />
        </template>

        <!-- Active flow session -->
        <template v-else-if="activeFlow">
          <FlowSession :flow="activeFlow" @exit="onFlowExit" @finish="onFlowFinish" />
        </template>

        <!-- Pick a new flow -->
        <template v-else-if="pickingNewFlow">
          <div class="relative isolate">
            <div class="absolute -inset-8 rounded-3xl blur-3xl -z-10 animate-glow" style="background: radial-gradient(circle, rgba(255, 107, 53, 0.35) 0%, rgba(255, 107, 53, 0.15) 50%, transparent 80%)" />
            <FlowPicker @start="onPickFlow" />
          </div>
        </template>

        <!-- Cold start: no flows started yet -->
        <template v-else-if="!hasStartedFlows">
          <div class="relative isolate">
            <div class="absolute -inset-8 rounded-3xl blur-3xl -z-10 animate-glow" style="background: radial-gradient(circle, rgba(255, 107, 53, 0.35) 0%, rgba(255, 107, 53, 0.15) 50%, transparent 80%)" />
            <FlowPicker @start="onPickFlow" />
          </div>
        </template>

        <!-- Today: recent flows -->
        <template v-else>
          <div class="w-full font-sans">
            <div class="mb-5">
              <div class="font-mono text-[11px] tracking-[0.06em] uppercase text-gray-400 mb-1">Today</div>
              <h2 class="text-[22px] font-medium tracking-[-0.01em] text-gray-900">Recent flows</h2>
            </div>

            <div class="flex flex-col gap-2">
              <div
                v-for="recent in recentFlows"
                :key="recent.flow.id"
                class="bg-white rounded-2xl px-5 py-4 flex items-center gap-4 shadow-xs"
              >
                <div class="flex-1 min-w-0">
                  <div class="font-mono text-[11px] tracking-[0.06em] uppercase text-gray-400 mb-0.5">{{ recent.flow.path }}</div>
                  <div class="text-[15px] font-medium text-gray-900 leading-snug truncate">{{ recent.flow.title }}</div>
                  <div class="flex items-center gap-2 mt-1.5">
                    <div class="flex gap-px">
                      <div
                        v-for="i in 12"
                        :key="i"
                        class="h-1 w-3 rounded-full"
                        :class="i <= recent.progress ? 'bg-gray-800' : 'bg-gray-200'"
                      />
                    </div>
                    <span class="text-[12px] text-gray-400 tabular-nums">{{ recent.progress }}/12</span>
                  </div>
                </div>
                <HlButton
                  variant="secondary"
                  size="sm"
                  @click="resumeFlow(recent)"
                >
                  {{ recent.progress === 0 ? 'Start' : recent.progress === 12 ? 'Redo' : 'Continue' }}
                  <Icon name="lucide:arrow-right" :size="13" />
                </HlButton>
              </div>
            </div>

            <button
              class="mt-4 inline-flex items-center gap-1.5 text-[13px] text-gray-400 bg-transparent border-none cursor-pointer font-[inherit] p-0 hover:text-gray-700 transition-colors duration-[120ms]"
              @click="pickingNewFlow = true"
            >
              <Icon name="lucide:plus" :size="13" />
              Pick a new flow
            </button>
          </div>
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
  { id: 'today',    label: 'Today',    icon: 'lucide:sun',         count: null },
  { id: 'practice', label: 'Practice', icon: 'lucide:rotate-ccw',  count: null },
  { id: 'skills',   label: 'Skills',   icon: 'lucide:layers',      count: null },
  { id: 'progress', label: 'Progress', icon: 'lucide:trending-up', count: null },
]
const activeNav = ref('today')

import type { EssentialFlow } from '~/components/FlowPicker.vue'

interface RecentFlow {
  flow: EssentialFlow
  progress: number  // questions answered (0–12)
  startedAt: Date
}

const recentFlows = ref<RecentFlow[]>([])
const activeFlow = ref<EssentialFlow | null>(null)
const pickingNewFlow = ref(false)

const hasStartedFlows = computed(() => recentFlows.value.length > 0)

function onPickFlow(flow: EssentialFlow) {
  pickingNewFlow.value = false
  activeFlow.value = flow
  if (!recentFlows.value.find(r => r.flow.id === flow.id)) {
    recentFlows.value.unshift({ flow, progress: 0, startedAt: new Date() })
  }
}

function onFlowExit(questionIndex: number) {
  if (activeFlow.value) {
    const recent = recentFlows.value.find(r => r.flow.id === activeFlow.value!.id)
    if (recent) recent.progress = questionIndex
  }
  activeFlow.value = null
}

function onFlowFinish() {
  if (activeFlow.value) {
    const recent = recentFlows.value.find(r => r.flow.id === activeFlow.value!.id)
    if (recent) recent.progress = 12
  }
  activeFlow.value = null
}

function resumeFlow(recent: RecentFlow) {
  activeFlow.value = recent.flow
}

const STREAK = { current: 47, longest: 63, totalSolved: 612, week: [1, 1, 1, 1, 2, 0, 0] }
const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']


const HEAT = Array.from({ length: 17 }, () =>
  Array.from({ length: 7 }, () => Math.random() < 0.18 ? 0 : 1 + Math.floor(Math.random() * 3))
)
</script>
