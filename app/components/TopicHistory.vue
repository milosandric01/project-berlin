<template>
  <div class="w-full font-sans">
    <!-- <div class="flex items-center gap-2 mb-6">
      <span class="w-2 h-2 rounded-full bg-gray-900 flex-none" />
      <span class="font-mono text-[11px] tracking-[0.06em] uppercase text-gray-500 font-medium">Timeline</span>
    </div> -->

    <!-- Loading -->
    <div v-if="pending" class="flex flex-col gap-3 pl-6">
      <div v-for="i in 3" :key="i" class="bg-white rounded-2xl px-5 py-4 shadow-sm animate-pulse">
        <div class="h-3 bg-gray-100 rounded w-1/3 mb-3" />
        <div class="h-4 bg-gray-100 rounded w-2/3" />
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!history?.length" class="bg-white rounded-3xl px-7 py-10 shadow-sm text-center">
      <div class="w-12 h-12 rounded-full bg-sand-200 flex items-center justify-center mx-auto mb-4">
        <Icon name="lucide:book-open" :size="22" class="text-gray-400" />
      </div>
      <h2 class="text-[18px] font-semibold text-gray-900 mb-1">No completed topics yet</h2>
      <p class="text-[13.5px] text-gray-500 max-w-[38ch] mx-auto">Complete your first daily practice to see it here.</p>
    </div>

    <!-- Timeline -->
    <div v-else class="flex flex-col gap-0">
      <template v-for="(group, gi) in groupedHistory" :key="group.label">
        <!-- Date group header -->
        <div class="flex items-center gap-3 mb-3" :class="gi > 0 ? 'mt-6' : ''">
          <span class="font-mono text-[11.5px] font-semibold text-gray-700 tracking-wide uppercase">{{ group.label }}</span>
        </div>

        <!-- Timeline entries with continuous line -->
        <div class="relative pl-5">
          <!-- Continuous vertical line -->
          <div class="absolute left-[3px] top-0 bottom-0 w-[2px] bg-gray-200 rounded-full" />

          <div
            v-for="item in group.items"
            :key="item.slug"
            class="relative mb-2 last:mb-0"
          >
            <!-- Card -->
            <div class="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 transition-colors duration-[120ms] hover:border-gray-200">
              <div class="flex items-center justify-between mb-1">
                <HlBadge>{{ item.category }}</HlBadge>
                <span class="font-mono text-[11px] text-gray-400">{{ formatTime(item.completedAt) }}</span>
              </div>
              <h3 class="text-[14.5px] font-medium text-gray-900 leading-snug mb-1">{{ item.title }}</h3>
              <div class="flex items-center gap-3 text-[12px] text-gray-500">
                <span class="flex items-center gap-1">
                  <Icon name="lucide:clock" :size="12" class="text-gray-400" />
                  {{ item.readMinutes }} min
                </span>
                <span class="flex items-center gap-1">
                  <Icon name="lucide:check-circle" :size="12" :class="item.questionsCorrect === item.questionsTotal ? 'text-purple-500' : 'text-gray-400'" />
                  {{ item.questionsCorrect }}/{{ item.questionsTotal }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- End cap -->
      <div class="flex items-center gap-3 mt-4">
        <span class="text-[11.5px] text-gray-400 italic">Beginning of your journey</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface HistoryItem {
  slug: string
  title: string
  category: string
  readMinutes: number
  questionsCorrect: number
  questionsTotal: number
  completedAt: string
}

interface DateGroup {
  label: string
  items: HistoryItem[]
}

const { data: history, pending } = await useFetch<HistoryItem[]>('/api/topics/history')

const groupedHistory = computed<DateGroup[]>(() => {
  if (!history.value) return []
  const groups = new Map<string, HistoryItem[]>()
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  for (const item of history.value) {
    const d = new Date(item.completedAt)
    let label: string
    if (isSameDay(d, today)) label = 'Today'
    else if (isSameDay(d, yesterday)) label = 'Yesterday'
    else label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

    if (!groups.has(label)) groups.set(label, [])
    groups.get(label)!.push(item)
  }

  return Array.from(groups.entries()).map(([label, items]) => ({ label, items }))
})

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}
</script>
