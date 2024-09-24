<script setup lang="ts">
import {
  Message,
  TableColumnData,
  TableRowSelection
} from '@arco-design/web-vue';
import { ref, reactive, onMounted, defineModel, computed } from 'vue';
import { getDicItem } from '@/api/dictionary';
const columns: TableColumnData[] = [
  {
    title: '字典编号',
    dataIndex: 'id',
    align: 'center'
  },
  {
    title: '字典名称',
    dataIndex: 'dic_name',
    slotName: 'dicName'
  },
  {
    title: '字典类型',
    dataIndex: 'dic_type'
  },
  {
    title: '状态',
    dataIndex: 'dic_state'
  },
  {
    title: '备注',
    dataIndex: 'dic_remark'
  },
  {
    title: '创建时间',
    dataIndex: 'create_time'
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

const curPage = ref(1);

// 一共多少数据
const total = ref(10);

// 可选择的每页条目数
const pageSizes = ref([5, 10, 20]);

// 默认每页的数据条数
const limit = ref(10);

// 计算最大页码
const maxPage = computed(() =>
  Math.ceil(pagination.total / pagination.pageSize)
);

// 分页配置
const pagination = reactive({
  pageSize: limit,
  defaultPageSize: limit,
  current: curPage,
  total: total, // 假设总共有100条数据
  showTotal: true, // 设置为布尔值
  showJumper: true,
  showPageSize: true,
  pageSizeOptions: pageSizes,
  onChange: current => handlePageChange(current)
});

// 表格分页
const handlePageChange = current => {
  console.log(111);
  if (current <= maxPage.value && current > 0) {
    pagination.current = current; // 更新当前页码
  }
};

// 获取数据
const getList = async () => {
  try {
    formLoading.value = true;
    const { data } = await getDicItem({
      dic_name: search.value.dic_name,
      dic_type: search.value.dic_type,
      dic_state: search.value.dic_state,
      create_time: search.value.create_time
    });
    dictionary.value.push(...data.data.dic_items);
    total.value = data.data.total;
  } catch (error) {
    Message.info(error.msg);
  } finally {
    formLoading.value = false;
  }
};

// 修改页码
const changePage = item => {
  // 没有访问过就渲染数据
  if (!beforePage.value.includes(item)) {
    // fetchComments();
    // 标记已选择
    beforePage.value.push(item);
  }
  // 切换到当前页
  curPage.value = item;
};

// 处理每页条目数变化
const handlePageSizeChange = size => {
  // 只接收 size
  console.log(`每页条目数已更改为: ${size}`);
  limit.value = size; // 更新每页条目数
  curPage.value = 1; // 重置当前页为1
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
      @page-change="changePage"
      @page-size-change="handlePageSizeChange"
    >
      <template #headshot="{ record }">
        <div>
          <img :src="record.headshot" alt="" class="uer-headshot" />
        </div>
      </template>
    </a-table>
  </div>
</template>

<style scoped></style>
