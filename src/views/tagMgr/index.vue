<script setup lang="ts">
import { TableColumnData, TableRowSelection } from '@arco-design/web-vue';
import { ref, reactive } from 'vue';
import { getTagList } from '@/api/tag';
const columns: TableColumnData[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    align: 'center'
  },
  {
    title: '标签头像',
    dataIndex: 'path',
    slotName: 'path',
    align: 'center'
  },
  {
    title: '标签名',
    dataIndex: 'name',
    align: 'center'
  },
  {
    title: '标签描述',
    dataIndex: 'description',
    align: 'center'
  },
  {
    title: '关联的文章数量',
    dataIndex: 'article_count',
    align: 'center'
  },
  {
    title: '标签热度',
    dataIndex: 'heat',
    align: 'center',
    sortable: {
      sortDirections: ['ascend']
    }
  },
  {
    title: '关注人数',
    dataIndex: 'fans_count',
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'optional',
    slotName: 'optional',
    align: 'center'
  }
];

const tag_list = ref([]);

// 行的唯一标识数据
const selectedKeys = ref<string[]>([]); // 确保这里初始化为一个空数组

const pagination = { pageSize: 5 };

// 行配置
const rowSelection: TableRowSelection = reactive({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false
});

// 获取列表数据
const getList = async () => {
  const { data } = await getTagList({});
  tag_list.value = [...tag_list.value, ...data.data.tag_list];
};

getList();
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
      :data="tag_list"
      row-key="id"
      stripe
      :row-selection="rowSelection"
      :pagination="pagination"
      @select="selectItem"
      @selection-change="cancelItem"
    >
      <template #path="{ record }">
        <div class="headshot">
          <img :src="record.path" alt="" />
        </div>
      </template>
    </a-table>
  </div>
</template>

<script scoped></script>

<style scoped>
.headshot img {
  width: 60px;
  height: 60px;
}
</style>
