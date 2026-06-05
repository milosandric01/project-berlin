<template>
  <span class="seg-ring" :style="{ width: size + 'px', height: size + 'px' }">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" style="transform: rotate(-90deg)">
      <circle
        v-for="(_, i) in total"
        :key="i"
        :cx="cx" :cy="cy" :r="r"
        fill="none"
        :stroke="i < done ? 'var(--accent)' : 'var(--accent-200)'"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        :stroke-dasharray="`${arc} ${C - arc}`"
        :stroke-dashoffset="-(i * seg) - gap / 2"
      />
    </svg>
    <span class="seg-ring-center">
      <span class="seg-ring-frac">{{ done }}/{{ total }}</span>
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

<style scoped>
.seg-ring {
  display: inline-flex;
  position: relative;
  flex: none;
}
.seg-ring-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
.seg-ring-frac {
  font-family: var(--font-mono);
  font-size: calc(v-bind('props.size') * 0.26px);
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--fg-primary);
}
</style>
