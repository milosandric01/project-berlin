<template>
  <div class="w-full font-sans">

    <!-- Intro -->
    <div class="mb-6">
      <h2 class="font-sans text-[26px] font-normal leading-snug tracking-[-0.01em] text-gray-900">
        Pick a flow to get started.
      </h2>
      <p class="text-[13px] text-gray-500 mt-1.5">
        12 questions per flow — exit anytime, resume exactly where you left off.
      </p>
    </div>

    <!-- Carousel: break out of parent px-12 padding to use full max-w width -->
    <div
      class="relative -mx-12 overflow-hidden"
      @touchstart.passive="onTouchStart"
      @touchmove.passive="onTouchMove"
      @touchend="onTouchEnd"
    >
      <!-- Left fade -->
      <div class="absolute inset-y-0 left-0 w-16 z-10 pointer-events-none"
        style="background: linear-gradient(to right, #FCFBF7, transparent)" />
      <!-- Right fade -->
      <div class="absolute inset-y-0 right-0 w-16 z-10 pointer-events-none"
        style="background: linear-gradient(to left, #FCFBF7, transparent)" />

      <div
        class="flex"
        :style="{
          transform: `translateX(${-(current * STEP) + OFFSET + drag}px)`,
          transition: dragging ? 'none' : 'transform 300ms cubic-bezier(0.22, 1, 0.36, 1)',
          gap: `${GAP}px`,
        }"
      >
        <div
          v-for="(flow, i) in flows"
          :key="flow.id"
          class="flex-none"
          :style="{ width: `${CARD}px` }"
          :class="i !== current ? 'cursor-pointer' : ''"
          @click="i !== current && go(i)"
        >
          <div
            class="bg-white rounded-3xl px-[26px] pt-6 pb-5 flex flex-col transition-all duration-300 select-none"
            :class="i === current ? 'opacity-100 shadow-sm' : 'opacity-[0.36] shadow-none'"
          >

            <!-- Top row -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-gray-900 flex-none" />
                <span class="font-mono text-[11px] tracking-[0.06em] uppercase text-gray-500 font-medium">{{ flow.path }}</span>
              </div>
              <div class="font-mono text-[11px] tracking-[0.06em] uppercase text-gray-400">Platform flow</div>
            </div>

            <!-- Title -->
            <h3 class="font-sans text-[22px] font-medium leading-[1.25] tracking-[-0.015em] text-gray-900 mb-2">
              {{ flow.title }}
            </h3>
            <p class="text-[13.5px] text-gray-500 leading-relaxed mb-5 max-w-[44ch]">
              {{ flow.description }}
            </p>

            <!-- Meta -->
            <div class="flex items-center gap-3 text-[12.5px] text-gray-500 mb-4">
              <span class="flex items-center gap-1.5">
                <Icon name="lucide:circle-dot" :size="13" class="text-gray-400" />
                12 questions
              </span>
              <span class="text-gray-400">·</span>
              <span class="flex items-center gap-1.5">
                <Icon name="lucide:clock" :size="13" class="text-gray-400" />
                {{ flow.duration }}
              </span>
            </div>

            <!-- Prompt types -->
            <div class="pt-4 pb-1">
              <div class="text-xs text-gray-500 mb-2.5">Question types</div>
              <div class="inline-flex items-center gap-0 p-1 border border-gray-200 rounded-full bg-gray-50">
                <span
                  v-for="tag in flow.promptTypes"
                  :key="tag"
                  class="inline-flex items-center justify-center h-[30px] px-4 rounded-full text-[13px] font-[450] bg-transparent text-gray-500"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <div class="flex-1" />

            <!-- Footer -->
            <div class="flex items-center justify-between pt-4">
              <span class="text-[13px] text-gray-400 tabular-nums">{{ current + 1 }} / {{ flows.length }}</span>
              <HlButton
                v-if="i === current"
                variant="primary"
                size="md"
                @click.stop="emit('start', flow)"
              >
                Start flow
                <Icon name="lucide:arrow-right" :size="14" />
              </HlButton>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- Dot indicators -->
    <div class="flex items-center justify-center gap-1.5 mt-4">
      <button
        v-for="(_, i) in flows"
        :key="i"
        class="rounded-full transition-all duration-150 cursor-pointer border-none p-0"
        :class="i === current ? 'w-4 h-1.5 bg-gray-800' : 'w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400'"
        @click="go(i)"
      />
    </div>

  </div>
</template>

<script setup lang="ts">
export interface EssentialFlow {
  id: string
  path: string
  title: string
  description: string
  duration: string
  difficulty: string
  promptTypes: string[]
}

const emit = defineEmits<{ start: [flow: EssentialFlow] }>()

// Carousel layout (px). Carousel container is 680px (parent max-w minus the -mx-12 breakout).
// Center card: 500px. Peek on each side: (680 - 500) / 2 = 90px.
const CARD = 500   // card width in px
const GAP  = 16    // gap between cards in px
const STEP = CARD + GAP  // 516px per step
const OFFSET = (680 - CARD) / 2  // 90px — centers first card

const current = ref(0)

function go(i: number) {
  current.value = Math.max(0, Math.min(flows.length - 1, i))
}

// Touch / swipe
const drag = ref(0)
const dragging = ref(false)
let touchStartX = 0

function onTouchStart(e: TouchEvent) {
  touchStartX = e.touches[0]?.clientX ?? 0
  dragging.value = true
}

function onTouchMove(e: TouchEvent) {
  drag.value = (e.touches[0]?.clientX ?? touchStartX) - touchStartX
}

function onTouchEnd() {
  dragging.value = false
  if (drag.value < -50) go(current.value + 1)
  else if (drag.value > 50) go(current.value - 1)
  drag.value = 0
}

const flows: EssentialFlow[] = [
  {
    id: 'networking',
    path: 'BACKEND / NETWORKING',
    title: 'Networking Essentials',
    description: 'Understand how data moves across the internet — HTTP, TCP/IP, DNS, TLS, and the layers beneath every request you\'ve ever made.',
    duration: '~15 min',
    difficulty: 'Light → Deep',
    promptTypes: ['Quick Take', 'What Would You Do?', 'Spot the Risk'],
  },
  {
    id: 'system-design',
    path: 'ARCHITECTURE / SYSTEMS',
    title: 'System Design Fundamentals',
    description: 'Think through scalability, load balancing, caching, and the trade-offs every distributed system eventually forces you to make.',
    duration: '~20 min',
    difficulty: 'Practical → Deep',
    promptTypes: ['What Would You Do?', 'Spot the Risk'],
  },
  {
    id: 'api-design',
    path: 'BACKEND / API',
    title: 'API Design Principles',
    description: 'REST, GraphQL, versioning, rate limiting, and the art of designing interfaces other engineers actually want to use.',
    duration: '~15 min',
    difficulty: 'Light → Practical',
    promptTypes: ['Quick Take', 'What Would You Do?'],
  },
  {
    id: 'databases',
    path: 'DATA / STORAGE',
    title: 'Database & Storage',
    description: 'SQL fundamentals, indexing strategies, transaction isolation levels, and when to reach for a non-relational store.',
    duration: '~18 min',
    difficulty: 'Practical → Deep',
    promptTypes: ['Quick Take', 'Spot the Risk'],
  },
  {
    id: 'security',
    path: 'SECURITY / AUTH',
    title: 'Security Fundamentals',
    description: 'Authentication, JWT, OAuth 2.0, OWASP top 10, and the security mindset that separates careful engineers from careless ones.',
    duration: '~15 min',
    difficulty: 'Light → Deep',
    promptTypes: ['Spot the Risk', 'What Would You Do?'],
  },
  {
    id: 'cloud',
    path: 'CLOUD / INFRASTRUCTURE',
    title: 'Cloud Architecture',
    description: 'Serverless, containers, managed services, and the architectural decisions that define how modern systems scale and survive failure.',
    duration: '~16 min',
    difficulty: 'Practical → Deep',
    promptTypes: ['What Would You Do?', 'Quick Take'],
  },
  {
    id: 'concurrency',
    path: 'BACKEND / CONCURRENCY',
    title: 'Concurrency & Async',
    description: 'Threads, event loops, race conditions, deadlocks, and the subtle bugs that only reveal themselves under real load.',
    duration: '~14 min',
    difficulty: 'Practical → Deep',
    promptTypes: ['Spot the Risk', 'Quick Take'],
  },
  {
    id: 'frontend-perf',
    path: 'FRONTEND / PERFORMANCE',
    title: 'Frontend Performance',
    description: 'Core Web Vitals, bundle optimization, caching, lazy loading, and the rendering pipeline from raw bytes to visible pixels.',
    duration: '~14 min',
    difficulty: 'Light → Practical',
    promptTypes: ['Quick Take', 'Spot the Risk'],
  },
]
</script>
