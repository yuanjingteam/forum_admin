<script setup lang="ts">
import {
  Message,
  TableColumnData,
  TableData,
  TableRowSelection
} from '@arco-design/web-vue';
import { ref, Ref, reactive, onMounted, computed, watch } from 'vue';
import useLoading from '@/hooks/useLoading';
import {
  getDicItem,
  delDicItem,
  updateDicItem,
  EditDicItem
} from '@/api/dictionary';
import OptionsItem from '@/views/dictionaryMgr/dictionaryItem/optionsItem/index.vue';

// 定义行
const columns = computed<TableColumnData[]>(() => [
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
  // {
  //   title: '字典类型',
  //   width: 90,
  //   align: 'center',
  //   dataIndex: 'dict_type_code'
  // },
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
    width: 200,
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
]);

// 行的唯一标识数据
const selectedKeys = ref<number[]>([]); // 确保这里初始化为一个空数组

// 行配置
const rowSelection: TableRowSelection = reactive({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false
});

// 当前页
const curPage = ref<number>(1);

// 一共多少数据
const total = ref<number>(10);

// 可选择的每页条目数
const pageSizes = ref<number[]>([5, 10, 15]);

// 默认每页的数据条数
const limit = ref(5);

// 计算最大页码
const maxPage = computed<number>(() =>
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
  onChange: (current: number) => handlePageChange(current)
});

// 表格分页
const handlePageChange = (current: number) => {
  if (current <= maxPage.value && current > 0) {
    pagination.current = current; // 更新当前页码
  }
};

// 接收数据
const dictionary: Ref<TableData[]> = ref([]);

// loading效果
const { loading, setLoading } = useLoading(false);

// 修改状态按钮
const switchCheck = ref(false);

// 批量删除模态框
const delSelectVisible = ref(false);

// 是否可以批量删除
const isButtonEnabled = ref(false);

// 编辑可见框
const optionsVisible = ref(false);

const props = defineProps({
  dict_type: {
    type: String,
    require: true
  }
});

const editDataModel = () => {
  return {
    id: -1,
    label: '',
    value: 0,
    sort: 0,
    status: 1,
    description: '',
    extend_value: ''
  };
};

const search = defineModel('search', {
  type: Object as () => {
    label: string;
    status: number;
    start_time: string;
    end_time: string;
  },
  required: true,
  default: () => ({
    label: '',
    status: 0,
    start_time: '',
    end_time: ''
  })
});

const editData = ref(editDataModel());
const selectType = ref('add');

// 获取数据
const getList = async () => {
  setLoading(true);
  try {
    const { data } = await getDicItem({
      dict_type_code: props.dict_type,
      label: search.value.label,
      status: search.value.status,
      create_at_begin: search.value.start_time,
      create_at_end: search.value.end_time,
      page: curPage.value,
      limit: limit.value
    });

    dictionary.value = data.dict_item_list;
    total.value = data.total;
  } catch (error) {
    Message.info(error.msg);
  } finally {
    setLoading(false);
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
  getList();
};

// 单选可勾选多个
const selectItem = item => {
  console.log(item);
};
// 全选,一次性选中当前页所有
const selectAllChange = item => {
  console.log(item);
};

// 改变状态
const switchData = ref<EditDicItem>();
// 声明一个Promise等待用户做出选择后再进行后续操作
let resolvePromise: (value?: unknown) => void;
const switchChange = async (item: EditDicItem) => {
  // 保存原始状态
  switchData.value = item;
  // 显示模态框
  switchCheck.value = true;
  // 阻塞后续代码，直到用户做出选择
  await new Promise(resolve => {
    resolvePromise = resolve; // 保存 resolve 函数
  });
  item.status = switchData.value.status;
};

const getSwitch = async (item: EditDicItem) => {
  try {
    await updateDicItem(item);
    Message.info('修改成功');
  } catch (error) {
    Message.info(error.msg);
    switchData.value.status = switchData.value.status === 1 ? 2 : 1;
  } finally {
    resolvePromise(); // 继续执行后续代码
  }
};

// 确认更改
const confirmChange = () => {
  // 用户确认后关闭模态框
  switchCheck.value = false;
  // 调用更改方法
  getSwitch(switchData.value);
};

// 取消更改
const cancelChange = () => {
  switchCheck.value = false;
  switchData.value.status = switchData.value.status === 1 ? 2 : 1;
  resolvePromise(); // 继续执行后续代码
};

// 确认批量删除
const confirmDelSelect = () => {
  delSelectVisible.value = true;
};

// 删除当前项
const deleteItem = async (dict_type: string, id: number) => {
  await delDicItem({
    dict_type_code: dict_type,
    id_list: [id]
  });
  reFresh();
};

// 编辑当前项
const editSelect = record => {
  optionsVisible.value = true;
  const { id, label, value, status, sort, description, extend_value } = record;
  editData.value = {
    id,
    label,
    value,
    sort,
    status,
    description,
    extend_value
  };
  selectType.value = 'edit';
};

// 新增字典项
const addDicItem = () => {
  optionsVisible.value = true;
  selectType.value = 'add';
  editData.value = editDataModel();
};

// 批量删除
const batchDeleteDic = async () => {
  try {
    setLoading(true);
    await delDicItem({
      dict_type_code: props.dict_type,
      id_list: selectedKeys.value
    });
    selectedKeys.value = [];
    getList();
  } catch {
  } finally {
    setLoading(false);
  }
};

// 刷新页面
const reFresh = () => {
  getList();
};

// 监听切换
watch(
  () => props.dict_type,
  () => {
    curPage.value = 1; // 重置当前页为1
    selectedKeys.value = [];
    getList();
  }
);

// 监听是否可以批量删除
watch(selectedKeys, newCount => {
  if (newCount.length > 0) {
    isButtonEnabled.value = true;
  } else {
    isButtonEnabled.value = false;
  }
});

// 暴露方法给父组件
defineExpose({ reFresh });
</script>

<template>
  <div class="main">
    <a-modal
      v-model:visible="switchCheck"
      @ok="confirmChange"
      @cancel="cancelChange"
    >
      <template #title>Title</template>
      <div>确认要修改当前字典项的状态吗?</div>
    </a-modal>

    <a-modal v-model:visible="delSelectVisible" @ok="batchDeleteDic">
      <template #title>Title</template>
      <div>确认删除选中项吗?</div>
    </a-modal>

    <options-item
      v-model:visible="optionsVisible"
      :editData="editData"
      :dict_type_code="props.dict_type"
      :type="selectType"
      @update="reFresh()"
    ></options-item>
    <a-spin :loading="loading" tip="This may take a while..." class="main">
      <a-space class="batch-operation">
        <a-button
          v-permission="['acl:dic_item:add']"
          type="primary"
          @click="addDicItem()"
        >
          <template #icon>
            <icon-plus />
          </template>
          新建
        </a-button>
        <a-button
          v-permission="['acl:dic_item:delete']"
          type="dashed"
          status="danger"
          :disabled="!isButtonEnabled"
          @click="confirmDelSelect"
        >
          <template #icon>
            <icon-delete />
          </template>
          批量删除
        </a-button>
      </a-space>

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
              v-permission="['acl:dic_item:edit']"
              :checked-value="1"
              :unchecked-value="2"
              @change="switchChange(record)"
            />
            <span class="dic-state">
              {{ record.status == 1 ? '开启' : '关闭' }}
            </span>
          </div>
        </template>

        <template #optional="{ record }">
          <a-button
            v-permission="['acl:dic_item:edit']"
            type="text"
            @click="editSelect(record)"
          >
            <template #icon>
              <icon-edit />
            </template>
            <template #default>编辑</template>
          </a-button>

          <a-popconfirm
            content="您确定要删除吗？"
            @ok="deleteItem(record.dict_type_code, record.id)"
          >
            <a-button v-permission="['acl:dic_item:delete']" type="text">
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

<style scoped lang="less">
.main {
  width: 100%;
}

.batch-operation {
  margin: 10px 0;
}

.dic-state {
  margin-left: 12px;
}
</style>
