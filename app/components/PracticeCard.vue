<template>
  <div class="w-full font-sans">

    <!-- Loading skeleton -->
    <div v-if="pending || dailyPending" class="bg-white rounded-3xl shadow-sm px-[26px] pt-6 pb-5 animate-pulse">
      <div class="h-3 bg-gray-100 rounded w-1/3 mb-4" />
      <div class="h-7 bg-gray-100 rounded w-2/3 mb-3" />
      <div class="h-3 bg-gray-100 rounded w-1/2" />
    </div>

    <!-- Cold start: no owned flows — show predefined carousel -->
    <template v-else-if="isColdStart">
      <div class="relative isolate">
        <div class="absolute -inset-8 rounded-3xl blur-3xl -z-10 animate-glow" style="background: radial-gradient(circle, rgba(255, 107, 53, 0.35) 0%, rgba(255, 107, 53, 0.15) 50%, transparent 80%)" />
        <FlowPicker @start="onColdStartPick" />
      </div>
    </template>

    <!-- State 1: pick a flow (+ mood form) -->
    <div v-else-if="currentState === 'pick'" class="relative isolate">
      <div class="absolute -inset-8 rounded-3xl blur-3xl -z-10 animate-glow" style="background: radial-gradient(circle, rgba(255, 107, 53, 0.35) 0%, rgba(255, 107, 53, 0.15) 50%, transparent 80%)" />
      <div class="bg-white border-none rounded-3xl shadow-sm px-[26px] pt-6 pb-5">

      <!-- ── Mood form ───────────────────────────────────────────────────── -->
      <template v-if="moodMode">

        <!-- Header with back -->
        <div class="flex items-center justify-between mb-5">
          <button
            class="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.06em] uppercase text-gray-400 hover:text-gray-700 transition-colors bg-transparent border-none cursor-pointer p-0 font-[inherit]"
            @click="moodMode = false"
          >
            <Icon name="lucide:arrow-left" :size="12" />
            Back
          </button>
          <span class="font-mono text-[11px] tracking-[0.06em] uppercase text-gray-400">{{ dateLabel }}</span>
        </div>

        <h2 class="font-sans text-[22px] font-medium leading-[1.3] tracking-[-0.015em] text-gray-900 mb-6">
          What are you up for today?
        </h2>

        <!-- Time -->
        <div class="mb-5">
          <div class="text-xs text-gray-500 mb-2.5">How much time do you have?</div>
          <div class="inline-flex items-center gap-0 p-1 border border-gray-200 rounded-full bg-gray-50">
            <button
              v-for="t in timeOptions"
              :key="t.id"
              :class="[
                'inline-flex items-center justify-center h-[30px] px-4 rounded-full border-none cursor-pointer font-[inherit] transition-all duration-[150ms]',
                moodTime === t.id
                  ? 'bg-white text-gray-900 font-medium shadow-sm'
                  : 'bg-transparent text-gray-500 hover:text-gray-700',
              ]"
              @click="moodTime = t.id as typeof moodTime"
            >
              <span class="text-[13px]">{{ t.label }}</span>
              <span class="ml-1.5 font-mono text-[10px] opacity-55">{{ t.sublabel }}</span>
            </button>
          </div>
        </div>

        <!-- Difficulty -->
        <div class="mb-5">
          <div class="text-xs text-gray-500 mb-2.5">How hard do you want to go?</div>
          <div class="inline-flex items-center gap-0 p-1 border border-gray-200 rounded-full bg-gray-50">
            <button
              v-for="d in difficultyOptions"
              :key="d.id"
              :class="[
                'inline-flex items-center justify-center h-[30px] px-4 rounded-full text-[13px] font-[450] border-none cursor-pointer font-[inherit] transition-all duration-[150ms]',
                moodDiff === d.id
                  ? 'bg-white text-gray-900 font-medium shadow-sm'
                  : 'bg-transparent text-gray-500 hover:text-gray-700',
              ]"
              @click="moodDiff = d.id as typeof moodDiff"
            >{{ d.label }}</button>
          </div>
        </div>

        <!-- Focus -->
        <div class="mb-6">
          <div class="text-xs text-gray-500 mb-2.5">What do you want to focus on?</div>
          <div class="flex flex-col gap-1.5">
            <button
              v-for="f in focusOptions"
              :key="f.id"
              :class="[
                'flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-xl border transition-all duration-[150ms] cursor-pointer font-[inherit]',
                moodFocus === f.id
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50',
              ]"
              @click="moodFocus = f.id as typeof moodFocus"
            >
              <span class="text-[13.5px] font-[450]">{{ f.label }}</span>
            </button>
          </div>
        </div>

        <!-- CTA -->
        <div class="flex items-center justify-end">
          <HlButton variant="primary" size="md" :disabled="!moodCanStart || applyingMood" @click="applyMood">
            <template v-if="applyingMood">
              <Icon name="lucide:loader-2" :size="14" class="animate-spin" />
              Finding a flow…
            </template>
            <template v-else>
              Let's go
              <Icon name="lucide:arrow-right" :size="14" />
            </template>
          </HlButton>
        </div>

      </template>

      <!-- ── Flow list ───────────────────────────────────────────────────── -->
      <template v-else>

        <!-- Header -->
        <div class="flex items-center justify-between mb-5">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-gray-900 flex-none" />
            <span class="font-mono text-[11px] tracking-[0.06em] uppercase text-gray-500 font-medium">Daily Practice</span>
          </div>
          <span class="font-mono text-[11px] tracking-[0.06em] uppercase text-gray-400">{{ dateLabel }}</span>
        </div>

        <h2 class="font-sans text-[22px] font-medium leading-[1.3] tracking-[-0.015em] text-gray-900 mb-5">
          {{ completedToday ? "What's next?" : 'What are you working on today?' }}
        </h2>

        <!-- Mood CTA — only on first pick of the day, not "pick next" -->
        <button
          v-if="!completedToday"
          class="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-sand-100 border border-sand-300 hover:bg-sand-200 hover:border-sand-400 transition-all duration-[150ms] cursor-pointer font-[inherit] text-left mb-5"
          @click="moodMode = true"
        >
          <div class="w-8 h-8 rounded-full bg-sand-300 flex items-center justify-center flex-none">
            <Icon name="lucide:sparkles" :size="14" class="text-gray-700" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-[13.5px] font-medium text-gray-900 leading-snug">Not sure where to start?</div>
            <div class="text-[12px] text-gray-500 mt-0.5">Answer a few quick questions and we'll pick for you</div>
          </div>
          <Icon name="lucide:arrow-right" :size="14" class="text-gray-400 flex-none" />
        </button>

        <!-- Divider -->
        <div v-if="!completedToday" class="flex items-center gap-3 mb-4">
          <div class="flex-1 h-px bg-gray-100" />
          <span class="font-mono text-[10px] tracking-[0.06em] uppercase text-gray-400">or pick directly</span>
          <div class="flex-1 h-px bg-gray-100" />
        </div>

        <!-- Single entry point to all flows -->
        <button
          class="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl border border-transparent bg-transparent hover:bg-gray-50 hover:border-gray-100 transition-all duration-[120ms] cursor-pointer font-[inherit]"
          @click="emit('goToFlows')"
        >
          <span class="flex-1 min-w-0">
            <span class="block text-[14px] font-medium text-gray-900 leading-snug">Browse flows</span>
            <span class="block text-[11px] text-gray-400 mt-0.5">Your custom flows and platform flows</span>
          </span>
          <Icon name="lucide:arrow-right" :size="14" class="text-gray-300 flex-none" />
        </button>

      </template>

      </div>
    </div>

    <!-- State 3: Goal complete -->
    <div v-else-if="currentState === 'complete'" class="relative isolate">
      <div class="absolute -inset-8 rounded-3xl blur-3xl -z-10 animate-glow" style="background: radial-gradient(circle, rgba(255, 107, 53, 0.35) 0%, rgba(255, 107, 53, 0.15) 50%, transparent 80%)" />
      <div class="bg-white border-none rounded-3xl shadow-sm px-[26px] pt-6 pb-5">
      <div class="flex items-center gap-2 mb-5">
        <span class="w-2 h-2 rounded-full bg-gray-900 flex-none" />
        <span class="font-mono text-[11px] tracking-[0.06em] uppercase text-gray-500 font-medium">Goal reached</span>
      </div>

      <h2 class="font-sans text-[28px] font-medium leading-[1.25] tracking-[-0.02em] text-gray-900 mb-2">
        Nice work.
      </h2>
      <p class="text-[15px] text-gray-500 leading-relaxed mb-7">
        You answered {{ daily?.questionsAnswered }} questions in {{ daily?.flowName }}.
      </p>

      <div class="flex items-center gap-3">
        <HlButton variant="secondary" size="md" @click="emit('goToFlows')">
          <Icon name="lucide:refresh-cw" :size="13" />
          Pick next flow
        </HlButton>
        <HlButton variant="ghost" size="md">
          Call it a day
        </HlButton>
      </div>
      </div>
    </div>

    <!-- State 2: Flow selected, active -->
    <div v-else class="relative isolate">
      <div class="absolute -inset-8 rounded-3xl blur-3xl -z-10 animate-glow" style="background: radial-gradient(circle, rgba(255, 107, 53, 0.35) 0%, rgba(255, 107, 53, 0.15) 50%, transparent 80%)" />

      <div class="font-mono text-[11px] tracking-[0.06em] uppercase text-gray-400 mb-3">Your flow today</div>

      <div class="bg-white border-none rounded-3xl shadow-sm px-[26px] pt-6 pb-5">

        <!-- Top row: skills path + date -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-gray-900 flex-none" />
            <span class="font-mono text-[11px] tracking-[0.06em] uppercase text-gray-500 font-medium">
              {{ skillPath }}
            </span>
          </div>
          <div class="font-mono text-[11px] tracking-[0.06em] uppercase text-gray-400">{{ dateLabel }}</div>
        </div>

        <!-- Flow name -->
        <h2 class="font-sans text-[28px] font-medium leading-[1.25] tracking-[-0.015em] text-gray-900 mb-[18px] max-w-[36ch]">
          {{ daily?.flowName }}
        </h2>

        <!-- Divider -->
        <div class="h-px bg-gray-100 -mx-[26px]" />

        <!-- Goal -->
        <div class="pt-4 pb-1">
          <div class="text-xs text-gray-500 mb-2.5">Questions today</div>
          <div class="inline-flex items-center gap-0 p-1 border border-gray-200 rounded-full bg-gray-50">
            <button
              v-for="g in goalOptions"
              :key="g"
              :class="[
                'inline-flex items-center justify-center h-[30px] px-4 rounded-full text-[13px] font-[450] border-none cursor-pointer font-[inherit] transition-all duration-[150ms]',
                activeGoal === g
                  ? 'bg-white text-gray-900 font-medium shadow-sm'
                  : 'bg-transparent text-gray-500 hover:text-gray-700',
              ]"
              @click="changeGoal(g)"
            >{{ g }}</button>
          </div>
        </div>

        <!-- Difficulty -->
        <div class="pt-4 pb-1">
          <div class="text-xs text-gray-500 mb-2.5">Difficulty</div>
          <div class="inline-flex items-center gap-0 p-1 border border-gray-200 rounded-full bg-gray-50">
            <button
              v-for="d in difficultyOptions"
              :key="d.id"
              :class="[
                'inline-flex items-center justify-center h-[30px] px-4 rounded-full text-[13px] font-[450] border-none cursor-pointer font-[inherit] transition-all duration-[150ms]',
                activeDiff === d.id
                  ? 'bg-white text-gray-900 font-medium shadow-sm'
                  : 'bg-transparent text-gray-500 hover:text-gray-700',
              ]"
              @click="activeDiff = d.id"
            >{{ d.label }}</button>
          </div>
        </div>

        <!-- Progress -->
        <div class="pt-4 pb-1">
          <div class="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Progress today</span>
            <span class="tabular-nums">{{ daily?.questionsAnswered ?? 0 }} / {{ activeGoal }}</span>
          </div>
          <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full bg-gray-800 rounded-full transition-all duration-500" :style="{ width: progressPct + '%' }" />
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between pt-4">
          <button
            class="inline-flex items-center gap-[7px] text-[13px] text-gray-500 bg-none border-none cursor-pointer font-[inherit] p-0 hover:text-gray-900 transition-colors duration-[100ms]"
            @click="emit('goToFlows')"
          >
            <Icon name="lucide:shuffle" :size="14" class="text-gray-400" />
            Pick a different flow
          </button>
          <HlButton variant="primary" size="md" @click="startFlow">
            Start flow
            <Icon name="lucide:arrow-right" :size="14" />
          </HlButton>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
interface Skill { id: number; name: string; slug: string }
interface CustomFlow { id: number; name: string; isActive: boolean; totalQuestions: number; lastPracticedAt: string | null; skills: Skill[] }
interface PlatformFlow { key: string; name: string; skillSlugs: string[]; dbId: number | null; isActive: boolean; totalQuestions: number; lastPracticedAt: string | null; skills: Skill[] }

interface DailyState {
  flowId: number | null
  flowName: string | null
  predefinedKey: string | null
  skills: Skill[]
  date: string
  goalQuestions: number
  questionsAnswered: number
  completedAt: string | null
}

const emit = defineEmits<{
  start: [{ flow: { id: number; name: string; predefinedKey: string | null }; goal: number; difficulty: string }]
  goToFlows: []
}>()

import type { EssentialFlow } from '~/components/FlowPicker.vue'

const { data: flowsData, pending, refresh } = await useFetch<{ customFlows: CustomFlow[]; platformFlows: PlatformFlow[] }>('/api/flows')
const { data: daily, pending: dailyPending, refresh: refreshDaily } = await useFetch<DailyState>('/api/daily')

const isColdStart = computed(() =>
  !pending.value
  && !dailyPending.value
  && (flowsData.value?.customFlows.length ?? 0) === 0
  && (flowsData.value?.platformFlows.every(f => f.dbId === null) ?? true),
)

const completedToday = computed(() => !!daily.value?.completedAt)

const currentState = computed<'pick' | 'complete' | 'active'>(() => {
  if (!daily.value?.flowId) return 'pick'
  if (daily.value.completedAt) return 'complete'
  return 'active'
})

// reset moodMode when leaving the pick state
watch(currentState, (val) => {
  if (val !== 'pick') moodMode.value = false
})

// ─── Goal / difficulty ────────────────────────────────────────────────────────

const goalOptions = [3, 5, 10]
const activeGoal = ref(5)

watch(() => daily.value?.goalQuestions, (val) => {
  if (val != null) activeGoal.value = val
}, { immediate: true })

async function changeGoal(g: number) {
  activeGoal.value = g
  await $fetch('/api/daily', { method: 'PATCH', body: { goalQuestions: g } })
}

const difficultyOptions = [
  { id: 'light',     label: 'Light' },
  { id: 'practical', label: 'Practical' },
  { id: 'deep',      label: 'Deep' },
]
const activeDiff = ref('practical')

// ─── Progress ────────────────────────────────────────────────────────────────

const progressPct = computed(() => {
  const answered = daily.value?.questionsAnswered ?? 0
  const goal = activeGoal.value
  if (!goal) return 0
  return Math.min(100, Math.round((answered / goal) * 100))
})

// ─── Mood form ────────────────────────────────────────────────────────────────

const moodMode = ref(false)

const timeOptions = [
  { id: 'quick',  label: 'Quick',  sublabel: '5m'  },
  { id: 'normal', label: 'Normal', sublabel: '15m' },
  { id: 'deep',   label: 'Deep',   sublabel: '30m' },
] as const

const focusOptions = [
  { id: 'usual',     label: 'My usual flow' },
  { id: 'neglected', label: "Something I haven't touched lately" },
  { id: 'surprise',  label: 'Surprise me' },
] as const

type MoodTime = 'quick' | 'normal' | 'deep'
type MoodDiff = 'light' | 'practical' | 'deep'
type MoodFocus = 'usual' | 'neglected' | 'surprise'

const moodTime = ref<MoodTime | null>(null)
const moodDiff = ref<MoodDiff | null>(null)
const moodFocus = ref<MoodFocus | null>(null)
const applyingMood = ref(false)

const moodCanStart = computed(() => moodTime.value !== null && moodDiff.value !== null && moodFocus.value !== null)

const timeGoalMap: Record<MoodTime, number> = { quick: 3, normal: 5, deep: 10 }

async function applyMood() {
  if (!moodTime.value || !moodDiff.value || !moodFocus.value || !flowsData.value) return

  const goal = timeGoalMap[moodTime.value]
  const diff = moodDiff.value

  const customFlows = flowsData.value.customFlows
  const platformFlows = flowsData.value.platformFlows
  const ownedFlows: Array<CustomFlow | PlatformFlow> = [
    ...customFlows,
    ...platformFlows.filter(f => f.dbId !== null),
  ]

  let picked: CustomFlow | PlatformFlow | null = null

  if (moodFocus.value === 'usual') {
    const practiced = ownedFlows.filter(f => f.lastPracticedAt !== null)
    picked = practiced.length > 0
      ? practiced.sort((a, b) => new Date(b.lastPracticedAt!).getTime() - new Date(a.lastPracticedAt!).getTime())[0]
      : ownedFlows[0] ?? platformFlows[0] ?? null
  }
  else if (moodFocus.value === 'neglected') {
    const neverPracticed = ownedFlows.filter(f => f.lastPracticedAt === null)
    picked = neverPracticed.length > 0
      ? neverPracticed[0]
      : [...ownedFlows].sort((a, b) => new Date(a.lastPracticedAt!).getTime() - new Date(b.lastPracticedAt!).getTime())[0] ?? null
  }
  else {
    const all: Array<CustomFlow | PlatformFlow> = [...customFlows, ...platformFlows]
    picked = all[Math.floor(Math.random() * all.length)] ?? null
  }

  if (!picked) return

  applyingMood.value = true
  try {
    const flowId = await ensureFlowId(picked)
    await $fetch('/api/daily', {
      method: 'PATCH',
      body: { flowId, questionsAnswered: 0, completedAt: null, goalQuestions: goal },
    })
    activeGoal.value = goal
    activeDiff.value = diff
    moodMode.value = false
    await refreshDaily()
  }
  finally {
    applyingMood.value = false
  }
}

// ─── Flow helpers ─────────────────────────────────────────────────────────────

async function ensureFlowId(flow: CustomFlow | PlatformFlow): Promise<number> {
  if ('id' in flow) return (flow as CustomFlow).id
  const pf = flow as PlatformFlow
  if (pf.dbId) return pf.dbId
  const created = await $fetch<{ id: number }>('/api/flows', {
    method: 'POST',
    body: { name: pf.name, predefinedKey: pf.key },
  })
  await refresh()
  return created.id
}

function startFlow() {
  if (!daily.value?.flowId || !daily.value.flowName) return
  emit('start', {
    flow: { id: daily.value.flowId, name: daily.value.flowName, predefinedKey: daily.value.predefinedKey },
    goal: activeGoal.value,
    difficulty: activeDiff.value,
  })
}

// ─── Cold start ───────────────────────────────────────────────────────────────

async function onColdStartPick(flow: EssentialFlow) {
  const created = await $fetch<{ id: number }>('/api/flows', {
    method: 'POST',
    body: { name: flow.title, predefinedKey: flow.id },
  })
  await $fetch('/api/daily', { method: 'PATCH', body: { flowId: created.id } })
  await Promise.all([refresh(), refreshDaily()])
}

// ─── Display helpers ──────────────────────────────────────────────────────────

function slugToLabel(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\band\b/g, '&').replace(/\b\w/g, c => c.toUpperCase())
}

const skillPath = computed(() => {
  const skills = daily.value?.skills
  if (skills?.length) return skills.map(s => s.name).join(' · ').toUpperCase()
  const key = daily.value?.predefinedKey
  if (key) {
    const pf = flowsData.value?.platformFlows.find(f => f.key === key)
    if (pf) return pf.skillSlugs.map(slugToLabel).join(' · ').toUpperCase()
  }
  return '—'
})

const dateLabel = new Date().toLocaleDateString('en-US', {
  weekday: 'long', month: 'long', day: 'numeric',
}).toUpperCase()
</script>
