<script setup lang="ts">
import { getUserList, getUerItem } from '@/api/user';
import { TableColumnData, TableRowSelection } from '@arco-design/web-vue';
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

const selectedKeys = ref<string[]>([]); // 确保这里初始化为一个空数组
const pagination = { pageSize: 5 };

const rowSelection: TableRowSelection = reactive({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false
});

// 抽屉是否可见
const itemVisible = ref(false);
// 自定义抽屉项
const itemCustom = ref([]);

const getUsers = async () => {
  const { data } = await getUserList();
  debugger;
  userInfo.value = data.data.user_list;
};
getUsers();

// 改变用户封禁状态
const switchChange = state => {
  console.log(state);
};

// 获取当前列
const editItem = async userId => {
  try {
    const { data } = await getUerItem({ user_id: userId });
    userItem.value = data;
    itemVisible.value = true;
  } catch {
    console.log(111);
  }
};

// 抽屉栏
// 确定
const handleOk = () => {
  itemVisible.value = false;
};
// 取消
const handleCancel = () => {
  itemVisible.value = false;
};
</script>

<template>
  <div>
    <!-- 以id为当前列的唯一标识 -->
    <a-table
      v-model:selectedKeys="selectedKeys"
      :columns="columns"
      :data="userInfo"
      row-key="id"
      stripe
      :row-selection="rowSelection"
      :pagination="pagination"
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
            <a-button type="outline" size="mini" @click="editItem(record.id)">
              编辑
            </a-button>
          </span>
          <span>
            <a-button type="outline" status="danger" size="mini">删除</a-button>
          </span>
        </div>
      </template>
    </a-table>
    <a-drawer
      :width="340"
      :header="!itemCustom.includes('hide header')"
      :footer="!itemCustom.includes('hide footer')"
      :visible="itemVisible"
      unmountOnClose
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <template #title>Title</template>
      <div>
        You can customize modal body text by the current situation. This modal
        will be closed immediately once you press the OK button.
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
