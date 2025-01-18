<script setup lang="ts">
import useLoading from '@/hooks/useLoading';
import type { ArticleTableData } from '@/api/article';
import { TableRowSelection } from '@arco-design/web-vue';
import { Pagination } from '@/types/global';
import cloneDeep from 'lodash/cloneDeep';
import Sortable from 'sortablejs';
import {
  queryArticleList,
  delArticleList,
  banArticleList,
  unsealArticleList
} from '@/api/article';
import ArticleVditor from '@/components/Vditor/index.vue';
import { watch, ref, Ref, onMounted, reactive, computed, nextTick } from 'vue';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';

type SizeProps = 'mini' | 'small' | 'medium' | 'large';
type Column = TableColumnData & { checked?: true };

//父传子
const props = defineProps({
  searchModel: {
    type: Object
  },
  itemType: {
    type: String,
    default: '1'
  }
});

// 双向通信
// 一共多少数据
const total = defineModel('total', {
  type: Number,
  required: true
});

// 加载
const { loading, setLoading } = useLoading(true);

const selectedKeys = ref<number[]>([]); // 确保这里初始化为一个空数组

// 文章数据模型
const generateFormModel = (): ArticleTableData => {
  return {
    // id: null,
    // title: '',
    // nickname: '',
    // article_condition: null,
    // views_count: null,
    // likes_count: null,
    // collections_count: null,
    // comments_count: null,
    // heat: null,
    // published_at: '',
    // updated_at: '',
    // tags: [
    //   {
    //     ID: null,
    //     name: ''
    //   }
    // ]
  } as ArticleTableData;
};
// -------------表格配置--------------------
// 列配置
const columns = computed<TableColumnData[]>(() => [
  {
    title: '#',
    dataIndex: 'index',
    slotName: 'index'
  },
  {
    title: '文章标题',
    dataIndex: 'title'
  },
  {
    title: '作者',
    dataIndex: 'nickname'
  },
  {
    title: '标签类型',
    dataIndex: 'tags',
    slotName: 'tags'
  },
  {
    title: '文章浏览量',
    dataIndex: 'views_count'
  },
  {
    title: '文章点赞量',
    dataIndex: 'likes_count'
  },
  {
    title: '文章收藏量',
    dataIndex: 'collections_count'
  },
  {
    title: '文章评论数量',
    dataIndex: 'comments_count'
  },
  {
    title: '发布时间',
    dataIndex: 'published_at'
  },
  {
    title: '更新时间',
    dataIndex: 'updated_at'
  },
  {
    title: '文章热度',
    dataIndex: 'heat'
  },
  {
    title: '状态',
    dataIndex: 'article_condition',
    slotName: 'article_condition'
  },
  {
    title: '操作',
    dataIndex: 'operations',
    slotName: 'operations',
    align: 'center'
  }
]);

// 行配置
const rowSelection: TableRowSelection = reactive({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false
});

// 表格大小
const densityList = computed(() => [
  {
    name: '迷你',
    value: 'mini'
  },
  {
    name: '偏小',
    value: 'small'
  },
  {
    name: '中等',
    value: 'medium'
  },
  {
    name: '偏大',
    value: 'large'
  }
]);

// 可选择的每页条目数
const pageSizes = ref<number[]>([5, 10, 15]);

const basePagination: Pagination = {
  current: 1,
  pageSize: 10
};

const pagination = reactive({
  ...basePagination,
  showTotal: true, // 设置为布尔值
  showJumper: true,
  showPageSize: true,
  pageSizeOptions: pageSizes
});

// -----------------------表格渲染--------------------------------
// 表格数据
const formModel: Ref<ArticleTableData[]> = ref();

// 表格项数据
const detailData = ref(generateFormModel());

// 表格标签项
const fieldNames = { value: 'ID', label: 'name' };

// 接收数据
const cloneColumns = ref<Column[]>([]);

// 查看详情是否可见
const detailVisible = ref(false);

// 获取搜索数据
const fetchData = async item => {
  setLoading(true);

  try {
    const { data } = await queryArticleList(item);
    formModel.value = data.data.article_list;
    pagination.total = data.data.total;
    total.value = data.data.total;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

// -------------------- 表格尺寸配置------------------------
// 表格大小
const size = ref<SizeProps>('medium');

// 能够展示的列
const showColumns = ref<Column[]>([]);

// 切换大小
const handleSelectDensity = (
  val: string | number | Record<string, any> | undefined,
  _e: Event
) => {
  size.value = val as SizeProps;
};

// 展示列
const handleChange = (
  checked: boolean | (string | boolean | number)[],
  column: Column,
  index: number
) => {
  if (!checked) {
    cloneColumns.value = showColumns.value.filter(
      item => item.dataIndex !== column.dataIndex
    );
  } else {
    cloneColumns.value.splice(index, 0, column);
  }
};

const exchangeArray = <T extends Array<any>>(
  array: T,
  beforeIdx: number,
  newIdx: number,
  isDeep = false
): T => {
  const newArray = isDeep ? cloneDeep(array) : array;
  if (beforeIdx > -1 && newIdx > -1) {
    // 先替换后面的，然后拿到替换的结果替换前面的
    newArray.splice(
      beforeIdx,
      1,
      newArray.splice(newIdx, 1, newArray[beforeIdx]).pop()
    );
  }
  return newArray;
};

// 定义一个函数，用于处理弹出框可见性的变化
const popupVisibleChange = (val: boolean) => {
  // 当弹出框可见时（val 为 true）
  if (val) {
    // 使用 nextTick 确保在 DOM 更新后执行回调
    nextTick(() => {
      // 获取 ID 为 'tableSetting' 的 DOM 元素，并将其类型断言为 HTMLElement
      const el = document.getElementById('tableSetting') as HTMLElement;

      // @ts-ignore 忽略 TypeScript 检查，防止类型错误
      const sortable = new Sortable(el, {
        // 当拖放结束时调用的事件处理函数
        onEnd(e: any) {
          // 解构获取拖动前的索引和拖动后的索引
          const { oldIndex, newIndex } = e;
          // 调用 exchangeArray 函数更新 cloneColumns 和 showColumns 的顺序
          exchangeArray(cloneColumns.value, oldIndex, newIndex);
          exchangeArray(showColumns.value, oldIndex, newIndex);
        }
      });
    });
  }
};

watch(
  () => columns.value,
  val => {
    cloneColumns.value = cloneDeep(val);
    cloneColumns.value.forEach((item, _index) => {
      item.checked = true;
    });
    showColumns.value = cloneDeep(cloneColumns.value);
  },
  { deep: true, immediate: true }
);

// -------------------表格交互---------------------
// 批量删除
const deleteDialog = ref(false);
// 批量审核
// const auditDialog = ref(false);

// 控制按钮的启用状态
const isButtonEnabled = ref<boolean>(false);

// // 打开批量删除对话框
const notifyDeleteSelect = () => {
  deleteDialog.value = true;
};

// 打开一键审核对话框
// const notifyAudit = () => {
//   auditDialog.value = true;
// };

// 页面切换
const onPageChange = (current: number) => {
  pagination.current = current;
  reFresh();
};

// 处理每页条目数变化
const handlePageSizeChange = size => {
  // 只接收 size
  console.log(`每页条目数已更改为: ${size}`);
  pagination.pageSize = size; // 更新每页条目数
  pagination.current = 1; // 重置当前页为1
};

//-------------------表格操作-----------------------
// 单选可勾选多个
const selectItem = item => {
  console.log(item);
};

// 全选,一次性选中当前页所有
const selectAllChange = item => {
  console.log(item);
};

// 删除当前项
const confirmDeleteOne = async id => {
  await delArticleList({
    id_list: [id]
  });
  reFresh();
};
// 审核当前项
// const confirmAuditOne = async id => {
//   await auditArticleList({
//     id_list: [id]
//   });
//   reFresh();
// };

// 封禁当前项
const confirmBanOne = async id => {
  await banArticleList({
    id_list: [id]
  });
  reFresh();
};

// 解封当前项
const confirmUnsealOne = async id => {
  await unsealArticleList({
    id_list: [id]
  });
  reFresh();
};

// 查看/编辑文章详情
const detailSelect = record => {
  detailVisible.value = true;
  detailData.value = record;
};

// 批量删除
const batchDelArticle = async () => {
  try {
    setLoading(true);
    await delArticleList({
      ids: selectedKeys.value
    });
    selectedKeys.value = [];
    reFresh();
  } catch {
  } finally {
    setLoading(false);
  }
};

// 批量审核
// const batchAuditAricle = async () => {
//   try {
//     setLoading(true);
//     await auditArticleList({
//       ids: selectedKeys.value
//     });
//     selectedKeys.value = [];
//     reFresh();
//   } catch {
//   } finally {
//     setLoading(false);
//   }
// };

// 初始化
onMounted(() => {
  // console.log(props.searchModel,234234234);
  // 初始化表格
  fetchData(props.searchModel);
});

// 监听是否可以批量删除
watch(selectedKeys, newCount => {
  if (newCount.length > 0) {
    isButtonEnabled.value = true;
  } else {
    isButtonEnabled.value = false;
  }
});

// 通用刷新方法
const reFresh = () => {
  fetchData({
    ...props.searchModel,
    itemType: props.itemType,
    ...pagination
  } as unknown);
};
// 暴露方法给父组件
defineExpose({ reFresh });
</script>

<template>
  <div>
    <a-drawer v-model:visible="detailVisible" :width="420" unmountOnClose>
      <template #title>
        <h3>文章详情</h3>
      </template>
      <a-layout style="min-height: 450px">
        <a-layout-header>
          <h3>《{{ detailData.title }}》</h3>
          <div>作者:{{ detailData.nickname }}</div>
          <br />
        </a-layout-header>
        <a-layout-content>
          <div ref="editorRef"></div>
          <article-vditor :id="detailData.id"></article-vditor>
          <!-- <div>{{ detailData.article_content.text }}</div>
          <div class="detial_img">
            <a-image-preview-group infinite>
              <a-space>
                <a-image
                  v-for="(item, index) in detailData.article_content.pic"
                  :key="index"
                  width="60"
                  height="60"
                  :src="item"
                ></a-image>
              </a-space>
            </a-image-preview-group>
          </div> -->
          <div>点赞数:{{ detailData.likes_count }}</div>
          <div>评论数:{{ detailData.comments_count }}</div>
          <div>收藏数:{{ detailData.collections_count }}</div>
        </a-layout-content>
        <a-layout-footer></a-layout-footer>
      </a-layout>
    </a-drawer>

    <a-modal v-model:visible="deleteDialog" @ok="batchDelArticle">
      <template #title>批量删除</template>
      <div style="text-align: center">
        确认批量删除选中文章吗?删除之后将无法再恢复。
      </div>
    </a-modal>
    <!--
    <a-modal v-model:visible="auditDialog" @ok="batchAuditAricle">
      <template #title>批量审核</template>
      <div style="text-align: center">确认一键审核选中文章吗？</div>
    </a-modal> -->
    <a-row style="margin-bottom: 16px">
      <a-col :span="12">
        <a-space>
          <a-button type="primary" @click="reFresh">刷新</a-button>
          <a-button
            type="dashed"
            status="danger"
            :disabled="!isButtonEnabled"
            @click="notifyDeleteSelect"
          >
            批量删除
          </a-button>
        </a-space>
      </a-col>
      <a-col
        :span="12"
        style="display: flex; align-items: center; justify-content: end"
      >
        <a-button>
          <template #icon>
            <icon-download />
          </template>
          下载
        </a-button>
        <a-tooltip content="刷新">
          <div class="action-icon" @click="reFresh">
            <icon-refresh size="18" />
          </div>
        </a-tooltip>
        <a-dropdown @select="handleSelectDensity">
          <a-tooltip content="密度">
            <div class="action-icon"><icon-line-height size="18" /></div>
          </a-tooltip>
          <template #content>
            <a-doption
              v-for="item in densityList"
              :key="item.value"
              :value="item.value"
              :class="{ active: item.value === size }"
            >
              <span>{{ item.name }}</span>
            </a-doption>
          </template>
        </a-dropdown>
        <a-tooltip content="列设置">
          <a-popover
            trigger="click"
            position="bl"
            @popup-visible-change="popupVisibleChange"
          >
            <div class="action-icon"><icon-settings size="18" /></div>
            <template #content>
              <div id="tableSetting">
                <div
                  v-for="(item, index) in showColumns"
                  :key="item.dataIndex"
                  class="setting"
                >
                  <div style="margin-right: 4px; cursor: move">
                    <icon-drag-arrow />
                  </div>
                  <div>
                    <a-checkbox
                      v-model="item.checked"
                      @change="
                        handleChange($event, item as TableColumnData, index)
                      "
                    ></a-checkbox>
                  </div>
                  <div class="title">
                    {{ item.title === '#' ? '序列号' : item.title }}
                  </div>
                </div>
              </div>
            </template>
          </a-popover>
        </a-tooltip>
      </a-col>
    </a-row>
    <a-table
      v-model:selectedKeys="selectedKeys"
      row-key="id"
      :data="formModel"
      :loading="loading"
      stripe
      :row-selection="rowSelection"
      :pagination="pagination"
      :columns="cloneColumns"
      :bordered="false"
      :size="size"
      @page-change="onPageChange"
      @select="selectItem"
      @selection-change="selectAllChange"
      @page-size-change="handlePageSizeChange"
    >
      <template #index="{ rowIndex }">
        {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
      </template>

      <template #tags="{ record }">
        <a-input-tag
          :style="{ width: '240px' }"
          :default-value="record.tags.map(tag => tag.name)"
          :field-names="fieldNames"
          readonly
        ></a-input-tag>
      </template>
      <template #operations="{ record }">
        <div class="option">
          <span>
            <a-button
              v-permission="['acl:article:view']"
              type="text"
              @click="detailSelect(record)"
            >
              查看详情
            </a-button>
          </span>
          <span>
            <a-popconfirm
              content="您确定要删除吗？"
              @ok="confirmDeleteOne(record.id)"
            >
              <a-button v-permission="['acl:articel:del']" type="text">
                <template #icon>
                  <icon-edit />
                </template>
                <template #default>删除</template>
              </a-button>
            </a-popconfirm>
          </span>
          <span v-if="record.article_condition != '1'">
            <a-popconfirm
              content="您确定封禁当前文章吗？"
              @ok="confirmBanOne(record.id)"
            >
              <a-button v-permission="['acl:article:ban']" type="text">
                <template #icon>
                  <icon-edit />
                </template>
                <template #default>封禁</template>
              </a-button>
            </a-popconfirm>
          </span>
          <span v-if="record.article_condition != '2'">
            <a-popconfirm
              content="您确定要解封当前文章吗？"
              @ok="confirmUnsealOne(record.id)"
            >
              <a-button v-permission="['acl:article:unblock']" type="text">
                <template #icon>
                  <icon-edit />
                </template>
                <template #default>解封</template>
              </a-button>
            </a-popconfirm>
          </span>
        </div>
      </template>
    </a-table>
  </div>
</template>

<style scoped lang="less">
.action-icon {
  margin-left: 12px;
  cursor: pointer;
}

.setting {
  display: flex;
  align-items: center;
  width: 200px;

  .title {
    margin-left: 12px;
    cursor: pointer;
  }
}

.detial_img {
  margin-top: 20px;
}
</style>
