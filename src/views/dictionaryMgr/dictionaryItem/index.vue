<script setup lang="ts">
import {
  Message,
  TableColumnData,
  TableRowSelection
} from '@arco-design/web-vue';
import {
  ref,
  reactive,
  onMounted,
  defineProps,
  defineModel,
  computed,
  watch
} from 'vue';
import { getDicItem } from '@/api/dictionary';
const columns: TableColumnData[] = [
  {
    title: '字典编号',
    dataIndex: 'id',
    width: 100
  },
  {
    title: '字典标签',
    dataIndex: 'label',
    width: 100,
    align: 'center'
  },
  {
    title: '字典类型',
    width: 100,
    align: 'center',
    dataIndex: 'dict_type_code'
  },
  {
    title: '字典键值',
    width: 100,
    align: 'center',
    dataIndex: 'value'
  },
  {
    title: '排序',
    width: 100,
    align: 'center',
    dataIndex: 'sort'
  },
  {
    title: '状态',
    width: 100,
    align: 'center',
    dataIndex: 'status'
  },
  {
    title: '描述',
    dataIndex: 'description',
    slotName: 'description',
    align: 'center',
    width: 200
  },
  {
    title: '扩展值',
    align: 'center',
    dataIndex: 'extend_value'
  },
  {
    title: '创建时间',
    align: 'center',
    dataIndex: 'create_at'
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

const props = defineProps({
  dict_type: {
    type: String,
    require: true
  }
});

const search = defineModel('search', {
  type: Object as () => {
    label: String;
    dict_type_code: String;
    status: String;
    create_at: String;
  },
  required: true,
  default: () => ({
    label: '',
    dict_type_code: '',
    status: '',
    create_at: ''
  })
});

const curPage = ref(1);

// 一共多少数据
const total = ref(10);

// 可选择的每页条目数
const pageSizes = ref([5, 10, 15]);

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
      dict_type_code: props.dict_type,
      label: search.value.label,
      status: search.value.status,
      create_at: search.value.create_at,
      page: curPage,
      limit: limit
    });
    dictionary.value.push(...data.data.dict_item_list);

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

const reFresh = () => {
  // 清空重新获取数据
  dictionary.value = [];
  beforePage.value = [];
  selectList.value = [];
  selectedKeys.value = [];
  getList();
};

// 在组件挂载时获取数据
onMounted(() => {
  getList(); // 初始化时调用获取数据
});

// 监听切换
watch(
  () => props.dict_type,
  () => {
    reFresh();
  }
);

// 单选可勾选多个
const selectItem = item => {
  selectList.value = item;
  console.log(selectList.value);
};
// 全选,一次性选中当前页所有
const selectAllChange = item => {
  selectList.value = item;
  console.log(selectList.value);
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
      @selection-change="selectAllChange"
      @page-change="changePage"
      @page-size-change="handlePageSizeChange"
    >
      <template #description="{ record }">
        <a-typography-paragraph
          :ellipsis="{
            rows: 2,
            showTooltip: true,
            expandable: true
          }"
        >
          {{ record.description }}
        </a-typography-paragraph>
      </template>
    </a-table>
  </div>
</template>

<style scoped></style>
