<script setup lang="ts">
import { ref, watch } from 'vue';
// 子组件1
import CommentTable from '@/views/commentMgr/commentTable/index.vue';
// 子组件2
import search from '@/views/commentMgr/search/index.vue';

// 表格子组件
// 每一栏的类型
const itemType = ref('1');
const deleteDialog = ref(false);
// 控制按钮的启用状态
const isButtonEnabled = ref(false);
// 创建对子组件的引用
const comTable = ref(null);
// 通知子组件调用刷新方法
const notifyRefresh = () => {
  if (comTable.value) {
    comTable.value.reFresh(); // 调用子组件的 refresh 方法
  }
};
// 更新按钮状态
const updateButtonState = enabled => {
  isButtonEnabled.value = enabled; // 根据子组件的值更新按钮状态
};
const notifyDeleteSelect = () => {
  deleteDialog.value = true; // 打开删除对话框
  console.log(deleteDialog.value);
};
// 监听 切换
watch(itemType, newCount => {
  console.log(newCount, '切换了');
  isButtonEnabled.value = false;
});

// 搜索子组件
const searchTerm = ref(null);
const handleSearch = term => {
  searchTerm.value = term; // 更新搜索关键词
};
</script>

<template>
  <div>
    <div>
      <search @search="handleSearch" @clearAll="notifyRefresh"></search>
    </div>
    <a-tabs v-model:active-key="itemType" :searchTerm="searchTerm">
      <template #extra>
        <div class="deletSelect">
          <a-button type="outline" @click="notifyRefresh">刷新</a-button>
          <a-button
            type="outline"
            status="danger"
            :disabled="!isButtonEnabled"
            @click="notifyDeleteSelect"
          >
            批量删除
          </a-button>
          <span v-if="itemType == '2'">
            <a-button type="outline" @click="notifyRefresh">一键审核</a-button>
          </span>
        </div>
      </template>
      <a-tab-pane key="1" title="全部">
        <div v-if="itemType === '1'">
          <comment-table
            ref="comTable"
            v-model="deleteDialog"
            :type="itemType"
            @update:enabled="updateButtonState"
          ></comment-table>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2">
        <template #title>待审</template>
        <div v-if="itemType === '2'">
          <comment-table
            ref="comTable"
            v-model="deleteDialog"
            :type="itemType"
            @update:enabled="updateButtonState"
          ></comment-table>
        </div>
      </a-tab-pane>
      <a-tab-pane key="3" title="已批准">
        <div v-if="itemType === '3'">
          <comment-table
            ref="comTable"
            v-model="deleteDialog"
            :type="itemType"
            @update:enabled="updateButtonState"
          ></comment-table>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<style scoped>
.deletSelect button {
  margin-left: 10px;
}
</style>
