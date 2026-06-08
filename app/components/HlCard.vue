<template>
  <div
    :class="[
      'bg-white border-none rounded-3xl shadow-sm',
      pad && 'p-5',
      flat && 'shadow-none',
      hover && 'cursor-pointer transition-colors duration-[120ms] hover:border-gray-300',
    ]"
  >
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
