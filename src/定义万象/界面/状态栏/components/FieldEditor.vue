<template>
  <div class="field-editor">
    <label class="field-label">{{ label }}</label>
    <div class="field-value">
      <input
        v-if="editMode"
        :value="modelValue"
        @input="handleInput"
        @blur="handleBlur"
        class="field-input"
        type="text"
      />
      <span v-else class="field-display">{{ modelValue || '(空)' }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  label: string;
  editMode: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'update': [value: string];
}>();

function handleInput(e: Event) {
  const value = (e.target as HTMLInputElement).value;
  emit('update:modelValue', value);
}

function handleBlur(e: Event) {
  const value = (e.target as HTMLInputElement).value;
  emit('update', value);
}
</script>

<style scoped>
.field-editor {
  display: flex;
  align-items: center;
  gap: 12px;
}

.field-label {
  min-width: 80px;
  font-weight: 500;
  color: #4a5568;
  font-size: 14px;
}

.field-value {
  flex: 1;
}

.field-input {
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.field-input:focus {
  outline: none;
  border-color: #667eea;
}

.field-display {
  display: block;
  padding: 8px 12px;
  background: #f7fafc;
  border-radius: 6px;
  font-size: 14px;
  color: #2d3748;
}
</style>
