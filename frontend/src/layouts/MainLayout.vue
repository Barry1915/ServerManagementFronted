<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { Monitor, Setting, DataBoard, Expand, Fold, Moon, Sunny } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const app = useAppStore()

const activeMenu = computed(() => {
  if (typeof route.name === 'string') {
    if (route.name.startsWith('server-') || route.name === 'server-detail') return '/servers'
  }
  return route.path.startsWith('/servers') ? '/servers' : route.path
})

async function onLogout() {
  auth.logout()
  await router.replace({ name: 'login' })
}
</script>

<template>
  <el-container class="app-shell">
    <el-aside :width="app.sidebarCollapsed ? '72px' : '240px'" class="aside">
      <div class="brand">
        <div class="logo">SM</div>
        <div v-show="!app.sidebarCollapsed" class="brand-text">
          <div class="title">Server Console</div>
          <div class="subtitle">服务器管理系统</div>
        </div>
      </div>

      <el-menu :default-active="activeMenu" router class="menu" :collapse="app.sidebarCollapsed">
        <el-menu-item index="/dashboard">
          <el-icon><DataBoard /></el-icon>
          <span>概览</span>
        </el-menu-item>
        <el-menu-item index="/servers">
          <el-icon><Monitor /></el-icon>
          <span>服务器</span>
        </el-menu-item>
        <el-menu-item index="/settings">
          <el-icon><Setting /></el-icon>
          <span>设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="left">
          <el-button text class="icon-btn" @click="app.toggleSidebar()">
            <el-icon>
              <Fold v-if="!app.sidebarCollapsed" />
              <Expand v-else />
            </el-icon>
          </el-button>

          <el-breadcrumb separator="/">
            <el-breadcrumb-item>控制台</el-breadcrumb-item>
            <el-breadcrumb-item>{{ route.meta.title || '页面' }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="right">
          <el-tooltip :content="app.isDark ? '切换到浅色' : '切换到深色'">
            <el-button text class="icon-btn" @click="app.toggleDark()">
              <el-icon>
                <Sunny v-if="app.isDark" />
                <Moon v-else />
              </el-icon>
            </el-button>
          </el-tooltip>

          <el-dropdown>
            <span class="user">
              <span class="avatar">{{ (auth.user?.displayName || auth.user?.username || 'U')[0] }}</span>
              <span class="name">{{ auth.user?.displayName || auth.user?.username || '未登录' }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="router.push('/settings')">设置</el-dropdown-item>
                <el-dropdown-item divided @click="onLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main">
        <el-scrollbar class="main-scroll">
          <div class="page">
            <RouterView />
          </div>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.aside {
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(10px);
}
html.dark .aside {
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(17, 22, 30, 0.6);
}
.brand {
  display: flex;
  gap: 12px;
  padding: 18px 16px 10px 16px;
  align-items: center;
}
.logo {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: white;
  background: linear-gradient(135deg, #409eff 0%, #36cfc9 55%, #67c23a 100%);
  box-shadow: 0 10px 26px rgba(64, 158, 255, 0.28);
}
.brand-text .title {
  font-weight: 700;
  line-height: 1.1;
}
.brand-text .subtitle {
  font-size: 12px;
  opacity: 0.7;
  margin-top: 2px;
}
.menu {
  border-right: 0;
  background: transparent;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(10px);
}
html.dark .header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(17, 22, 30, 0.6);
}
.left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.icon-btn {
  padding: 8px 10px;
}
.user {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}
.avatar {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  background: rgba(64, 158, 255, 0.16);
}
.name {
  font-weight: 600;
}
.main {
  padding: 16px;
}
.main-scroll {
  height: calc(100vh - 56px - 32px);
}
.page {
  max-width: 1200px;
  margin: 0 auto;
}
</style>

