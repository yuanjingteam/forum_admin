<template>
  <div></div>
  <!-- 组件的模板部分，当前没有任何内容 -->
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router'; // 导入 Vue Router 的路由功能

// 获取路由实例
const router = useRouter();
// 获取当前路由信息
const route = useRoute();

// 从路由参数中获取路径，强制转换为字符串类型
const gotoPath = route.params.path as string;

// 使用 router.replace 方法跳转到指定路径
// replace 方法会替换当前的历史记录条目，而不是添加新的条目
router.replace({ path: gotoPath });
</script>

<style scoped lang="less">
/* 当前组件没有样式 */
</style>
