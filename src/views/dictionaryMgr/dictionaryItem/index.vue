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
import { getDicItem, delDicItem, updateDicItem } from '@/api/dictionary';
// import AddItemfrom from '@/views/dictionaryMgr/dictionaryItem/AddItem/index.vue';
import EditItem from '@/views/dictionaryMgr/dictionaryItem/EditItem/index.vue';

// 定义行
const columns: TableColumnData[] = [
  {
    title: '字典编号',
    dataIndex: 'id',
    width: 90
  },
  {
    title: '字典标签',
    dataIndex: 'label',
    width: 90,
    align: 'center'
  },
  {
    title: '字典类型',
    width: 90,
    align: 'center',
    dataIndex: 'dict_type_code'
  },
  {
    title: '字典键值',
    width: 90,
    align: 'center',
    dataIndex: 'value'
  },
  {
    title: '排序',
    width: 80,
    align: 'center',
    dataIndex: 'sort'
  },
  {
    title: '状态',
    width: 120,
    align: 'center',
    dataIndex: 'status',
    slotName: 'status'
  },
  {
    title: '描述',
    dataIndex: 'description',
    width: 180,
    slotName: 'description',
    align: 'center'
  },
  {
    title: '扩展值',
    width: 90,
    align: 'center',
    dataIndex: 'extend_value'
  },
  {
    title: '创建时间',
    align: 'center',
    width: 180,
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

// 当前页
const curPage = ref(1);

// 一共多少数据
const total = ref(10);

// 可选择的每页条目数
const pageSizes = ref([5, 10, 15]);

// 默认每页的数据条数
const limit = ref(5);

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

// 接收数据
const dictionary = ref([]);

// 删除loading
const formLoading = ref(false);

// 编辑可见框
const editVisible = ref(false);

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
    start_time: String;
    end_time: String;
  },
  required: true,
  default: () => ({
    label: '',
    dict_type_code: '',
    status: '',
    start_time: '',
    end_time: ''
  })
});

const editData = ref({
  id: -1,
  label: '',
  value: 0,
  sort: 0,
  status: 0,
  description: '',
  extend_value: ''
});

// 获取数据
const getList = async () => {
  formLoading.value = true;
  try {
    const { data } = await getDicItem({
      dict_type_code: props.dict_type,
      label: search.value.label,
      status: search.value.status,
      start_time: search.value.start_time,
      end_time: search.value.end_time,
      page: curPage,
      limit: limit
    });
    dictionary.value = data.data.dict_item_list;
    total.value = data.data.total;
  } catch (error) {
    Message.info(error.msg);
  } finally {
    formLoading.value = false;
  }
};

// 修改页码
const changePage = item => {
  // 切换到当前页
  curPage.value = item;
  // 获取当前页数据
  getList();
};

// 处理每页条目数变化
const handlePageSizeChange = size => {
  // 只接收 size
  console.log(`每页条目数已更改为: ${size}`);
  limit.value = size; // 更新每页条目数
  curPage.value = 1; // 重置当前页为1
};

// 单选可勾选多个
const selectItem = item => {
  console.log(item);
};
// 全选,一次性选中当前页所有
const selectAllChange = item => {
  console.log(item);
};

// 批量删除
const deleteSelect = async () => {
  await delDicItem({
    dict_type_code: props.dict_type,
    id_list: selectedKeys
  });
  selectedKeys.value = [];
  getList();
};

// 编辑
const editSelect = record => {
  editVisible.value = true;
  editData.value = record;
};

// 单个删除
const deleteItem = async (dict_type, id) => {
  await delDicItem({
    dict_type_code: dict_type,
    id_list: [id]
  });
};

// 改变状态
const switchChange = async item => {
  const mid = item;
  console.log(mid.status, 242);
  await updateDicItem({
    id: mid.id,
    label: mid.label,
    value: mid.value,
    sort: mid.sort,
    status: mid.status,
    description: mid.description,
    extend_value: mid.extend_value
  });
};

const reFresh = () => {
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
    curPage.value = 1; // 重置当前页为1
    getList();
  }
);

// 暴露方法给父组件
defineExpose({ reFresh });
</script>

<template>
  <div class="main">
    <edit-item v-model:visible="editVisible" :editData="editData"></edit-item>
    <a-spin :loading="formLoading" tip="This may take a while..." class="main">
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
        <template #status="{ record }">
          <div>
            <a-switch
              v-model="record.status"
              :default-checked="record.status == 0 ? true : false"
              :checked-value="0"
              :unchecked-value="1"
              @change="switchChange(record)"
            />
            <span class="dic-state">
              {{ record.status == 0 ? '开启' : '关闭' }}
            </span>
          </div>
        </template>

        <template #optional="{ record }">
          <a-button type="text" @click="editSelect(record)">
            <template #icon>
              <icon-edit />
            </template>
            <template #default>编辑</template>
          </a-button>

          <a-popconfirm
            content="您确定要删除吗？"
            @ok="deleteItem(record.dict_type_code, record.id)"
          >
            <a-button type="text">
              <template #icon>
                <icon-delete />
              </template>
              <template #default>删除</template>
            </a-button>
          </a-popconfirm>
        </template>
      </a-table>
    </a-spin>
  </div>
</template>

<style scoped>
.main {
  width: 100%;
}

.dic-state {
  margin-left: 12px;
}
</style>
