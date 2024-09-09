<template>
  <div class="container">
    <!-- 面包屑导航，显示当前页面的路径 -->
    <Breadcrumb :items="['字典管理', '分类管理']" />
    <a-space direction="vertical" :size="16" fill>
      <!-- 当前用户资料卡片 -->
      <a-card class="general-card">
        <ProfileItem :loading="loading" />
      </a-card>
      <!-- 之前用户资料卡片 -->
      <a-card class="general-card">
        <ProfileItem :loading="preLoading" type="pre" />
      </a-card>
      <!-- 操作日志组件 -->
      <OperationLog />
    </a-space>
  </div>
</template>

<script lang="ts" setup>
// 导入 Vue 的响应式 API
import { ref } from 'vue';
// 导入自定义的 loading 钩子
import useLoading from '@/hooks/useLoading';

// 使用自定义的 loading 钩子，初始化 loading 状态
const { loading, setLoading } = useLoading(true);
// 另一个 loading 状态用于之前的数据加载
const { loading: preLoading, setLoading: preSetLoading } = useLoading(true);
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px;
}

.steps {
  max-width: 548px;
  margin: 0 auto 10px;
}
</style>
