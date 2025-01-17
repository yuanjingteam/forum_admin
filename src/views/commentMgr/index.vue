<script setup lang="ts">
import { ref, watch } from 'vue';
import { SearchModel } from '@/views/commentMgr/search/index.vue';
// 子组件1
import CommentTable from '@/views/commentMgr/commentTable/index.vue';
// 子组件2
import search from '@/views/commentMgr/search/index.vue';

// 表格子组件
// 每一栏的类型
const itemType = ref('1');

// 批量删除
const deleteDialog1 = ref<boolean>(false);
const deleteDialog2 = ref<boolean>(false);
const deleteDialog3 = ref<boolean>(false);
// 批量审核
const auditDialog1 = ref<boolean>(false);
const auditDialog2 = ref<boolean>(false);
const auditDialog3 = ref<boolean>(false);

// 创建对子组件的引用
const comTable1 = ref();
const comTable2 = ref();
const comTable3 = ref();

const total_1 = ref<number>(0);
const total_2 = ref<number>(0);
const total_3 = ref<number>(0);

// 控制按钮的启用状态
const isButtonEnabled = ref<boolean>(false);

// 搜索子组件
const searchTerm = ref<SearchModel>({
  email: '',
  nickname: '',
  title: '',
  parent_email: ''
});

// 子组键在当前条件下刷新
const notifyRefresh = () => {
  if (itemType.value === '1') {
    comTable1.value.reFresh(); // 调用子组件的 refresh 方法
  } else if (itemType.value == '2') {
    comTable2.value.reFresh(); // 调用子组件的 refresh 方法
  } else if (itemType.value == '3') {
    comTable3.value.reFresh(); // 调用子组件的 refresh 方法
  }
};

// 更新按钮状态,是否可以进行批量操作/对于删除和审核
const updateButtonState = (value: boolean) => {
  isButtonEnabled.value = value; // 根据子组件的值更新按钮状态
};

// // 打开批量删除对话框
const notifyDeleteSelect = () => {
  if (itemType.value === '1') {
    deleteDialog1.value = true;
  } else if (itemType.value == '2') {
    deleteDialog2.value = true;
  } else if (itemType.value == '3') {
    deleteDialog3.value = true;
  }
};

// 打开一键审核对话框
const notifyAudit = () => {
  if (itemType.value === '1') {
    auditDialog1.value = true;
  } else if (itemType.value == '2') {
    auditDialog2.value = true;
  } else if (itemType.value == '3') {
    auditDialog3.value = true;
  }
};

// 在当前条件下搜索
const handleSearch = (term: SearchModel) => {
  searchTerm.value = term; // 更新搜索关键词
  notifyRefresh();
};

// 监听 切换
watch(itemType, newCount => {
  console.log(newCount);
  notifyRefresh();
  isButtonEnabled.value = false;
});
</script>

<template>
  <div class="main">
    <Breadcrumb :items="['评论管理']" />
    <div>
      <search @search="handleSearch" @clearAll="handleSearch"></search>
    </div>
    <a-tabs v-model:active-key="itemType" type="line">
      <template #extra>
        <div class="deletSelect">
          <a-button
            v-permission="['acl:comment:search']"
            type="primary"
            @click="notifyRefresh"
          >
            刷新
          </a-button>
          <a-button
            v-permission="['acl:comment:delete']"
            type="dashed"
            status="danger"
            :disabled="!isButtonEnabled"
            @click="notifyDeleteSelect"
          >
            批量删除
          </a-button>
          <span v-if="itemType == '2'">
            <a-button
              v-permission="['acl:comment:audit']"
              type="outline"
              status="success"
              :disabled="!isButtonEnabled"
              @click="notifyAudit"
            >
              一键审核
            </a-button>
          </span>
        </div>
      </template>
      <a-tab-pane key="1" :title="`全部${total_1} `">
        <comment-table
          ref="comTable1"
          v-model:delete="deleteDialog1"
          v-model:audit="auditDialog1"
          v-model:total="total_1"
          :search="searchTerm"
          itemType="1"
          @update:enabled="updateButtonState"
        ></comment-table>
      </a-tab-pane>
      <a-tab-pane key="2" :title="`待审${total_2}`">
        <comment-table
          ref="comTable2"
          v-model:delete="deleteDialog2"
          v-model:audit="auditDialog2"
          v-model:total="total_2"
          :search="searchTerm"
          itemType="2"
          @update:enabled="updateButtonState"
        ></comment-table>
      </a-tab-pane>
      <a-tab-pane key="3" :title="`已批准${total_3}`">
        <comment-table
          ref="comTable3"
          v-model:delete="deleteDialog3"
          v-model:audit="auditDialog3"
          v-model:total="total_3"
          :search="searchTerm"
          itemType="3"
          @update:enabled="updateButtonState"
        ></comment-table>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<style scoped>
:deep(.arco-tabs-content) {
  padding-top: 0;
}

.main {
  margin: 0 15px;
}

.deletSelect button {
  margin: 0 5px;
}
</style>
