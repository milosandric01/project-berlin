<template>
  <span class="topic-dot" :style="{ background: color, width: size + 'px', height: size + 'px' }" />
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  color: string
  size?: number
}>(), {
  size: 7,
})
</script>
