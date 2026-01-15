<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="wrap">
    <el-result icon="warning" title="页面不存在" sub-title="你访问的页面可能已被移动或删除">
      <template #extra>
        <el-button type="primary" @click="router.replace('/dashboard')">返回概览</el-button>
        <el-button @click="router.back()">返回上一页</el-button>
      </template>
    </el-result>
  </div>
</template>

<style scoped>
.wrap {
  padding: 40px 10px;
}
</style>

