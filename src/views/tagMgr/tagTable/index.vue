<script setup lang="ts">
import {
  TableColumnData,
  TableRowSelection,
  Message
} from '@arco-design/web-vue';
import { ref, reactive, watch, defineEmits, onMounted } from 'vue';
import { deleteTag } from '@/api/tag';
import { getTagList } from '@/api/tag';

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

// 总数
const total = defineModel('total', {
  type: Number,
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

// 行的唯一标识数据
const selectedKeys = ref<string[]>([]); // 确保这里初始化为一个空数组

const pagination = { pageSize: 5 };

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

// 之前去过的历史页
const beforePage = ref([]);

// 单删框
const deleteOneVisible = ref(false);
// 当前页
const curPage = ref(1);

// 当前选中的单个
const selectOne = ref(-1);

// 获取列表数据
const getList = async () => {
  try {
    formLoading.value = true;
    const { data } = await getTagList({});
    tag_list.value.push(...data.data.tag_list);
  } catch {
  } finally {
    formLoading.value = false;
  }
};

// 在组件挂载时获取数据
onMounted(() => {
  getList(); // 初始化时调用获取数据
});

// 单删
const deleteOneDialog = id => {
  deleteOneVisible.value = true;
  selectOne.value = id;
};

const confirmDeleteOne = async () => {
  try {
    formLoading.value = true;
    await deleteTag({ list: [selectOne] });
    // 筛选出不包含筛选数组的元素
    tag_list.value = tag_list.value.filter(
      tag_list => tag_list.id !== selectOne.value
    );
    // 获取最新的一条数据
    const { data } = await getTagList({
      offset: curPage.value + 1,
      limit: 1,
      name: props.search.name
    });
    // 获取现有评论
    const existing = tag_list.value;
    const newTag = data.data.tag_list;

    // 使用 Set 来存储现有评论的 ID
    const existingIds = new Set(existing.map(tag_list => tag_list.id));

    // 过滤出唯一的新评论
    const uniqueNewTag = newTag.filter(
      (newComment: { id: number }) => !existingIds.has(newComment.id)
    );

    // 合并唯一的新评论
    tag_list.value.push(...uniqueNewTag);
    // 更新总数
    total.value = tag_list.value.length;
    console.log(total.value);
  } catch (error) {
    Message.info(error.msg);
  } finally {
    formLoading.value = false;
  }
};

// 批量删除
const confirmDeleteSelect = async () => {
  try {
    formLoading.value = true;
    await deleteTag({ list: [selectList] });
    // 重新获取到第一页
    curPage.value = 1;
    reFresh();
  } catch (error) {
    Message.info(error.msg);
  } finally {
    formLoading.value = false;
  }
};

// 监听 selectedCount 的变化并发射事件
watch(selectList, newCount => {
  emit('update:enabled', newCount.length > 0);
});

const selectItem = item => {
  console.log(item);
};
const cancelItem = item => {
  console.log(item);
};

// 父组件刷新方法
const reFresh = () => {
  // 清空
  tag_list.value = [];
  beforePage.value = [];
  getList();
};

defineExpose({ reFresh });
</script>

<template>
  <div>
    <a-modal v-model:visible="deleteOneVisible" @ok="confirmDeleteOne">
      <template #title>确认删除</template>
      <div>确认要删除当前项吗,删除之后无法再恢复</div>
    </a-modal>
    <a-modal v-model:visible="deleteSelectVisible" @ok="confirmDeleteSelect">
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
        @selection-change="cancelItem"
      >
        <template #path="{ record }">
          <div class="headshot">
            <img :src="record.path" alt="" />
          </div>
        </template>
        <template #optional="{ record }">
          <div class="option">
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

<script scoped></script>

<style scoped>
.main {
  width: 100%;
}

.headshot img {
  width: 60px;
  height: 60px;
}
</style>
