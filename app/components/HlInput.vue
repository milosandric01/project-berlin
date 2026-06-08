<template>
  <div
    :class="[
      'flex items-center gap-2 h-9 px-3 bg-white border border-gray-200 rounded-md shadow-xs transition-[border-color,box-shadow] duration-[120ms]',
      focused && 'border-gray-400 ring-[3px] ring-gray-200',
    ]"
  >
    <slot name="icon" />
    <input
      ref="inputEl"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      class="border-none outline-none bg-transparent font-sans text-[13.5px] text-gray-900 w-full placeholder:text-gray-400"
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
