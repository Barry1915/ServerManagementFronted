<script setup lang="ts">
import * as echarts from 'echarts'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

type EChartOption = echarts.EChartsCoreOption

const props = defineProps<{
  option: EChartOption
  height?: string
}>()

const el = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null

function resize() {
  chart?.resize()
}

onMounted(() => {
  if (!el.value) return
  chart = echarts.init(el.value)
  chart.setOption(props.option, { notMerge: true })
  window.addEventListener('resize', resize)
})

watch(
  () => props.option,
  (opt) => {
    if (!chart) return
    chart.setOption(opt, { notMerge: true })
  },
  { deep: true },
)

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  chart?.dispose()
  chart = null
})
</script>

<template>
  <div ref="el" :style="{ width: '100%', height: props.height || '280px' }" />
</template>

