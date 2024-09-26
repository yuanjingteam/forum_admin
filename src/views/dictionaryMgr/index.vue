<script setup lang="ts">
import { ref } from 'vue';
import DictionaryItem from '@/views/dictionaryMgr/dictionaryItem/index.vue';
import DictionaryList from '@/views/dictionaryMgr/dictionaryList/index.vue';

// 有待扩展
// 搜索字典
const searchList = ref({
  name: '',
  code: '',
  status: '',
  create_at: ''
});

// 搜索字典项
const searchItem = ref({
  dict_type_code: '',
  label: '',
  status: '',
  create_at: ''
});

// 当前列
const dict_type = ref('');

// 监听当前列
const changeType = (itemCode: string) => {
  dict_type.value = itemCode;
};
</script>

<template>
  <a-layout style="min-height: 400px">
    <a-layout-sider class="list">
      <dictionary-list
        v-model:search="searchList"
        @check="changeType"
      ></dictionary-list>
    </a-layout-sider>
    <a-layout-content class="item">
      <dictionary-item
        v-model:search="searchItem"
        :dict_type="dict_type"
      ></dictionary-item>
    </a-layout-content>
  </a-layout>
</template>

<style scoped>
.list {
  padding: 10px;
  margin: 10px 10px 0;
}

.item {
  padding: 10px;
  margin: 10px 10px 0 0;
  background-color: #fff;
}
</style>
