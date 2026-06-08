<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[1000] bg-[rgba(13,15,18,0.4)] flex items-center justify-center backdrop-blur-sm animate-[fadeIn_120ms_cubic-bezier(0.22,1,0.36,1)]"
      @click="$emit('close')"
    >
      <div
        class="bg-white border border-gray-200 rounded-xl shadow-xl w-full max-w-[480px] max-h-[85vh] flex flex-col animate-[scaleIn_180ms_cubic-bezier(0.22,1,0.36,1)]"
        @click.stop
      >
        <div class="flex items-center justify-between px-[22px] pt-[18px]">
          <h3 class="text-base font-semibold tracking-tight">
            <slot name="title">{{ title }}</slot>
          </h3>
          <button
            class="w-7 h-7 rounded-md border-none bg-transparent text-gray-500 text-xl cursor-pointer flex items-center justify-center hover:bg-gray-100 hover:text-gray-900 transition-colors duration-[120ms]"
            @click="$emit('close')"
          >
            &times;
          </button>
        </div>
        <div class="px-[22px] py-4 overflow-y-auto flex-1">
          <slot />
        </div>
        <div v-if="$slots.footer" class="px-[22px] py-3.5 border-t border-gray-150 flex items-center justify-end gap-2">
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

<style>
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes scaleIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: none; } }
</style>
