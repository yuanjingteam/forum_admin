<script setup lang="ts">
import { ref } from 'vue';
import search from '@/views/tagMgr/search/index.vue';
import TagTable from '@/views/tagMgr/tagTable/index.vue';

const tagTable = ref(null);
const total = ref(10);
const deleteDialog = ref(false);
// 控制按钮的启用状态
const isButtonEnabled = ref(false);

const searchTerm = ref({
  name: ''
});
// 子组键在当前条件下刷新
const notifyRefresh = () => {
  tagTable.value.reFresh(); // 调用子组件的 refresh 方法
};

// 在当前条件下搜索
const handleSearch = (term: any) => {
  searchTerm.value = term; // 更新搜索关键词
  console.log(searchTerm.value.name);
  notifyRefresh();
};

// 打开删除对话框
const notifyDeleteSelect = () => {
  deleteDialog.value = true;
};

// 更新按钮状态,是否可以进行批量操作
const updateButtonState = (value: boolean) => {
  isButtonEnabled.value = value; // 根据子组件的值更新按钮状态
};
</script>

<template>
  <div>
    <search @search="handleSearch" @clearAll="handleSearch"></search>
    <a-tabs type="line">
      <template #extra>
        <span class="selectAll">
          <a-button type="outline" @click="notifyRefresh">刷新</a-button>
          <a-button
            type="outline"
            status="danger"
            :disabled="!isButtonEnabled"
            @click="notifyDeleteSelect"
          >
            批量删除
          </a-button>
        </span>
      </template>

      <a-tab-pane key="1" :title="`全部(${total}) `">
        <tag-table
          ref="tagTable"
          v-model:total="total"
          v-model:delete="deleteDialog"
          :search="searchTerm"
          @update:enabled="updateButtonState"
        ></tag-table>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<style>
.sum {
  font-size: 20px;
  color: #fff;
}

.selectAll {
  float: right;
}
</style>
