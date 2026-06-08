<template>
  <span
    :class="[
      'inline-flex items-center gap-[5px] h-[22px] px-[9px] rounded font-medium text-[11.5px] whitespace-nowrap',
      variant === 'easy'    && 'bg-green-100 text-green-600',
      variant === 'medium'  && 'bg-amber-100 text-amber-600',
      variant === 'hard'    && 'bg-red-100 text-red-600',
      variant === 'accent'  && 'bg-gray-100 text-gray-700',
      variant === 'neutral' && 'bg-gray-100 text-gray-500',
    ]"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'easy' | 'medium' | 'hard' | 'accent' | 'neutral'
}>(), {
  variant: 'neutral',
})
</script>
