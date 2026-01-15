<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const loading = ref(false)
const form = reactive({
  username: 'admin',
  password: 'admin',
})

async function onSubmit() {
  try {
    loading.value = true
    await auth.login(form.username, form.password)
    ElMessage.success('登录成功')
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
    await router.replace(redirect)
  } catch (e: any) {
    ElMessage.error(e?.message || '登录失败，请检查账号或后端服务')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="wrap">
    <div class="bg" />
    <div class="panel app-card">
      <div class="header">
        <div class="logo">SM</div>
        <div class="text">
          <div class="title">Server Console</div>
          <div class="subtitle">登录到服务器管理系统</div>
        </div>
      </div>

      <el-form label-position="top" @submit.prevent="onSubmit">
        <el-form-item label="用户名">
          <el-input v-model="form.username" size="large" placeholder="请输入用户名" autocomplete="username" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="form.password"
            size="large"
            placeholder="请输入密码"
            type="password"
            show-password
            autocomplete="current-password"
            @keyup.enter="onSubmit"
          />
        </el-form-item>

        <el-button type="primary" size="large" style="width: 100%" :loading="loading" @click="onSubmit">
          登录
        </el-button>

        <div class="hint">
          <div>默认开启 Mock：可用 <b>admin / admin</b> 直接体验界面。</div>
          <div>
            切换到真实后端：配置 `frontend/.env.development` 的 `VITE_API_BASE_URL` 并将 `VITE_USE_MOCK=false`。
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  height: 100%;
  display: grid;
  place-items: center;
  padding: 24px;
  position: relative;
}
.bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(900px 500px at 20% 15%, rgba(64, 158, 255, 0.25), transparent 60%),
    radial-gradient(900px 600px at 85% 35%, rgba(103, 194, 58, 0.18), transparent 58%),
    radial-gradient(900px 700px at 30% 85%, rgba(230, 162, 60, 0.15), transparent 58%);
  filter: blur(0px);
  pointer-events: none;
}
.panel {
  width: min(440px, 100%);
  padding: 22px 22px 18px 22px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.74);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.12);
  position: relative;
}
html.dark .panel {
  background: rgba(17, 22, 30, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.35);
}
.header {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 14px;
}
.logo {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: white;
  background: linear-gradient(135deg, #409eff 0%, #36cfc9 55%, #67c23a 100%);
}
.text .title {
  font-weight: 800;
  font-size: 18px;
}
.text .subtitle {
  margin-top: 2px;
  opacity: 0.75;
  font-size: 12px;
}
.hint {
  margin-top: 14px;
  font-size: 12px;
  opacity: 0.75;
  line-height: 1.6;
}
</style>

