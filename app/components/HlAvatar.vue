<template>
  <span
    class="inline-flex items-center justify-center rounded-full text-white font-semibold flex-none tracking-wide"
    :style="{ width: size + 'px', height: size + 'px', fontSize: (size * 0.4) + 'px', backgroundColor: '#FF6B35' }"
  >
    <slot>{{ initials }}</slot>
  </span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  initials?: string
  size?: number
}>(), {
  initials: '',
  size: 28,
})
</script>
