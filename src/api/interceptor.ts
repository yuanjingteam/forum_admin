// 导入 axios 库用于进行 HTTP 请求
import axios from 'axios';
// 导入 AxiosResponse 和 InternalAxiosRequestConfig 类型
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
// 导入 Arco Design 的 Message 和 Modal 组件
import { Message, Modal } from '@arco-design/web-vue';
// 导入用户状态管理和获取 token 的工具函数
import { useUserStore } from '@/store';
import { getToken } from '@/utils/auth';

// 创建 axios 实例，设置基础配置
axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '', // 设置 API 的基础 URL
  timeout: 10000, // 请求超时的毫秒数
  withCredentials: false // 跨域请求时不使用凭证
});

// 添加请求拦截器
axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 获取用户的 token
    const token = getToken();
    // 如果存在 token，则设置请求头中的 Authorization 字段
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // 返回修改后的请求配置
  },
  error => {
    // 如果请求失败，返回一个拒绝的 Promise
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data; // 获取响应数据
    // 检查响应中的状态码
    if (res.code !== 20000) {
      // 如果状态码不是 20000，则显示错误信息
      Message.error({
        content: res.msg || '网络错误', // 显示响应中的错误信息，或默认提示
        duration: 5 * 1000 // 提示持续时间
      });
      // 检查特定的错误代码，并且请求的 URL 不是 '/api/user/info'
      if (
        [50008, 50012, 50014].includes(res.code) &&
        response.config.url !== '/api/user/info'
      ) {
        // 显示登录信息已过期的模态框
        Modal.error({
          title: '登录信息已过期',
          content: '登录信息已过期，请重新登录',
          okText: '去登录', // 确认按钮文本
          async onOk() {
            const userStore = useUserStore(); // 获取用户状态管理

            // 调用 logout 方法并刷新页面
            await userStore.logout();
            window.location.reload();
          }
        });
      }
      // 返回拒绝的 Promise，并附带错误信息
      return Promise.reject(new Error(res.msg || '网络错误'));
    }
    return res; // 返回响应数据
  },
  error => {
    // 如果响应失败，显示错误信息
    Message.error({
      content: error.msg || '网络错误请稍后重试', // 显示错误信息，或默认提示
      duration: 5 * 1000 // 提示持续时间
    });
    return Promise.reject(error); // 返回拒绝的 Promise
  }
);
