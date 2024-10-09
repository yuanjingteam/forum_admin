<script lang="ts" setup>
import { computed, ref, reactive, watch, nextTick } from 'vue';
import useLoading from '@/hooks/useLoading';
import {
  getAllMenuListService,
  getIconListService,
  addMenuService,
  getMenuDetailService,
  deleteMenuService,
  editMenuService
} from '@/api/menu';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
import { Message } from '@arco-design/web-vue';
import cloneDeep from 'lodash/cloneDeep';
import Sortable from 'sortablejs';
import { dataForm } from '@/views/acl/menu/testData';

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

//-------------获取菜单图标列表相关----------------------------
//存储菜单图标列表
const iconList = ref([]);
//获取菜单图标列表
const getIconList = async () => {
  const {
    data: {
      data: { icon_list }
    }
  } = await getIconListService();
  iconList.value = icon_list;
};
getIconList();
//下拉框菜单图标内容
const filterMethodOptions = computed(() => {
  return iconList.value.map(option => ({
    label: option.label,
    value: option.value
  }));
});

//下拉框权限点状态内容
const aclStatusOptions = computed(() => {
  return [
    {
      label: '正常',
      value: 1
    },
    {
      label: '封禁',
      value: 2
    }
  ];
});
//下拉框权限点类型内容
const aclTypesOptions = computed(() => {
  return [
    {
      label: '目录',
      value: 1
    },
    {
      label: '菜单',
      value: 2
    },
    {
      label: '按钮',
      value: 3
    }
  ];
});
//表格初始化属性值
const generateFormModel = () => {
  return {
    id: 0,
    name: '',
    code: '',
    icon: '',
    type: '',
    route_name: '',
    route_path: '',
    component_path: '',
    isVisible: 0,
    sort: 0,
    desc: ''
  };
};
//表格总条数
const total = ref(0);
//发送请求的原始数据
const originForm = () => {
  return {
    icon: '',
    name: '',
    type: '',
    route_name: '',
    route_path: '',
    isVisible: undefined,
    code: '',
    component_path: '',
    pid: 0,
    page: 1,
    limit: 10
  };
};
//发送请求数据
const menuForm = ref(originForm());

//接收到异步表格数据并渲染在表格内部
const renderData = ref([]);
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
    dataIndex: 'id',
    sortable: {
      sortDirections: ['ascend', 'descend']
    }
  },
  {
    title: '权限点名称',
    dataIndex: 'name'
  },
  {
    title: '权限点标识',
    dataIndex: 'code'
  },
  {
    title: '图标名',
    dataIndex: 'icon',
    slotName: 'icon'
  },
  {
    title: '权限类型',
    dataIndex: 'type',
    slotName: 'type'
  },
  {
    title: '路由name',
    dataIndex: 'route_name'
  },
  {
    title: '路由path',
    dataIndex: 'route_path'
  },
  {
    title: '文件路径',
    dataIndex: 'component_path'
  },
  {
    title: '状态',
    dataIndex: 'isVisible',
    slotName: 'isVisible'
  },
  {
    title: '排序',
    dataIndex: 'sort'
  },
  {
    title: '描述',
    dataIndex: 'desc'
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
    } = await getAllMenuListService(menuForm.value);
    renderData.value = data.menus;
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
  menuForm.value = originForm();
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

//-------添加、删除、编辑-----------------抽屉-----
//表单
const formRef = ref(null);
//控制抽屉是否显示
const visibleDrawer = ref(false);
//抽屉标题
const title = ref('添加');
//表示抽屉是添加还是编辑
const state = ref('');
//添加api表格数据原始数据
const originAddForm = () => {
  return {
    pid: undefined,
    type: '',
    icon: '',
    name: '',
    sort: 0,
    isVisible: 0,
    route_name: '',
    route_param: '',
    route_path: '',
    component_path: '',
    desc: '',
    code: ''
  };
};
//添加api表格数据
const addroleForm = ref(originAddForm());
//添加api
const addFaMenu = () => {
  title.value = '添加API';
  state.value = 'add';
  addroleForm.value = originAddForm();
  visibleDrawer.value = true;
};
//编辑当前api
const editMenu = async (id: number) => {
  title.value = '编辑API';
  state.value = 'edit';

  // //回显当前api的详情
  // const {
  //   data: { data }
  // } = await getMenuDetailService({ id: id });
  // addroleForm.value.id = data.id;
  // addroleForm.value.brief_introduction = data.brief_introduction;
  // addroleForm.value.path = data.path;
  // addroleForm.value.request_method = data.request_method;
  // addroleForm.value.grouping = data.grouping;
  // visibleDrawer.value = true;
};
//删除当前菜单
const deleteMenu = async (id: number) => {
  await deleteMenuService({ ids: [id] });
  fetchData();
  Message.success('删除成功');
};
//抽屉确认事件
const handleOkDrawer = async () => {
  if (!(await formRef.value.validate())) {
    if (state.value == 'add') {
      //调用添加api接口
      await addMenuService(addroleForm.value);
      Message.success('添加成功');
    } else {
      //调用编辑api接口
      await editMenuService(addroleForm.value);
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
  menuForm.value.page = current;
  fetchData();
};
//改变每页条数
const changePageSize = (pageSize: number) => {
  menuForm.value.page = 1;
  menuForm.value.limit = pageSize;
  fetchData();
};
</script>

<template>
  <div class="container">
    <Breadcrumb :items="['权限管理', '菜单管理']" />
    <a-collapse :default-active-key="['1']" :bordered="false">
      <a-collapse-item key="1" header="搜索" :style="customStyle">
        <a-row>
          <a-col :flex="1">
            <a-form
              :model="menuForm"
              :label-col-props="{ span: 6 }"
              :wrapper-col-props="{ span: 18 }"
              label-align="left"
            >
              <a-row :gutter="16">
                <a-col :span="8">
                  <a-form-item field="name" label="权限点名称">
                    <a-input
                      v-model="menuForm.name"
                      placeholder="请输入权限点名称"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item field="code" label="权限点标识">
                    <a-input
                      v-model="menuForm.code"
                      placeholder="请输入权限点标识"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item field="icon" label="图标名">
                    <a-select
                      v-model="menuForm.icon"
                      :options="filterMethodOptions"
                      placeholder="请选择图标名"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item field="type" label="权限类型">
                    <a-select
                      v-model="menuForm.type"
                      :options="aclTypesOptions"
                      placeholder="请选择权限类型"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item field="isVisible" label="状态">
                    <a-select
                      v-model="menuForm.isVisible"
                      :options="aclStatusOptions"
                      placeholder="请选择状态"
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
            <a-button type="primary" @click="addFaMenu()">
              <template #icon>
                <icon-plus />
              </template>
              新建根菜单
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
        show-empty-tree
        row-key="id"
        :loading="loading"
        :columns="cloneColumns as TableColumnData[]"
        :data="dataForm"
        :bordered="false"
        :size="size"
        :pagination="false"
      >
        <!-- 状态 -->
        <template #isVisible="{ record }">
          <a-tag v-if="record.isVisible == 1" color="#168cff">正常</a-tag>
          <a-tag v-else color="#ff5722">停用</a-tag>
        </template>
        <!-- 图标名 -->
        <template #icon="{ record }">
          <icon-settings />
          <span style="margin-left: 5px">{{ record.icon }}</span>
        </template>
        <!-- 权限类型 -->
        <template #type="{ record }">
          <a-tag v-if="record.type == '1'" color="purple">目录</a-tag>
          <a-tag v-else-if="record.type == '2'" color="blue">菜单</a-tag>
          <a-tag v-else color="green">按钮</a-tag>
        </template>
        <!-- 操作项 -->
        <template #operations="{ record }">
          <a-row>
            <a-col :span="8">
              <a-button v-if="record.type != 3" type="text">
                <template #icon>
                  <icon-plus />
                </template>
                <template #default>添加子菜单</template>
              </a-button>
            </a-col>
            <a-col :span="8">
              <a-button type="text" @click="editMenu(record.id)">
                <template #icon>
                  <icon-edit />
                </template>
                <template #default>编辑</template>
              </a-button>
            </a-col>
            <a-col :span="8">
              <a-popconfirm
                content="您确定要删除吗？"
                @ok="deleteMenu(record.id)"
              >
                <a-button type="text">
                  <template #icon>
                    <icon-delete />
                  </template>
                  <template #default>删除</template>
                </a-button>
              </a-popconfirm>
            </a-col>
          </a-row>
        </template>
      </a-table>
      <a-pagination
        :total="total"
        :size="size"
        show-total
        show-jumper
        show-page-size
        :current="menuForm.page"
        :page-size="menuForm.limit"
        @change="changePage"
        @page-size-change="changePageSize"
      />
    </a-card>
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
