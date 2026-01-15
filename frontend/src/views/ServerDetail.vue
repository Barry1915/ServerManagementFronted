<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import EChart from '@/components/EChart.vue'
import type { Server, ServerMetricsPoint, ServerStatus } from '@/types/server'
import { getServer, getServerMetrics } from '@/api/servers'

const route = useRoute()
const router = useRouter()
const id = computed(() => String(route.params.id || ''))

const loading = ref(false)
const server = ref<Server | null>(null)
const metrics = ref<ServerMetricsPoint[]>([])
const range = ref<'1h' | '6h' | '24h'>('6h')

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

const chartOption = computed(() => {
  const xs = metrics.value.map((p) => dayjs(p.ts).format(range.value === '24h' ? 'MM-DD HH:mm' : 'HH:mm'))
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 18, top: 18, bottom: 24 },
    xAxis: { type: 'category', boundaryGap: false, data: xs },
    yAxis: { type: 'value', min: 0, max: 100, axisLabel: { formatter: '{value}%' } },
    series: [
      {
        name: 'CPU',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: metrics.value.map((p) => p.cpu),
        areaStyle: { opacity: 0.08 },
      },
      {
        name: '内存',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: metrics.value.map((p) => p.mem),
        areaStyle: { opacity: 0.06 },
      },
      {
        name: '磁盘',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: metrics.value.map((p) => p.disk),
        areaStyle: { opacity: 0.05 },
      },
    ],
  }
})

async function refresh() {
  try {
    loading.value = true
    server.value = await getServer(id.value)
    metrics.value = await getServerMetrics(id.value, range.value)
  } catch (e: any) {
    ElMessage.error(e?.message || '加载失败')
  } finally {
    loading.value = false
  }
}

onMounted(refresh)
</script>

<template>
  <div class="grid">
    <el-card shadow="never" class="card">
      <template #header>
        <div class="header">
          <div>
            <div class="title">{{ server?.name || '服务器' }}</div>
            <div class="sub mono">{{ server?.host }}:{{ server?.port }}</div>
          </div>
          <div class="actions">
            <el-button @click="router.push('/servers')">返回</el-button>
            <el-button type="primary" @click="router.push(`/servers/${id}/edit`)">编辑</el-button>
          </div>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="ID">{{ server?.id }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="server" :type="statusType(server.status)" effect="dark">{{ statusLabel(server.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="用户名">{{ server?.username || '-' }}</el-descriptions-item>
        <el-descriptions-item label="标签">
          <el-space wrap>
            <el-tag v-for="t in server?.tags || []" :key="t" effect="plain">{{ t }}</el-tag>
            <span v-if="!server?.tags || server.tags.length === 0">-</span>
          </el-space>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ server?.createdAt }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ server?.updatedAt }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card shadow="never" class="card">
      <template #header>
        <div class="header">
          <div>
            <div class="title">监控</div>
            <div class="sub">CPU / 内存 / 磁盘使用率（%）</div>
          </div>
          <div class="actions">
            <el-segmented v-model="range" :options="['1h', '6h', '24h']" @change="refresh" />
            <el-button :loading="loading" @click="refresh">刷新</el-button>
          </div>
        </div>
      </template>

      <EChart :option="chartOption" height="320px" />
    </el-card>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  gap: 14px;
}
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
  align-items: center;
  gap: 10px;
}
.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}
</style>

