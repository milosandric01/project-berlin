<template>
  <button
    :disabled="disabled"
    :class="[
      'inline-flex items-center justify-center gap-[7px] font-medium tracking-tight rounded-md border cursor-pointer whitespace-nowrap transition-[background,border-color,transform] duration-[120ms] active:translate-y-px',
      size === 'md' && 'h-9 px-3.5 text-[13.5px]',
      size === 'sm' && 'h-[30px] px-[11px] text-[12.5px]',
      variant === 'primary' && 'bg-gray-900 text-white border-transparent shadow-xs hover:bg-gray-800',
      variant === 'secondary' && 'bg-white text-gray-900 border-gray-200 shadow-xs hover:bg-gray-100 hover:border-gray-300',
      variant === 'ghost' && 'bg-transparent text-gray-600 border-transparent hover:bg-gray-100 hover:text-gray-900',
      block && 'w-full',
    ]"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
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
</script>
