<script setup lang="ts">
import {
  TableColumnData,
  TableRowSelection,
  Message
} from '@arco-design/web-vue';
import { ref, reactive, watch, onMounted, computed } from 'vue';
import useLoading from '@/hooks/useLoading';
import { deleteTag } from '@/api/tag';
import { getTagList } from '@/api/tag';
import EditItem from '@/views/tagMgr/tagTable/EditItem/index.vue';
import AddItem from '@/views/tagMgr/tagTable/AddItem/index.vue';

const props = defineProps({
  search: {
    type: Object as () => {
      name: String;
    },
    required: true,
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
    align: 'center',
    width: 300
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

// 当前页
const curPage = ref(1);

// 总数
const total = defineModel('total', {
  type: Number,
  required: true
});

// 控制按钮的启用状态
const isButtonEnabled = ref(false);

// 删除弹框
const deleteDialog = ref(false);

// 配置表格分页
const pageSizes = ref([5, 10, 20]); // 可选择的每页条目数

// 默认每页的数据条数
const PAGE_LIMIT = ref(10);

// 计算最大页码
const maxPage = computed(() =>
  Math.ceil(pagination.total / pagination.pageSize)
);

const pagination = reactive({
  pageSize: PAGE_LIMIT,
  defaultPageSize: PAGE_LIMIT,
  current: curPage,
  total: total, // 假设总共有100条数据
  showTotal: true, // 设置为布尔值
  showJumper: true,
  showPageSize: true,
  pageSizeOptions: pageSizes,
  onChange: current => handlePageChange(current)
});

// 行的唯一标识数据
const selectedKeys = ref<number[]>([]); // 确保这里初始化为一个空数组

// 行配置
const rowSelection: TableRowSelection = reactive({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false
});

// 标签列表
const tag_list = ref([]);

// 选中列数组
const selectList = ref([]);

// 加载
const { loading, setLoading } = useLoading(false);

// 修改框
const editVisible = ref(false);
const addVisible = ref(false);

// 当前项ID
const editId = ref(-1);

// 编辑项
const editData = ref({
  id: -1,
  name: '',
  description: '',
  article_count: 0,
  heat: 0,
  fans_count: 0,
  path: ''
});

// 获取列表数据
const getList = async () => {
  setLoading(true);
  try {
    const { data } = await getTagList({
      offset: curPage.value,
      limit: PAGE_LIMIT.value,
      name: props.search.name
    });

    tag_list.value = data.tag_list;
    total.value = data.total;
  } catch {
  } finally {
    setLoading(false);
  }
};

// 在组件挂载时获取数据
onMounted(() => {
  getList(); // 初始化时调用获取数据
});

// 表格分页
const handlePageChange = current => {
  console.log(111);
  if (current <= maxPage.value && current > 0) {
    pagination.current = current; // 更新当前页码
  }
};
// 删除
const confirmDeleteSelect = async (selectArray: Array<number>) => {
  try {
    // 删除选中的标签
    await deleteTag({ id: selectArray });
    // 删除
    selectedKeys.value = selectedKeys.value.filter(
      key => !selectArray.includes(key)
    );
    // 重定向到第一页
    curPage.value = 1;
    // 重新获取数据
    getList();
  } catch (error) {
    Message.info(error.msg);
  }
};

// 监听页数切换
const changePage = (item: number) => {
  // 更新当前页
  curPage.value = item;
  // 重新获取
  getList();
};

// 处理每页条目数变化
const handlePageSizeChange = size => {
  // 只接收 size
  console.log(`每页条目数已更改为: ${size}`);
  PAGE_LIMIT.value = size; // 更新每页条目数
  curPage.value = 1; // 重置当前页为1
  getList();
};

// 单选,可勾选多个
const selectItem = (item: Array<number>) => {
  selectList.value = item;
};

// 全选,一次性选中当前页所有
const selectAllChange = (item: Array<number>) => {
  selectList.value = item;
};

// 修改评论
const toEditItem = async item => {
  editVisible.value = true;
  // 清空之前的,重新获取当前列的信息
  if (editId.value !== item.id) {
    editData.value = item;
    editId.value = item.id;
  }
};

// 添加评论
const toAddItem = () => {
  addVisible.value = true;
};

// 打开删除对话框
const notifyDeleteSelect = () => {
  deleteDialog.value = true;
};

// 父组件刷新方法
const reFresh = () => {
  // 清空
  tag_list.value = [];
  getList();
};

// 监听 selectedCount 的变化并发射事件
watch(selectedKeys, newCount => {
  isButtonEnabled.value = newCount.length > 0;
});

defineExpose({ reFresh });
</script>

<template>
  <div>
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
        确认批量删除选中评论吗?删除之后将无法再恢复。
      </div>
    </a-modal>

    <a-card :title="`全部(${total}) `" :bordered="false">
      <a-spin :loading="loading" tip="This may take a while..." class="main">
        <span class="selectAll">
          <a-button
            v-permission="['acl:tag:search']"
            type="primary"
            @click="reFresh"
          >
            刷新
          </a-button>
          <a-button
            v-permission="['acl:tag:add']"
            type="primary"
            @click="toAddItem()"
          >
            <template #icon>
              <icon-plus />
            </template>
            新建
          </a-button>
          <a-button
            v-permission="['acl:tag:delete']"
            type="dashed"
            status="danger"
            :disabled="!isButtonEnabled"
            @click="notifyDeleteSelect"
          >
            批量删除
          </a-button>
        </span>
        <a-table
          v-model:selectedKeys="selectedKeys"
          :columns="columns"
          :data="tag_list"
          row-key="id"
          stripe
          :row-selection="rowSelection"
          :pagination="pagination"
          @select="selectItem"
          @selection-change="selectAllChange"
          @page-change="changePage"
          @page-size-change="handlePageSizeChange"
        >
          <template #path="{ record }">
            <div class="user-path">
              <a-image
                :src="record.path"
                alt="图片"
                width="45"
                height="45"
                fit="cover"
              />
            </div>
          </template>
          <template #optional="{ record }">
            <div class="option">
              <span>
                <a-button
                  v-permission="['acl:tag:edit']"
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
                  <a-button v-permission="['acl:tag:delete']" type="text">
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

<style scoped>
.main {
  width: 100%;
}

.option {
  button {
    margin-right: 3px;
  }
}

.user-path {
  :deep(img) {
    border-radius: 30px;
  }
}

.selectAll button {
  margin: 0 5px 12px;
}
</style>
