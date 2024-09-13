<script setup lang="ts">
import { getUserList, editUserInfo, deleteUserInfo } from '@/api/user';
import {
  TableColumnData,
  TableRowSelection,
  Message
} from '@arco-design/web-vue';
import { ref, reactive } from 'vue';

const columns: TableColumnData[] = [
  {
    title: '用户ID',
    dataIndex: 'id',
    align: 'center'
  },
  {
    title: '用户头像',
    dataIndex: 'headshot',
    slotName: 'headshot'
  },
  {
    title: '用户名',
    dataIndex: 'nickname'
  },
  {
    title: '电子邮箱',
    dataIndex: 'email'
  },
  {
    title: '电话',
    dataIndex: 'phonenumber'
  },
  {
    title: '个人热度',
    dataIndex: 'heat'
  },
  {
    title: '粉丝数',
    dataIndex: 'fans_count'
  },
  {
    title: '身份',
    dataIndex: 'roles',
    slotName: 'roles'
  },
  {
    title: '用户状态',
    dataIndex: 'user_status',
    slotName: 'user_status'
  },
  {
    title: '最后一次登录',
    dataIndex: 'last_login_time',
    width: 120
  },
  {
    title: '注册时间',
    dataIndex: 'create_time',
    width: 120
  },
  {
    title: '操作',
    dataIndex: 'optional',
    slotName: 'optional',
    align: 'center'
  }
];
const userInfo = ref([]);
const userItem = ref(null);

// 行的唯一标识数据
const selectedKeys = ref<string[]>([]); // 确保这里初始化为一个空数组
const pagination = { pageSize: 5 };

// 行配置
const rowSelection: TableRowSelection = reactive({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false
});

// 抽屉是否可见
const itemVisible = ref(false);

// 确认删除对话框
const deleteVisible = ref(false);

// 定义一个删除数组
const deleteUsers = ref<number[]>([]); // 正确声明响应式数组

// 获取用户数据
const getUsers = async () => {
  const { data } = await getUserList();
  userInfo.value = data.data.user_list;
};
getUsers();

// 获取当前列
const editItem = async info => {
  const { headshot, nickname, email, phonenumber, user_status, roles } = info;
  userItem.value = {
    headshot,
    nickname,
    email,
    phonenumber,
    user_status,
    roles: roles[0].role_name
  };

  itemVisible.value = true; // 打开抽屉
};

// 改变用户封禁状态
const switchChange = state => {
  console.log(state);
};

// 抽屉栏
// 修改用户
const handleOk = async () => {
  try {
    await editUserInfo(userItem.value);
    getUsers();
    // Message.info('修改成功'); // 显示信息提示
    itemVisible.value = false;
  } catch (error) {
    Message.info(error.msg); // 显示信息提示
  }
};
// 取消修改
const handleCancel = async () => {
  itemVisible.value = false;
};

// 删除单个用户
const toDelete = async id => {
  deleteVisible.value = true;
  deleteUsers.value.push(id);
};

// 取消删除
const cancelDelete = () => {
  deleteVisible.value = false;
  deleteUsers.value = [];
};

// 删除用户
const deleteItem = async () => {
  try {
    deleteVisible.value = false;
    await deleteUserInfo({
      ids: deleteUsers
    });
    Message.info('删除成功');
  } catch (error) {
    Message.info(error.msg);
  } finally {
    deleteVisible.value = false;
    deleteUsers.value = [];
  }
};

// 选中用户
const selectUser = user => {
  if (user) {
    console.log(user);
  }
};
// 取消选中
const selectCancel = user => {
  if (user) {
    console.log(user);
  }
};
</script>

<template>
  <div>
    <a-modal
      v-model:visible="deleteVisible"
      @ok="deleteItem"
      @cancel="cancelDelete"
    >
      <template #title>确认删除</template>
      <div>确认要删除吗,删除之后无法再恢复</div>
    </a-modal>
    <!-- 以id为当前列的唯一标识 -->
    <a-table
      v-model:selectedKeys="selectedKeys"
      :columns="columns"
      :data="userInfo"
      row-key="id"
      stripe
      :row-selection="rowSelection"
      :pagination="pagination"
      @select="selectUser"
      @selection-change="selectCancel"
    >
      <template #headshot="{ record }">
        <div>
          <img :src="record.headshot" alt="" class="uer-headshot" />
        </div>
      </template>
      <template #roles="{ record }">
        <div>
          {{ record.roles[0].role_name }}
        </div>
      </template>
      <template #user_status="{ record }">
        <div>
          <a-switch
            v-model="record.user_status"
            :default-checked="record.user_status"
            :checked-value="true"
            :unchecked-value="false"
            @change="switchChange(record.user_status)"
          />
          <span class="user-state">
            {{ record.user_status ? '封禁' : '正常' }}
          </span>
        </div>
      </template>
      <template #optional="{ record }">
        <div class="edit">
          <span>
            <a-button type="outline" size="mini" @click="editItem(record)">
              编辑
            </a-button>
          </span>
          <span>
            <a-button
              type="outline"
              status="danger"
              size="mini"
              @click="toDelete(record.id)"
            >
              删除
            </a-button>
          </span>
        </div>
      </template>
    </a-table>
    <a-drawer
      :width="380"
      :visible="itemVisible"
      unmountOnClose
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <template #title>Title</template>
      <div class="drawer">
        <a-form :model="userItem" :style="{ width: '340px' }">
          <a-form-item
            field="headshot"
            tooltip="修改头像"
            label="头像"
            label-col-flex="60px"
            label-align="left"
          >
            <a-input
              v-model="userItem.headshot"
              placeholder="please enter your username..."
            />
          </a-form-item>
          <a-form-item
            field="nickname"
            tooltip="请输入昵称"
            label="昵称"
            label-col-flex="60px"
          >
            <a-input v-model="userItem.nickname" placeholder="输入昵称..." />
          </a-form-item>
          <a-form-item
            field="email"
            tooltip="请输入邮箱"
            label="邮箱"
            label-col-flex="60px"
          >
            <a-input v-model="userItem.email" placeholder="输入邮箱..." />
          </a-form-item>
          <a-form-item
            field="phonenumber"
            tooltip="请输入手机号"
            label="电话"
            label-col-flex="60px"
          >
            <a-input v-model="userItem.phonenumber" placeholder="输入手机号" />
          </a-form-item>
          <a-form-item
            field="user_status"
            tooltip="修改用户状态"
            label="用户状态"
            label-col-flex="90px"
          >
            <div>
              <a-switch
                v-model="userItem.user_status"
                :default-checked="userItem.user_status"
                :checked-value="true"
                :unchecked-value="false"
                @change="switchChange(userItem.user_status)"
              />
              <span class="user-state">
                {{ userItem.user_status ? '封禁' : '正常' }}
              </span>
            </div>
          </a-form-item>
          <a-form-item
            field="roles"
            tooltip="用户身份有普通用户、管理员等..."
            label="用户身份"
            label-col-flex="90px"
          >
            <a-input
              v-model="userItem.roles"
              placeholder="please enter your username..."
            />
          </a-form-item>
        </a-form>
      </div>
    </a-drawer>
  </div>
</template>

<style scoped>
.uer-headshot {
  width: 50px;
  height: 30px;
}
.user-state {
  margin-left: 12px;
}
.edit button {
  margin: 0px 5px;
}
</style>
