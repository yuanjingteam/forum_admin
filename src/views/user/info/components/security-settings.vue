<script setup>
import useUser from '@/hooks/useUser';

const { logout } = useUser();
const handleLogout = () => {
  logout();
};
</script>

<template>
  <a-list :bordered="false">
    <a-list-item>
      <a-list-item-meta>
        <template #avatar>
          <a-typography-paragraph>登录密码</a-typography-paragraph>
        </template>
        <template #description>
          <div class="content">
            <a-typography-paragraph>
              已设置。密码至少6位字符，支持数字、字母和除空格外的特殊字符，且必须同时包含数字和大小写字母。
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
          <a-typography-paragraph>安全邮箱</a-typography-paragraph>
        </template>
        <template #description>
          <div class="content">
            <a-typography-paragraph class="tip">
              已设置邮箱，绑定邮箱可以用来找回密码、接收通知等。
            </a-typography-paragraph>
          </div>
          <div class="operation">
            <a-link>修改</a-link>
          </div>
        </template>
      </a-list-item-meta>
    </a-list-item>
    <!-- <a-list-item>
      <a-list-item-meta>
        <template #avatar>
          <a-typography-paragraph>用户权限</a-typography-paragraph>
        </template>
        <template #description>
          <div class="content">
            <a-typography-paragraph>
              设置当前用户的访问权限
            </a-typography-paragraph>
          </div>
          <div class="operation">
            <a-link>修改</a-link>
          </div>
        </template>
      </a-list-item-meta>
    </a-list-item> -->
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
