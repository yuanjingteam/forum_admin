<script setup lang="ts">
import {
  Message,
  TableColumnData,
  TableRowSelection,
  PaginationProps
} from '@arco-design/web-vue';
import { getCommentList } from '@/api/comment';
import { ref, reactive } from 'vue';

const loading = ref(false);
const comments = ref([]);
const columns: TableColumnData[] = [
  {
    title: '作者',
    dataIndex: 'id',
    width: 600,
    slotName: 'author'
  },
  {
    title: '评论',
    dataIndex: 'comment',
    slotName: 'comment'
  },
  {
    title: '回复至',
    dataIndex: 'parent',
    width: 300,
    slotName: 'parent'
  }
];
// 行的唯一标识数据
const selectedKeys = ref<string[]>([]); // 确保这里初始化为一个空数组
// 行配置
const rowSelection: TableRowSelection = reactive({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false
});

const itemType = ref(1);
const page = ref(1);
const limit = ref(10);
// 每一页的设置
const pagination: PaginationProps = {
  pageSize: limit.value
  // currentPage: page.value
  // total: 100 // 假设总共有100条数据
};

const getList = async item => {
  try {
    loading.value = true;
    const { data } = await getCommentList({
      offset: page,
      limit: limit,
      type: item
    });
    comments.value = data.data.comlist;
  } catch (error) {
    Message.info(error.msg);
  } finally {
    loading.value = false;
  }
};

const selectItem = item => {
  console.log(item);
};
const cancelItem = item => {
  console.log(item);
};
// 初始化
getList(itemType);
</script>

<template>
  <div>
    <a-spin :loading="loading" tip="This may take a while...">
      <a-tabs :default-active-key="itemType" @change="getList(itemType)">
        <a-tab-pane key="1" title="全部">
          <a-table
            v-model:selectedKeys="selectedKeys"
            :columns="columns"
            :data="comments"
            row-key="id"
            stripe
            :row-selection="rowSelection"
            :pagination="pagination"
            @select="selectItem"
            @selection-change="cancelItem"
          >
            <template #author="{ record }">
              <div class="left">
                <img :src="record.path" alt="" />
              </div>
              <div class="right">
                <span>{{ record.nickname }}</span>
                <span>{{ record.email }}</span>
              </div>
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="2" title="我的">Content of Tab Panel 2</a-tab-pane>
        <a-tab-pane key="3">
          <template #title>待审</template>
          Content of Tab Panel 3
        </a-tab-pane>
        <a-tab-pane key="4" title="已批准"></a-tab-pane>
        <a-tab-pane key="5" title="垃圾"></a-tab-pane>
        <a-tab-pane key="6" title="回收站"></a-tab-pane>
      </a-tabs>
    </a-spin>
  </div>
</template>

<style scoped>
.left {
  height: 60px;
  width: 20px;
}
.left img {
  width: 10px;
  height: 40px;
}
.right {
  float: left;
  display: flex;
  flex-direction: column;
}
</style>
