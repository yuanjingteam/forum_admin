<script setup lang="ts">
import {
  TableColumnData,
  TableRowSelection,
  Message
} from '@arco-design/web-vue';
import { ref, reactive, watch, defineEmits, onMounted, computed } from 'vue';
import { deleteTag } from '@/api/tag';
import { getTagList } from '@/api/tag';
import EditItem from '@/views/tagMgr/tagTable/EditItem/index.vue';

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

// 批量删除
const deleteSelectVisible = defineModel('delete', {
  type: Boolean,
  required: true
});

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

// 当前页
const curPage = ref(1);

// 总数
const total = defineModel('total', {
  type: Number,
  required: true
});

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
const formLoading = ref(false);

// 单删框
const deleteOneVisible = ref(false);

// 修改框
const editVisible = ref(false);

// // 当前项ID
const editId = ref(-1);

const editData = ref({
  id: -1,
  name: '',
  description: '',
  article_count: 0,
  heat: 0,
  fans_count: 0,
  path: 'src/assets/images/green_dog.jpg'
});

// 当前选中的单个
const selectOne = ref([]);

// 获取列表数据
const getList = async () => {
  try {
    formLoading.value = true;
    const { data } = await getTagList({});
    tag_list.value.push(...data.data.tag_list);
    total.value = data.data.total;
  } catch {
  } finally {
    formLoading.value = false;
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

// 单删
const deleteOneDialog = (id: number) => {
  deleteOneVisible.value = true;
  selectOne.value = [id];
};

// 记录已访问的页码
const visitedPages: Set<number> = new Set();

let deleteCount = 0; // 删除的数据计数

const checkPageData = async (page: number) => {
  const { data } = await getTagList({
    offset: page + 1,
    limit: PAGE_LIMIT,
    name: props.search.name
  });
  return data.data.tag_list;
};

const handlePageData = async (currentPageData: any[]) => {
  if (currentPageData.length === 0 && deleteCount >= PAGE_LIMIT.value) {
    // 当前页没有数据且删除数量达到了 PAGE_LIMIT
    curPage.value -= 1; // 前往前一页

    // 重新获取前一页的数据
    const prevPageData = await checkPageData(curPage.value);

    // 递归调用
    await handlePageData(prevPageData);

    // 如果前一页有数据，合并
    if (prevPageData.length > 0) {
      tag_list.value.push(...prevPageData);
    } else {
      // 如果前一页也没有数据，可以选择清空当前页
      tag_list.value = [];
    }
  } else if (currentPageData.length > 0) {
    // 如果当前页有数据，直接返回
    return;
  }
};

const confirmDeleteSelect = async (selectArray: Array<number>) => {
  try {
    formLoading.value = true;
    // 删除选中的标签
    await deleteTag({ list: selectArray });

    // 记录删除数量
    deleteCount++;

    // 获取当前页的数据
    const currentPageData = await checkPageData(curPage.value);

    // 筛选 out 当前删除的标签
    tag_list.value = tag_list.value.filter(
      tag => !selectArray.includes(tag.id)
    );

    selectedKeys.value = selectedKeys.value.filter(
      key => !selectArray.includes(key)
    );

    // 检查当前页数据是否为空并递归处理
    await handlePageData(currentPageData);

    // 更新总数
    total.value = tag_list.value.length;
    console.log(total.value);

    // 记录当前页和下一页为已访问
    visitedPages.add(curPage.value);
    visitedPages.add(curPage.value + 1);
  } catch (error) {
    Message.info(error.msg);
  } finally {
    formLoading.value = false;
  }
};

const changePage = (item: number) => {
  // 当页码变化时，记录下一页为被访问的页
  if (item > curPage.value) {
    visitedPages.add(item);
  }
  // 更新当前页
  curPage.value = item;
  // 重新计数
  deleteCount = 0;
};

// 处理每页条目数变化
const handlePageSizeChange = size => {
  // 只接收 size
  console.log(`每页条目数已更改为: ${size}`);
  PAGE_LIMIT.value = size; // 更新每页条目数
  curPage.value = 1; // 重置当前页为1
};

// 监听 selectedCount 的变化并发射事件
watch(selectedKeys, newCount => {
  emit('update:enabled', newCount.length > 0);
});

// 单选,可勾选多个
const selectItem = (item: Array<number>) => {
  selectList.value = item;
};

// 全选,一次性选中当前页所有
const selectAllChange = (item: Array<number>) => {
  selectList.value = item;
};

// 父组件刷新方法
const reFresh = () => {
  // 清空
  tag_list.value = [];
  visitedPages.clear();
  getList();
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

defineExpose({ reFresh });
</script>

<template>
  <div>
    <edit-item v-model:visible="editVisible" :editData="editData"></edit-item>
    <a-modal
      v-model:visible="deleteOneVisible"
      @ok="confirmDeleteSelect(selectOne)"
    >
      <template #title>确认删除</template>
      <div>确认要删除当前项吗,删除之后无法再恢复</div>
    </a-modal>
    <a-modal
      v-model:visible="deleteSelectVisible"
      @ok="confirmDeleteSelect(selectList)"
    >
      <template #title>批量删除</template>
      <div style="text-align: center">
        确认批量删除选中评论吗?删除之后将无法再恢复。
      </div>
    </a-modal>

    <a-spin :loading="formLoading" tip="This may take a while..." class="main">
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
          <a-image
            :src="record.path"
            alt="图片"
            width="60"
            height="60"
            fit="cover"
          />
        </template>
        <template #optional="{ record }">
          <div class="option">
            <span>
              <a-button
                status="success"
                type="outline"
                size="mini"
                @click="toEditItem(record)"
              >
                修改
              </a-button>
            </span>
            <span>
              <a-button
                type="outline"
                status="danger"
                size="mini"
                @click="deleteOneDialog(record.id)"
              >
                删除
              </a-button>
            </span>
          </div>
        </template>
      </a-table>
    </a-spin>
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
</style>
