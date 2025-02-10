import { defineStore } from 'pinia';
import {
  login as userLogin,
  logout as userLogout,
  type LoginData
} from '@/api/user';
import { setToken, clearToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { Message } from '@arco-design/web-vue';

import type { UserState } from './types';

const useUserStore = defineStore('user', {
  // 定义初始化状态
  state: (): UserState => ({
    id: undefined,
    nickname: undefined,
    email: undefined,
    user_status: undefined,
    role_ids: undefined,
    code: undefined,
    role_names: undefined,
    role_id: undefined,
    avatar_path: undefined,
    isRoles: false
  }),

  // 返回state的浅拷贝
  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    }
  },

  actions: {
    changeRole() {
      this.isRoles = true;
    },
    // 改变用户权限
    switchRoles() {
      return new Promise(resolve => {
        this.role = this.role === 'user' ? 'admin' : 'user';
        resolve(this.role);
      });
    },
    // 设置用户信息
    // Partial 类型，这意味着它可以包含 UserState 中的任意子集属性，而不是所有属性。
    // $patch 是 Pinia 提供的方法，用于批量更新 store 的状态。它会将传入的 partial 对象合并到当前状态中。
    // 例如，如果 partial 只包含 nickname 和 email，那么只有这两个状态属性会被更新，其余属性保持不变。
    // 更新用户信息: setInfo 方法可以用来根据需要更新用户的部分信息。例如：
    // const userStore = useUserStore();
    // userStore.setInfo({ nickname: '新昵称', email: 'new@example.com' });
    setInfo(partial: Partial<UserState>) {
      console.log(partial, '存储了新的用户信息');
      this.$patch(partial);
    },

    // 重置用户信息
    resetInfo() {
      this.$reset();
    },

    // 更新用户信息
    async info() {
      // 从 localStorage 中获取用户信息
      const savedUserInfo = localStorage.getItem('userInfo');
      if (savedUserInfo) {
        // 解析 JSON 字符串为对象
        const userInfo = JSON.parse(savedUserInfo);
        // 使用 setInfo 方法更新 store 中的用户信息
        this.setInfo(userInfo);
      } else {
        console.warn('在本地存储中找不到用户信息');
      }
    },

    // Login
    // 获取用户信息
    async login(loginForm: LoginData) {
      try {
        const { data } = await userLogin(loginForm);
        setToken(data.token);
        this.setInfo({
          email: loginForm.email // 确保以对象的形式传递
        });
        // 将用户信息存储到 localStorage
        localStorage.setItem('userInfo', JSON.stringify(data.userInfo));
        localStorage.setItem(
          'permissionButton',
          JSON.stringify(data.code_list)
        );
        localStorage.setItem('permissionMenu', JSON.stringify(data.perm));
        Message.success('登录成功');
      } catch (error) {
        Message.info('该用户没有权限');
        clearToken();
      }
    },

    logoutCallBack() {
      this.resetInfo();
      clearToken();
      removeRouteListener();
    },
    // 用户登出
    async logout() {
      try {
        await userLogout();
      } finally {
        this.logoutCallBack();
      }
    }
  }
});

export default useUserStore;
