<template>
  <div class="w-full font-sans">

    <!-- Level hero card -->
    <div class="relative overflow-hidden rounded-3xl px-7 pt-7 pb-6 shadow-sm mb-6" :style="{ background: levelInfo.current.bgGradient }">
      <!-- Decorative glow -->
      <div class="absolute top-[-40px] right-[-40px] w-[180px] h-[180px] rounded-full opacity-20 blur-3xl" :style="{ background: levelInfo.current.bgGradient }" />

      <div class="relative flex items-center gap-6">
        <!-- Level ring -->
        <div class="relative flex-none">
          <svg width="100" height="100" viewBox="0 0 100 100" class="drop-shadow-md">
            <!-- Track -->
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="6" />
            <!-- Progress -->
            <circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke="white"
              stroke-width="6"
              stroke-linecap="round"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="circumference - (circumference * levelInfo.progress) / 100"
              transform="rotate(-90 50 50)"
              class="transition-[stroke-dashoffset] duration-700 ease-out"
            />
          </svg>
          <!-- Center badge -->
          <div class="absolute inset-0 flex items-center justify-center">
            <LevelBadge :rank="levelInfo.current.rank" :size="52" />
          </div>
        </div>

        <!-- Level info -->
        <div class="flex-1 min-w-0">
          <div class="font-mono text-[11px] tracking-[0.06em] uppercase text-white/70 mb-1">Level {{ levelInfo.current.rank }}</div>
          <h1 class="text-[28px] font-bold text-white tracking-[-0.02em] leading-tight mb-1">{{ levelInfo.current.name }}</h1>
          <p class="text-[13.5px] text-white/80 leading-snug">{{ levelInfo.current.title }}</p>
          <div v-if="levelInfo.next" class="mt-3 flex items-center gap-2">
            <div class="flex-1 h-1.5 rounded-full bg-white/20 overflow-hidden">
              <div class="h-full bg-white rounded-full transition-[width] duration-700" :style="{ width: levelInfo.progress + '%' }" />
            </div>
            <span class="text-[11px] font-mono text-white/70 flex-none">{{ levelInfo.daysToNext }}d to {{ levelInfo.next.name }}</span>
          </div>
          <div v-else class="mt-3 text-[12px] text-white/80 font-medium">Max level reached. Legendary.</div>
        </div>
      </div>
    </div>

    <!-- Stats row -->
    <div class="grid grid-cols-3 gap-3 mb-6">
      <div class="bg-white rounded-2xl px-4 py-4 shadow-sm text-center">
        <div class="text-[28px] font-bold text-gray-900 leading-none mb-1">{{ streakData?.streak ?? 0 }}</div>
        <div class="text-[12px] text-gray-500 font-medium">Current streak</div>
      </div>
      <div class="bg-white rounded-2xl px-4 py-4 shadow-sm text-center">
        <div class="text-[28px] font-bold text-gray-900 leading-none mb-1">{{ streakData?.longestStreak ?? 0 }}</div>
        <div class="text-[12px] text-gray-500 font-medium">Longest streak</div>
      </div>
      <div class="bg-white rounded-2xl px-4 py-4 shadow-sm text-center">
        <div class="text-[28px] font-bold text-gray-900 leading-none mb-1">{{ streakData?.totalCompleted ?? 0 }}</div>
        <div class="text-[12px] text-gray-500 font-medium">Topics done</div>
      </div>
    </div>

    <!-- Accuracy -->
    <div v-if="(streakData?.totalQuestions ?? 0) > 0" class="bg-white rounded-2xl px-5 py-4 shadow-sm mb-6">
      <div class="flex items-center justify-between mb-2">
        <span class="text-[13px] font-medium text-gray-700">Answer accuracy</span>
        <span class="font-mono text-[13px] font-semibold text-gray-900">{{ accuracy }}%</span>
      </div>
      <div class="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div class="h-full rounded-full bg-purple-500 transition-[width] duration-500" :style="{ width: accuracy + '%' }" />
      </div>
      <div class="text-[11px] text-gray-400 mt-1.5">{{ streakData?.totalCorrect ?? 0 }} correct out of {{ streakData?.totalQuestions ?? 0 }} questions</div>
    </div>

    <!-- Calendar heatmap -->
    <div class="bg-white rounded-2xl px-5 py-5 shadow-sm mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-[15px] font-semibold text-gray-900">Activity</h2>
        <span class="font-mono text-[11px] text-gray-400">Last {{ WEEKS }} weeks</span>
      </div>

      <!-- Day labels -->
      <div class="flex gap-[3px]">
        <!-- Column of day labels -->
        <div class="flex flex-col gap-[3px] mr-1.5 pt-[3px]">
          <div v-for="(label, i) in dayLabels" :key="i" class="h-[13px] flex items-center">
            <span class="text-[9px] font-mono text-gray-400 w-[18px]">{{ label }}</span>
          </div>
        </div>

        <!-- Heatmap grid -->
        <div class="flex gap-[3px] flex-1 overflow-hidden">
          <div v-for="(week, wi) in calendarWeeks" :key="wi" class="flex flex-col gap-[3px]">
            <div
              v-for="(day, di) in week"
              :key="di"
              :title="day.date ? `${day.date}${day.active ? ' ✓' : ''}` : ''"
              :class="[
                'w-[13px] h-[13px] rounded-[3px] transition-colors duration-200',
                !day.date ? 'bg-transparent' :
                day.active ? 'bg-purple-500 hover:bg-purple-600' :
                day.isToday ? 'bg-gray-200 ring-1 ring-gray-400' :
                day.isFuture ? 'bg-transparent' :
                'bg-gray-100 hover:bg-gray-150',
              ]"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Levels roadmap -->
    <div class="bg-white rounded-2xl px-5 py-5 shadow-sm">
      <h2 class="text-[15px] font-semibold text-gray-900 mb-4">Levels</h2>
      <div class="flex flex-col gap-3">
        <div
          v-for="level in LEVELS"
          :key="level.rank"
          :class="[
            'flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors duration-200',
            level.rank === levelInfo.current.rank ? 'bg-gray-50 ring-1 ring-gray-200' : '',
            level.rank > levelInfo.current.rank ? 'opacity-40' : '',
          ]"
        >
          <LevelBadge :rank="level.rank" :size="36" class="flex-none" />
          <div class="flex-1 min-w-0">
            <div class="text-[13.5px] font-medium text-gray-900">{{ level.name }}</div>
            <div class="text-[11.5px] text-gray-500">{{ level.title }}</div>
          </div>
          <div class="flex-none">
            <span v-if="level.rank <= levelInfo.current.rank" class="text-[11px] font-mono text-purple-600">✓</span>
            <span v-else class="text-[11px] font-mono text-gray-400">{{ level.threshold }}d</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { LEVELS, getLevelProgress } from '~/utils/levels'

interface StreakData {
  streak: number
  longestStreak: number
  totalCompleted: number
  totalCorrect: number
  totalQuestions: number
  calendar: Record<string, { correct: number; total: number }>
  today: string
}

const { data: streakData } = await useFetch<StreakData>('/api/topics/streak')

const levelInfo = computed(() => getLevelProgress(streakData.value?.streak ?? 0))
const circumference = 2 * Math.PI * 42 // radius 42
const accuracy = computed(() => {
  if (!streakData.value || streakData.value.totalQuestions === 0) return 0
  return Math.round((streakData.value.totalCorrect / streakData.value.totalQuestions) * 100)
})

// Calendar heatmap
const WEEKS = 12
const dayLabels = ['Mon', '', 'Wed', '', 'Fri', '', '']

const calendarWeeks = computed(() => {
  const today = new Date(streakData.value?.today ?? new Date().toISOString().slice(0, 10))
  const cal = streakData.value?.calendar ?? {}
  const weeks: Array<Array<{ date: string | null; active: boolean; isToday: boolean; isFuture: boolean }>> = []

  // End on this Saturday (end of current week row)
  const todayDow = today.getDay() // 0=Sun
  const endDate = new Date(today)
  endDate.setDate(endDate.getDate() + (6 - todayDow))

  // Start WEEKS * 7 days before end
  const startDate = new Date(endDate)
  startDate.setDate(startDate.getDate() - (WEEKS * 7 - 1))

  // Align to Monday
  const startDow = startDate.getDay()
  const offset = startDow === 0 ? -6 : 1 - startDow
  startDate.setDate(startDate.getDate() + offset)

  const cursor = new Date(startDate)
  const todayStr = today.toISOString().slice(0, 10)

  while (cursor <= endDate) {
    const week: typeof weeks[0] = []
    for (let d = 0; d < 7; d++) {
      const dateStr = cursor.toISOString().slice(0, 10)
      const isFuture = dateStr > todayStr
      week.push({
        date: dateStr,
        active: !!cal[dateStr],
        isToday: dateStr === todayStr,
        isFuture,
      })
      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push(week)
  }

  return weeks
})
</script>
