<script setup lang="ts">
import { getAccountInfo } from '@/api/user-center';
import { updateAccountInfo } from '@/api/user-center';
import type { AccountInfoModel } from '@/api/user-center';
import { Message } from '@arco-design/web-vue';

import { onMounted } from 'vue';

import { ref } from 'vue';

// 创建响应式账户数据
const accountData = ref({
  id: 0,
  nickname: '',
  email: '',
  blog_link: '',
  weibo_link: '',
  github_link: '',
  password: ''
});

const staticInfo = [
  { title: '个人博客链接', field: 'blog_link' },
  { title: '新浪微博链接', field: 'weibo_link' },
  { title: 'Github链接', field: 'github_link' }
];

const isModalVisible = ref(false);
const newLink = ref('');
const currentField = ref('');
const currentTitle = ref('');

const openModal = (title, field) => {
  currentTitle.value = title; // 设置模态框标题
  currentField.value = field; // 设置要修改的字段
  newLink.value = accountData.value[field]; // 预填充当前链接
  isModalVisible.value = true; // 打开模态框
};

// 获取账号设置
const AccountSettings = async () => {
  const { data } = await getAccountInfo();
  accountData.value = data as AccountInfoModel;
};
onMounted(() => {
  // 获取个人信息
  AccountSettings();
  console.log(1111111);
});

// 更新账号设置
const updateAccount = async () => {
  // 正则表达式验证链接格式
  const urlPattern = /^https?:\/\/[^\s]+$/;
  if (!urlPattern.test(newLink.value)) {
    // 如果链接格式不合法，提示用户
    Message.info('请输入有效的链接格式');
    return;
  }
  const originalValue = accountData.value[currentField.value]; // 备份原始链接

  accountData.value[currentField.value] = newLink.value; // 更新链接
  // 这里可以添加发送更新请求的逻辑
  try {
    await updateAccountInfo({
      ...accountData.value,
      [currentField.value]: newLink.value
    });
    accountData.value[currentField.value] = newLink.value; // 更新链接
    isModalVisible.value = false; // 关闭模态框
    Message.success('修改成功!');
  } catch {
    newLink.value = originalValue; // 恢复为原始链接
  }
};
</script>

<template>
  <a-modal
    v-model:visible="isModalVisible"
    :title="currentTitle"
    @ok="updateAccount"
  >
    <a-input v-model="newLink" placeholder="请输入新的链接" />
  </a-modal>

  <a-list :bordered="false">
    <a-list-item v-for="(item, index) in staticInfo" :key="index">
      <a-list-item-meta>
        <template #avatar>
          <a-typography-paragraph>{{ item.title }}</a-typography-paragraph>
        </template>
        <template #description>
          <div class="content">
            <a-typography-paragraph>
              {{ accountData[item.field] }}
            </a-typography-paragraph>
          </div>
          <div class="operation">
            <a-link @click="openModal(item.title, item.field)">修改</a-link>
          </div>
        </template>
      </a-list-item-meta>
    </a-list-item>
  </a-list>
</template>

<script lang="ts" setup></script>

<style scoped lang="less">
:deep(.arco-list-item) {
  border-bottom: none !important;

  .arco-typography {
    margin-bottom: 20px;
  }

  .arco-list-item-meta-avatar {
    margin-bottom: 1px;
  }

  .arco-list-item-meta {
    padding: 0;
  }
}

:deep(.arco-list-item-meta-content) {
  flex: 1;
  border-bottom: 1px solid var(--color-neutral-3);

  .arco-list-item-meta-description {
    display: flex;
    flex-flow: row;
    justify-content: space-between;

    .tip {
      color: rgb(var(--gray-6));
    }

    .operation {
      margin-right: 6px;
    }
  }
}
</style>
