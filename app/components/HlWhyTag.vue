<template>
  <span
    :class="[
      'inline-flex items-center gap-1 h-5 px-[7px] rounded text-[11px] font-medium whitespace-nowrap',
      type === 'weak'   && 'bg-gray-100 text-gray-700',
      type === 'review' && 'bg-amber-100 text-amber-600',
      type === 'fresh'  && 'bg-gray-100 text-gray-500',
    ]"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  type?: 'weak' | 'review' | 'fresh'
}>(), {
  type: 'weak',
})
</script>
