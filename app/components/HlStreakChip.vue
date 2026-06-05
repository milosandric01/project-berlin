<template>
  <span class="streak-chip">
    <slot />
  </span>
</template>

<style scoped>
.streak-chip {
  display: inline-flex; align-items: center; gap: 6px; height: 30px; padding: 0 11px;
  background: var(--accent-bg); color: var(--accent-fg); border: 1px solid var(--accent-200);
  border-radius: var(--radius-full); font-size: 13px; font-weight: 600;
}
</style>
