<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

const app = useAppStore()

const apiBase = computed(() => (import.meta.env.VITE_API_BASE_URL || '').trim() || '(未配置)')
const mock = computed(() => String(import.meta.env.VITE_USE_MOCK || '').toLowerCase() === 'true')

const darkChecked = computed({
  get: () => app.isDark,
  set: (v: boolean) => {
    if (v !== app.isDark) app.toggleDark()
  },
})

const sidebarChecked = computed({
  get: () => app.sidebarCollapsed,
  set: (v: boolean) => {
    if (v !== app.sidebarCollapsed) app.toggleSidebar()
  },
})
</script>

<template>
  <el-card shadow="never" class="card">
    <template #header>
      <div class="header">
        <div>
          <div class="title">设置</div>
          <div class="sub">外观与运行环境信息</div>
        </div>
      </div>
    </template>

    <el-descriptions :column="2" border>
      <el-descriptions-item label="API Base URL">{{ apiBase }}</el-descriptions-item>
      <el-descriptions-item label="Mock 模式">{{ mock ? '开启' : '关闭' }}</el-descriptions-item>
      <el-descriptions-item label="主题">
        <el-switch v-model="darkChecked" active-text="深色" inactive-text="浅色" />
      </el-descriptions-item>
      <el-descriptions-item label="侧边栏">
        <el-switch v-model="sidebarChecked" active-text="收起" inactive-text="展开" />
      </el-descriptions-item>
    </el-descriptions>

    <el-alert
      class="tip"
      type="warning"
      show-icon
      title="如何对接真实后端"
      description="将 frontend/.env.development 中 VITE_USE_MOCK=false，并把 VITE_API_BASE_URL 指向你的后端；同时确保后端提供 /api/auth/login 与 /api/servers 等接口。"
    />
  </el-card>
</template>

<style scoped>
.card {
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(255, 255, 255, 0.72);
}
html.dark .card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(17, 22, 30, 0.62);
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
.title {
  font-weight: 800;
}
.sub {
  font-size: 12px;
  opacity: 0.75;
  margin-top: 2px;
}
.tip {
  margin-top: 14px;
}
</style>

