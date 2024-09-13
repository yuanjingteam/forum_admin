<script setup lang="ts">
import { TableColumnData, TableRowSelection } from '@arco-design/web-vue';
import { ref, reactive } from 'vue';
const columns: TableColumnData[] = [
  {
    title: '字典编号',
    dataIndex: 'id',
    align: 'center'
  },
  {
    title: '字典名称',
    dataIndex: 'dicName',
    slotName: 'dicName'
  },
  {
    title: '字典类型',
    dataIndex: 'dicType'
  },
  {
    title: '状态',
    dataIndex: 'state'
  },
  {
    title: '备注',
    dataIndex: 'remark'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime'
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
    >
      <template #headshot="{ record }">
        <div>
          <img :src="record.headshot" alt="" class="uer-headshot" />
        </div>
      </template>
    </a-table>
  </div>
</template>

<script scoped></script>
