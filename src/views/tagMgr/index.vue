<script setup lang="ts">
import { reactive, ref } from 'vue';
import search from '@/views/tagMgr/search/index.vue';
import TagTable from '@/views/tagMgr/tagTable/index.vue';

// 当前绑定的DOM元素
const tagTable = ref(null);

// 总数
const total = ref(10);

const searchTerm = reactive({
  name: ''
});
// 子组键在当前条件下刷新
const notifyRefresh = () => {
  tagTable.value.reFresh(); // 调用子组件的 refresh 方法
};

// 在当前条件下搜索
const handleSearch = (term: any) => {
  searchTerm.name = term.value.name; // 直接更新搜索关键词
  notifyRefresh(); // 调用相关处理
};
</script>

<template>
  <div class="main">
    <Breadcrumb :items="['标签管理']" />
    <search @search="handleSearch" @clearAll="handleSearch"></search>
    <tag-table
      ref="tagTable"
      v-model:total="total"
      :search="searchTerm"
    ></tag-table>
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
