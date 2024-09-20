<script lang="ts" setup>
import {
  Message,
  TableColumnData,
  TableRowSelection
} from '@arco-design/web-vue';

import { getCommentList, deleteComment, auditComment } from '@/api/comment';
import {
  ref,
  reactive,
  onMounted,
  defineProps,
  defineEmits,
  defineModel,
  watch
} from 'vue';

// 定义更新,是否可以进行批量操作
const emit = defineEmits(['update:enabled']);

// 选择的哪一栏
const props = defineProps({
  itemType: {
    type: String,
    required: true
  }
});

// 批量删除
const deleteSelectVisible = defineModel('delete', {
  type: Boolean,
  required: true
});
// 批量审批
const auditSelectVisible = defineModel('audit', {
  type: Boolean,
  required: true
});
// 定义 search 的双向绑定模型
const search = defineModel('search', {
  type: Object as () => {
    email: String;
    nickname: String;
    title: String;
    parent_nickname: String;
  },
  required: true,
  default: () => ({
    email: '',
    nickname: '',
    title: '',
    parent_nickname: ''
  })
});

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
const total = defineModel('total', {
  type: Number,
  required: true
});
// 一页多少个
const limit = ref(10);

// 分页配置
const pagination = reactive({
  pageSize: limit,
  defaultPageSize: limit,
  current: curPage,
  total: total // 假设总共有100条数据
});

// 编辑选框
// const editVisible = ref(false);

// 接收数据
const comments = ref([]);

// 选中列数组
const selectList = ref([]);

// 绑定上传文件组件

// const uploadRef = ref();

// // 存储文件列表
// const fileList = ref([]);

// // 当前评论ID
// const editId = ref(-1);

// // 当前评论文字内容
// const editContent = ref('');

// 删除一个

const deleteOneVisible = ref(false);

// 当前选中的单个
const selectOne = ref(-1);

// 之前去过的历史页
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
      type: Number(props.itemType),
      email: search.value.email,
      nickname: search.value.nickname,
      title: search.value.title,
      parent_nickname: search.value.parent_nickname
    });
    console.log(search.value.email, '筛选邮箱');
    console.log(props.itemType, '当前选项');
    console.log(curPage.value, '当前页');

    comments.value = [...comments.value, ...data.data.comlist];
    total.value = data.data.total;
  } catch (error) {
    Message.info(error.msg);
  } finally {
    formLoading.value = false;
  }
};

// 提交文件
// const submitFile = async () => {
//   try {
//     // 创建 FormData 对象
//     const formData = new FormData();
//     fileList.value.forEach(file => {
//       formData.append('uploads', file.file); // 假设每个 file 对象中有原始文件
//     });
//     formData.append('id', String(editId)); // 直接添加数组
//     await updateComment(formData);
//   } catch {
//   } finally {
//   }
// };

// const onChange = list => {
//   fileList.value = list;
// };

// // 将图片路径转换为 File 对象
// const convertToFiles = async imagePaths => {
//   const files = await Promise.all(
//     imagePaths.map(async path => {
//       // 使用 fetch 下载图片数据
//       const response = await fetch(path);
//       const blob = await response.blob(); // 转换为 Blob 对象
//       const fileName = path.split('/').pop(); // 获取文件名

//       // 创建 File 对象
//       const file = new File([blob], fileName, { type: blob.type });

//       // 返回符合你需要格式的对象
//       return {
//         uid: String(Date.now()), // 生成唯一的 uid
//         name: fileName,
//         url: path, // 使用原始链接
//         file: file // 可选，保留对 File 对象的引用
//       };
//     })
//   );
//   fileList.value = [...fileList.value, ...files];
// };

// 修改评论
// const editItem = item => {
//   editVisible.value = true;
//   // 清空之前的,重新获取当前列的信息
//   if (editId.value !== item.id) {
//     console.log(111213123);
//     editId.value = item.id;
//     editContent.value = item.content;
//     fileList.value = [];
//     convertToFiles([
//       'src/assets/images/green_dog.jpg',
//       'src/assets/images/Cat_Tom.jpg'
//     ]);
//   }
// };

// const editOk = async () => {
//   console.log(111);
// };

// 单删弹框
const deleteOneDialog = id => {
  deleteOneVisible.value = true;
  selectOne.value = id;
};

// 单审不弹框
const auditOneDialog = id => {
  selectOne.value = id;
  // 调用单审方法直接审核
  confirmAuditOne();
};

// 单选,可勾选多个
const selectItem = (item: Array<number>) => {
  selectList.value = item;
  console.log(selectList.value);
};

// 全选,一次性选中当前页所有
const selectAllChange = item => {
  selectList.value = item;
};

// 删除一个
const confirmDeleteOne = async () => {
  try {
    formLoading.value = true;
    await deleteComment({ list: [selectOne] });
    // 筛选出不包含筛选数组的元素
    comments.value = comments.value.filter(
      comment => comment.id !== selectOne.value
    );
    // 获取最新的一条数据
    const { data } = await getCommentList({
      offset: curPage.value + 1,
      limit: 1,
      type: Number(props.itemType),
      email: search.value.email,
      nickname: search.value.nickname,
      title: search.value.title,
      parent_nickname: search.value.parent_nickname
    });
    // 获取现有评论
    const existingComments = comments.value;
    const newComments = data.data.comlist;
    // 合并之前检查重复项
    const uniqueNewComments = newComments.filter(
      (newComment: { id: number }) =>
        !existingComments.some(
          (existingComment: { id: number }) =>
            existingComment.id === newComment.id
        )
    );
    // 合并唯一的新评论
    comments.value = [...existingComments, ...uniqueNewComments];
    // 更新总数
    total.value = comments.value.length;
    console.log(total.value);
  } catch (error) {
    Message.info(error.msg);
  } finally {
    formLoading.value = false;
  }
};

// 审核一个
const confirmAuditOne = async () => {
  try {
    formLoading.value = true;

    await auditComment({ list: [selectOne] });
    // 筛选出不包含筛选数组的元素
    comments.value = comments.value.filter(
      comment => comment.id !== selectOne.value
    );

    // 获取最新的一条数据
    const { data } = await getCommentList({
      offset: curPage.value + 1,
      limit: 1,
      type: Number(props.itemType),
      email: search.value.email,
      nickname: search.value.nickname,
      title: search.value.title,
      parent_nickname: search.value.parent_nickname
    });
    // 获取现有评论
    const existingComments = comments.value;
    const newComments = data.data.comlist;
    // 合并之前检查重复项
    const uniqueNewComments = newComments.filter(
      (newComment: { id: number }) =>
        !existingComments.some(
          (existingComment: { id: number }) =>
            existingComment.id === newComment.id
        )
    );
    // 合并唯一的新评论
    comments.value = [...existingComments, ...uniqueNewComments];
    // 更新总数
    total.value = comments.value.length;
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
    console.log(props.itemType, 21331);

    formLoading.value = true;
    await deleteComment({ list: [selectList] });
    // 删除完毕后清空 selectList
    selectList.value = []; // 清空数组
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

// 批量审核
const confirmAuditSelect = async () => {
  try {
    formLoading.value = true;
    await auditComment({ list: [selectList] });
    // 审批完毕后清空 selectList
    selectList.value = []; // 清空数组
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
watch(selectList, newCount => {
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
  getList();
};

// 暴露方法给父组件
defineExpose({ reFresh });
</script>

<template>
  <div>
    <!-- <a-modal v-model:visible="editVisible" @ok="editOk">
      <template #title>修改评论</template>
      <a-mention
        v-model="editContent"
        type="textarea"
        placeholder="please enter your username..."
      />
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

    <a-modal v-model:visible="auditSelectVisible" @ok="confirmAuditSelect">
      <template #title>批量审核</template>
      <div style="text-align: center">确认一键审核选中评论吗？</div>
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
        @selection-change="selectAllChange"
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
            <h4>
              回复给
              <router-link :to="{ path: './' }" class="custom-link">
                {{ record.parent_nickname }}:
              </router-link>
            </h4>
            <a-typography-paragraph
              :ellipsis="{
                rows: 2,
                showTooltip: true,
                expandable: true
              }"
            >
              {{ record.content }}
              <div v-if="record.comment_path.length > 0">
                <h4>评论图片详情:</h4>
                <div class="pic_Details">
                  <a-image-preview-group infinite>
                    <a-space>
                      <a-image
                        v-for="(src, index) in record.comment_path"
                        :key="index"
                        :src="src"
                        width="80"
                        height="80"
                        style="object-fit: contain"
                      />
                    </a-space>
                  </a-image-preview-group>
                </div>
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
            <!-- <span>
              <a-button type="outline" size="mini" @click="editItem(record)">
                修改
              </a-button>
            </span> -->
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
            <span v-if="props.itemType === '2'">
              <a-button
                type="outline"
                status="success"
                size="mini"
                @click="auditOneDialog(record.id)"
              >
                审核
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

.pic_Details {
  display: grid;
}
</style>
