<template>
  <div class="record-editor">
    <div class="record-header">
      <span class="record-label">{{ label }}</span>
      <button 
        v-if="editMode" 
        @click="addItem" 
        class="add-btn"
        :disabled="maxItems && Object.keys(data).length >= maxItems"
      >
        <i class="fa-solid fa-plus"></i>
        添加
      </button>
    </div>
    <div class="record-list">
      <div v-for="(value, key) in data" :key="key" class="record-item">
        <input
          v-if="editMode"
          :value="key"
          @blur="renameKey(key, $event)"
          class="key-input"
          placeholder="键名"
        />
        <span v-else class="key-display">{{ key }}</span>
        
        <input
          v-if="editMode"
          :value="value"
          @input="updateValue(key, $event)"
          class="value-input"
          placeholder="值"
        />
        <span v-else class="value-display">{{ value }}</span>
        
        <button 
          v-if="editMode" 
          @click="deleteItem(key)" 
          class="delete-btn"
          title="删除"
        >
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
      <div v-if="Object.keys(data).length === 0" class="empty-hint">
        {{ editMode ? '点击"添加"按钮添加项目' : '(空)' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  data: Record<string, string>;
  label: string;
  editMode: boolean;
  maxItems?: number;
}>();

const emit = defineEmits<{
  'update': [value: Record<string, string>];
}>();

const newKeyCounter = ref(1);

function addItem() {
  const newKey = `新项目${newKeyCounter.value}`;
  newKeyCounter.value++;
  const updated = { ...props.data, [newKey]: '' };
  emit('update', updated);
}

function deleteItem(key: string) {
  const updated = { ...props.data };
  delete updated[key];
  emit('update', updated);
}

function renameKey(oldKey: string, e: Event) {
  const newKey = (e.target as HTMLInputElement).value.trim();
  if (newKey && newKey !== oldKey) {
    const updated = { ...props.data };
    updated[newKey] = updated[oldKey];
    delete updated[oldKey];
    emit('update', updated);
  }
}

function updateValue(key: string, e: Event) {
  const value = (e.target as HTMLInputElement).value;
  const updated = { ...props.data, [key]: value };
  emit('update', updated);
}
</script>

<style scoped>
.record-editor {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.record-label {
  font-weight: 500;
  color: #4a5568;
  font-size: 14px;
}

.add-btn {
  padding: 6px 12px;
  background: #48bb78;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s;
}

.add-btn:hover:not(:disabled) {
  background: #38a169;
}

.add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.record-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.key-input,
.value-input {
  padding: 6px 10px;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
}

.key-input {
  width: 150px;
  font-weight: 500;
}

.value-input {
  flex: 1;
}

.key-input:focus,
.value-input:focus {
  outline: none;
  border-color: #667eea;
}

.key-display {
  min-width: 150px;
  padding: 6px 10px;
  background: #edf2f7;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #2d3748;
}

.value-display {
  flex: 1;
  padding: 6px 10px;
  background: #f7fafc;
  border-radius: 6px;
  font-size: 13px;
  color: #4a5568;
}

.delete-btn {
  padding: 6px 10px;
  background: #f56565;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.2s;
}

.delete-btn:hover {
  background: #e53e3e;
}

.empty-hint {
  padding: 12px;
  text-align: center;
  color: #a0aec0;
  font-size: 13px;
  font-style: italic;
}
</style>
