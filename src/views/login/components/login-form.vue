<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core';
import { useUserStore } from '@/store';
import useLoading from '@/hooks/useLoading';
import type { LoginData } from '@/api/user';
import { pick } from 'lodash';
import { Message } from '@arco-design/web-vue';
import { getRoleAllCodeService, getRoleMenuService } from '@/api/menu';
import { restRouter } from '@/router';
import { usePermissionNavStore } from '@/store';
import { changeAppRoutes } from '@/router/routes';
// CryptoJS 是一个广泛使用的 JavaScript 加密库，这里用不到
// import CryptoJS from 'crypto-js';

const router = useRouter();
const userStore = useUserStore();
const formRef = ref();
const tabActiveKey = ref('1');
const { loading, setLoading } = useLoading();

const loginConfig = useStorage('login-config', {
  rememberPassword: false,
  email: '', // 演示默认值
  password: '' // 演示密码
});
const form = reactive({
  email: loginConfig.value.email,
  password: loginConfig.value.password,
  agreement: false
});
const rules = {
  email: [
    { required: true, message: '请输入正确邮箱账号' },
    {
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: '请输入有效的邮箱地址'
    }
  ],

  password: [
    { required: true, message: '请输入密码' },
    {
      // 密码格式：6-32位，包含大小写字母、数字、特殊字符(除空格)两种以上
      match:
        /^(?![\d]+$)(?![a-z]+$)(?![A-Z]+$)(?![~!@#$%^&*.]+$)[\da-zA-z~!@#$%^&*.]{6,32}$/,
      message:
        '密码格式：6-32位，包含大小写字母、数字、特殊字符(除空格)任意两种以上'
    }
  ]
};

const handleSubmit = () => {
  if (loading.value) return;

  // 账号登录
  if (tabActiveKey.value === '1') {
    formRef.value.validateField(['username', 'password']).then(async res => {
      if (res) return;
      if (!form.agreement) {
        return Message.info('请阅读并同意服务协议和隐私政策');
      }
      setLoading(true);
      try {
        // 快速查询属性
        const userInfoForm = pick(form, ['email', 'password']);

        // userInfoForm 被断言为 LoginData 类型，以确保其符合登录所需的数据结构
        // 登录校验
        await userStore.login(userInfoForm as LoginData);

        // 从当前路由的查询参数中解构出 `redirect` 属性
        // `redirect` 用于存储重定向的目标地址
        // `...othersQuery` 收集其余的查询参数，存储在 `othersQuery` 对象中
        const { redirect, ...othersQuery } = router.currentRoute.value.query;

        //跳转之前调用两个权限相关的接口：获取菜单权限名称和获取按钮权限标识
        const roleId = Math.max(
          ...JSON.parse(localStorage.getItem('userInfo'))?.role_ids
        );

        //1.获取按钮权限标识
        const {
          data: { code_list }
        } = await getRoleAllCodeService(roleId);
        // 同时存储当前用户所拥有的所有按钮权限标识;
        localStorage.setItem('permissionButtton', JSON.stringify(code_list));

        //2.获取菜单权限名称
        const {
          data: { perm }
        } = await getRoleMenuService(roleId);
        // 同时存储当前用户所拥有的所有菜单权限;
        const permRouteName = perm.map(item => item.route_name);
        localStorage.setItem('permissionMenu', JSON.stringify(permRouteName));
        restRouter();
        const usePermissionNav = usePermissionNavStore();
        usePermissionNav.formatRoutes(changeAppRoutes());
        // 使用 router.push 方法进行路由跳转
        router.push({
          // 设置路由名称为 `redirect` 的值，如果 `redirect` 为空，则默认跳转至 'Workplace'
          name: (redirect as string) || 'Workplace',
          // 将其他查询参数传递给新的路由
          query: {
            ...othersQuery // 展开其他查询参数
          }
        });
      } catch (error) {
      } finally {
        // 表示加载状态已经结束，通常用于更新用户界面的加载指示器。
        setLoading(false);
      }
    });
  }
};
</script>

<template>
  <a-form
    ref="formRef"
    class="login-form-wrapper"
    layout="vertical"
    :model="form"
    :rules="rules"
  >
    <div class="login-form-title">欢迎登录</div>
    <a-tabs v-model:active-key="tabActiveKey" size="mini" animation>
      <a-tab-pane key="1" title="邮箱登录" destroy-on-hide>
        <a-form-item field="username" validate-trigger="blur" hide-label>
          <a-input
            v-model="form.email"
            autocomplete="current-email"
            placeholder="邮箱"
          >
            <template #prefix>
              <icon-user />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item field="password" validate-trigger="blur" hide-label>
          <a-input-password
            v-model="form.password"
            autocomplete="current-password"
            placeholder="请输入密码"
            allow-clear
          >
            <template #prefix>
              <icon-lock />
            </template>
          </a-input-password>
        </a-form-item>
        <!-- <a-checkbox
          checked="rememberPassword"
          :model-value="loginConfig.rememberPassword"
          @change="setRememberPassword"
        >
          记住密码
        </a-checkbox> -->
      </a-tab-pane>
    </a-tabs>
    <a-button
      type="primary"
      style="margin: 32px 0 6px"
      long
      :loading="loading"
      @click="handleSubmit"
    >
      登录
    </a-button>
    <div class="login-form-actions">
      <a-checkbox v-model="form.agreement">我已阅读并同意</a-checkbox>
      <a-link>服务协议</a-link>
      <span>和</span>
      <a-link>隐私政策</a-link>
    </div>
  </a-form>
</template>

<style lang="less" scoped>
.login-form {
  &-wrapper {
    width: 330px;
    padding: 24px 24px 12px;
    overflow: hidden;
    background-color: var(--color-bg-1);
    border: 1px solid var(--color-border-2);
    border-radius: var(--border-radius-large);
  }

  &-title {
    margin-bottom: 16px;
    font-size: 24px;
    font-weight: 500;
    line-height: 32px;
    color: var(--color-text-1);
  }

  &-actions {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-top: 24px;
    margin-bottom: 6px;
  }

  &-register-btn {
    color: var(--color-text-3) !important;
  }

  &-more {
    justify-content: center;

    .arco-icon {
      font-size: 20px;
      cursor: pointer;
      transition: transform 0.2s ease;

      &:hover {
        transform: scale(1.3);
      }
    }
  }
}

:deep(.arco-tabs-content) {
  height: 120px;
}
</style>
