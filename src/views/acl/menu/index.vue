<script lang="ts" setup>
import { computed, ref, watch, nextTick } from 'vue';
import useLoading from '@/hooks/useLoading';
import {
  getAllMenuListService,
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
import { useMenuStore } from '@/store';
type SizeProps = 'mini' | 'small' | 'medium' | 'large';
type Column = TableColumnData & { checked?: true };

const menuStore = useMenuStore();
//表格上方搜素框的样式
const customStyle = {
  marginBottom: '18px',
  border: '1px solid #e5e6eb',
  overflow: 'hidden'
};
//加载效果
const { loading, setLoading } = useLoading(true);

//-------------下拉框内容相关----------------------------
//下拉框选择图标内容
const filterIconlistOptions = computed(() => {
  return menuStore.iconList;
});
//新建菜单单选框
const typeOptions = menuStore.typeOptions;
//下拉框权限点状态内容
const aclStatusOptions = menuStore.aclStatusOptions;
//下拉框权限点类型内容
const aclTypesOptions = menuStore.aclTypesOptions;
//初始化一些下拉框中的数据
const loadData = async () => {
  //调用获取图标方法
  await menuStore.getIconList();
};
loadData();

//下拉框选择父级菜单内容
const menuOptions = computed(() => {
  return [];
});
//----------------------表格相关----------------------
//表格初始化属性值
const generateFormModel = () => {
  return {
    id: 0,
    name: '',
    code: '',
    icon: '',
    type: 0,
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
    type: 0,
    route_name: '',
    route_path: '',
    isVisible: 0,
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
const densityList = menuStore.densityList;
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
//添加菜单表格数据原始数据
const originAddForm = () => {
  return {
    id: undefined,
    pid: undefined,
    type: 1,
    icon: '',
    name: '',
    sort: 0,
    isVisible: 0,
    route_name: '',
    route_param: '',
    route_path: '',
    component_path: '',
    desc: '',
    code: '',
    api_id: []
  };
};
//添加菜单表格数据
const addMenuForm = ref(originAddForm());
//添加菜单
const addMenu = () => {
  title.value = '新建菜单';
  state.value = 'add';
  addMenuForm.value = originAddForm();
  visibleDrawer.value = true;
};
//编辑当前菜单
const editMenu = async (id: number) => {
  title.value = '编辑菜单';
  state.value = 'edit';
  addMenuForm.value = originAddForm();

  //回显当前菜单的详情
  const {
    data: { data }
  } = await getMenuDetailService(id);
  console.log(data);

  addMenuForm.value.id = data.id;
  addMenuForm.value.pid = data.pid;
  addMenuForm.value.type = data.type;
  addMenuForm.value.icon = data.icon;
  addMenuForm.value.name = data.name;
  addMenuForm.value.sort = data.sort;
  addMenuForm.value.isVisible = data.isVisible;
  addMenuForm.value.route_name = data.route_name;
  addMenuForm.value.route_param = data.route_param;
  addMenuForm.value.route_path = data.route_path;
  addMenuForm.value.component_path = data.component_path;
  addMenuForm.value.desc = data.desc;
  addMenuForm.value.code = data.code;
  addMenuForm.value.api_id = data.api_id;

  visibleDrawer.value = true;
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
      //调用添加菜单接口
      await addMenuService(addMenuForm.value);
      Message.success('添加成功');
    } else {
      //调用编辑菜单接口
      await editMenuService(addMenuForm.value);
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
                      :options="filterIconlistOptions"
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
              <a-button
                v-permission="['acl:menu:search']"
                type="primary"
                @click="search"
              >
                <template #icon>
                  <icon-search />
                </template>
                查询
              </a-button>
              <a-button v-permission="['acl:menu:search']" @click="reset">
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
              v-permission="['acl:menu:add']"
              type="primary"
              @click="addMenu()"
            >
              <template #icon>
                <icon-plus />
              </template>
              新建菜单
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
          <a-tag v-else color="#ff5722">隐藏</a-tag>
        </template>
        <!-- 图标名 -->
        <template #icon="{ record }">
          <icon-settings />
          <span style="margin-left: 5px">{{ record.icon }}</span>
        </template>
        <!-- 权限类型 -->
        <template #type="{ record }">
          <a-tag v-if="record.type == 1" color="purple">目录</a-tag>
          <a-tag v-else-if="record.type == 2" color="blue">菜单</a-tag>
          <a-tag v-else color="green">按钮</a-tag>
        </template>
        <!-- 操作项 -->
        <template #operations="{ record }">
          <a-button
            v-permission="['acl:menu:edit']"
            type="text"
            @click="editMenu(record.id)"
          >
            <template #icon>
              <icon-edit />
            </template>
            <template #default>编辑</template>
          </a-button>
          <a-popconfirm content="您确定要删除吗？" @ok="deleteMenu(record.id)">
            <a-button v-permission="['acl:menu:delete']" type="text">
              <template #icon>
                <icon-delete />
              </template>
              <template #default>删除</template>
            </a-button>
          </a-popconfirm>
        </template>
      </a-table>
      <a-pagination
        v-permission="['acl:menu:search']"
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
    <a-drawer
      :width="700"
      :visible="visibleDrawer"
      unmountOnClose
      :title="title"
      @ok="handleOkDrawer"
      @cancel="handleCancelDrawer"
    >
      <div v-if="addMenuForm.type == 1">
        <a-form ref="formRef" :model="addMenuForm" :style="{ width: '600px' }">
          <a-form-item v-if="state == 'edit'" field="id" label="ID">
            <a-input v-model="addMenuForm.id" disabled />
          </a-form-item>
          <a-form-item field="pid" label="父级菜单">
            <a-select
              v-model="addMenuForm.pid"
              :options="menuOptions"
              placeholder="请选择父级菜单"
            />
          </a-form-item>
          <a-form-item
            field="name"
            label="菜单名称"
            required
            :rules="[{ required: true, message: '请输入菜单名称' }]"
          >
            <a-input v-model="addMenuForm.name" placeholder="请输入菜单名称" />
          </a-form-item>
          <a-form-item
            field="type"
            label="菜单类型"
            :rules="[{ required: true, message: '请选择菜单类型' }]"
          >
            <a-radio-group v-model="addMenuForm.type" :options="typeOptions" />
          </a-form-item>
          <a-form-item
            field="route_name"
            label="路由名称"
            required
            :rules="[{ required: true, message: '请输入路由名称' }]"
          >
            <a-input
              v-model="addMenuForm.route_name"
              placeholder="请输入路由名称"
            />
          </a-form-item>
          <a-form-item
            field="route_path"
            label="路由路径"
            required
            :rules="[{ required: true, message: '请输入路由路径' }]"
          >
            <a-input
              v-model="addMenuForm.route_path"
              placeholder="请输入路由路径"
            />
          </a-form-item>

          <a-form-item
            field="icon"
            label="图标名"
            required
            :rules="[{ required: true, message: '请选择图标名' }]"
          >
            <a-select
              v-model="addMenuForm.icon"
              :options="filterIconlistOptions"
              placeholder="请选择图标名"
            />
          </a-form-item>
          <a-form-item
            field="isVisible"
            label="状态"
            required
            :rules="[{ required: true, message: '请选择状态' }]"
          >
            <a-select
              v-model="addMenuForm.isVisible"
              :options="aclStatusOptions"
              placeholder="请选择状态"
            />
          </a-form-item>
          <a-form-item field="sort" label="排序">
            <a-input-number
              v-model="addMenuForm.sort"
              :style="{ width: '320px' }"
              placeholder="请输入排序"
              :default-value="0"
              mode="button"
              class="input-demo"
            />
          </a-form-item>
          <a-form-item field="desc" label="简介">
            <a-input v-model="addMenuForm.desc" placeholder="请输入简介" />
          </a-form-item>
        </a-form>
      </div>
      <div v-if="addMenuForm.type == 2">
        <a-form ref="formRef" :model="addMenuForm" :style="{ width: '600px' }">
          <a-form-item v-if="state == 'edit'" field="id" label="ID">
            <a-input v-model="addMenuForm.id" disabled />
          </a-form-item>

          <a-form-item field="pid" label="父级菜单">
            <a-select
              v-model="addMenuForm.pid"
              :options="menuOptions"
              placeholder="请选择父级菜单"
            />
          </a-form-item>
          <a-form-item
            field="name"
            label="菜单名称"
            required
            :rules="[{ required: true, message: '请输入菜单名称' }]"
          >
            <a-input v-model="addMenuForm.name" placeholder="请输入菜单名称" />
          </a-form-item>
          <a-form-item
            field="type"
            label="菜单类型"
            required
            :rules="[{ required: true, message: '请选择菜单类型' }]"
          >
            <a-radio-group v-model="addMenuForm.type" :options="typeOptions" />
          </a-form-item>
          <a-form-item
            field="route_name"
            label="路由名称"
            required
            :rules="[{ required: true, message: '请输入路由名称' }]"
          >
            <a-input
              v-model="addMenuForm.route_name"
              placeholder="请输入路由名称"
            />
          </a-form-item>
          <a-form-item
            field="route_path"
            label="路由路径"
            required
            :rules="[{ required: true, message: '请输入路由路径' }]"
          >
            <a-input
              v-model="addMenuForm.route_path"
              placeholder="请输入路由路径"
            />
          </a-form-item>
          <a-form-item field="route_param" label="路由参数">
            <a-input
              v-model="addMenuForm.route_param"
              placeholder="请输入路由参数"
            />
          </a-form-item>
          <a-form-item
            field="component_path"
            label="组件路径"
            :rules="[{ required: true, message: '请输入组件路径' }]"
          >
            <a-input
              v-model="addMenuForm.component_path"
              placeholder="请输入组件路径"
            >
              <template #prepend>src/views</template>
              <template #append>.vue</template>
            </a-input>
          </a-form-item>
          <a-form-item
            field="isVisible"
            label="状态"
            required
            :rules="[{ required: true, message: '请选择状态' }]"
          >
            <a-select
              v-model="addMenuForm.isVisible"
              :options="aclStatusOptions"
              placeholder="请选择状态"
            />
          </a-form-item>
          <a-form-item field="sort" label="排序">
            <a-input-number
              v-model="addMenuForm.sort"
              :style="{ width: '320px' }"
              placeholder="请输入排序"
              :default-value="0"
              mode="button"
              class="input-demo"
            />
          </a-form-item>
          <a-form-item field="desc" label="简介">
            <a-input v-model="addMenuForm.desc" placeholder="请输入简介" />
          </a-form-item>
        </a-form>
      </div>
      <div v-if="addMenuForm.type == 3">
        <a-form ref="formRef" :model="addMenuForm" :style="{ width: '600px' }">
          <a-form-item v-if="state == 'edit'" field="id" label="ID">
            <a-input v-model="addMenuForm.id" disabled />
          </a-form-item>
          <a-form-item
            field="pid"
            label="父级菜单"
            :rules="[{ required: true, message: '请选择父级菜单' }]"
          >
            <a-select
              v-model="addMenuForm.pid"
              :options="menuOptions"
              placeholder="请选择父级菜单"
            />
          </a-form-item>
          <a-form-item
            field="name"
            label="菜单名称"
            required
            :rules="[{ required: true, message: '请输入菜单名称' }]"
          >
            <a-input v-model="addMenuForm.name" placeholder="请输入菜单名称" />
          </a-form-item>
          <a-form-item
            field="type"
            label="菜单类型"
            required
            :rules="[{ required: true, message: '请选择菜单类型' }]"
          >
            <a-radio-group v-model="addMenuForm.type" :options="typeOptions" />
          </a-form-item>
          <a-form-item
            field="code"
            label="权限标识"
            required
            :rules="[{ required: true, message: '请输入权限标识' }]"
          >
            <a-input v-model="addMenuForm.code" placeholder="请输入权限标识" />
          </a-form-item>
          <a-form-item
            field="isVisible"
            label="状态"
            required
            :rules="[{ required: true, message: '请选择状态' }]"
          >
            <a-select
              v-model="addMenuForm.isVisible"
              :options="aclStatusOptions"
              placeholder="请选择状态"
            />
          </a-form-item>
          <a-form-item field="api_id" label="API路径">
            <a-select
              v-model="addMenuForm.api_id"
              :options="aclStatusOptions"
              placeholder="请选择API路径"
            />
          </a-form-item>
          <a-form-item field="sort" label="排序">
            <a-input-number
              v-model="addMenuForm.sort"
              :style="{ width: '320px' }"
              placeholder="请输入排序"
              :default-value="0"
              mode="button"
              class="input-demo"
            />
          </a-form-item>
          <a-form-item field="desc" label="简介">
            <a-input v-model="addMenuForm.desc" placeholder="请输入简介" />
          </a-form-item>
        </a-form>
      </div>
    </a-drawer>
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
