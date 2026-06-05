<template>
  <span :class="['hl-why-tag', tagClass]">
    <slot />
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  type?: 'weak' | 'review' | 'fresh'
}>(), {
  type: 'weak',
})

const tagClass = computed(() => {
  const map: Record<string, string> = {
    weak: 'why-weak',
    review: 'why-review',
    fresh: 'why-fresh',
  }
  return map[props.type]
})
</script>
