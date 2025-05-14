<script lang="ts" setup>
import { computed, ref, reactive, watch, nextTick } from 'vue';
import useLoading from '@/hooks/useLoading';
import {
  getApiListService,
  Api,
  ApiForm,
  addApiService,
  getApiDetailService,
  deleteApiService,
  editApiService
} from '@/api/api';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
import { TableRowSelection, Message } from '@arco-design/web-vue';
import cloneDeep from 'lodash/cloneDeep';
import Sortable from 'sortablejs';
import { useApiStore } from '@/store';

type SizeProps = 'mini' | 'small' | 'medium' | 'large';
type Column = TableColumnData & { checked?: true };

const apiStore = useApiStore();
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

const loadData = async () => {
  //调用获取请求方法列表
  await apiStore.getApiMethods();
  //调用获取api分组列表
  await apiStore.getApiGroups();
};
loadData();
//下拉框请求方法内容
const filterMethodOptions = computed(() => {
  return apiStore.apiMethods;
});

//下拉框请求方法内容
const contentTypeOptions = computed(() => {
  return apiStore.apiGroups;
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
    grouping: '',
    request_method: '',
    page: 1,
    limit: 10
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
const densityList = apiStore.densityList;
//列数据
const columns = computed<TableColumnData[]>(() => [
  {
    title: 'ID',
    dataIndex: 'id',
    sortable: {
      sortDirections: ['ascend', 'descend']
    }
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
const fetchData = async () => {
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
fetchData();
//点击查询按钮时调用方法
const search = () => {
  fetchData();
};

//重置方法
const reset = () => {
  apiForm.value = originForm();
  formModel.value = generateFormModel();
  fetchData();
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

//-------------------批量删除数据-----------------------
//批量删除
const batchDeleteApi = () => {
  if (selectedKeys.value.length > 0) {
    visibleModal.value = true;
  } else {
    Message.error('请先选择要删除的行');
  }
};

//批量删除的确认框
const visibleModal = ref(false);
//确认批量删除
const handleOkModal = async () => {
  visibleModal.value = false;
  await deleteApiService({ ids: selectedKeys.value });
  apiForm.value.page = 1;
  fetchData();
  Message.success('删除成功');
};
//取消批量删除
const handleCancelModal = () => {
  visibleModal.value = false;
};
//-------添加、删除、编辑-----------------抽屉-----
//表单
const formRef = ref(null);
//控制抽屉是否显示
const visibleDrawer = ref(false);
//抽屉标题
const title = ref('添加API');
//表示抽屉是添加还是编辑
const state = ref('');
//添加api表格数据原始数据
const originAddForm = () => {
  return {
    id: undefined,
    path: '',
    request_method: '',
    grouping: '',
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
  visibleDrawer.value = true;
};
//编辑当前api
const editApi = async (id: number) => {
  title.value = '编辑API';
  state.value = 'edit';

  //回显当前api的详情
  const {
    data: { data }
  } = await getApiDetailService(id);
  addApiForm.value.id = data.id;
  addApiForm.value.brief_introduction = data.brief_introduction;
  addApiForm.value.path = data.path;
  addApiForm.value.request_method = data.request_method;
  addApiForm.value.grouping = data.grouping;
  visibleDrawer.value = true;
};
//删除当前api
const deleteApi = async (id: number) => {
  await deleteApiService({ ids: [id] });
  fetchData();
  Message.success('删除成功');
};
//抽屉确认事件
const handleOkDrawer = async () => {
  if (!(await formRef.value.validate())) {
    if (state.value == 'add') {
      //调用添加api接口
      await addApiService(addApiForm.value);
      Message.success('添加成功');
    } else {
      //调用编辑api接口
      await editApiService(addApiForm.value);
      Message.success('编辑成功');
    }
    fetchData();
    visibleDrawer.value = false;
  }
};
//抽屉取消事件
const handleCancelDrawer = () => {
  visibleDrawer.value = false;
};
//--------------------分页--------------------
//点击跳转改变当前页数
const changePage = (current: number) => {
  apiForm.value.page = current;
  fetchData();
};
//改变每页条数
const changePageSize = (pageSize: number) => {
  apiForm.value.page = 1;
  apiForm.value.limit = pageSize;
  fetchData();
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
                      v-model="apiForm.grouping"
                      :options="contentTypeOptions"
                      placeholder="请选择API分组"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item field="request_method" label="请求方法">
                    <a-select
                      v-model="apiForm.request_method"
                      :options="filterMethodOptions"
                      placeholder="请选择请求方法"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-col>
          <a-divider style="height: 84px" direction="vertical" />
          <a-col :flex="'86px'" style="text-align: right">
            <a-space direction="vertical" :size="18">
              <a-button
                v-permission="['acl:api:search']"
                type="primary"
                @click="search"
              >
                <template #icon>
                  <icon-search />
                </template>
                查询
              </a-button>
              <a-button v-permission="['acl:api:search']" @click="reset">
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
            <a-button
              v-permission="['acl:api:add']"
              type="primary"
              @click="addApi()"
            >
              <template #icon>
                <icon-plus />
              </template>
              新建
            </a-button>
            <a-button
              v-permission="['acl:api:delete']"
              @click="batchDeleteApi()"
            >
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
          <a-button
            v-permission="['acl:api:edit']"
            type="text"
            @click="editApi(record.id)"
          >
            <template #icon>
              <icon-edit />
            </template>
            <template #default>编辑</template>
          </a-button>

          <a-popconfirm content="您确定要删除吗？" @ok="deleteApi(record.id)">
            <a-button v-permission="['acl:api:delete']" type="text">
              <template #icon>
                <icon-delete />
              </template>
              <template #default>删除</template>
            </a-button>
          </a-popconfirm>
        </template>
      </a-table>
      <a-pagination
        v-permission="['acl:api:search']"
        :total="total"
        :size="size"
        show-total
        show-jumper
        show-page-size
        :current="apiForm.page"
        :page-size="apiForm.limit"
        @change="changePage"
        @page-size-change="changePageSize"
      />
    </a-card>
    <a-drawer
      :width="700"
      :visible="visibleDrawer"
      unmountOnClose
      :title="title"
      @ok="handleOkDrawer"
      @cancel="handleCancelDrawer"
    >
      <div>
        <a-form ref="formRef" :model="addApiForm" :style="{ width: '600px' }">
          <a-form-item v-if="state == 'edit'" field="id" label="ID">
            <a-input v-model="addApiForm.id" disabled />
          </a-form-item>
          <a-form-item
            field="path"
            label="API路径"
            required
            :rules="[
              { required: true, message: '请填写API路径' },
              {
                match: /^\/[a-zA-Z0-9]*$/,
                message: 'API路径需以/开头，由字母数字组成'
              }
            ]"
          >
            <a-input v-model="addApiForm.path" placeholder="请输入API路径" />
          </a-form-item>
          <a-form-item
            field="grouping"
            label="API分组"
            required
            :rules="[{ required: true, message: '请选择API分组' }]"
          >
            <a-select
              v-model="addApiForm.grouping"
              :options="contentTypeOptions"
              placeholder="请选择API分组"
            />
          </a-form-item>
          <a-form-item
            field="request_method"
            label="请求方法"
            required
            :rules="[{ required: true, message: '请选择请求方法' }]"
          >
            <a-select
              v-model="addApiForm.request_method"
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
    <a-modal
      v-model:visible="visibleModal"
      @ok="handleOkModal"
      @cancel="handleCancelModal"
    >
      <template #title>批量删除</template>
      <div>当前共有{{ selectedKeys.length }}条数据。您确定要删除吗？</div>
    </a-modal>
  </div>
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
