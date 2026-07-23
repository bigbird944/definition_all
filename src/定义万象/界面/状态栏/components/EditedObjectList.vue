<template>
  <div class="edited-object-list">
    <button 
      v-if="editMode" 
      @click="addObject" 
      class="add-btn"
    >
      <i class="fa-solid fa-plus"></i>
      添加编辑记录
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
            title="删除记录"
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
        
        <div class="tags-compare">
          <div class="tags-column">
            <div class="column-header">原始标签</div>
            <div class="tags-list">
              <div v-for="(value, key) in obj.原始标签" :key="key" class="tag-item">
                <input
                  v-if="editMode"
                  :value="key"
                  @blur="renameOriginalTag(name, key, $event)"
                  class="tag-key-input"
                />
                <span v-else class="tag-key">{{ key }}</span>
                
                <input
                  v-if="editMode"
                  :value="value"
                  @input="updateOriginalTag(name, key, $event)"
                  class="tag-value-input"
                />
                <span v-else class="tag-value">{{ value }}</span>
                
                <button 
                  v-if="editMode" 
                  @click="deleteOriginalTag(name, key)" 
                  class="delete-tag-btn"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
              <button 
                v-if="editMode" 
                @click="addOriginalTag(name)" 
                class="add-tag-btn"
              >
                <i class="fa-solid fa-plus"></i> 添加
              </button>
            </div>
          </div>
          
          <div class="tags-column">
            <div class="column-header">当前标签</div>
            <div class="tags-list">
              <div v-for="(value, key) in obj.当前标签" :key="key" class="tag-item">
                <input
                  v-if="editMode"
                  :value="key"
                  @blur="renameCurrentTag(name, key, $event)"
                  class="tag-key-input"
                />
                <span v-else class="tag-key">{{ key }}</span>
                
                <input
                  v-if="editMode"
                  :value="value"
                  @input="updateCurrentTag(name, key, $event)"
                  class="tag-value-input"
                />
                <span v-else class="tag-value">{{ value }}</span>
                
                <button 
                  v-if="editMode" 
                  @click="deleteCurrentTag(name, key)" 
                  class="delete-tag-btn"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
              <button 
                v-if="editMode" 
                @click="addCurrentTag(name)" 
                class="add-tag-btn"
              >
                <i class="fa-solid fa-plus"></i> 添加
              </button>
            </div>
          </div>
        </div>
        
        <div class="notes-section">
          <div class="notes-header">
            <label>备注:</label>
            <button 
              v-if="editMode" 
              @click="addNote(name)" 
              class="add-note-btn"
            >
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>
          <div class="notes-list">
            <div v-for="(value, key) in obj.备注" :key="key" class="note-item">
              <input
                v-if="editMode"
                :value="key"
                @blur="renameNote(name, key, $event)"
                class="note-key-input"
                placeholder="备注标题"
              />
              <span v-else class="note-key">{{ key }}</span>
              
              <input
                v-if="editMode"
                :value="value"
                @input="updateNote(name, key, $event)"
                class="note-value-input"
                placeholder="备注内容"
              />
              <span v-else class="note-value">{{ value }}</span>
              
              <button 
                v-if="editMode" 
                @click="deleteNote(name, key)" 
                class="delete-note-btn"
              >
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="Object.keys(objects).length === 0" class="empty-hint">
        {{ editMode ? '点击"添加编辑记录"按钮添加' : '暂无编辑记录' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  objects: Record<string, {
    类型: string;
    原始标签: Record<string, string>;
    当前标签: Record<string, string>;
    备注: Record<string, string>;
  }>;
  editMode: boolean;
}>();

const emit = defineEmits<{
  'update': [value: any];
}>();

const newObjectCounter = ref(1);
const newTagCounter = ref(1);
const newNoteCounter = ref(1);

function addObject() {
  const name = `对象${newObjectCounter.value}`;
  newObjectCounter.value++;
  const updated = {
    ...props.objects,
    [name]: {
      类型: '',
      原始标签: {},
      当前标签: {},
      备注: {}
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

// 原始标签操作
function addOriginalTag(objName: string) {
  const tagName = `标签${newTagCounter.value}`;
  newTagCounter.value++;
  const updated = {
    ...props.objects,
    [objName]: {
      ...props.objects[objName],
      原始标签: { ...props.objects[objName].原始标签, [tagName]: '' }
    }
  };
  emit('update', updated);
}

function deleteOriginalTag(objName: string, tagKey: string) {
  const tags = { ...props.objects[objName].原始标签 };
  delete tags[tagKey];
  const updated = {
    ...props.objects,
    [objName]: {
      ...props.objects[objName],
      原始标签: tags
    }
  };
  emit('update', updated);
}

function renameOriginalTag(objName: string, oldKey: string, e: Event) {
  const newKey = (e.target as HTMLInputElement).value.trim();
  if (newKey && newKey !== oldKey) {
    const tags = { ...props.objects[objName].原始标签 };
    tags[newKey] = tags[oldKey];
    delete tags[oldKey];
    const updated = {
      ...props.objects,
      [objName]: {
        ...props.objects[objName],
        原始标签: tags
      }
    };
    emit('update', updated);
  }
}

function updateOriginalTag(objName: string, tagKey: string, e: Event) {
  const value = (e.target as HTMLInputElement).value;
  const updated = {
    ...props.objects,
    [objName]: {
      ...props.objects[objName],
      原始标签: { ...props.objects[objName].原始标签, [tagKey]: value }
    }
  };
  emit('update', updated);
}

// 当前标签操作
function addCurrentTag(objName: string) {
  const tagName = `标签${newTagCounter.value}`;
  newTagCounter.value++;
  const updated = {
    ...props.objects,
    [objName]: {
      ...props.objects[objName],
      当前标签: { ...props.objects[objName].当前标签, [tagName]: '' }
    }
  };
  emit('update', updated);
}

function deleteCurrentTag(objName: string, tagKey: string) {
  const tags = { ...props.objects[objName].当前标签 };
  delete tags[tagKey];
  const updated = {
    ...props.objects,
    [objName]: {
      ...props.objects[objName],
      当前标签: tags
    }
  };
  emit('update', updated);
}

function renameCurrentTag(objName: string, oldKey: string, e: Event) {
  const newKey = (e.target as HTMLInputElement).value.trim();
  if (newKey && newKey !== oldKey) {
    const tags = { ...props.objects[objName].当前标签 };
    tags[newKey] = tags[oldKey];
    delete tags[oldKey];
    const updated = {
      ...props.objects,
      [objName]: {
        ...props.objects[objName],
        当前标签: tags
      }
    };
    emit('update', updated);
  }
}

function updateCurrentTag(objName: string, tagKey: string, e: Event) {
  const value = (e.target as HTMLInputElement).value;
  const updated = {
    ...props.objects,
    [objName]: {
      ...props.objects[objName],
      当前标签: { ...props.objects[objName].当前标签, [tagKey]: value }
    }
  };
  emit('update', updated);
}

// 备注操作
function addNote(objName: string) {
  const noteName = `备注${newNoteCounter.value}`;
  newNoteCounter.value++;
  const updated = {
    ...props.objects,
    [objName]: {
      ...props.objects[objName],
      备注: { ...props.objects[objName].备注, [noteName]: '' }
    }
  };
  emit('update', updated);
}

function deleteNote(objName: string, noteKey: string) {
  const notes = { ...props.objects[objName].备注 };
  delete notes[noteKey];
  const updated = {
    ...props.objects,
    [objName]: {
      ...props.objects[objName],
      备注: notes
    }
  };
  emit('update', updated);
}

function renameNote(objName: string, oldKey: string, e: Event) {
  const newKey = (e.target as HTMLInputElement).value.trim();
  if (newKey && newKey !== oldKey) {
    const notes = { ...props.objects[objName].备注 };
    notes[newKey] = notes[oldKey];
    delete notes[oldKey];
    const updated = {
      ...props.objects,
      [objName]: {
        ...props.objects[objName],
        备注: notes
      }
    };
    emit('update', updated);
  }
}

function updateNote(objName: string, noteKey: string, e: Event) {
  const value = (e.target as HTMLInputElement).value;
  const updated = {
    ...props.objects,
    [objName]: {
      ...props.objects[objName],
      备注: { ...props.objects[objName].备注, [noteKey]: value }
    }
  };
  emit('update', updated);
}
</script>

<style scoped>
.edited-object-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.add-btn {
  padding: 8px 16px;
  background: #f093fb;
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
  background: #e879f9;
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
  margin-bottom: 8px;
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

.tags-compare {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 12px 0;
}

.tags-column {
  background: white;
  border-radius: 6px;
  padding: 10px;
  border: 1px solid #e2e8f0;
}

.column-header {
  font-weight: 600;
  color: #2d3748;
  font-size: 13px;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 2px solid #e2e8f0;
}

.tags-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tag-item {
  display: flex;
  gap: 4px;
  align-items: center;
}

.tag-key-input,
.tag-value-input {
  padding: 4px 6px;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
  font-size: 11px;
}

.tag-key-input {
  width: 80px;
  font-weight: 500;
}

.tag-value-input {
  flex: 1;
}

.tag-key {
  min-width: 80px;
  padding: 4px 6px;
  background: #edf2f7;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.tag-value {
  flex: 1;
  padding: 4px 6px;
  background: #f7fafc;
  border-radius: 4px;
  font-size: 11px;
}

.delete-tag-btn {
  padding: 3px 6px;
  background: #fc8181;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 10px;
}

.add-tag-btn {
  padding: 6px;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  width: 100%;
}

.notes-section {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
}

.notes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.notes-header label {
  font-weight: 500;
  color: #4a5568;
  font-size: 13px;
}

.add-note-btn {
  padding: 4px 8px;
  background: #9f7aea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.note-item {
  display: flex;
  gap: 6px;
  align-items: center;
}

.note-key-input,
.note-value-input {
  padding: 4px 8px;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
  font-size: 12px;
}

.note-key-input {
  width: 100px;
  font-weight: 500;
}

.note-value-input {
  flex: 1;
}

.note-key {
  min-width: 100px;
  padding: 4px 8px;
  background: #edf2f7;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.note-value {
  flex: 1;
  padding: 4px 8px;
  background: white;
  border-radius: 4px;
  font-size: 12px;
}

.delete-note-btn {
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
