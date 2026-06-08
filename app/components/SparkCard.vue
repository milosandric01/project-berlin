<template>
  <div class="bg-white border-none rounded-3xl shadow-sm px-[26px] pt-6 pb-5">

    <!-- Top row -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-gray-900 flex-none" />
        <span class="font-mono text-[11px] tracking-[0.06em] uppercase text-gray-500 font-medium">{{ topicPath }}</span>
      </div>
      <div class="font-mono text-[11px] tracking-[0.06em] uppercase text-gray-400">{{ dateLabel }}</div>
    </div>

    <!-- Title -->
    <h2 class="font-serif text-[28px] font-normal leading-[1.25] tracking-[-0.015em] text-gray-900 mb-[18px] max-w-[36ch]">
      {{ title }}
    </h2>

    <!-- Meta row -->
    <div class="flex items-center justify-between text-[12.5px] text-gray-500 mb-4">
      <div class="flex items-center gap-1.5">
        <Icon name="lucide:sparkles" :size="13" class="text-gray-400" />
        <span>{{ mode }}</span>
        <span class="text-gray-400">·</span>
        <Icon name="lucide:clock" :size="13" class="text-gray-400" />
        <span>{{ duration }}</span>
        <span class="text-gray-400">·</span>
      </div>
    </div>

    <!-- Divider -->
    <div class="h-px bg-gray-150 -mx-[26px]" />

    <!-- Practice with -->
    <div class="pt-4 pb-1">
      <div class="text-xs text-gray-500 mb-2.5">Practice with</div>
      <div class="flex flex-wrap gap-[7px]">
        <button
          v-for="p in practiceOptions"
          :key="p.id"
          :class="[
            'inline-flex items-center gap-1.5 h-8 px-[13px] border rounded-full text-[13px] font-[450] cursor-pointer font-[inherit] transition-[border-color,background,color] duration-[100ms]',
            activePractice === p.id
              ? 'bg-gray-100 border-gray-300 text-gray-700 font-medium'
              : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900',
          ]"
          @click="activePractice = p.id"
        >
          <Icon :name="p.icon" :size="13" :style="p.color ? { color: p.color } : {}" />
          {{ p.label }}
        </button>
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
            'inline-flex items-center justify-center gap-[5px] h-[30px] px-4 rounded-full text-[13px] font-[450] border-none cursor-pointer font-[inherit] transition-all duration-[150ms]',
            activeDiff === d.id
              ? 'bg-white text-gray-900 font-medium shadow-sm'
              : 'bg-transparent text-gray-500 hover:text-gray-700',
          ]"
          @click="activeDiff = d.id"
        >
          {{ d.label }}
        </button>
      </div>
    </div>

    <!-- Divider -->
    <!-- <div class="h-px bg-gray-150 -mx-[26px]" /> -->

    <!-- Footer -->
    <div class="flex items-center justify-between pt-4">
      <button
        class="inline-flex items-center gap-[7px] text-[13px] text-gray-500 bg-none border-none cursor-pointer font-[inherit] p-0 hover:text-gray-900 transition-colors duration-[100ms]"
        @click="emit('change')"
      >
        <Icon name="lucide:shuffle" :size="14" class="text-gray-400" />
        Change flow
      </button>
      <HlButton variant="primary" size="md" @click="emit('start', { practice: activePractice, difficulty: activeDiff })">
        Start flow
        <Icon name="lucide:arrow-right" :size="14" />
      </HlButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  topicPath?: string
  sparkNumber?: number
  title?: string
  mode?: string
  duration?: string
  dateLabel?: string
}>(), {
  topicPath: 'BACKEND / MESSAGING',
  sparkNumber: 13,
  title: 'Practice thinking through message-processing problems.',
  mode: 'Quick take',
  duration: '3 min',
  dateLabel: 'THURSDAY, JUNE 5',
})

const emit = defineEmits<{
  change: []
  start: [{ practice: string; difficulty: string }]
}>()

const practiceOptions = [
  { id: 'general',  label: 'General',  icon: 'lucide:share-2',           color: null },
  { id: 'kafka',    label: 'Kafka',    icon: 'simple-icons:apachekafka', color: '#231F20' },
  { id: 'rabbitmq', label: 'RabbitMQ', icon: 'simple-icons:rabbitmq',    color: '#FF6600' },
  { id: 'sqs',      label: 'SQS',      icon: 'simple-icons:amazonaws',   color: '#FF9900' },
]

const difficultyOptions = [
  { id: 'easy',   label: 'Easy',   icon: 'lucide:signal-low' },
  { id: 'medium', label: 'Medium', icon: 'lucide:signal-medium' },
  { id: 'hard',   label: 'Hard',   icon: 'lucide:signal-high' },
]

const activePractice = ref('kafka')
const activeDiff = ref('medium')
</script>
