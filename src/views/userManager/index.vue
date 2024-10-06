<script lang="ts" setup>
import { computed, ref, reactive, watch, nextTick, h } from 'vue';
import useLoading from '@/hooks/useLoading';
import {
  UserForm,
  User,
  getUserListService,
  addUserService,
  getUserDetailService,
  deleteUserService,
  editUserService,
  resetUserService
} from '@/api/user_manager';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
import { TableRowSelection, Message } from '@arco-design/web-vue';
import { IconSearch } from '@arco-design/web-vue/es/icon';
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
//上次登录时间
const lastLoginTime = ref([]);
//创建时间
const createTime = ref([]);
//当前多选框选择的key
const selectedKeys = ref([]);
//列选择属性
const rowSelection: TableRowSelection = reactive({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false
});

//下拉框用户状态内容
const filterMethodOptions = computed(() => {
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

//表格初始化属性值
const generateFormModel = () => {
  return {
    id: 0,
    avatar_path: '',
    nickname: '',
    email: '',
    heat: 0,
    fans_count: 0,
    role_ids: [],
    user_status: 0,
    last_login_time: '',
    create_time: ''
  };
};
//表格总条数
const total = ref(0);
//发送原始数据
const originForm = () => {
  return {
    id: undefined,
    nickname: '',
    email: '',
    user_status: undefined,
    heat: 0,
    fans_count: 0,
    role_ids: [],
    last_login_time_begin: '',
    last_login_time_end: '',
    create_time_begin: '',
    create_time_end: '',
    page: 1,
    limit: 10
  };
};
//发送请求数据
const userForm: UserForm = ref(originForm());

//接收到异步表格数据并渲染在表格内部
const renderData = ref<User[]>([]);
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
    },
    fixed: 'left',
    minwidth: 100
  },
  {
    title: '头像',
    dataIndex: 'avatar_path',
    slotName: 'avatar_path',
    fixed: 'left',
    minwidth: 100
  },
  {
    title: '用户名',
    dataIndex: 'nickname',
    fixed: 'left',
    minwidth: 100
  },
  {
    title: '邮箱',
    dataIndex: 'email'
  },
  {
    title: '个人热度',
    dataIndex: 'heat',
    filterable: {
      filter: (value, record) => record.heat >= value,
      slotName: 'name-filter',
      icon: () => h(IconSearch)
    }
  },
  {
    title: '粉丝数',
    dataIndex: 'fans_count',
    filterable: {
      filter: (value, record) => record.fans_count >= value,
      slotName: 'name-filter',
      icon: () => h(IconSearch)
    }
  },
  {
    title: '用户身份',
    dataIndex: 'role_ids',
    slotName: 'role_ids'
  },

  {
    title: '创建时间',
    dataIndex: 'create_time',
    sortable: {
      sortDirections: ['ascend', 'descend']
    }
  },
  {
    title: '上次登录时间',
    dataIndex: 'last_login_time',
    sortable: {
      sortDirections: ['ascend', 'descend']
    }
  },
  {
    title: '状态',
    dataIndex: 'user_status',
    slotName: 'user_status'
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
    } = await getUserListService(userForm.value);
    renderData.value = data.user_list;
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
  userForm.value = originForm();
  formModel.value = generateFormModel();
  lastLoginTime.value = [];
  createTime.value = [];
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
  await deleteUserService({ ids: selectedKeys.value });
  userForm.value.page = 1;
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
const title = ref('添加用户');
//表示抽屉是添加还是编辑
const state = ref('');
//添加用户表格数据原始数据
const originAddForm = () => {
  return {
    user_id: undefined,
    nickname: '',
    email: '',
    user_status: undefined,
    role_ids: []
  };
};
//添加用户表格数据
const addUserForm = ref(originAddForm());
//添加用户
const addUser = () => {
  title.value = '添加用户';
  state.value = 'add';
  addUserForm.value = originAddForm();
  visibleDrawer.value = true;
};
//编辑当前用户
const editUser = async (id: number) => {
  title.value = '编辑用户';
  state.value = 'edit';

  //回显当前用户的详情
  const {
    data: { data }
  } = await getUserDetailService({ id: id });
  addUserForm.value.user_id = data.id;
  addUserForm.value.nickname = data.nickname;
  addUserForm.value.email = data.email;
  addUserForm.value.user_status = data.user_status;
  addUserForm.value.role_ids = data.role_ids;
  //回显用户头像
  // addUserForm.value.avatar_path = data.avatar_path;
  visibleDrawer.value = true;
};
//删除当前用户
const deleteRole = async (id: number) => {
  await deleteUserService({ ids: [id] });
  fetchData();
  Message.success('删除成功');
};
//抽屉确认事件
const handleOkDrawer = async () => {
  if (!(await formRef.value.validate())) {
    if (state.value == 'add') {
      //调用添加用户接口
      await addUserService(addUserForm.value);
      Message.success('添加成功');
    } else {
      //调用编辑用户接口
      await editUserService(addUserForm.value);
      Message.success('编辑成功');
      addUserForm.value = originAddForm();
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
  userForm.value.page = current;
  fetchData();
};
//改变每页条数
const changePageSize = (pageSize: number) => {
  userForm.value.page = 1;
  userForm.value.limit = pageSize;
  fetchData();
};
//--------------------开关------------------------
//切换拦截
const handleChangeIntercept = async (newValue, id) => {
  //newValue为改变后的值
  //获取当前用户信息
  const {
    data: { data }
  } = await getUserDetailService({ id: id });
  addUserForm.value.user_id = id;
  addUserForm.value.nickname = data.nickname;
  addUserForm.value.email = data.email;
  addUserForm.value.user_status = newValue;
  addUserForm.value.role_ids = data.role_ids;
  //回显用户头像
  // addUserForm.value.avatar_path = data.avatar_path;
  try {
    await editUserService(addUserForm.value);
    Message.success('编辑成功');
    //清空数据
    addUserForm.value = originAddForm();
    return true;
  } catch {
    Message.error('编辑失败');
    //清空数据
    addUserForm.value = originAddForm();
    return false;
  }
};
//------------时间选择器----------------------
const onChangeLogin = dateString => {
  userForm.value.last_login_time_begin = dateString[0];
  userForm.value.last_login_time_end = dateString[1];
};
const onChangeCreate = dateString => {
  userForm.value.create_time_begin = dateString[0];
  userForm.value.create_time_end = dateString[1];
};
//-------------多选下拉框---------------------
const fieldNames = { value: 'id', label: 'name' };
const options = reactive([
  {
    id: 125,
    name: '用户'
  },
  {
    id: 126,
    name: '管理员'
  },
  {
    id: 127,
    name: '超级管理员'
  }
]);
//临时身份
const temRoleIds = ref([]);
//改变下拉框中的值调用
const changeRole = async (value, record) => {
  console.log(value, record);

  //当多选框中的值只剩下一个的时候，或者当前多选框原本就是一个值记录当前值
  // if (value.length == 1 || record.role_ids.length == 1) {
  //   temRoleIds.value = record.role_ids;
  // }

  // if (record.role_ids.length == 0) {
  //   Message.error('用户必须有一个身份');
  //   record.role_ids = temRoleIds.value;
  //   return;
  // }
  // const {
  //   data: { data }
  // } = await getUserDetailService({ id: id });
  // addUserForm.value.user_id = data.id;
  // addUserForm.value.nickname = data.nickname;
  // addUserForm.value.email = data.email;
  // addUserForm.value.user_status = data.user_status;
  // addUserForm.value.role_ids = value;
  // await editUserService(addUserForm.value);
  // Message.success('设定用户角色成功');
  //清空数据
  addUserForm.value = originAddForm();
};
//------------------上传---------------
//上传的file文件
const file = ref();
//上传状态变化时
const onChange = (_, currentFile) => {
  file.value = {
    ...currentFile
    // url: URL.createObjectURL(currentFile.file)
  };
};
//上传进度变化时调用
const onProgress = currentFile => {
  file.value = currentFile;
};

//--------------重置密码-----------
const resetUser = async (id: number) => {
  await resetUserService(id);
  Message.success('重置密码成功');
};
//-------------导入文件-------------
const importVisible = ref(false);
const importUser = () => {
  importVisible.value = true;
};
</script>

<template>
  <div class="container">
    <Breadcrumb :items="['用户管理']" />
    <a-collapse :default-active-key="['1']" :bordered="false">
      <a-collapse-item key="1" header="搜索" :style="customStyle">
        <a-row>
          <a-col :flex="1">
            <a-form
              :model="userForm"
              :label-col-props="{ span: 6 }"
              :wrapper-col-props="{ span: 18 }"
              label-align="left"
            >
              <a-row :gutter="16">
                <a-col :span="8">
                  <a-form-item field="nickname" label="用户名">
                    <a-input
                      v-model="userForm.nickname"
                      placeholder="请输入用户名"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item field="email" label="邮箱">
                    <a-input
                      v-model="userForm.email"
                      placeholder="请输入邮箱"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item field="user_status" label="用户状态">
                    <a-select
                      v-model="userForm.user_status"
                      :options="filterMethodOptions"
                      placeholder="请选择用户状态"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item field="role_ids" label="用户身份">
                    <a-select
                      v-model="userForm.role_ids"
                      :default-value="[]"
                      placeholder="请选择用户身份"
                      multiple
                      :max-tag-count="2"
                      allow-clear
                      :options="options"
                      :field-names="fieldNames"
                    ></a-select>
                  </a-form-item>
                </a-col>

                <a-col :span="8">
                  <a-form-item field="last_login_time" label="上次登录时间">
                    <a-range-picker
                      v-model="lastLoginTime"
                      @change="onChangeLogin"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item field="create_time" label="创建时间">
                    <a-range-picker
                      v-model="createTime"
                      @change="onChangeCreate"
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
            <a-button type="primary" @click="addUser()">
              <template #icon>
                <icon-plus />
              </template>
              新建
            </a-button>
            <a-button type="dashed" status="danger" @click="batchDeleteRole()">
              <template #icon>
                <icon-delete />
              </template>
              批量删除
            </a-button>

            <a-button type="outline" status="success" @click="importUser">
              <template #icon>
                <icon-to-top />
              </template>
              导入
            </a-button>
            <a-modal
              v-model:visible="importVisible"
              @ok="handleOk"
              @cancel="handleCancel"
            >
              <template #title>用户导入</template>
              <a-upload draggable action="/" />
              <div class="user-import">
                <span>
                  仅允许导入xls、xlsx格式文件。
                  <span style="color: #4080ff; cursor: pointer">下载模版</span>
                </span>
              </div>
            </a-modal>
            <a-button type="outline" status="success">
              <template #icon>
                <icon-to-bottom />
              </template>
              导出
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
        <template
          #name-filter="{
            filterValue,
            setFilterValue,
            handleFilterConfirm,
            handleFilterReset
          }"
        >
          <div class="custom-filter">
            <a-space direction="vertical">
              <a-input
                :model-value="filterValue[0]"
                @input="value => setFilterValue([value])"
              />
              <div class="custom-filter-footer">
                <a-button @click="handleFilterConfirm">Confirm</a-button>
                <a-button @click="handleFilterReset">Reset</a-button>
              </div>
            </a-space>
          </div>
        </template>
        <!-- 头像 -->
        <template #avatar_path="{ record }">
          <a-avatar :size="32">
            <img alt="avatar" :src="record.avatar_path" />
          </a-avatar>
        </template>

        <!-- 用户身份 -->
        <template #role_ids="{ record }">
          <a-select
            v-model="record.role_ids"
            placeholder="请选择用户身份"
            multiple
            :max-tag-count="2"
            :scrollbar="true"
            :options="options"
            :field-names="fieldNames"
            @change="value => changeRole(value, record)"
          ></a-select>
        </template>

        <!-- 状态开关 -->
        <template #user_status="{ record }">
          <a-switch
            v-model="record.user_status"
            :checked-value="1"
            :unchecked-value="2"
            :beforeChange="checked => handleChangeIntercept(checked, record.id)"
          />
          <span class="user-status">
            {{ record.user_status == 1 ? '启用' : '禁用' }}
          </span>
        </template>

        <!-- 操作项 -->
        <template #operations="{ record }">
          <a-button type="text" @click="editUser(record.id)">
            <template #icon>
              <icon-edit />
            </template>
            <template #default>编辑</template>
          </a-button>

          <a-popconfirm content="您确定要删除吗？" @ok="deleteRole(record.id)">
            <a-button type="text">
              <template #icon>
                <icon-delete />
              </template>
              <template #default>删除</template>
            </a-button>
          </a-popconfirm>
          <a-popconfirm
            content="您确定要重置密码吗？"
            @ok="resetUser(record.id)"
          >
            <a-button type="text">
              <template #icon>
                <icon-sync />
              </template>
              <template #default>重置密码</template>
            </a-button>
          </a-popconfirm>
        </template>
      </a-table>
      <a-pagination
        :total="total"
        :size="size"
        show-total
        show-jumper
        show-page-size
        :current="userForm.page"
        :page-size="userForm.limit"
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
        <a-form ref="formRef" :model="addUserForm" :style="{ width: '600px' }">
          <a-form-item v-if="state == 'edit'" field="id" label="ID">
            <a-input v-model="addUserForm.user_id" disabled />
          </a-form-item>
          <a-form-item field="nickname" label="用户名称" required>
            <a-input
              v-model="addUserForm.nickname"
              placeholder="请输入用户名称"
            />
          </a-form-item>
          <a-form-item field="avatar_path" label="头像" required>
            <a-upload
              action="http://127.0.0.1:4523/m1/4891553-0-default/user/upload/headshot?id=351335"
              :fileList="file ? [file] : []"
              :show-file-list="false"
              @change="onChange"
              @progress="onProgress"
            >
              <template #upload-button>
                <div
                  :class="`arco-upload-list-item${
                    file && file.status === 'error'
                      ? ' arco-upload-list-item-error'
                      : ''
                  }`"
                >
                  <div
                    v-if="file && file.url"
                    class="arco-upload-list-picture custom-upload-avatar"
                  >
                    <img :src="file.url" />
                    <div class="arco-upload-list-picture-mask">
                      <IconEdit />
                    </div>
                    <a-progress
                      v-if="file.status === 'uploading' && file.percent < 100"
                      :percent="file.percent"
                      type="circle"
                      size="mini"
                      :style="{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translateX(-50%) translateY(-50%)'
                      }"
                    />
                  </div>
                  <div v-else class="arco-upload-picture-card">
                    <div class="arco-upload-picture-card-text">
                      <IconPlus />
                    </div>
                  </div>
                </div>
              </template>
            </a-upload>
          </a-form-item>
          <a-form-item
            field="email"
            label="邮箱"
            required
            :rules="[{ required: true, message: '请填写邮箱' }]"
          >
            <a-input v-model="addUserForm.email" placeholder="请输入邮箱" />
          </a-form-item>
          <a-form-item
            field="user_status"
            label="用户状态"
            required
            :rules="[{ required: true, message: '请输入用户状态' }]"
          >
            <a-select
              v-model="addUserForm.user_status"
              :options="filterMethodOptions"
              placeholder="请输入用户状态"
            />
          </a-form-item>
          <a-form-item field="role_ids" label="用户身份" required>
            <a-select
              v-model="addUserForm.role_ids"
              placeholder="请选择用户身份"
              multiple
              :max-tag-count="2"
              allow-clear
              :scrollbar="true"
              :options="options"
              :field-names="fieldNames"
            ></a-select>
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

.user-status {
  margin-left: 12px;
}

.user-import {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}

.custom-filter {
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
</style>
