<script setup lang="ts">
import { ref } from 'vue';
import DictionaryItem from '@/views/dictionaryMgr/dictionaryItem/index.vue';
import DictionaryList from '@/views/dictionaryMgr/dictionaryList/index.vue';
const search = ref();

// 处理来自子组件的 check 事件
const handleCheck = id => {
  console.log(id);
  // 在这里处理 ID，例如执行某个操作或刷新数据
};
</script>

<template>
  <a-layout style="min-height: 400px">
    <a-layout-sider class="list">
      <dictionary-list @check="handleCheck"></dictionary-list>
    </a-layout-sider>
    <a-layout-content class="item">
      <dictionary-item v-model:search="search"></dictionary-item>
    </a-layout-content>
  </a-layout>
</template>

<style scoped>
.list {
  height: 600px;
  padding: 10px;
  margin: 10px 10px 0;
}

.item {
  height: 600px;
  padding: 10px;
  margin: 10px 10px 0 0;
  background-color: #fff;
}
</style>
