<script setup lang="ts">
import { TableColumnData, TableRowSelection } from '@arco-design/web-vue';
import { ref, reactive } from 'vue';
const columns: TableColumnData[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    align: 'center'
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    align: 'center'
  },
  {
    title: '昵称',
    dataIndex: 'email',
    align: 'center'
  },
  {
    title: '文章',
    dataIndex: 'title',
    align: 'center'
  },
  {
    title: '时间',
    dataIndex: 'releaseTime',
    align: 'center',
    sortable: {
      sortDirections: ['ascend']
    }
  },
  {
    title: '状态',
    dataIndex: 'releaseTime',
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'optional',
    slotName: 'optional',
    align: 'center'
  }
];
const dictionary = ref([]);

// 行的唯一标识数据
const selectedKeys = ref<string[]>([]); // 确保这里初始化为一个空数组

const pagination = { pageSize: 5 };

// 行配置
const rowSelection: TableRowSelection = reactive({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false
});

const selectItem = item => {
  console.log(item);
};
const cancelItem = item => {
  console.log(item);
};
</script>

<template>
  <div>
    <a-table
      v-model:selectedKeys="selectedKeys"
      :columns="columns"
      :data="dictionary"
      row-key="id"
      stripe
      :row-selection="rowSelection"
      :pagination="pagination"
      @select="selectItem"
      @selection-change="cancelItem"
    ></a-table>
  </div>
</template>

<script scoped></script>
