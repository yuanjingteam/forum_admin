<script setup lang="ts">
import {
  Message,
  TableColumnData,
  TableRowSelection
} from '@arco-design/web-vue';
import { ref, reactive, onMounted } from 'vue';
import { getDicList } from '@/api/dictionary';
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

// 行的唯一标识数据
const selectedKeys = ref<string[]>([]); // 确保这里初始化为一个空数组

// 行配置
const rowSelection: TableRowSelection = reactive({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false
});

// 当前页
const curPage = ref(1);

// 一共多少数据
const total = defineModel('total', {
  type: Number,
  required: true
});

// 一页多少个
const limit = ref(10);

// 分页配置
const pagination = reactive({
  pageSize: limit,
  defaultPageSize: limit,
  current: curPage,
  total: total // 假设总共有100条数据
});

// 接收数据
const dictionary = ref([]);

// 选中列数组
const selectList = ref([]);

// 删除单选框
const deleteOneVisible = ref(false);
// 当前选中的单个值
const selectOne = ref(-1);

// 之前去过的历史页
const beforePage = ref([]);

// 删除loading
const formLoading = ref(false);

const search = defineModel('search', {
  type: Object as () => {
    dic_name: String;
    dic_type: String;
    dic_state: String;
    create_time: String;
  },
  required: true,
  default: () => ({
    dic_name: '',
    dic_type: '',
    dic_state: '',
    create_time: ''
  })
});
// 获取数据
const getList = async () => {
  try {
    formLoading.value = true;
    const { data } = await getDicList({
      dic_name: search.value.dic_name,
      dic_type: search.value.dic_type,
      dic_state: search.value.dic_state,
      create_time: search.value.create_time
    });
    dictionary.value = [...dictionary.value, ...data.data.dic_list];
    total.value = data.data.total;
  } catch (error) {
    Message.info(error.msg);
  } finally {
    formLoading.value = false;
  }
};

// 在组件挂载时获取数据
onMounted(() => {
  getList(); // 初始化时调用获取数据
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
