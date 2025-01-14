<script setup lang="ts">
import useUser from '@/hooks/useUser';
import { getAccountInfo } from '@/api/user-center';
import type { AccountInfoModel } from '@/api/user-center';

import { useUserStore } from '@/store';

import { onMounted, reactive } from 'vue';

const { logout } = useUser();
const handleLogout = () => {
  logout();
};

import { ref } from 'vue';

const userStore = useUserStore();

// 创建响应式账户数据
const accountData = ref({
  id: 0,
  email: '',
  blog_link: '',
  weibo_link: '',
  github_link: '',
  password: ''
});

// 获取账号设置
const AccountSettings = async () => {
  const { data } = await getAccountInfo(userStore.id);
  accountData.value = data.data as AccountInfoModel;
};
onMounted(() => {
  // 获取个人信息
  AccountSettings();
  console.log(1111111);
});
</script>

<template>
  <a-list :bordered="false">
    <a-list-item>
      <a-list-item-meta>
        <template #avatar>
          <a-typography-paragraph>个人博客链接</a-typography-paragraph>
        </template>
        <template #description>
          <div class="content">
            <a-typography-paragraph>
              {{ accountData.blog_link }}
            </a-typography-paragraph>
          </div>
          <div class="operation">
            <a-link>修改</a-link>
          </div>
        </template>
      </a-list-item-meta>
    </a-list-item>
    <a-list-item>
      <a-list-item-meta>
        <template #avatar>
          <a-typography-paragraph>新浪微博链接</a-typography-paragraph>
        </template>
        <template #description>
          <div class="content">
            <a-typography-paragraph class="tip">
              {{ accountData.github_link }}
            </a-typography-paragraph>
          </div>
          <div class="operation">
            <a-link>修改</a-link>
          </div>
        </template>
      </a-list-item-meta>
    </a-list-item>
    <a-list-item>
      <a-list-item-meta>
        <template #avatar>
          <a-typography-paragraph>Github链接</a-typography-paragraph>
        </template>
        <template #description>
          <div class="content">
            <a-typography-paragraph>
              {{ accountData.github_link }}
            </a-typography-paragraph>
          </div>
          <div class="operation">
            <a-link>修改</a-link>
          </div>
        </template>
      </a-list-item-meta>
    </a-list-item>
    <a-list-item>
      <a-form-item>
        <a-space>
          <a-button type="primary" @click="handleLogout">退出登录</a-button>
        </a-space>
      </a-form-item>
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
