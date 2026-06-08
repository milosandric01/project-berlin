<template>
  <span
    :class="[
      'inline-flex items-center gap-[5px] h-[22px] px-[9px] rounded text-[11.5px] font-medium whitespace-nowrap',
      level === 'Easy' && 'bg-green-100 text-green-600',
      level === 'Hard' && 'bg-red-100 text-red-600',
      level !== 'Easy' && level !== 'Hard' && 'bg-amber-100 text-amber-600',
    ]"
  >
    <Icon :name="iconName" :size="12" />
    {{ level }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{ level: string }>()

const iconName = computed(() => {
  switch (props.level) {
    case 'Easy': return 'lucide:circle'
    case 'Hard': return 'lucide:flame'
    default: return 'lucide:circle-dot'
  }
})
</script>
