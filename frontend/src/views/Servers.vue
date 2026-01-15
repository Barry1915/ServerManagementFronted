<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, RefreshRight, Search } from '@element-plus/icons-vue'
import type { Server, ServerStatus } from '@/types/server'
import { deleteServer, listServers } from '@/api/servers'

const router = useRouter()
const loading = ref(false)
const rows = ref<Server[]>([])

const query = reactive({
  q: '',
  status: 'all' as ServerStatus | 'all',
})

const filtered = computed(() => rows.value)

function statusLabel(s: ServerStatus) {
  if (s === 'online') return '在线'
  if (s === 'offline') return '离线'
  return '未知'
}
function statusType(s: ServerStatus) {
  if (s === 'online') return 'success'
  if (s === 'offline') return 'danger'
  return 'info'
}

async function refresh() {
  try {
    loading.value = true
    rows.value = await listServers({ q: query.q, status: query.status })
  } catch (e: any) {
    ElMessage.error(e?.message || '加载失败')
  } finally {
    loading.value = false
  }
}

async function onDelete(row: Server) {
  try {
    await ElMessageBox.confirm(`确定删除服务器「${row.name}」吗？`, '确认删除', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await deleteServer(row.id)
    ElMessage.success('已删除')
    await refresh()
  } catch {
    // ignore
  }
}

onMounted(refresh)
</script>

<template>
  <el-card shadow="never" class="card">
    <template #header>
      <div class="header">
        <div>
          <div class="title">服务器</div>
          <div class="sub">管理节点信息、状态与基础操作</div>
        </div>
        <div class="actions">
          <el-button :icon="RefreshRight" :loading="loading" @click="refresh">刷新</el-button>
          <el-button type="primary" :icon="Plus" @click="router.push('/servers/new')">新增服务器</el-button>
        </div>
      </div>
    </template>

    <div class="filters">
      <el-input v-model="query.q" placeholder="搜索名称 / IP / ID" clearable style="max-width: 340px" @change="refresh">
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-segmented v-model="query.status" :options="['all', 'online', 'offline', 'unknown']" @change="refresh">
        <template #default="{ item }">
          <span v-if="item === 'all'">全部</span>
          <span v-else-if="item === 'online'">在线</span>
          <span v-else-if="item === 'offline'">离线</span>
          <span v-else>未知</span>
        </template>
      </el-segmented>
    </div>

    <el-table :data="filtered" v-loading="loading" style="width: 100%" height="520" stripe>
      <el-table-column label="名称" min-width="200">
        <template #default="{ row }">
          <div class="name-cell">
            <div class="name">{{ row.name }}</div>
            <div class="meta">{{ row.id }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="地址" min-width="180">
        <template #default="{ row }">
          <div class="mono">{{ row.host }}:{{ row.port }}</div>
          <div class="meta">{{ row.username || '-' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="标签" min-width="180">
        <template #default="{ row }">
          <el-space wrap>
            <el-tag v-for="t in row.tags || []" :key="t" effect="plain">{{ t }}</el-tag>
            <span v-if="!row.tags || row.tags.length === 0" class="meta">-</span>
          </el-space>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <el-tag :type="statusType(row.status)" effect="dark">{{ statusLabel(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" min-width="170" prop="updatedAt" />
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="router.push(`/servers/${row.id}`)">详情</el-button>
          <el-button link type="primary" @click="router.push(`/servers/${row.id}/edit`)">编辑</el-button>
          <el-button link type="danger" @click="onDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
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
.filters {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.name-cell .name {
  font-weight: 700;
}
.meta {
  font-size: 12px;
  opacity: 0.72;
  margin-top: 2px;
}
.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}
</style>

