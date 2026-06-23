<template>
  <img
    :src="`/levels/level-${rank}-${LEVEL_SLUGS[rank] ?? 'scout'}.svg`"
    :alt="`Level ${rank}`"
    :width="size"
    :height="size"
    class="inline-block"
    style="image-rendering: pixelated;"
  />
</template>

<script setup lang="ts">
withDefaults(defineProps<{ rank: number; size?: number }>(), { size: 48 })

const LEVEL_SLUGS: Record<number, string> = {
  1: 'scout',
  2: 'grunt',
  3: 'sergeant',
  4: 'champion',
  5: 'warlord',
  6: 'high-warlord',
  7: 'overlord',
}
</script>
