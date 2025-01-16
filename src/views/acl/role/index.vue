<script lang="ts" setup>
import { computed, ref, reactive, watch, nextTick } from 'vue';
import useLoading from '@/hooks/useLoading';
import {
  RoleForm,
  Role,
  getRoleListService,
  addRoleService,
  getRoleDetailService,
  deleteRoleService,
  editRoleService
} from '@/api/role';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
import { TableRowSelection, Message } from '@arco-design/web-vue';
import cloneDeep from 'lodash/cloneDeep';
import Sortable from 'sortablejs';
import RoleAcl from '@/views/acl/role/roleAcl/index.vue';
import { useUserManageStore } from '@/store';

type SizeProps = 'mini' | 'small' | 'medium' | 'large';
type Column = TableColumnData & { checked?: true };

const userManageStore = useUserManageStore();
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

//下拉框角色状态内容
const filterMethodOptions = userManageStore.filterMethodOptions;

//表格初始化属性值
const generateFormModel = () => {
  return {
    id: 0,
    created_at: '',
    name: '',
    code: '',
    status: 0,
    sort: 0
  };
};
//表格总条数
const total = ref(0);
//发送原始数据
const originForm = () => {
  return {
    name: '',
    code: '',
    status: undefined,
    page: 1,
    limit: 10
  };
};
//发送请求数据
const roleForm: RoleForm = ref(originForm());

//接收到异步表格数据并渲染在表格内部
const renderData = ref<Role[]>([]);
//查询表格属性的ref对象
const formModel = ref(generateFormModel());
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);

const size = ref<SizeProps>('medium');

//密度数据
const densityList = userManageStore.densityList;
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
    title: '创建时间',
    dataIndex: 'created_at',
    sortable: {
      sortDirections: ['ascend', 'descend']
    }
  },
  {
    title: '角色名称',
    dataIndex: 'name'
  },
  {
    title: '角色编码',
    dataIndex: 'code'
  },
  {
    title: '角色状态',
    dataIndex: 'status',
    slotName: 'status'
  },
  {
    title: '角色排序',
    dataIndex: 'sort'
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
    const { data } = await getRoleListService(roleForm.value);
    renderData.value = data.role_list;
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
  roleForm.value = originForm();
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
const batchDeleteRole = () => {
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
  await deleteRoleService({ ids: selectedKeys.value });
  roleForm.value.page = 1;
  fetchData();
  Message.success('删除成功');
  //清空选择的key
  selectedKeys.value = [];
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
const title = ref('添加角色');
//表示抽屉是添加还是编辑
const state = ref('');
//添加角色表格数据原始数据
const originAddForm = () => {
  return {
    id: undefined,
    name: '',
    code: '',
    status: undefined,
    sort: 0
  };
};
//添加角色表格数据
const addRoleForm = ref(originAddForm());
//添加角色
const addRole = () => {
  title.value = '添加角色';
  state.value = 'add';
  addRoleForm.value = originAddForm();
  visibleDrawer.value = true;
};
//编辑当前角色
const editRole = async (id: number) => {
  title.value = '编辑角色';
  state.value = 'edit';

  //回显当前角色的详情
  const { data } = await getRoleDetailService(id);
  addRoleForm.value.id = data.id;
  addRoleForm.value.name = data.name;
  addRoleForm.value.code = String(data.code);
  addRoleForm.value.status = data.status;
  addRoleForm.value.sort = data.sort;
  visibleDrawer.value = true;
};
//删除当前角色
const deleteRole = async (id: number) => {
  await deleteRoleService({ ids: [id] });
  fetchData();
  Message.success('删除成功');
};
//抽屉确认事件
const handleOkDrawer = async () => {
  if (!(await formRef.value.validate())) {
    if (state.value == 'add') {
      //调用添加角色接口
      await addRoleService(addRoleForm.value);
      Message.success('添加成功');
    } else {
      //调用编辑角色接口
      await editRoleService(addRoleForm.value);
      Message.success('编辑成功');
      addRoleForm.value = originAddForm();
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
  roleForm.value.page = current;
  fetchData();
};
//改变每页条数
const changePageSize = (pageSize: number) => {
  roleForm.value.page = 1;
  roleForm.value.limit = pageSize;
  fetchData();
};
//--------------------开关------------------------
//切换拦截
const handleChangeIntercept = async (newValue, id) => {
  //newValue为改变后的值
  //获取当前角色信息
  const { data } = await getRoleDetailService(id);
  addRoleForm.value.id = data.id;
  addRoleForm.value.name = data.name;
  addRoleForm.value.code = data.code;
  addRoleForm.value.status = newValue;
  addRoleForm.value.sort = data.sort;
  try {
    await editRoleService(addRoleForm.value);
    Message.success('编辑成功');
    //清空数据
    addRoleForm.value = originAddForm();
    return true;
  } catch {
    Message.error('编辑失败');
    //清空数据
    addRoleForm.value = originAddForm();
    return false;
  }
};
//----------设置权限----------
//权限抽屉是否可见
const visibleApiDrawer = ref(false);
//当前角色id
const roleIdTem = ref(0);
//点击设置权限后调用
const showRoleAcl = id => {
  visibleApiDrawer.value = true;
  roleIdTem.value = id;
};
</script>

<template>
  <div class="container">
    <Breadcrumb :items="['权限管理', '角色管理']" />
    <a-collapse :default-active-key="['1']" :bordered="false">
      <a-collapse-item key="1" header="搜索" :style="customStyle">
        <a-row>
          <a-col :flex="1">
            <a-form
              :model="roleForm"
              :label-col-props="{ span: 6 }"
              :wrapper-col-props="{ span: 18 }"
              label-align="left"
            >
              <a-row :gutter="16">
                <a-col :span="8">
                  <a-form-item field="name" label="角色名称">
                    <a-input
                      v-model="roleForm.name"
                      placeholder="请输入角色名称"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item field="code" label="角色编码">
                    <a-input
                      v-model="roleForm.code"
                      placeholder="请输入角色编码"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item field="status" label="角色状态">
                    <a-select
                      v-model="roleForm.status"
                      :options="filterMethodOptions"
                      placeholder="请选择角色状态"
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
                v-permission="['acl:role:search']"
                type="primary"
                @click="search"
              >
                <template #icon>
                  <icon-search />
                </template>
                查询
              </a-button>
              <a-button v-permission="['acl:role:search']" @click="reset">
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
              v-permission="['acl:role:add']"
              type="primary"
              @click="addRole()"
            >
              <template #icon>
                <icon-plus />
              </template>
              新建
            </a-button>
            <a-button
              v-permission="['acl:role:delete']"
              @click="batchDeleteRole()"
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
        <template #status="{ record }">
          <a-switch
            v-model="record.status"
            v-permission="['acl:role:edit']"
            :checked-value="1"
            :unchecked-value="2"
            :beforeChange="checked => handleChangeIntercept(checked, record.id)"
          />
          <span class="user-status">
            {{ record.status == 1 ? '启用' : '禁用' }}
          </span>
        </template>

        <!-- 操作项 -->
        <template #operations="{ record }">
          <a-button
            v-permission="['acl:role:permission']"
            type="text"
            @click="showRoleAcl(record.id)"
          >
            <template #icon>
              <icon-settings />
            </template>
            <template #default>设置权限</template>
          </a-button>

          <a-button
            v-permission="['acl:role:edit']"
            type="text"
            @click="editRole(record.id)"
          >
            <template #icon>
              <icon-edit />
            </template>
            <template #default>编辑</template>
          </a-button>

          <a-popconfirm content="您确定要删除吗？" @ok="deleteRole(record.id)">
            <a-button v-permission="['acl:role:delete']" type="text">
              <template #icon>
                <icon-delete />
              </template>
              <template #default>删除</template>
            </a-button>
          </a-popconfirm>
        </template>
      </a-table>
      <a-pagination
        v-permission="['acl:role:search']"
        :total="total"
        :size="size"
        show-total
        show-jumper
        show-page-size
        :current="roleForm.page"
        :page-size="roleForm.limit"
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
        <a-form ref="formRef" :model="addRoleForm" :style="{ width: '600px' }">
          <a-form-item v-if="state == 'edit'" field="id" label="ID">
            <a-input v-model="addRoleForm.id" disabled />
          </a-form-item>
          <a-form-item
            field="name"
            label="角色名称"
            required
            :rules="[{ required: true, message: '请填写角色名称' }]"
          >
            <a-input v-model="addRoleForm.name" placeholder="请输入角色名称" />
          </a-form-item>
          <a-form-item
            field="code"
            label="角色编码"
            required
            :rules="[{ required: true, message: '请填写角色编码' }]"
          >
            <a-input v-model="addRoleForm.code" placeholder="请输入角色编码" />
          </a-form-item>
          <a-form-item
            field="status"
            label="角色状态"
            required
            :rules="[{ required: true, message: '请输入角色状态' }]"
          >
            <a-select
              v-model="addRoleForm.status"
              :options="filterMethodOptions"
              placeholder="请输入角色状态"
            />
          </a-form-item>
          <a-form-item field="sort" label="角色排序" required>
            <a-input-number
              v-model="addRoleForm.sort"
              :style="{ width: '200px' }"
              placeholder="请输入角色排序"
              :default-value="0"
              mode="button"
              class="input-demo"
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
    <role-acl v-model="visibleApiDrawer" :roleId="roleIdTem"></role-acl>
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

.user-status {
  margin-left: 12px;
}
</style>
