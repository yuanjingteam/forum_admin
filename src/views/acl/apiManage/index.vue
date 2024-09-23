<script lang="ts" setup>
import { computed, ref, reactive, watch, nextTick, h } from 'vue';
import useLoading from '@/hooks/useLoading';
// import { queryPolicyList, PolicyRecord, PolicyParams } from '@/api/list';
import {
  getApiListService,
  Api,
  ApiForm,
  getApiMethodsService,
  getApiGroupsService,
  addApiService,
  getApiDetailService
} from '@/api/api';
// import { Pagination } from '@/types/global';
import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
import { TableRowSelection, Message } from '@arco-design/web-vue';
import { IconFaceSmileFill } from '@arco-design/web-vue/es/icon';
import cloneDeep from 'lodash/cloneDeep';
import Sortable from 'sortablejs';

type SizeProps = 'mini' | 'small' | 'medium' | 'large';
type Column = TableColumnData & { checked?: true };

//表格上方搜素框的样式
const customStyle = {
  marginBottom: '18px',
  border: '1px solid #e5e6eb',
  overflow: 'hidden'
};
//加载效果
const { loading, setLoading } = useLoading(true);
//当前多选框选择的key
const selectedKeys = ref([]);
//列选择属性
const rowSelection: TableRowSelection = reactive({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false
});
//-------------api请求方法相关----------------------------
//存储api方法列表
const apiMethods = ref([]);
//获取所有api方法
const getApiMethods = async () => {
  const {
    data: {
      data: { methods }
    }
  } = await getApiMethodsService();
  apiMethods.value = methods;
};
getApiMethods();
//下拉框请求方法内容
const filterMethodOptions = computed(() => {
  return apiMethods.value.map(option => ({
    label: option.label,
    value: option.value
  }));
});
//-------------------api分组列表-----------------------------
//存储api方法列表
const apiGroups = ref([]);
//获取所有api方法
const getApiGroups = async () => {
  const {
    data: {
      data: { groups }
    }
  } = await getApiGroupsService();
  apiGroups.value = groups;
};
getApiGroups();
//下拉框请求方法内容
const contentTypeOptions = computed(() => {
  return apiGroups.value.map(option => ({
    label: option.label,
    value: option.value
  }));
});

//表格初始化属性值
const generateFormModel = () => {
  return {
    id: 0,
    path: '',
    grouping: '',
    brief_introduction: '',
    request_method: ''
  };
};
//表格总条数
const total = ref(0);
//发送原始数据
const originForm = () => {
  return {
    path: '',
    brief_introduction: '',
    grouping_id: 0,
    request_method_id: 0,
    page: 1,
    limit: 20
  };
};
//发送请求数据
const apiForm: ApiForm = ref(originForm());

//接收到异步表格数据并渲染在表格内部
const renderData = ref<Api[]>([]);
//查询表格属性的ref对象
const formModel = ref(generateFormModel());
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);

const size = ref<SizeProps>('medium');

//密度数据
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
//列数据
const columns = computed<TableColumnData[]>(() => [
  {
    title: 'ID',
    dataIndex: 'id'
  },
  {
    title: 'API路径',
    dataIndex: 'path'
  },
  {
    title: 'API分组',
    dataIndex: 'grouping'
  },
  {
    title: 'API简介',
    dataIndex: 'brief_introduction'
  },
  {
    title: '请求',
    dataIndex: 'request_method'
  },
  {
    title: '操作',
    dataIndex: 'operations',
    slotName: 'operations'
  }
]);

//请求获取表格数据
const fetchData = async (page: number, limit: number) => {
  apiForm.value.page = page;
  apiForm.value.limit = limit;
  //打开加载效果
  setLoading(true);
  try {
    const {
      data: { data }
    } = await getApiListService(apiForm.value);
    renderData.value = data.api;
    total.value = data.total;
  } catch (err) {
    // 处理错误信息
  } finally {
    //关闭加载效果
    setLoading(false);
  }
};
fetchData(1, 20);
//点击查询按钮时调用方法
const search = () => {
  fetchData(1, 20);
};
//分页查询方法
// const onPageChange = (page: number) => {
//   fetchData(page);
// };

//重置方法
const reset = () => {
  apiForm.value = originForm();
  console.log(apiForm.value, 11);

  formModel.value = generateFormModel();
  fetchData(1, 20);
};

const handleSelectDensity = (
  val: string | number | Record<string, any> | undefined,
  _e: Event
) => {
  size.value = val as SizeProps;
};

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

const popupVisibleChange = (val: boolean) => {
  if (val) {
    nextTick(() => {
      const el = document.getElementById('tableSetting') as HTMLElement;
      // @ts-ignore
      const sortable = new Sortable(el, {
        onEnd(e: any) {
          const { oldIndex, newIndex } = e;
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

//请求api列表
const getApiList = async () => {
  const res = await getApiListService({
    page: 1,
    limit: 8
  });
  console.log(res.data);
  renderData.value = res.data.data.api;
};
getApiList();

//
const change = () => {
  console.log(apiForm.value.request_method_id);
  Message.success({
    content: 'ghdfhsdf',
    icon: () => h(IconFaceSmileFill)
  });
};

//------------------------抽屉-------------------------

//控制抽屉是否显示
const visible = ref(false);
//抽屉标题
const title = ref('添加API');
//表示抽屉是添加还是编辑
const state = ref('');
//添加api表格数据原始数据
const originAddForm = () => {
  return {
    path: '',
    request_method_id: 0,
    grouping_id: 0,
    brief_introduction: ''
  };
};
//添加api表格数据
const addApiForm = ref(originAddForm());
//添加api
const addApi = () => {
  title.value = '添加API';
  state.value = 'add';
  addApiForm.value = originAddForm();
  visible.value = true;
};
//编辑当前api
const editApi = async (id: number) => {
  title.value = '编辑API';
  state.value = 'edit';

  //回显当前api的详情
  const {
    data: { data }
  } = await getApiDetailService({ id: id });
  console.log(data);

  visible.value = true;
};
//删除当前api
const deleteApi = (id: number) => {};
//抽屉确认事件
const handleOk = async () => {
  if (state.value == 'add') {
    //调用添加api接口
    await addApiService(addApiForm.value);
  } else {
    //调用编辑api接口
  }
  visible.value = false;
};
//抽屉取消事件
const handleCancel = () => {
  visible.value = false;
};
</script>

<template>
  <div class="container">
    <Breadcrumb :items="['权限管理', 'api管理']" />
    <a-collapse :default-active-key="['1']" :bordered="false">
      <a-collapse-item key="1" header="搜索" :style="customStyle">
        <a-row>
          <a-col :flex="1">
            <a-form
              :model="apiForm"
              :label-col-props="{ span: 6 }"
              :wrapper-col-props="{ span: 18 }"
              label-align="left"
            >
              <a-row :gutter="16">
                <a-col :span="8">
                  <a-form-item field="path" label="API路径">
                    <a-input
                      v-model="apiForm.path"
                      placeholder="请输入API路径"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item field="brief_introduction" label="API简介">
                    <a-input
                      v-model="apiForm.brief_introduction"
                      placeholder="请输入API简介"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item field="grouping" label="API分组">
                    <a-select
                      v-model="apiForm.grouping_id"
                      :options="contentTypeOptions"
                      placeholder="请选择API分组"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item field="request_method" label="请求方法">
                    <a-select
                      v-model="apiForm.request_method_id"
                      :options="filterMethodOptions"
                      placeholder="请选择请求方法"
                      @change="change"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-col>
          <a-divider style="height: 84px" direction="vertical" />
          <a-col :flex="'86px'" style="text-align: right">
            <a-space direction="vertical" :size="18">
              <a-button type="primary" @click="search">
                <template #icon>
                  <icon-search />
                </template>
                查询
              </a-button>
              <a-button @click="reset">
                <template #icon>
                  <icon-refresh />
                </template>
                重置
              </a-button>
            </a-space>
          </a-col>
        </a-row>
      </a-collapse-item>
    </a-collapse>
    <a-card class="general-card">
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="addApi()">
              <template #icon>
                <icon-plus />
              </template>
              新建
            </a-button>
            <a-button>
              <template #icon>
                <icon-delete />
              </template>
              批量删除
            </a-button>
          </a-space>
        </a-col>
        <a-col
          :span="12"
          style="display: flex; align-items: center; justify-content: end"
        >
          <a-tooltip content="刷新">
            <div class="action-icon" @click="search">
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
        :loading="loading"
        :columns="cloneColumns as TableColumnData[]"
        :data="renderData"
        :row-selection="rowSelection"
        :bordered="false"
        :size="size"
        :pagination="false"
      >
        <!-- 操作项 -->
        <template #operations="{ record }">
          <a-button type="text" @click="editApi(record.id)">
            <template #icon>
              <icon-edit />
            </template>
            <template #default>编辑</template>
          </a-button>
          <a-button type="text" @click="deleteApi(record.id)">
            <template #icon>
              <icon-delete />
            </template>
            <template #default>删除</template>
          </a-button>
        </template>
      </a-table>
      <a-pagination
        :total="total"
        :size="size"
        show-total
        show-jumper
        show-page-size
        :current="apiForm.page"
        :page-size="apiForm.limit"
      />
    </a-card>
  </div>
  <a-drawer
    :width="700"
    :visible="visible"
    unmountOnClose
    :title="title"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div>
      <a-form :model="addApiForm" :style="{ width: '600px' }">
        <a-form-item field="path" label="API路径" required>
          <a-input v-model="addApiForm.path" placeholder="请输入API路径" />
        </a-form-item>
        <a-form-item field="grouping_id" label="API分组" required>
          <a-select
            v-model="addApiForm.grouping_id"
            :options="contentTypeOptions"
            placeholder="请选择API分组"
          />
        </a-form-item>
        <a-form-item field="request_method_id" label="请求方法" required>
          <a-select
            v-model="addApiForm.request_method_id"
            :options="filterMethodOptions"
            placeholder="请选择请求方法"
          />
        </a-form-item>
        <a-form-item field="brief_introduction" label="API简介">
          <a-input
            v-model="addApiForm.brief_introduction"
            placeholder="请输入API简介"
          />
        </a-form-item>
      </a-form>
    </div>
  </a-drawer>
</template>

<style scoped lang="less">
.container {
  padding: 0 20px 20px;
}

:deep(.arco-table-th) {
  &:last-child {
    .arco-table-th-item-title {
      margin-left: 16px;
    }
  }
}

.action-icon {
  margin-left: 12px;
  cursor: pointer;
}

.active {
  color: #0960bd;
  background-color: #e3f4fc;
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

.arco-collapse:deep(.arco-collapse-item-content) {
  background-color: #fff;
}

.arco-pagination {
  justify-content: flex-end;
  margin-top: 10px;
  margin-right: 10px;
}
</style>
