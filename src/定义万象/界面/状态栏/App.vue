<template>
  <div class="status-bar">
    <!-- 顶部控制栏 -->
    <div class="header">
      <div class="title">
        <i class="fa-solid fa-wand-magic-sparkles"></i>
        <span>定义万象 - 状态栏</span>
      </div>
      <div class="controls">
        <button 
          @click="toggleMode" 
          :class="['mode-btn', { active: isEditMode }]"
        >
          <i :class="isEditMode ? 'fa-solid fa-lock-open' : 'fa-solid fa-lock'"></i>
          {{ isEditMode ? '编辑模式' : '只读模式' }}
        </button>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content">
      <!-- 用户信息 -->
      <section-card title="用户信息" icon="fa-user">
        <record-editor
          :data="store.stat_data.用户信息.标签"
          label="标签"
          :edit-mode="isEditMode"
          @update="updateField('用户信息.标签', $event)"
        />
        <record-editor
          :data="store.stat_data.用户信息.备注"
          label="备注"
          :edit-mode="isEditMode"
          @update="updateField('用户信息.备注', $event)"
        />
      </section-card>

      <!-- 场景信息 -->
      <section-card title="场景信息" icon="fa-location-dot">
        <field-editor
          v-model="store.stat_data.场景信息.日期"
          label="日期"
          :edit-mode="isEditMode"
          @update="updateField('场景信息.日期', $event)"
        />
        <field-editor
          v-model="store.stat_data.场景信息.时刻"
          label="时刻"
          :edit-mode="isEditMode"
          @update="updateField('场景信息.时刻', $event)"
        />
        <field-editor
          v-model="store.stat_data.场景信息.地点"
          label="地点"
          :edit-mode="isEditMode"
          @update="updateField('场景信息.地点', $event)"
        />
        <field-editor
          v-model="store.stat_data.场景信息.天气"
          label="天气"
          :edit-mode="isEditMode"
          @update="updateField('场景信息.天气', $event)"
        />
        <field-editor
          v-model="store.stat_data.场景信息.环境"
          label="环境"
          :edit-mode="isEditMode"
          @update="updateField('场景信息.环境', $event)"
        />
        <record-editor
          :data="store.stat_data.场景信息.备注"
          label="备注"
          :edit-mode="isEditMode"
          @update="updateField('场景信息.备注', $event)"
        />
      </section-card>

      <!-- 在场对象 -->
      <section-card title="在场对象" icon="fa-users">
        <object-list
          :objects="store.stat_data.在场对象"
          :edit-mode="isEditMode"
          @update="updateField('在场对象', $event)"
        />
      </section-card>

      <!-- 编辑对象 -->
      <section-card title="编辑对象" icon="fa-pen-to-square">
        <edited-object-list
          :objects="store.stat_data.编辑对象"
          :edit-mode="isEditMode"
          @update="updateField('编辑对象', $event)"
        />
      </section-card>

      <!-- 扫描历史 -->
      <section-card title="扫描历史" icon="fa-clock-rotate-left">
        <record-editor
          :data="store.stat_data.扫描历史"
          label="历史记录"
          :edit-mode="isEditMode"
          @update="updateField('扫描历史', $event)"
        />
      </section-card>

      <!-- 收藏标签 -->
      <section-card title="收藏标签" icon="fa-star">
        <record-editor
          :data="store.stat_data.收藏标签"
          label="收藏"
          :edit-mode="isEditMode"
          @update="updateField('收藏标签', $event)"
          :max-items="20"
        />
      </section-card>

      <!-- 因果配置 -->
      <section-card title="因果配置" icon="fa-gears">
        <record-editor
          :data="store.stat_data.因果配置"
          label="规则"
          :edit-mode="isEditMode"
          @update="updateField('因果配置', $event)"
        />
      </section-card>
    </div>

    <!-- 指令预览区 -->
    <div v-if="pendingCommands.length > 0" class="command-preview">
      <div class="preview-header">
        <span>待发送指令 ({{ pendingCommands.length }})</span>
        <button @click="clearCommands" class="clear-btn">
          <i class="fa-solid fa-trash"></i>
          清空
        </button>
      </div>
      <div class="command-list">
        <div v-for="(cmd, idx) in pendingCommands" :key="idx" class="command-item">
          {{ cmd }}
        </div>
      </div>
      <button @click="sendCommands" class="send-btn">
        <i class="fa-solid fa-paper-plane"></i>
        发送到输入框
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDataStore } from './store';
import SectionCard from './components/SectionCard.vue';
import FieldEditor from './components/FieldEditor.vue';
import RecordEditor from './components/RecordEditor.vue';
import ObjectList from './components/ObjectList.vue';
import EditedObjectList from './components/EditedObjectList.vue';

const store = useDataStore();
const isEditMode = ref(false);
const pendingCommands = ref<string[]>([]);

function toggleMode() {
  isEditMode.value = !isEditMode.value;
}

function updateField(path: string, value: any) {
  // 生成指令并添加到待发送列表
  const command = generateCommand(path, value);
  pendingCommands.value.push(command);
}

function generateCommand(path: string, value: any): string {
  // 根据路径和值生成自然语言指令
  const parts = path.split('.');
  
  // 处理不同类型的字段
  if (typeof value === 'object' && value !== null) {
    // Record类型字段
    const entries = Object.entries(value);
    if (entries.length === 0) {
      return `清空${path}`;
    }
    const changes = entries.map(([k, v]) => `"${k}": "${v}"`).join(', ');
    return `更新${path}: ${changes}`;
  } else if (typeof value === 'string') {
    // 字符串字段
    if (value === '') {
      return `清空${path}`;
    }
    return `将${path}修改为"${value}"`;
  } else if (typeof value === 'boolean') {
    // 布尔字段
    return `将${path}设置为${value ? '是' : '否'}`;
  }
  
  return `修改${path}`;
}

function sendCommands() {
  // 将指令追加到SillyTavern输入框
  const textarea = document.querySelector('#send_textarea') as HTMLTextAreaElement;
  if (textarea) {
    const commands = pendingCommands.value.join('\n');
    textarea.value = textarea.value ? `${textarea.value}\n${commands}` : commands;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  }
  clearCommands();
}

function clearCommands() {
  pendingCommands.value = [];
}
</script>

<style scoped>
.status-bar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.header {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: bold;
  color: #2c3e50;
}

.title i {
  color: #667eea;
}

.mode-btn {
  padding: 10px 20px;
  border: 2px solid #667eea;
  background: white;
  color: #667eea;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.mode-btn:hover {
  background: #667eea;
  color: white;
}

.mode-btn.active {
  background: #667eea;
  color: white;
}

.content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 16px;
}

.command-preview {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-weight: 600;
  color: #2c3e50;
}

.clear-btn {
  padding: 6px 12px;
  background: #f56565;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.command-list {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 12px;
}

.command-item {
  padding: 8px 12px;
  background: #f7fafc;
  border-radius: 6px;
  margin-bottom: 8px;
  font-size: 13px;
  color: #4a5568;
}

.send-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: transform 0.2s;
}

.send-btn:hover {
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .content {
    grid-template-columns: 1fr;
  }
}
</style>
