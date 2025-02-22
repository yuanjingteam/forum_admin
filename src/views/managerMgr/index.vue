<script setup lang="ts">
import { Ref, ref, reactive, watch, computed, nextTick, onMounted } from 'vue';
import {
  getManagerList,
  getManagerDetail,
  addManager,
  updateManager,
  deleteManager,
  resetPassword
} from '@/api/manager';
import { userUploadApi } from '@/api/user-center';
import { Message } from '@arco-design/web-vue';
import { Pagination } from '@/types/global';
import useLoading from '@/hooks/useLoading';
import cloneDeep from 'lodash/cloneDeep';
import type { SearchModel } from '@/api/manager';
import type {
  TableData,
  TableRowSelection,
  TableColumnData,
  RequestOption,
  FileItem
} from '@arco-design/web-vue';
import search from './search/index.vue';
import { useUserManageStore } from '@/store';

type Column = TableColumnData & { checked?: true };
type SizeProps = 'mini' | 'small' | 'medium' | 'large';

const uploadHeaders = ref({
  Authorization: 'Bearer ' + localStorage.getItem('Authorization')
});

/*--------------------------------表格配置------------------------------*/
// 列配置
const columns = computed<TableColumnData[]>(() => [
  {
    title: '头像',
    dataIndex: 'avatar',
    width: 120,
    fixed: 'left'
  },
  {
    title: '名字',
    dataIndex: 'name',
    width: 120
  },
  {
    title: '电子邮箱',
    dataIndex: 'email',
    slotName: 'email',
    width: 350
  },
  {
    title: '管理员身份',
    dataIndex: 'role_ids',
    width: 350
  },

  {
    title: '创建时间',
    dataIndex: 'created_at',
    width: 350
  },
  {
    title: '最后一次登录时间',
    dataIndex: 'last_login_time'
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

/*--------------------------------表格数据渲染------------------------------*/
//加载效果
const { loading, setLoading } = useLoading(false);

const userManageStore = useUserManageStore();

const loadData = async () => {
  await userManageStore.getRoleNameList();
};

const roleNameList = computed(() => userManageStore.roleNameList);

const userRoleOptions = computed(() => {
  return roleNameList.value.map(option => ({
    label: option.name,
    value: option.id
  }));
});
// 是否可以进行操作
const isButtonEnabled = ref(false);

// 表格数据
const managerData: Ref<TableData[]> = ref([
  {
    id: 0,
    name: '',
    email: '',
    role_ids: [],
    avatar_path: '',
    manager_status: 0,
    last_login_time: '',
    created_at: ''
  }
]);

// 用户列原始数据
const originAddForm = () => {
  return {
    id: undefined,
    name: '',
    email: '',
    manager_status: undefined,
    role_ids: [],
    avatar: ''
  };
};

// 创建一个编辑副本
const editMgrForm = ref(originAddForm());

// 操作类型
const editType = ref('add');

// 添加/编辑用户信息抽屉
const editMgrDrawer = ref(false);

// 修改密码
const oldPassword = ref('');
const newPassword = ref('');
const isChangePwd = ref(false);

//当前多选框选择的key
const selectedKeys = ref([]);

/*--------------------------------文件上传------------------------------*/
const file = ref({
  uid: '',
  name: '',
  url: ''
});
const fileList = ref<FileItem[]>([file.value]);
const uploadChange = (fileItemList: FileItem[], fileItem: FileItem) => {
  fileList.value = [fileItem];
};

const reFresh = () => {
  getManagerList(searchInfo.value);
};

/*--------------------------------搜索功能------------------------------*/
const searchInfo = ref<SearchModel>({
  email: '',
  name: ''
});
// 搜索
const searchManagerInfo = async info => {
  searchInfo.value = info;
  await getManagerList(searchInfo.value);
};
/*--------------------------------表格功能------------------------------*/

// const handleChangeIntercept = async (newValue, id) => {
//   //newValue为改变后的值
//   //获取当前用户信息
//   const { data } = await getManagerDetail(id);
//   editMgrForm.value.id = id;
//   editMgrForm.value.name = data.name;
//   editMgrForm.value.email = data.email;
//   editMgrForm.value.role_ids = data.role_ids;
//   //回显用户头像
//   editMgrForm.value.avatar_path = data.avatar;
//   try {
//     await updateManager(editMgrForm.value);
//     Message.success('编辑成功');
//     //清空数据
//     editMgrForm.value = originAddForm();
//     return true;
//   } catch {
//     Message.error('编辑失败');
//     //清空数据
//     editMgrForm.value = originAddForm();
//     return false;
//   }
// };

// 取消添加/编辑用户抽屉
const editMgrDrawerCancel = () => {
  editMgrDrawer.value = false;
  //清空数据
  editMgrForm.value = originAddForm();
  isChangePwd.value = false;
};

//添加用户
const addMgr = async item => {
  try {
    await addManager(item);
    Message.success('添加成功');
    editMgrDrawer.value = false;
    reFresh();
  } catch {
    Message.error('添加失败');
  }
};
//删除用户
const deleteMgr = async ids => {
  setLoading(true);
  try {
    await deleteManager(ids);
    Message.success('删除成功');
  } catch {
    Message.error('删除失败');
  }
  setLoading(false);
};

//重置密码
const resetPwd = async id => {
  try {
    await resetPassword(id);
    Message.success('重置成功');
  } catch {
    Message.error('重置失败');
  }
};

// 添加管理员模态框
const addMgrDrawerVisible = () => {
  editType.value = 'add';
  editMgrDrawer.value = true;
};

// 编辑管理员模态框
const editMgrDrawerVisible = async item => {
  editType.value = 'edit';
  editMgrDrawer.value = true;
  editMgrForm.value.id = item.id;
  editMgrForm.value.name = item.name;
  editMgrForm.value.email = item.email;
  editMgrForm.value.role_ids = item.role_ids;
};

// 是否点击了重置密码
const changePwdVisible = () => {
  isChangePwd.value = true;
};

// 提交添加/编辑
const switchMgrOption = async () => {
  setLoading(true);
  if (editType.value === 'add') {
    await addMgr(editMgrForm.value);
  } else {
    const { id, avatar, name } = editMgrForm.value;
    let password = oldPassword.value;
    if (isChangePwd.value) {
      password = newPassword.value;
      // 校验新老密码是否一样
      if (oldPassword.value === newPassword.value) {
        Message.error('新密码不能与旧密码相同');
        return;
      }
    }
    try {
      await updateManager({
        id,
        avatar,
        name,
        password
      });
    } catch (error) {
      Message.error(error.msg);
      return;
    } finally {
      editMgrForm.value = originAddForm();
      isChangePwd.value = false;
      setLoading(false);
    }
  }
};

//------------------上传---------------

// 导入文件
const importVisible = ref(false);
const importUser = () => {
  importVisible.value = true;
};

//重写导出接口
const downloadUserService = async () => {
  const token = localStorage.getItem('Authorization');
  const response = await fetch('/backstage_manager/import', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}` // 添加 Authorization 头
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.blob(); // 将响应转换为 Blob 对象
};

// 导出
const outputFile = async () => {
  try {
    const blob = await downloadUserService();
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = 'users.xlsx'; // 设置下载文件的名称
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(a.href); // 释放 URL 对象
  } catch (err) {
    console.error('下载失败:', err);
  }
};

const downloadTemService = async () => {
  const token = localStorage.getItem('Authorization');
  const response = await fetch('/api/user/download_template', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}` // 添加 Authorization 头
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.blob(); // 将响应转换为 Blob 对象
};

// 导出模板
const downloadTemExcel = async () => {
  try {
    const blob = await downloadTemService();
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = 'users.xlsx'; // 设置下载文件的名称
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(a.href); // 释放 URL 对象
  } catch (err) {
    console.error('下载失败:', err);
  }
};

// 自定义请求上传头像
const customRequest = (options: RequestOption) => {
  const controller = new AbortController(); // 创建一个 AbortController 实例

  (async () => {
    const { onError, onSuccess, fileItem, name = 'files' } = options; // 解构选项
    const formData = new FormData(); // 创建 FormData 对象
    formData.append('width', '200');
    formData.append(name as string, fileItem.file as Blob); // 将文件添加到 FormData
    try {
      // 调用文件上传 API
      const res = await userUploadApi(formData);
      editMgrForm.value.avatar = res.data[0].url;
      onSuccess(res); // 成功时调用成功回调
    } catch (error) {
      onError(error); // 发生错误时调用错误回调
    }
  })(); // 立即执行异步请求
  return {
    abort() {
      controller.abort(); // 调用 abort 方法取消请求
    }
  };
};

onMounted(async () => {
  const { data } = await getManagerList(searchInfo.value);
  managerData.value = data.administrator_list;
  // 获取身份下拉数据
  loadData();
});

// -------------------- 表格尺寸配置------------------------
const size = ref<SizeProps>('medium');
// 能够展示的列
const showColumns = ref<Column[]>([]);

// 接收数据
const cloneColumns = ref<Column[]>([]);

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
</script>

<template>
  <div>
    <div class="container">
      <Breadcrumb :items="['管理员管理']" />
      <search @search="searchManagerInfo"></search>

      <a-card>
        <a-spin :loading="loading" tip="This may take a while...">
          <a-row>
            <a-col :span="12">
              <a-space>
                <a-button
                  v-permission="['acl:manager:search']"
                  type="primary"
                  @click="reFresh"
                >
                  刷新
                </a-button>
                <a-button
                  v-permission="['acl:manager:delete']"
                  type="dashed"
                  status="danger"
                  :disabled="!isButtonEnabled"
                  @click="deleteMgr"
                >
                  批量删除
                </a-button>
                <a-button
                  v-permission="['acl:manager:add']"
                  type="primary"
                  status="success"
                  @click="addMgrDrawerVisible"
                >
                  添加管理员
                </a-button>
                <a-button
                  v-permission="['acl:manager:import']"
                  type="outline"
                  status="success"
                  @click="importUser"
                >
                  <template #icon>
                    <icon-to-bottom />
                  </template>
                  导入
                </a-button>
                <a-modal v-model:visible="importVisible" :hide-cancel="true">
                  <template #title>用户导入</template>
                  <a-upload
                    draggable
                    action="/backstage_manager/import"
                    :headers="uploadHeaders"
                  />
                  <div class="user-import">
                    <span>
                      仅允许导入xls、xlsx格式文件。
                      <span
                        style="color: #4080ff; cursor: pointer"
                        @click="downloadTemExcel"
                      >
                        下载模版
                      </span>
                    </span>
                  </div>
                </a-modal>
                <a-button
                  v-permission="['acl:manager:export']"
                  type="outline"
                  status="success"
                  @click="outputFile"
                >
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
                              handleChange(
                                $event,
                                item as TableColumnData,
                                index
                              )
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
            style="overflow-x: auto"
            row-key="id"
            :loading="loading"
            :columns="cloneColumns as TableColumnData[]"
            :data="managerData"
            :row-selection="rowSelection"
            :bordered="false"
            :size="size"
            :pagination="pagination"
            :scroll="{ x: 300 }"
            :scrollbar="false"
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
                <img
                  alt="avatar"
                  :src="record.avatar_path || 'https://picsum.photos/200/200'"
                />
              </a-avatar>
            </template>

            <!-- 用户身份 -->
            <template #role_ids="{ record }">
              <a-space>
                <a-tag
                  v-for="(item, index) in record.role_names"
                  :key="index"
                  color="arcoblue"
                >
                  {{ item }}
                </a-tag>
              </a-space>
            </template>

            <!-- 状态开关 -->
            <!-- <template #user_status="{ record }">
            <a-switch v-model="record.user_status" v-permission="['acl:manager:edit']" :checked-value="1"
              :unchecked-value="2" :beforeChange="checked => handleChangeIntercept(checked, record.id)" />
            <span class="user-status">
              {{ record.user_status == 1 ? '启用' : '禁用' }}
            </span>
          </template> -->

            <!-- 操作项 -->
            <template #operations="{ record }">
              <a-button
                v-permission="['acl:manager:edit']"
                type="text"
                @click="editMgrDrawerVisible(record)"
              >
                <template #icon>
                  <icon-edit />
                </template>
                <template #default>编辑</template>
              </a-button>
              <a-popconfirm
                content="您确定要删除吗？"
                @ok="deleteMgr(record.id)"
              >
                <a-button v-permission="['acl:manager:delete']" type="text">
                  <template #icon>
                    <icon-delete />
                  </template>
                  <template #default>删除</template>
                </a-button>
              </a-popconfirm>
              <a-popconfirm content="重置密码吗？" @ok="resetPwd(record.id)">
                <a-button v-permission="['acl:manager:reset']" type="text">
                  <template #icon>
                    <icon-sync />
                  </template>
                  <template #default>重置密码</template>
                </a-button>
              </a-popconfirm>
            </template>
          </a-table>
        </a-spin>
      </a-card>
    </div>

    <a-drawer
      :width="450"
      :hide-cancel="true"
      :visible="editMgrDrawer"
      unmountOnClose
      @ok="switchMgrOption"
      @cancel="editMgrDrawerCancel"
    >
      <template #title>添加管理员</template>
      <div class="drawer">
        <a-form :model="editMgrForm" :style="{ width: '380px' }">
          <a-form-item
            v-if="editType === 'edit'"
            field="path"
            tooltip="点击头像进行修改"
            label="修改头像"
            label-col-flex="90px"
            label-align="left"
          >
            <a-upload
              :custom-request="customRequest"
              list-type="picture-card"
              :file-list="fileList"
              :show-upload-button="true"
              :show-file-list="false"
              @change="uploadChange"
            >
              <template #upload-button>
                <a-avatar :size="100" class="info-avatar">
                  <template #trigger-icon>
                    <icon-camera />
                  </template>
                  <img v-if="fileList.length" :src="fileList[0].url" />
                </a-avatar>
              </template>
            </a-upload>
          </a-form-item>
          <a-form-item
            v-if="editType === 'edit'"
            field="label"
            tooltip="请输入用户昵称"
            label="用户昵称"
            label-col-flex="90px"
          >
            <a-input v-model="editMgrForm.name" placeholder="输入用户昵称..." />
          </a-form-item>
          <a-form-item
            field="value"
            tooltip="管理员邮箱"
            label="邮箱"
            label-col-flex="90px"
          >
            <a-input
              v-model="editMgrForm.email"
              placeholder="输入管理员邮箱"
              class="input-demo"
              :min="0"
              :max="10000"
            />
          </a-form-item>
          <a-form-item
            field="description"
            tooltip="输入管理员身份"
            label="管理员身份"
            label-col-flex="90px"
          >
            <a-select
              v-model="editMgrForm.role_ids"
              :allow-search="false"
              :default-value="[]"
              placeholder="请选择用户身份"
              multiple
              :max-tag-count="2"
              allow-clear
              :options="userRoleOptions"
            ></a-select>
          </a-form-item>
          <a-form-item
            v-if="editType == 'edit' && isChangePwd"
            tooltip="输入原密码"
            label="原密码"
            label-col-flex="90px"
          >
            <a-input
              v-model="oldPassword"
              type="password"
              placeholder="请输入原密码"
            />
          </a-form-item>
          <a-form-item
            v-if="editType == 'edit' && isChangePwd"
            tooltip="输入新密码"
            label="新密码"
            label-col-flex="90px"
          >
            <a-input
              v-model="newPassword"
              type="password"
              placeholder="请输入新密码"
            />
          </a-form-item>
          <a-form-item label-col-flex="90px">
            <a-button
              v-if="editType == 'add' && !isChangePwd"
              style="float: right; width: 280px"
              @click="changePwdVisible"
            >
              修改密码
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </a-drawer>
  </div>
</template>

<style scoped>
.container {
  padding: 0 20px 20px;
}
</style>
