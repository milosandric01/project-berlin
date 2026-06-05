<template>
  <div class="card" :class="{ 'card-pad': pad, 'card--flat': flat, 'card--hover': hover }">
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  pad?: boolean
  flat?: boolean
  hover?: boolean
}>(), {
  pad: false,
  flat: false,
  hover: false,
})
</script>

<style scoped>
.card-pad { padding: 20px 22px; }
.card--flat { box-shadow: none; }
.card--hover { cursor: pointer; transition: border-color var(--dur-fast) var(--ease-out); }
.card--hover:hover { border-color: var(--border-strong); }
</style>
