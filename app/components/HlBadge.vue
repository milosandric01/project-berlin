<template>
  <span :class="['hl-badge', variantClass]">
    <slot />
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'easy' | 'medium' | 'hard' | 'accent' | 'neutral'
}>(), {
  variant: 'neutral',
})

const variantClass = computed(() => {
  const map: Record<string, string> = {
    easy: 'b-easy',
    medium: 'b-med',
    hard: 'b-hard',
    accent: 'hl-badge--accent',
    neutral: 'hl-badge--neutral',
  }
  return map[props.variant]
})
</script>

<style scoped>
.hl-badge {
  display: inline-flex; align-items: center; gap: 5px; height: 22px; padding: 0 9px;
  border-radius: var(--radius-sm); font-size: 11.5px; font-weight: 500; white-space: nowrap;
}
.hl-badge--accent { background: var(--accent-bg); color: var(--accent-fg); }
.hl-badge--neutral { background: var(--bg-subtle); color: var(--fg-tertiary); }
</style>
