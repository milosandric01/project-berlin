<template>
  <span class="inline-flex relative flex-none" :style="{ width: size + 'px', height: size + 'px' }">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" style="transform: rotate(-90deg)">
      <circle
        v-for="(_, i) in total"
        :key="i"
        :cx="cx" :cy="cy" :r="r"
        fill="none"
        :stroke="i < done ? '#16191d' : '#e1e4e8'"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        :stroke-dasharray="`${arc} ${C - arc}`"
        :stroke-dashoffset="-(i * seg) - gap / 2"
      />
    </svg>
    <span class="absolute inset-0 flex flex-col items-center justify-center leading-none">
      <span class="font-mono font-semibold tracking-tight text-gray-900" :style="{ fontSize: (size * 0.26) + 'px' }">
        {{ done }}/{{ total }}
      </span>
    </span>
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  done?: number
  total?: number
  size?: number
  strokeWidth?: number
  gap?: number
}>(), {
  done: 0,
  total: 4,
  size: 62,
  strokeWidth: 5,
  gap: 14,
})

const r = (props.size - props.strokeWidth) / 2
const cx = props.size / 2
const cy = props.size / 2
const C = 2 * Math.PI * r
const seg = C / props.total
const arc = seg - props.gap
</script>
