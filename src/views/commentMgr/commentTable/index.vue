<script lang="ts" setup>
import {
  Message,
  TableColumnData,
  TableData,
  TableRowSelection
} from '@arco-design/web-vue';
import useLoading from '@/hooks/useLoading';
import { getCommentList, deleteComment, auditComment } from '@/api/comment';
import { ref, Ref, reactive, onMounted, watch, computed } from 'vue';

export interface ViewDetail {
  nickname: string;
  email: string;
  path: string;
  content: string;
  comment_path: string;
  parent_nickname: string;
  parent_path: string;
  parent_content: string;
  parent_email: string;
  parent_comment_path: string;
}

// 选择的哪一栏
const props = defineProps({
  itemType: {
    type: String,
    required: true
  },
  search: {
    type: Object as () => {
      email: String;
      nickname: String;
      title: String;
      parent_email: String;
    },
    required: true,
    default: () => ({
      email: '',
      nickname: '',
      title: '',
      parent_email: ''
    })
  }
});

// 定义更新,是否可以进行批量操作
const emit = defineEmits(['update:enabled']);

// 批量删除
const delSelectVisible = defineModel('delete', {
  type: Boolean,
  required: true
});
// 批量审批
const auditSelectVisible = defineModel('audit', {
  type: Boolean,
  required: true
});

// 定义行
const columns = computed<TableColumnData[]>(() => [
  {
    title: 'ID',
    width: 80,
    dataIndex: 'id'
  },
  {
    title: '发布者',
    dataIndex: 'nickname',
    slotName: 'author'
  },
  {
    title: '评论',
    dataIndex: 'content',
    width: 400,
    slotName: 'content'
  },
  {
    title: '所在文章',
    width: 400,
    align: 'center',
    dataIndex: 'parent',
    slotName: 'parent'
  },
  {
    title: '操作',
    dataIndex: 'optional',
    width: 200,
    align: 'center',
    slotName: 'optional'
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

// 接收数据
const comments: Ref<TableData[]> = ref([]);

// loading效果
const { loading, setLoading } = useLoading(false);

// 查看详情框
const editVisible = ref<boolean>(false);

// 获取列表项
const fetchComments = async (): Promise<void> => {
  try {
    setLoading(true);
    const { data } = await getCommentList({
      offset: curPage.value,
      limit: limit.value,
      type: Number(props.itemType),
      email: props.search.email,
      nickname: props.search.nickname,
      title: props.search.title,
      parent_email: props.search.parent_email
    });
    console.log(props.search.email, '筛选邮箱');
    console.log(props.itemType, '当前选项');
    console.log(curPage.value, '当前页');
    comments.value = data.comlist;
    total.value = data.total;
  } catch (error) {
    Message.info(error.msg);
  } finally {
    setLoading(false);
  }
};

// 配置表格分页
// 当前页
const curPage = ref<number>(1);

// 编辑项  查看详情
const viewDetail = ref<ViewDetail>({
  nickname: '',
  email: '',
  path: '',
  content: '',
  comment_path: '',
  parent_nickname: '',
  parent_path: '',
  parent_content: '',
  parent_email: '',
  parent_comment_path: ''
});

// 一共多少数据
const total = defineModel('total', {
  type: Number,
  required: true
});

// 可选择的每页条目数
const pageSizes = ref<number[]>([5, 10, 20]);

// 默认每页的数据条数
const limit = ref<number>(10);

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
  onChange: (current: number) => handlePageChange(current)
});

// 表格分页
const handlePageChange = (current: number) => {
  console.log(111);
  if (current <= maxPage.value && current > 0) {
    pagination.current = current; // 更新当前页码
  }
};

// 全选,一次性选中当前页所有
const selectAllChange = (item: number[]) => {
  console.log(item);
};

// 删除一个
const confirmDeleteOne = async (id: number) => {
  try {
    setLoading(true);
    await deleteComment({ list: [id] });
    selectedKeys.value = selectedKeys.value.filter(key => key !== id);
    reFresh();
  } catch (error) {
    Message.info(error.msg);
  } finally {
    setLoading(false);
  }
};

// 审核一个
const confirmAuditOne = async (id: number) => {
  try {
    setLoading(true);
    await auditComment({ list: [id] });
    // 筛选出去
    selectedKeys.value = selectedKeys.value.filter(key => key !== id);
    reFresh();
  } catch (error) {
    console.log(error);
    // Message.info(error.msg);
  } finally {
    setLoading(false);
  }
};

// 批量删除
const confirmDeleteSelect = async () => {
  try {
    console.log(props.itemType, 21331);
    setLoading(true);
    await deleteComment({ list: selectedKeys });
    selectedKeys.value = [];
    // 重新获取到第一页
    curPage.value = 1;
    reFresh();
  } catch (error) {
    Message.info(error.msg);
  } finally {
    setLoading(false);
  }
};

// 批量审核
const confirmAuditSelect = async () => {
  try {
    setLoading(true);
    await auditComment({ list: selectedKeys });
    selectedKeys.value = [];
    // 重新获取到第一页
    curPage.value = 1;
    reFresh();
  } catch (error) {
    Message.info(error.msg);
  } finally {
    setLoading(false);
  }
};

// 修改页码
const changePage = (item: number) => {
  // 切换到当前页
  curPage.value = item;
  fetchComments();
};

const editItem = (item: ViewDetail) => {
  editVisible.value = true;
  viewDetail.value = item;
  console.log(viewDetail);
};

// 处理每页条目数变化
const handlePageSizeChange = (size: number) => {
  // 只接收 size
  console.log(`每页条目数已更改为: ${size}`);
  limit.value = size; // 更新每页条目数
  curPage.value = 1; // 重置当前页为1
};

// 监听 selectedCount 的变化并发射事件
watch(selectedKeys, newCount => {
  emit('update:enabled', newCount.length > 0);
});

// 父组件刷新方法
const reFresh = () => {
  fetchComments();
};

// 在组件挂载时获取数据
onMounted(() => {
  fetchComments(); // 初始化时调用获取数据
});

// 暴露方法给父组件
defineExpose({ reFresh });
</script>

<template>
  <div>
    <a-drawer v-model:visible="editVisible" :width="420" unmountOnClose>
      <template #title>查看评论详情:</template>
      <a-spin :loading="loading" tip="This may take a while..." class="main">
        <div class="drawer">
          <a-form
            :model="viewDetail"
            :style="{ width: '380px' }"
            layout="vertical"
          >
            <div v-if="viewDetail.parent_email" class="details-other">
              <a-form-item field="userInfo">
                <div class="details">
                  <div class="details-info">
                    <a-image
                      :src="viewDetail.parent_path"
                      alt="图片"
                      width="35"
                      height="35"
                      fit="cover"
                    />
                    <span>{{ viewDetail.parent_nickname }}</span>
                  </div>
                  <div>邮箱:{{ viewDetail.parent_email }}</div>
                </div>
              </a-form-item>
              <a-form-item field="content" label="评论内容:">
                <div>{{ viewDetail.parent_content }}</div>
              </a-form-item>
              <a-form-item field="content">
                <div class="pic_Details">
                  <a-image-preview-group infinite>
                    <a-space>
                      <a-image
                        v-if="viewDetail.parent_comment_path"
                        :src="viewDetail.parent_comment_path"
                        width="50"
                        height="50"
                        style="object-fit: contain"
                      />
                    </a-space>
                  </a-image-preview-group>
                </div>
              </a-form-item>
            </div>
            <div class="details-self">
              <a-form-item field="userInfo">
                <div class="details">
                  <div class="details-info">
                    <a-image
                      :src="viewDetail.path"
                      alt="图片"
                      width="35"
                      height="35"
                      fit="cover"
                    />
                    <span>{{ viewDetail.nickname }}</span>
                  </div>
                  <div>邮箱:{{ viewDetail.email }}</div>
                </div>
              </a-form-item>

              <a-form-item field="content" label="回复评论内容:">
                <div>{{ viewDetail.content }}</div>
              </a-form-item>
              <a-form-item field="content">
                <div class="pic_Details">
                  <a-image-preview-group infinite>
                    <a-space>
                      <a-image
                        v-if="viewDetail.comment_path"
                        :src="viewDetail.comment_path"
                        width="50"
                        height="50"
                        style="object-fit: contain"
                      />
                    </a-space>
                  </a-image-preview-group>
                </div>
              </a-form-item>
            </div>
          </a-form>
        </div>
      </a-spin>
    </a-drawer>
    <!-- <a-modal>
      <template #title>修改评论</template>
      <a-mention type="textarea" placeholder="please enter your username..." />

      <a-upload
        ref="uploadRef"
        list-type="picture"
        :file-list="fileList"
        action="/"
        :auto-upload="false"
        multiple
        @change="onChange"
      >
        <template #upload-button>
          <a-space>
            <a-button>选择文件</a-button>
            <a-button type="primary" @click="submitFile">上传文件</a-button>
          </a-space>
        </template>
      </a-upload>
    </a-modal> -->

    <a-modal v-model:visible="delSelectVisible" @ok="confirmDeleteSelect">
      <template #title>批量删除</template>
      <div style="text-align: center">
        确认批量删除选中评论吗?删除之后将无法再恢复。
      </div>
    </a-modal>

    <a-modal v-model:visible="auditSelectVisible" @ok="confirmAuditSelect">
      <template #title>批量审核</template>
      <div style="text-align: center">确认一键审核选中评论吗？</div>
    </a-modal>

    <a-spin :loading="loading" tip="This may take a while..." class="main">
      <a-table
        v-model:selectedKeys="selectedKeys"
        :columns="columns"
        :data="comments"
        row-key="id"
        stripe
        :row-selection="rowSelection"
        :pagination="pagination"
        :page="curPage"
        @selection-change="selectAllChange"
        @page-change="changePage"
        @page-size-change="handlePageSizeChange"
      >
        <template #author="{ record }">
          <div class="left">
            <a-image
              :src="record.path"
              alt="图片"
              width="45"
              height="45"
              fit="cover"
            />
          </div>
          <div class="right">
            <span>{{ record.nickname }}</span>
            <span>{{ record.email }}</span>
          </div>
        </template>
        <template #content="{ record }">
          <div>
            <h4 v-if="record.parent_nickname">
              回复了
              <span class="ohter-name">
                {{ record.parent_nickname }}
              </span>
              的评论
            </h4>
            <h4 v-else>回复到文章</h4>
            <a-typography-paragraph
              :ellipsis="{
                rows: 2,
                showTooltip: true,
                expandable: true
              }"
            >
              {{ record.content }}
              <div v-if="record.comment_path.length > 0">
                <span style="color: #165dff">[图片]</span>
              </div>
            </a-typography-paragraph>
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
              <a-button
                v-permission="['acl:comment:view']"
                type="text"
                @click="editItem(record)"
              >
                查看详情
              </a-button>
            </span>
            <span>
              <a-popconfirm
                content="您确定要删除吗？"
                @ok="confirmDeleteOne(record.id)"
              >
                <a-button v-permission="['acl:comment:delete']" type="text">
                  <template #icon>
                    <icon-edit />
                  </template>
                  <template #default>删除</template>
                </a-button>
              </a-popconfirm>
            </span>
            <span v-if="props.itemType === '2' || record.examine === 1">
              <a-popconfirm
                content="您确定要审核吗？"
                @ok="confirmAuditOne(record.id)"
              >
                <a-button v-permission="['acl:comment:audit']" type="text">
                  <template #icon>
                    <icon-edit />
                  </template>
                  <template #default>审核</template>
                </a-button>
              </a-popconfirm>
            </span>
          </div>
        </template>
      </a-table>
    </a-spin>
  </div>
</template>

<style scoped lang="less">
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

  :deep(img) {
    border-radius: 30px;
  }
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

.ohter-name {
  color: #5bc0de; /* 浅蓝色 */
}

.details {
  display: flex;
  flex-direction: column;
}

.details-info {
  :deep(img) {
    border-radius: 30px;
  }

  span {
    margin-left: 10px;
  }
}

.details-self {
  padding: 8px;
  background-color: #f2f3f5;
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

.pic_Details {
  display: grid;
}
</style>
