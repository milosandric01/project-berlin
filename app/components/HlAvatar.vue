<template>
  <span class="avatar" :style="{ width: size + 'px', height: size + 'px', fontSize: (size * 0.4) + 'px' }">
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
