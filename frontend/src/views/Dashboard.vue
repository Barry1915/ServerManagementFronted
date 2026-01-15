<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import EChart from '@/components/EChart.vue'
import type { Server, ServerMetricsPoint } from '@/types/server'
import { listServers, getServerMetrics } from '@/api/servers'

const loading = ref(false)
const servers = ref<Server[]>([])
const metrics = ref<ServerMetricsPoint[]>([])

const total = computed(() => servers.value.length)
const online = computed(() => servers.value.filter((s) => s.status === 'online').length)
const offline = computed(() => servers.value.filter((s) => s.status === 'offline').length)
const unknown = computed(() => servers.value.filter((s) => s.status === 'unknown').length)

const chartOption = computed(() => {
  const xs = metrics.value.map((p) => dayjs(p.ts).format('HH:mm'))
  const cpu = metrics.value.map((p) => p.cpu)
  const mem = metrics.value.map((p) => p.mem)
  const disk = metrics.value.map((p) => p.disk)

  return {
    tooltip: { trigger: 'axis' },
    legend: { top: 6, data: ['CPU', '内存', '磁盘'] },
    grid: { left: 40, right: 18, top: 40, bottom: 24 },
    xAxis: { type: 'category', boundaryGap: false, data: xs },
    yAxis: { type: 'value', min: 0, max: 100, axisLabel: { formatter: '{value}%' } },
    series: [
      { name: 'CPU', type: 'line', smooth: true, showSymbol: false, data: cpu, areaStyle: { opacity: 0.08 } },
      { name: '内存', type: 'line', smooth: true, showSymbol: false, data: mem, areaStyle: { opacity: 0.06 } },
      { name: '磁盘', type: 'line', smooth: true, showSymbol: false, data: disk, areaStyle: { opacity: 0.05 } },
    ],
  }
})

async function refresh() {
  try {
    loading.value = true
    servers.value = await listServers({ status: 'all' })
    const first = servers.value[0]
    metrics.value = await getServerMetrics(first?.id || 'global', '6h')
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
    <div class="row">
      <el-card shadow="never" class="card">
        <div class="kpi">
          <div class="label">服务器总数</div>
          <div class="value">{{ total }}</div>
          <div class="meta">已接入的节点规模</div>
        </div>
      </el-card>
      <el-card shadow="never" class="card">
        <div class="kpi">
          <div class="label">在线</div>
          <div class="value success">{{ online }}</div>
          <div class="meta">正常可用</div>
        </div>
      </el-card>
      <el-card shadow="never" class="card">
        <div class="kpi">
          <div class="label">离线</div>
          <div class="value danger">{{ offline }}</div>
          <div class="meta">需要关注</div>
        </div>
      </el-card>
      <el-card shadow="never" class="card">
        <div class="kpi">
          <div class="label">未知</div>
          <div class="value warn">{{ unknown }}</div>
          <div class="meta">尚未上报状态</div>
        </div>
      </el-card>
    </div>

    <el-card shadow="never" class="card chart">
      <template #header>
        <div class="card-header">
          <div>
            <div class="title">资源趋势（示例）</div>
            <div class="sub">CPU / 内存 / 磁盘使用率（%）</div>
          </div>
          <el-button :loading="loading" @click="refresh">刷新</el-button>
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
.row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}
@media (max-width: 980px) {
  .row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 520px) {
  .row {
    grid-template-columns: 1fr;
  }
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
.kpi .label {
  font-size: 13px;
  opacity: 0.75;
}
.kpi .value {
  font-size: 34px;
  font-weight: 800;
  margin-top: 6px;
  letter-spacing: 0.3px;
}
.kpi .meta {
  margin-top: 4px;
  font-size: 12px;
  opacity: 0.7;
}
.success {
  color: #67c23a;
}
.danger {
  color: #f56c6c;
}
.warn {
  color: #e6a23c;
}
.chart :deep(.el-card__body) {
  padding-top: 10px;
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.title {
  font-weight: 800;
}
.sub {
  font-size: 12px;
  opacity: 0.75;
  margin-top: 2px;
}
</style>

