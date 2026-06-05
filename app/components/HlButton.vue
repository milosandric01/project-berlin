<template>
  <button :class="classes" :disabled="disabled">
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
  disabled?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  block: false,
  disabled: false,
})

const classes = computed(() => [
  'hbtn',
  `hbtn-${props.variant}`,
  `hbtn-${props.size}`,
  props.block && 'hbtn--block',
].filter(Boolean))
</script>

<style scoped>
.hbtn--block { width: 100%; }
</style>
