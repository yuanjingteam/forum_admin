<script setup lang="ts">
import {
  TableColumnData,
  TableRowSelection,
  Message
} from '@arco-design/web-vue';
import { ref, reactive, watch, onMounted, computed } from 'vue';
import useLoading from '@/hooks/useLoading';
import { deleteCategory, getAllCategories } from '@/api/category';
import { dynamicMenuList } from '@/api/category';
import EditItem from '@/views/categoryMgr/categoryTable/EditItem/index.vue';
import AddItem from '@/views/categoryMgr/categoryTable/AddItem/index.vue';

const props = defineProps({
  search: {
    type: Object as () => {
      name: string;
    },
    required: false,
    default: () => ({
      name: ''
    })
  }
});

// 定义更新,是否可以进行批量操作
const emit = defineEmits(['update:enabled']);

const columns: TableColumnData[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    align: 'center'
  },
  {
    title: '分类图标',
    dataIndex: 'icon',
    slotName: 'icon',
    align: 'center'
  },
  {
    title: '分类名称',
    dataIndex: 'name',
    align: 'center'
  },
  {
    title: '可见性',
    dataIndex: 'visible',
    align: 'center',
    slotName: 'visible'
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    align: 'center',
    slotName: 'created_at'
  },
  {
    title: '更新时间',
    dataIndex: 'update_at',
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'optional',
    slotName: 'optional',
    align: 'center'
  }
];

// 当前页
const curPage = ref(1);

// 总数
const total = ref(0);

// 控制按钮的启用状态
const isButtonEnabled = ref(false);

// 删除弹框
const deleteDialog = ref(false);

// 修改框
const editVisible = ref(false);
const addVisible = ref(false);

// 当前项ID
const editId = ref(-1);

// 编辑项
const editData = ref({
  id: -1,
  name: '',
  icon: '',
  sort: 0,
  visible: 1,
  type: 0,
  category_id: 0,
  tag_id: 0
});

// 配置表格分页
const pageSizes = ref([5, 10, 15]); // 可选择的每页条目数

// 默认每页的数据条数
const PAGE_LIMIT = ref(10);

// 计算最大页码
const maxPage = computed(() => Math.ceil(total.value / PAGE_LIMIT.value));

const pagination = reactive({
  pageSize: PAGE_LIMIT,
  defaultPageSize: PAGE_LIMIT,
  current: curPage,
  total: total, // 假设总共有100条数据
  showTotal: true, // 设置为布尔值
  showJumper: true,
  showPageSize: true,
  pageSizeOptions: pageSizes
});

// 行的唯一标识数据
const selectedKeys = ref<number[]>([]); // 确保这里初始化为一个空数组

// 行配置
const rowSelection: TableRowSelection = reactive({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false
});

// 分类列表
const formModel = ref<dynamicMenuList[]>([]);

// 选中列数组
const selectList = ref<number[]>([]);

// 加载
const { loading, setLoading } = useLoading(true);

// 获取列表数据
const fetchCategoryList = async () => {
  setLoading(true);
  try {
    const { data } = await getAllCategories();

    formModel.value = data.filter(item => {
      if (props.search && props.search.name) {
        return item.name.includes(props.search.name);
      }
      return true;
    });
    total.value = formModel.value.length;
  } catch (error) {
    Message.error('获取分类列表失败');
  } finally {
    setLoading(false);
  }
};

// 在组件挂载时获取数据
onMounted(() => {
  fetchCategoryList(); // 初始化时调用获取数据
});

// 表格分页
const onPageChange = (current: number) => {
  if (current <= maxPage.value && current > 0) {
    pagination.current = current; // 更新当前页码
  }
  reFresh();
};

// 删除
const confirmDeleteSelect = async (selectArray: Array<number>) => {
  try {
    // 删除选中的分类
    await deleteCategory({ ids: selectArray });
    // 删除
    selectedKeys.value = selectedKeys.value.filter(
      key => !selectArray.includes(key)
    );
    // 重定向到第一页
    curPage.value = 1;
    // 重新获取数据
    reFresh();
    Message.success('删除成功');
  } catch (error) {
    Message.error('删除失败');
  }
};

// 处理每页条目数变化
const handlePageSizeChange = size => {
  PAGE_LIMIT.value = size; // 更新每页条目数
  pagination.pageSize = size;
  curPage.value = 1; // 重置当前页为1
  reFresh();
};

// 单选,可勾选多个
const selectItem = item => {
  selectList.value = item;
};

// 全选,一次性选中当前页所有
const selectAllChange = item => {
  selectList.value = item;
};

// 修改分类
const toEditItem = async item => {
  editVisible.value = true;
  // 清空之前的,重新获取当前列的信息
  if (editId.value !== item.id) {
    editData.value = { ...item };
    editId.value = item.id;
  }
};

// 添加分类
const toAddItem = () => {
  addVisible.value = true;
};

// 通用刷新方法
const reFresh = () => {
  fetchCategoryList();
};

// 监听 selectedKeys 的变化并更新按钮状态
watch(selectedKeys, newCount => {
  isButtonEnabled.value = newCount.length > 0;
});

defineExpose({ reFresh });
</script>

<template>
  <div class="main">
    <edit-item
      v-model:visible="editVisible"
      :editData="editData"
      @refresh="reFresh"
    ></edit-item>
    <add-item v-model:visible="addVisible" @update="reFresh"></add-item>
    <a-modal
      v-model:visible="deleteDialog"
      @ok="confirmDeleteSelect(selectList)"
    >
      <template #title>批量删除</template>
      <div style="text-align: center">
        确认批量删除选中分类吗?删除之后将无法再恢复。
      </div>
    </a-modal>

    <a-card :title="`全部(${total}) `" :bordered="false">
      <a-spin :loading="loading" tip="加载中..." class="main">
        <span class="selectAll">
          <a-button
            v-permission="['acl:category:search']"
            type="primary"
            @click="reFresh"
          >
            刷新
          </a-button>
          <a-button
            v-permission="['acl:category:add']"
            type="primary"
            @click="toAddItem()"
          >
            <template #icon>
              <icon-plus />
            </template>
            新建
          </a-button>
          <a-button
            v-permission="['acl:category:delete']"
            type="dashed"
            status="danger"
            :disabled="!isButtonEnabled"
            @click="deleteDialog = true"
          >
            批量删除
          </a-button>
        </span>
        <a-table
          v-model:selectedKeys="selectedKeys"
          :columns="columns"
          :data="formModel"
          row-key="id"
          stripe
          :row-selection="rowSelection"
          :pagination="pagination"
          :bordered="false"
          :size="'medium'"
          @page-change="onPageChange"
          @select="selectItem"
          @selection-change="selectAllChange"
          @page-size-change="handlePageSizeChange"
        >
          <template #icon="{ record }">
            {{ record.icon }}
            <div class="category-icon">
              <!-- <icon-font :type="record.icon" :size="24" /> -->
            </div>
          </template>
          <template #visible="{ record }">
            <a-tag :color="record.visible === 1 ? 'green' : 'red'">
              {{ record.visible === 1 ? '显示' : '隐藏' }}
            </a-tag>
          </template>
          <template #optional="{ record }">
            <div class="option">
              <span>
                <a-button
                  v-permission="['acl:category:edit']"
                  type="text"
                  @click="toEditItem(record)"
                >
                  <template #icon>
                    <icon-edit />
                  </template>
                  <template #default>修改</template>
                </a-button>
              </span>
              <span>
                <a-popconfirm
                  content="您确定要删除吗？"
                  @ok="confirmDeleteSelect([record.id])"
                >
                  <a-button v-permission="['acl:category:delete']" type="text">
                    <template #icon>
                      <icon-delete />
                    </template>
                    <template #default>删除</template>
                  </a-button>
                </a-popconfirm>
              </span>
            </div>
          </template>
        </a-table>
      </a-spin>
    </a-card>
  </div>
</template>

<style scoped lang="less">
.main {
  width: 100%;
}

.option {
  button {
    margin-right: 3px;
  }
}

.category-icon {
  font-size: 24px;
}

.selectAll button {
  margin: 0 5px 12px;
}
</style>
