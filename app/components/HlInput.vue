<template>
  <div class="hl-input" :class="{ 'hl-input--focus': focused }">
    <slot name="icon" />
    <input
      ref="inputEl"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @focus="focused = true"
      @blur="focused = false"
    />
    <slot name="suffix" />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
  type?: string
}>(), {
  modelValue: '',
  placeholder: '',
  type: 'text',
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

const focused = ref(false)
const inputEl = ref<HTMLInputElement>()

defineExpose({ focus: () => inputEl.value?.focus() })
</script>

<style scoped>
.hl-input {
  display: flex; align-items: center; gap: 8px;
  height: 36px; padding: 0 12px;
  background: var(--bg-surface); border: 1px solid var(--border-default);
  border-radius: var(--radius-md); box-shadow: var(--shadow-xs);
  transition: border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out);
}
.hl-input--focus { border-color: var(--border-focus); box-shadow: var(--ring); }
.hl-input input {
  border: none; outline: none; background: transparent;
  font-family: var(--font-sans); font-size: 13.5px; color: var(--fg-primary);
  width: 100%;
}
.hl-input input::placeholder { color: var(--fg-quaternary); }
</style>
