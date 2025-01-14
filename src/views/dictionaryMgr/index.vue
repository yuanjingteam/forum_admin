<script setup lang="ts">
import { ref, watch } from 'vue';
import DictionaryItem from '@/views/dictionaryMgr/dictionaryItem/index.vue';
import DictionaryType from '@/views/dictionaryMgr/dictionaryType/index.vue';
import { SearchItemModel } from '@/views/dictionaryMgr/search/index.vue';
import search from '@/views/dictionaryMgr/search/index.vue';

// 有待扩展
// 搜索字典类型
const searchList = ref({
  name: '',
  code: '',
  status: 1,
  create_at: ''
});

// 搜索字典项模型
const searchItemModel = () => {
  return {
    label: '',
    status: 0,
    start_time: '',
    end_time: ''
  };
};

// 搜索字典项
const searchItem = ref(searchItemModel());

// 当前列
const dict_type = ref('');

// 监听 dict_type 的变化
watch(dict_type, (newValue, oldValue) => {});

// 初始化
const notifyInit = itemCode => {
  dict_type.value = itemCode;
};

// 监听切换
const changeType = (itemCode: string) => {
  dict_type.value = itemCode;
};

// 绑定表格
const dicTable = ref();

// 通知子组件刷新
const notifyRefresh = () => {
  dicTable.value.reFresh(); // 调用子组件的 refresh 方法
};

// 在当前条件下搜索
const handleSearch = (term: SearchItemModel) => {
  searchItem.value.label = term.label;
  searchItem.value.status = term.status;
  searchItem.value.start_time = term.create_at[0];
  searchItem.value.end_time = term.create_at[1];
  notifyRefresh();
};

// 清空
const handleClear = () => {
  // 重置为初始状态
  searchItem.value = searchItemModel();
  console.log(searchItem.value, '重置');
  notifyRefresh();
};
</script>

<template>
  <a-layout style="min-height: 400px">
    <a-layout-sider class="list">
      <dictionary-type
        v-model:search="searchList"
        @check="changeType"
        @update="notifyRefresh"
        @init="notifyInit"
      ></dictionary-type>
    </a-layout-sider>
    <a-layout-content class="item">
      <Breadcrumb :items="['字典管理', '字典项管理']" />
      <search @search="handleSearch" @clearAll="handleClear"></search>
      <dictionary-item
        ref="dicTable"
        v-model:search="searchItem"
        :dict_type="dict_type"
      ></dictionary-item>
    </a-layout-content>
  </a-layout>
</template>

<style scoped>
.list {
  margin: 10px 10px 0;
}

.item {
  padding: 10px;
  margin: 10px 10px 0 0;

  /* background-color: #fff; */
}
</style>
