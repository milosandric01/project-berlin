<template>
  <div class="w-full font-sans">

    <!-- Loading skeleton -->
    <div v-if="pending || dailyPending" class="bg-white rounded-3xl shadow-sm px-[26px] pt-6 pb-5 animate-pulse">
      <div class="h-3 bg-gray-100 rounded w-1/3 mb-4" />
      <div class="h-7 bg-gray-100 rounded w-2/3 mb-3" />
      <div class="h-3 bg-gray-100 rounded w-1/2" />
    </div>

    <!-- State 1: pick a flow (+ mood form) -->
    <div v-else-if="currentState === 'pick'" class="relative isolate">
      <div class="absolute -inset-8 rounded-3xl blur-3xl -z-10 animate-glow" style="background: radial-gradient(circle, rgba(255, 107, 53, 0.35) 0%, rgba(255, 107, 53, 0.15) 50%, transparent 80%)" />

      <!-- Header (outside the card) — flow list state only -->
      <div v-if="!moodMode" class="px-1 mb-4">
        <!-- <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-gray-900 flex-none" />
            <span class="font-mono text-[11px] tracking-[0.06em] uppercase text-gray-500 font-medium">Daily Practice</span>
          </div>
          <span class="font-mono text-[11px] tracking-[0.06em] uppercase text-gray-400">{{ dateLabel }}</span>
        </div> -->
        <h2 class="font-sans text-[27px] font-medium leading-[1.25] tracking-[-0.015em] text-gray-900">
          {{ completedToday ? "What's next?" : `Ready for today's practice${props.userName ? `, ${props.userName}` : ''}?` }}
        </h2>
      </div>

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
        </div>

        <h2 class="font-sans text-[22px] mb-6 font-medium leading-[1.3] tracking-[-0.015em] text-gray-900 mb-1">
          We'll match a flow to your headspace
        </h2>
        <!-- <p class="text-[13px] text-gray-500 leading-snug mb-6">
          We'll match a flow to your headspace — no wrong answers.
        </p> -->

        <!-- Difficulty -->
        <div class="mb-5">
          <div class="text-xs text-gray-500 mb-2.5">Difficulty</div>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="e in energyOptions"
              :key="e.id"
              :class="[
                'flex flex-col items-center justify-center gap-2 py-3.5 rounded-2xl border transition-all duration-[150ms] cursor-pointer font-[inherit]',
                moodDiff === e.id
                  ? 'border-gray-900 bg-gray-900 text-white shadow-sm'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50',
              ]"
              @click="moodDiff = e.id as typeof moodDiff"
            >
              <Icon :name="e.icon" :size="20" :class="moodDiff === e.id ? 'text-[#FF6B35]' : 'text-gray-400'" />
              <span class="text-[13px] font-medium leading-none">{{ e.label }}</span>
              <span :class="['text-[11px] leading-none', moodDiff === e.id ? 'text-white/55' : 'text-gray-400']">{{ e.sublabel }}</span>
            </button>
          </div>
        </div>

        <!-- Time -->
        <div class="mb-5">
          <div class="text-xs text-gray-500 mb-2.5">How much time feels right?</div>
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

        <!-- Category -->
        <div class="mb-6">
          <div class="text-xs text-gray-500 mb-2.5">I'm in the mood for…</div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="f in focusOptions"
              :key="f.id"
              :class="[
                'inline-flex items-center gap-1.5 h-[30px] px-3.5 rounded-full border transition-all duration-[150ms] cursor-pointer font-[inherit] text-[13px]',
                moodFocus === f.id
                  ? 'border-gray-900 bg-gray-900 text-white font-medium shadow-sm'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50',
              ]"
              @click="moodFocus = f.id as typeof moodFocus"
            >
              <Icon :name="f.icon" :size="14" />
              {{ f.label }}
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

        <!-- Two clear choices -->
        <div class="flex flex-col gap-3">

          <!-- Choice 1: mood — featured, only on first pick of the day -->
          <button
            v-if="!completedToday"
            class="group relative w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-gray-900 border border-gray-900 hover:bg-gray-800 transition-all duration-[150ms] cursor-pointer font-[inherit] text-left shadow-sm hover:shadow-md"
            @click="moodMode = true"
          >
            <div class="w-10 h-10 rounded-full bg-[#FF6B35] flex items-center justify-center flex-none">
              <Icon name="lucide:sparkles" :size="17" class="text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-[15px] font-semibold text-white leading-snug">Match my mood</span>
                <!-- <span class="font-mono text-[9px] tracking-[0.08em] uppercase text-white/60 border border-white/20 rounded-full px-1.5 py-0.5">Quick</span> -->
              </div>
              <div class="text-[12.5px] text-white/60 mt-0.5">Tell us your vibe, we'll find the right flow</div>
            </div>
            <Icon name="lucide:arrow-right" :size="16" class="text-white/50 flex-none transition-transform duration-[150ms] group-hover:translate-x-0.5" />
          </button>

          <!-- Choice 2: browse existing flows -->
          <button
            class="group relative w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-25 transition-all duration-[150ms] cursor-pointer font-[inherit] text-left shadow-sm hover:shadow-md"
            @click="emit('goToFlows')"
          >
            <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-none">
              <Icon name="lucide:layout-grid" :size="17" class="text-gray-700" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-[15px] font-semibold text-gray-900 leading-snug">Browse flows</div>
              <div class="text-[12.5px] text-gray-500 mt-0.5">Pick from your custom or platform flows</div>
            </div>
            <Icon name="lucide:arrow-right" :size="16" class="text-gray-300 flex-none transition-transform duration-[150ms] group-hover:translate-x-0.5" />
          </button>

        </div>

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

const props = defineProps<{ userName?: string }>()

const emit = defineEmits<{
  start: [{ flow: { id: number; name: string; predefinedKey: string | null }; goal: number; difficulty: string }]
  goToFlows: []
}>()

const { data: flowsData, pending, refresh } = await useFetch<{ customFlows: CustomFlow[]; platformFlows: PlatformFlow[] }>('/api/flows')
const { data: daily, pending: dailyPending, refresh: refreshDaily } = await useFetch<DailyState>('/api/daily')

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

const energyOptions = [
  { id: 'light',     label: 'Easy',   sublabel: 'Warm-up', icon: 'lucide:coffee' },
  { id: 'practical', label: 'Medium', sublabel: 'Standard', icon: 'lucide:target' },
  { id: 'deep',      label: 'Hard',   sublabel: 'Challenge', icon: 'lucide:flame' },
] as const

const focusOptions = [
  { id: 'fundamentals', label: 'Fundamentals',  icon: 'lucide:box' },
  { id: 'frontend',     label: 'Frontend',      icon: 'lucide:layout' },
  { id: 'backend',      label: 'Backend',       icon: 'lucide:server' },
  { id: 'systems',      label: 'Systems',       icon: 'lucide:network' },
  { id: 'devops',       label: 'DevOps',        icon: 'lucide:container' },
  { id: 'security',     label: 'Security',      icon: 'lucide:shield' },
  { id: 'quality',      label: 'Code Quality',  icon: 'lucide:check-circle' },
  { id: 'surprise',     label: 'Surprise me',   icon: 'lucide:dices' },
] as const

type MoodFocus = typeof focusOptions[number]['id']

type MoodTime = 'quick' | 'normal' | 'deep'
type MoodDiff = 'light' | 'practical' | 'deep'

const moodTime = ref<MoodTime | null>('quick')
const moodDiff = ref<MoodDiff | null>(null)
const moodFocus = ref<MoodFocus | null>(null)
const applyingMood = ref(false)

const moodCanStart = computed(() => moodTime.value !== null && moodDiff.value !== null && moodFocus.value !== null)

const timeGoalMap: Record<MoodTime, number> = { quick: 3, normal: 5, deep: 10 }

const focusCategoryMap: Record<string, string[]> = {
  fundamentals: ['Fundamentals'],
  frontend:     ['Frontend'],
  backend:      ['Backend'],
  systems:      ['Systems'],
  devops:       ['Cloud & DevOps'],
  security:     ['Security'],
  quality:      ['Code Quality'],
  surprise:     [],
}

async function applyMood() {
  if (!moodTime.value || !moodDiff.value || !moodFocus.value || !flowsData.value) return

  const goal = timeGoalMap[moodTime.value]
  const diff = moodDiff.value

  const customFlows = flowsData.value.customFlows
  const platformFlows = flowsData.value.platformFlows
  const allFlows: Array<CustomFlow | PlatformFlow> = [...customFlows, ...platformFlows]

  let picked: CustomFlow | PlatformFlow | null = null

  const categories = focusCategoryMap[moodFocus.value] ?? []

  if (categories.length > 0) {
    // Filter flows whose skills match the selected category
    const matching = allFlows.filter(f =>
      f.skills.some(s => {
        const slug = 'slug' in s ? s.slug : ''
        return categories.some(cat => cat.toLowerCase() === slug) || categories.length > 0
      }),
    )
    // For platform flows, match by skillSlugs
    const platformMatching = platformFlows.filter(pf =>
      pf.skillSlugs.some(slug => {
        const label = slug.replace(/-/g, ' ').toLowerCase()
        return categories.some(cat => cat.toLowerCase() === label || label.includes(cat.toLowerCase()))
      }),
    )
    const candidates = [...matching, ...platformMatching]
    const unique = [...new Map(candidates.map(f => [('key' in f ? f.key : f.id), f])).values()]
    picked = unique.length > 0 ? unique[Math.floor(Math.random() * unique.length)] : allFlows[Math.floor(Math.random() * allFlows.length)] ?? null
  }
  else {
    // Surprise: random
    picked = allFlows[Math.floor(Math.random() * allFlows.length)] ?? null
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
