<script lang="ts" setup>
import {
  Message,
  TableColumnData,
  TableRowSelection
} from '@arco-design/web-vue';

import { getCommentList, deleteComment } from '@/api/comment';
import { ref, reactive, onMounted, defineModel, defineEmits, watch } from 'vue';

// 定义接收的 props
const props = defineProps({
  type: {
    type: String, // 根据实际类型定义
    required: true // 可选，是否必需
  },
  email: String,
  nickname: String,
  title: String,
  parent_nickname: String
});

// 定义更新事件
const emit = defineEmits(['update:enabled']);

// 批量删除
const deleteSelectVisible = defineModel({
  type: Boolean
});

// 选择的哪一栏
const itemType = ref('1');
itemType.value = props.type;

// 接收数据
const comments = ref([]);
// 删除列数组
const deleteList = ref([]);
// 定义行
const columns: TableColumnData[] = [
  {
    title: 'ID',
    width: 80,
    dataIndex: 'id'
  },
  {
    title: '发布者',
    dataIndex: 'nickname',
    width: 290,
    slotName: 'author'
  },
  {
    title: '评论',
    dataIndex: 'content',
    slotName: 'content'
  },
  {
    title: '回复至',
    dataIndex: 'parent',
    width: 260,
    slotName: 'parent'
  },
  {
    title: '操作',
    dataIndex: 'optional',
    width: 160,
    align: 'center',
    slotName: 'optional'
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
// 一页多少个
const limit = ref(10);

// 分页配置
const pagination = reactive({
  pageSize: limit,
  defaultPageSize: limit,
  current: curPage,
  total: total // 假设总共有100条数据
});

const editVisible = ref(false);
const edit = ref('');
// 删除一个
const deleteOneVisible = ref(false);
const deleteOne = ref(-1);
const beforePage = ref([]);
// 删除loading
const formLoading = ref(false);

// 获取列表项
const getList = async () => {
  try {
    formLoading.value = true;
    const { data } = await getCommentList({
      offset: curPage.value,
      limit: limit.value,
      type: Number(itemType.value),
      email: props.email,
      nickname: props.nickname,
      title: props.title,
      parent_nickname: props.parent_nickname
    });

    console.log(itemType.value, '当前选项');
    console.log(curPage.value, '当前页');

    comments.value = comments.value.concat(data.data.comlist);
    total.value = data.data.total;
  } catch (error) {
    Message.info(error.msg);
  } finally {
    formLoading.value = false;
  }
};

// 修改评论
const editItem = item => {
  editVisible.value = true;
  edit.value = item.content;
};

const editOk = () => {
  try {
    editVisible.value = false; // 关闭模态框
  } catch {}
};

// 单删弹框
const deleteOneDialog = id => {
  deleteOneVisible.value = true;
  deleteOne.value = id;
};

// 删除一个
const confirmDeleteOne = async () => {
  try {
    formLoading.value = true;
    await deleteComment({ list: [deleteOne] });
    // 筛选出不包含删除数组的元素
    comments.value = comments.value.filter(
      comment => comment.id !== deleteOne.value
    );
    total.value -= deleteList.value.length;
    console.log(total.value);

    // 删除完毕后清空 deleteList
    deleteList.value = []; // 清空数组
    // 重新获取新数据
    comments.value = [];
    getList();
  } catch (error) {
    Message.info(error.msg);
  } finally {
    formLoading.value = false;
  }
};

// 单选,可勾选多个
const selectItem = (item: Array<number>) => {
  deleteList.value = item;
  console.log(deleteList.value);
};

// 全选,一次性选中当前页所有
const selectAllChange = checked => {
  if (checked) {
    deleteList.value = comments.value.map(item => item.id); // 全选
  } else {
    deleteList.value = []; // 取消全选
  }
};

// 批量删除
const confirmDeleteSelect = async () => {
  try {
    formLoading.value = true;
    await deleteComment({ list: [deleteList] });
    // 筛选出剩余的评论
    comments.value = comments.value.filter(
      comment => !deleteList.value.includes(comment.id)
    );
    total.value -= deleteList.value.length;
    console.log(total.value);

    // 删除完毕后清空 deleteList
    deleteList.value = []; // 清空数组
    // 重新获取到第一页
    curPage.value = 1;
    comments.value = [];
    getList();
  } catch (error) {
    Message.info(error.msg);
  } finally {
    formLoading.value = false;
  }
};

// 监听 selectedCount 的变化并发射事件
watch(deleteList, newCount => {
  emit('update:enabled', newCount.length > 0);
});

// 修改页码
const changePage = item => {
  // 没有访问过就渲染数据
  if (!beforePage.value.includes(item)) {
    getList();
    // 标记已选择
    beforePage.value.push(item);
  }
  // 切换到当前页
  curPage.value = item;
};

// 在组件挂载时获取数据
onMounted(() => {
  getList(); // 初始化时调用获取数据
});

// 父组件刷新方法
const reFresh = () => {
  // 清空
  comments.value = [];
  beforePage.value = [];
  curPage.value = 1;
  getList();
};

// 暴露方法给父组件
defineExpose({ reFresh });
</script>

<template>
  <div>
    <a-modal v-model:visible="editVisible" @ok="editOk">
      <template #title>修改评论</template>
      <a-mention
        v-model="edit"
        type="textarea"
        placeholder="please enter your username..."
      />
    </a-modal>

    <a-modal v-model:visible="deleteOneVisible" @ok="confirmDeleteOne">
      <template #title>确认删除</template>
      <div>确认要删除当前项吗,删除之后无法再恢复</div>
    </a-modal>
    <a-modal v-model:visible="deleteSelectVisible" @ok="confirmDeleteSelect">
      <template #title>确认删除</template>
      <div>确认批量删除吗,删除之后无法再恢复</div>
    </a-modal>

    <a-spin :loading="formLoading" tip="This may take a while..." class="main">
      <a-table
        v-model:selectedKeys="selectedKeys"
        :columns="columns"
        :data="comments"
        row-key="id"
        stripe
        :row-selection="rowSelection"
        :pagination="pagination"
        :page="curPage"
        @select="selectItem"
        @select-all="selectAllChange"
        @page-change="changePage"
      >
        <template #author="{ record }">
          <div class="left">
            <img :src="record.path" alt="" />
          </div>
          <div class="right">
            <span>{{ record.nickname }}</span>
            <span>{{ record.email }}</span>
          </div>
        </template>
        <template #content="{ record }">
          <div v-if="record.article_id">
            <p>
              回复给
              <router-link :to="{ path: './' }" class="custom-link">
                {{ record.parent_nickname }}:
              </router-link>
            </p>
            <p>
              <a-typography-paragraph
                :ellipsis="{
                  rows: 2,
                  showTooltip: true,
                  expandable: true
                }"
              >
                {{ record.content }}
              </a-typography-paragraph>
            </p>
          </div>
        </template>
        <template #parent="{ record }">
          <router-link :to="{ path: './article' }" class="custom-link">
            <p>《 {{ record.title }} 》</p>
            <a-typography-paragraph
              :ellipsis="{
                rows: 2,
                showTooltip: true
              }"
              class="inherit-color"
            >
              {{ record.summary }}
            </a-typography-paragraph>
          </router-link>
        </template>
        <template #optional="{ record }">
          <div class="option">
            <span>
              <a-button type="outline" size="mini" @click="editItem(record)">
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

<style>
.custom-filter {
  float: left;
  padding: 20px;
  background: var(--color-bg-5);
  border: 1px solid var(--color-neutral-3);
  border-radius: var(--border-radius-medium);
  box-shadow: 0 2px 5px rgb(0 0 0 / 10%);
}

.custom-filter-footer {
  display: flex;
  justify-content: space-between;
}

.main {
  width: 100%;
}

.left {
  float: left;
  margin-right: 15px;
}

.left img {
  width: 50px;
  height: 50px;
  object-fit: cover; /* 或使用 'cover' */
}

.right {
  display: flex;
  flex-direction: column;
  justify-content: center;
  float: left;
}

.custom-link {
  margin: 0 8px 0 -3px;
  color: #5bc0de; /* 浅蓝色 */
  text-decoration: none; /* 去除下划线 */
}

.inherit-color {
  color: inherit; /* 继承父元素的颜色 */
}

.option {
  button {
    margin-right: 3px;
  }
}

.arco-mention textarea {
  min-height: 100px;
  max-height: 380px;
}
</style>
