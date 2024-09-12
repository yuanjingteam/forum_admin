<script setup lang="ts">
import { getUserList, getUerItem } from '@/api/user';
import { TableColumnData } from '@arco-design/web-vue';
import { ref } from 'vue';
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
    dataIndex: 'last_login_time'
  },
  {
    title: '注册时间',
    dataIndex: 'create_time'
  },
  {
    title: '操作',
    dataIndex: 'optional',
    slotName: 'optional',
    width: 80
  }
];
const userInfo = ref([]);
const userItem = ref();
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
  const { data } = await getUerItem({ user_id: userId });
  userItem.value = data;
};
</script>

<template>
  <a-table :columns="columns" :data="userInfo" stripe>
    <template #headshot="{ record }">
      <img :src="record.headshot" alt="" class="uer-headshot" />
    </template>
    <template #roles="{ record }">
      {{ record.roles[0].role_name }}
    </template>
    <template #user_status="{ record }">
      <a-switch
        v-model="record.user_status"
        :default-checked="record.user_status"
        :checked-value="true"
        :unchecked-value="false"
        @change="switchChange(record.user_status)"
      />
      <span class="user-state">{{ record.user_status ? '封禁' : '正常' }}</span>
    </template>
    <template #optional="{ record }">
      <div class="edit">
        <a-button type="outline" size="mini" @click="editItem(record.id)">
          编辑
        </a-button>
        <a-button type="outline" status="danger" size="mini">删除</a-button>
      </div>
    </template>
  </a-table>
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
  margin: 5px 0;
}
</style>
