<template>
  <span :class="['diff-badge', badgeClass]">
    <Icon :name="iconName" :size="12" />
    {{ level }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{ level: string }>()

const badgeClass = computed(() => {
  switch (props.level) {
    case 'Easy': return 'b-easy'
    case 'Hard': return 'b-hard'
    default: return 'b-med'
  }
})

const iconName = computed(() => {
  switch (props.level) {
    case 'Easy': return 'lucide:circle'
    case 'Hard': return 'lucide:flame'
    default: return 'lucide:circle-dot'
  }
})
</script>
