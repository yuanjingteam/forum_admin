<script setup lang="ts">
import { ref } from 'vue';
import { SearchModel } from '@/views/commentMgr/search/index.vue';
// 子组件1
import CommentTable from '@/views/commentMgr/commentTable/index.vue';
// 子组件2
import search from '@/views/commentMgr/search/index.vue';

// 表格子组件
// 每一栏的类型
const itemType = ref('1');

// 创建对子组件的引用
const comTable1 = ref();
const comTable2 = ref();
const comTable3 = ref();

const total_1 = ref<number>(0);
const total_2 = ref<number>(0);
const total_3 = ref<number>(0);

// 搜索子组件
const searchTerm = ref<SearchModel>({
  email: '',
  nickname: '',
  title: '',
  parent_email: ''
});

// 在当前条件下搜索
const handleSearch = (term: SearchModel) => {
  searchTerm.value = term; // 更新搜索关键词
  if (itemType.value === '1') {
    comTable1.value.reFresh(); // 调用子组件的 refresh 方法
  } else if (itemType.value == '2') {
    comTable2.value.reFresh(); // 调用子组件的 refresh 方法
  } else if (itemType.value == '3') {
    comTable3.value.reFresh(); // 调用子组件的 refresh 方法
  }
};
</script>

<template>
  <div class="main">
    <Breadcrumb :items="['评论管理']" />
    <div>
      <search @search="handleSearch" @clearAll="handleSearch"></search>
    </div>
    <a-card>
      <a-row>
        <a-tabs v-model:active-key="itemType" type="line">
          <a-tab-pane key="1" :title="`全部${total_1} `">
            <comment-table
              ref="comTable1"
              v-model:total="total_1"
              :search="searchTerm"
              itemType="1"
            ></comment-table>
          </a-tab-pane>
          <a-tab-pane key="2" :title="`待审${total_2}`">
            <comment-table
              ref="comTable2"
              v-model:total="total_2"
              :search="searchTerm"
              itemType="2"
            ></comment-table>
          </a-tab-pane>
          <a-tab-pane key="3" :title="`已批准${total_3}`">
            <comment-table
              ref="comTable3"
              v-model:total="total_3"
              :search="searchTerm"
              itemType="3"
            ></comment-table>
          </a-tab-pane>
        </a-tabs>
      </a-row>
    </a-card>
  </div>
</template>

<style scoped>
:deep(.arco-tabs-content) {
  padding-top: 0;
}

.main {
  margin: 0 15px;
}
</style>
