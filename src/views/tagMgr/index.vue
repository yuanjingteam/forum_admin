<script setup lang="ts">
import { ref } from 'vue';
import search from '@/views/tagMgr/search/index.vue';
import TagTable from '@/views/tagMgr/tagTable/index.vue';

const tagTable = ref(null);
const total = ref(0);
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
</script>

<template>
  <div>
    <search @search="handleSearch" @clearAll="handleSearch"></search>
    <div>
      <span class="selectAll">
        <a-button
          type="outline"
          status="danger"
          :disabled="!isButtonEnabled"
          @click="notifyDeleteSelect"
        >
          批量删除
        </a-button>
      </span>
    </div>

    <tag-table
      ref="tagTable"
      v-model:total="total"
      v-model:delete="deleteDialog"
      :search="searchTerm"
    ></tag-table>
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
