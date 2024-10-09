import { defineStore } from 'pinia';
import {
  login as userLogin,
  logout as userLogout,
  type LoginData
} from '@/api/user';
import { setToken, clearToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import type { UserState } from './types';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    nickname: undefined,
    email: undefined,
    user_status: undefined,
    roles_ids: undefined,
    avatar_path: undefined
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    }
  },

  actions: {
    switchRoles() {
      return new Promise(resolve => {
        this.role = this.role === 'user' ? 'admin' : 'user';
        resolve(this.role);
      });
    },
    // 设置用户信息
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },

    // 重置用户信息
    resetInfo() {
      this.$reset();
    },

    // async info() {
    //   const res = await getUserInfo();
    // },

    // Login
    // 获取用户信息
    async login(loginForm: LoginData) {
      try {
        const res = await userLogin(loginForm);
        setToken(res.data.Authorization);
        this.setInfo(res.data.userInfo);
      } catch (err) {
        clearToken();
        throw err;
      }
    },
    logoutCallBack() {
      this.resetInfo();
      clearToken();
      removeRouteListener();
    },
    // Logout
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
