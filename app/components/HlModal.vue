<template>
  <Teleport to="body">
    <div v-if="open" class="hl-overlay" @click="$emit('close')">
      <div class="hl-modal" @click.stop>
        <div class="hl-modal__head">
          <h3 class="hl-modal__title">
            <slot name="title">{{ title }}</slot>
          </h3>
          <button class="hl-modal__close" @click="$emit('close')">&times;</button>
        </div>
        <div class="hl-modal__body">
          <slot />
        </div>
        <div v-if="$slots.footer" class="hl-modal__foot">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  open: boolean
  title?: string
}>()

defineEmits<{
  close: []
}>()
</script>

<style scoped>
.hl-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(13, 15, 18, 0.4);
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(2px);
  animation: fadeIn var(--dur-fast) var(--ease-out);
}
.hl-modal {
  background: var(--bg-surface); border: 1px solid var(--border-default);
  border-radius: var(--radius-xl); box-shadow: var(--shadow-xl);
  width: 100%; max-width: 480px; max-height: 85vh;
  display: flex; flex-direction: column;
  animation: scaleIn var(--dur-base) var(--ease-out);
}
.hl-modal__head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 22px 0;
}
.hl-modal__title {
  font-size: 16px; font-weight: 600; letter-spacing: -0.01em;
}
.hl-modal__close {
  width: 28px; height: 28px; border-radius: var(--radius-md);
  border: none; background: transparent; color: var(--fg-tertiary);
  font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out);
}
.hl-modal__close:hover { background: var(--bg-hover); color: var(--fg-primary); }
.hl-modal__body { padding: 16px 22px 22px; overflow-y: auto; flex: 1; }
.hl-modal__foot {
  padding: 14px 22px; border-top: 1px solid var(--border-subtle);
  display: flex; align-items: center; justify-content: flex-end; gap: 8px;
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes scaleIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: none; } }
</style>
