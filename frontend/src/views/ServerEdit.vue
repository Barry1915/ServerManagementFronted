<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { ServerStatus } from '@/types/server'
import { createServer, getServer, updateServer } from '@/api/servers'

const route = useRoute()
const router = useRouter()

const id = computed(() => (route.params.id ? String(route.params.id) : ''))
const isEdit = computed(() => Boolean(id.value))

const loading = ref(false)
const saving = ref(false)
const formRef = ref<FormInstance>()

const form = reactive({
  name: '',
  host: '',
  port: 22,
  username: '',
  tags: [] as string[],
  status: 'unknown' as ServerStatus,
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  host: [{ required: true, message: '请输入主机地址', trigger: 'blur' }],
  port: [
    { required: true, message: '请输入端口', trigger: 'blur' },
    {
      validator: (_, v, cb) => {
        const n = Number(v)
        if (!Number.isFinite(n) || n <= 0 || n > 65535) cb(new Error('端口范围 1~65535'))
        else cb()
      },
      trigger: 'blur',
    },
  ],
}

async function load() {
  if (!isEdit.value) return
  try {
    loading.value = true
    const s = await getServer(id.value)
    form.name = s.name
    form.host = s.host
    form.port = s.port
    form.username = s.username || ''
    form.tags = s.tags || []
    form.status = s.status
  } finally {
    loading.value = false
  }
}

async function onSave() {
  try {
    await formRef.value?.validate()
    saving.value = true
    if (isEdit.value) {
      await updateServer(id.value, {
        name: form.name,
        host: form.host,
        port: form.port,
        username: form.username || undefined,
        tags: form.tags,
        status: form.status,
      })
      ElMessage.success('已保存')
      await router.replace(`/servers/${id.value}`)
    } else {
      const created = await createServer({
        name: form.name,
        host: form.host,
        port: form.port,
        username: form.username || undefined,
        tags: form.tags,
        status: form.status,
      })
      ElMessage.success('已创建')
      await router.replace(`/servers/${created.id}`)
    }
  } catch (e: any) {
    if (e?.message) ElMessage.error(e.message)
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>

<template>
  <el-card shadow="never" class="card" v-loading="loading">
    <template #header>
      <div class="header">
        <div>
          <div class="title">{{ isEdit ? '编辑服务器' : '新增服务器' }}</div>
          <div class="sub">填写基础信息后保存即可</div>
        </div>
        <div class="actions">
          <el-button @click="router.back()">返回</el-button>
          <el-button type="primary" :loading="saving" @click="onSave">保存</el-button>
        </div>
      </div>
    </template>

    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" class="form">
      <el-row :gutter="14">
        <el-col :xs="24" :md="12">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" placeholder="例如：生产-主节点" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item label="状态" prop="status">
            <el-select v-model="form.status" style="width: 100%">
              <el-option label="在线" value="online" />
              <el-option label="离线" value="offline" />
              <el-option label="未知" value="unknown" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="14">
        <el-col :xs="24" :md="12">
          <el-form-item label="主机地址" prop="host">
            <el-input v-model="form.host" placeholder="例如：10.0.0.11 / example.com" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item label="端口" prop="port">
            <el-input-number v-model="form.port" :min="1" :max="65535" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="14">
        <el-col :xs="24" :md="12">
          <el-form-item label="用户名">
            <el-input v-model="form.username" placeholder="例如：root / ubuntu（可选）" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item label="标签">
            <el-select v-model="form.tags" multiple filterable allow-create default-first-option style="width: 100%">
              <el-option v-for="t in form.tags" :key="t" :label="t" :value="t" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-alert
        type="info"
        show-icon
        title="对接后端提示"
        description="当前默认使用 Mock 数据（可直接体验界面）。切换到真实后端后，请确保后端提供 /api/servers 的增删改查接口。"
      />
    </el-form>
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
.actions {
  display: flex;
  gap: 10px;
}
.form {
  max-width: 860px;
}
</style>

