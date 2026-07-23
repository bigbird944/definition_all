<template>
  <div class="object-list">
    <button 
      v-if="editMode" 
      @click="addObject" 
      class="add-btn"
    >
      <i class="fa-solid fa-plus"></i>
      添加对象
    </button>
    
    <div class="objects">
      <div v-for="(obj, name) in objects" :key="name" class="object-card">
        <div class="object-header">
          <input
            v-if="editMode"
            :value="name"
            @blur="renameObject(name, $event)"
            class="name-input"
            placeholder="对象名称"
          />
          <span v-else class="name-display">{{ name }}</span>
          
          <button 
            v-if="editMode" 
            @click="deleteObject(name)" 
            class="delete-btn-small"
            title="删除对象"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        <div class="object-field">
          <label>类型:</label>
          <input
            v-if="editMode"
            :value="obj.类型"
            @input="updateType(name, $event)"
            class="field-input-small"
          />
          <span v-else>{{ obj.类型 }}</span>
        </div>
        
        <div class="object-field">
          <label>已编辑:</label>
          <input
            v-if="editMode"
            type="checkbox"
            :checked="obj.已编辑"
            @change="updateEdited(name, $event)"
          />
          <span v-else>{{ obj.已编辑 ? '是' : '否' }}</span>
        </div>
        
        <div class="tags-section">
          <div class="tags-header">
            <label>标签:</label>
            <button 
              v-if="editMode" 
              @click="addTag(name)" 
              class="add-tag-btn"
            >
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>
          <div class="tags-list">
            <div v-for="(value, key) in obj.标签" :key="key" class="tag-item">
              <input
                v-if="editMode"
                :value="key"
                @blur="renameTag(name, key, $event)"
                class="tag-key-input"
                placeholder="标签名"
              />
              <span v-else class="tag-key">{{ key }}</span>
              
              <input
                v-if="editMode"
                :value="value"
                @input="updateTag(name, key, $event)"
                class="tag-value-input"
                placeholder="说明"
              />
              <span v-else class="tag-value">{{ value }}</span>
              
              <button 
                v-if="editMode" 
                @click="deleteTag(name, key)" 
                class="delete-tag-btn"
              >
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="Object.keys(objects).length === 0" class="empty-hint">
        {{ editMode ? '点击"添加对象"按钮添加在场对象' : '当前无在场对象' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  objects: Record<string, {
    类型: string;
    标签: Record<string, string>;
    已编辑: boolean;
  }>;
  editMode: boolean;
}>();

const emit = defineEmits<{
  'update': [value: any];
}>();

const newObjectCounter = ref(1);
const newTagCounter = ref(1);

function addObject() {
  const name = `对象${newObjectCounter.value}`;
  newObjectCounter.value++;
  const updated = {
    ...props.objects,
    [name]: {
      类型: '',
      标签: {},
      已编辑: false
    }
  };
  emit('update', updated);
}

function deleteObject(name: string) {
  const updated = { ...props.objects };
  delete updated[name];
  emit('update', updated);
}

function renameObject(oldName: string, e: Event) {
  const newName = (e.target as HTMLInputElement).value.trim();
  if (newName && newName !== oldName) {
    const updated = { ...props.objects };
    updated[newName] = updated[oldName];
    delete updated[oldName];
    emit('update', updated);
  }
}

function updateType(name: string, e: Event) {
  const value = (e.target as HTMLInputElement).value;
  const updated = {
    ...props.objects,
    [name]: { ...props.objects[name], 类型: value }
  };
  emit('update', updated);
}

function updateEdited(name: string, e: Event) {
  const checked = (e.target as HTMLInputElement).checked;
  const updated = {
    ...props.objects,
    [name]: { ...props.objects[name], 已编辑: checked }
  };
  emit('update', updated);
}

function addTag(objName: string) {
  const tagName = `标签${newTagCounter.value}`;
  newTagCounter.value++;
  const updated = {
    ...props.objects,
    [objName]: {
      ...props.objects[objName],
      标签: { ...props.objects[objName].标签, [tagName]: '' }
    }
  };
  emit('update', updated);
}

function deleteTag(objName: string, tagKey: string) {
  const tags = { ...props.objects[objName].标签 };
  delete tags[tagKey];
  const updated = {
    ...props.objects,
    [objName]: {
      ...props.objects[objName],
      标签: tags
    }
  };
  emit('update', updated);
}

function renameTag(objName: string, oldKey: string, e: Event) {
  const newKey = (e.target as HTMLInputElement).value.trim();
  if (newKey && newKey !== oldKey) {
    const tags = { ...props.objects[objName].标签 };
    tags[newKey] = tags[oldKey];
    delete tags[oldKey];
    const updated = {
      ...props.objects,
      [objName]: {
        ...props.objects[objName],
        标签: tags
      }
    };
    emit('update', updated);
  }
}

function updateTag(objName: string, tagKey: string, e: Event) {
  const value = (e.target as HTMLInputElement).value;
  const updated = {
    ...props.objects,
    [objName]: {
      ...props.objects[objName],
      标签: { ...props.objects[objName].标签, [tagKey]: value }
    }
  };
  emit('update', updated);
}
</script>

<style scoped>
.object-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.add-btn {
  padding: 8px 16px;
  background: #48bb78;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
}

.add-btn:hover {
  background: #38a169;
}

.objects {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.object-card {
  background: #f7fafc;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #e2e8f0;
}

.object-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e2e8f0;
}

.name-input {
  flex: 1;
  padding: 6px 10px;
  border: 2px solid #cbd5e0;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
}

.name-display {
  font-size: 15px;
  font-weight: 600;
  color: #2d3748;
}

.delete-btn-small {
  padding: 4px 8px;
  background: #f56565;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.object-field {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 13px;
}

.object-field label {
  font-weight: 500;
  color: #4a5568;
  min-width: 60px;
}

.field-input-small {
  flex: 1;
  padding: 4px 8px;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
  font-size: 13px;
}

.tags-section {
  margin-top: 8px;
}

.tags-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.tags-header label {
  font-weight: 500;
  color: #4a5568;
  font-size: 13px;
}

.add-tag-btn {
  padding: 4px 8px;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
}

.tags-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tag-item {
  display: flex;
  gap: 6px;
  align-items: center;
}

.tag-key-input,
.tag-value-input {
  padding: 4px 8px;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
  font-size: 12px;
}

.tag-key-input {
  width: 120px;
  font-weight: 500;
}

.tag-value-input {
  flex: 1;
}

.tag-key {
  min-width: 120px;
  padding: 4px 8px;
  background: #edf2f7;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.tag-value {
  flex: 1;
  padding: 4px 8px;
  background: white;
  border-radius: 4px;
  font-size: 12px;
}

.delete-tag-btn {
  padding: 4px 8px;
  background: #fc8181;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
}

.empty-hint {
  padding: 20px;
  text-align: center;
  color: #a0aec0;
  font-size: 14px;
  font-style: italic;
}
</style>
