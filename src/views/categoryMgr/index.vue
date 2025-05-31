<script setup lang="ts">
import { reactive, ref } from 'vue';
import Search from '@/views/categoryMgr/search/index.vue';
import CategoryTable from '@/views/categoryMgr/categoryTable/index.vue';

// 当前绑定的DOM元素
const categoryTable = ref(null);

// 总数
const total = ref(0);

const searchTerm = reactive({
  name: ''
});

// 子组键在当前条件下刷新
const notifyRefresh = () => {
  categoryTable.value.reFresh(); // 调用子组件的 refresh 方法
};

// 在当前条件下搜索
const handleSearch = (term: any) => {
  searchTerm.name = term.value.name; // 直接更新搜索关键词
  notifyRefresh(); // 调用相关处理
};
</script>

<template>
  <div class="main">
    <Breadcrumb :items="['分类管理']" />
    <search @search="handleSearch" @clearAll="handleSearch"></search>
    <category-table
      ref="categoryTable"
      v-model:total="total"
      :search="searchTerm"
    ></category-table>
  </div>
</template>

<style scoped lang="less">
:deep(.arco-tabs-content) {
  padding-top: 0;
}

.main {
  margin: 0 15px;
}

.sum {
  font-size: 20px;
  color: #fff;
}

.selectAll {
  float: right;

  button {
    margin: 0 5px;
  }
}
</style>
