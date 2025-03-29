// 导入 axios 库用于进行 HTTP 请求
import axios from 'axios';
// 导入 AxiosResponse 和 InternalAxiosRequestConfig 类型
import type { AxiosResponse } from 'axios';
// 导入 Arco Design 的 Message 和 Modal 组件
import { Message, Modal } from '@arco-design/web-vue';
// 导入用户状态管理和获取 token 的工具函数
import { useUserStore } from '@/store';
import { getToken } from '@/utils/auth';

// 创建 axios 实例，设置基础配置
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // API 基础 URL
  timeout: 10000, // 请求超时的毫秒数
  withCredentials: false // 跨域请求时不使用凭证
});

const csrfRequest = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000, // 设置较短的超时时间
  withCredentials: false
});

// 函数用于获取动态请求头和 Cookie
async function fetchDynamicHeaders(): Promise<{
  headers: any;
}> {
  try {
    debugger;
    // 调用另一个接口获取动态请求头和 Cookie
    const response = await csrfRequest.get('/get_csrf_token');
    console.log(response, 'response');

    // 确保返回的 headers 中包含 x-csrf-token
    if (!response.headers['x-csrf-token']) {
      throw new Error('Missing x-csrf-token in response headers');
    }

    return response;
  } catch (error) {
    // 如果获取动态请求头失败，抛出错误
    throw new Error('Failed to fetch dynamic headers');
  }
}

// 添加请求拦截器
request.interceptors.request.use(
  async (config: any) => {
    // 获取用户的 token
    const token = getToken();
    debugger;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.withCredentials = true; // 启用 Cookie
    }

    try {
      // 获取动态请求头和 Cookie
      const { headers } = await fetchDynamicHeaders();
      console.log(headers, 'headers');

      // 合并动态请求头
      config.headers = {
        ...config.headers,
        'X-Csrf-Token': headers['x-csrf-token']
      };
    } catch (error) {
      // 如果获取动态请求头失败，可以抛出错误或者记录日志
      console.error('获取动态请求头失败:', error);
      // 你可以选择在此处中断请求或者继续发送请求
    }
    return config; // 返回修改后的请求配置
  },
  error => {
    // 如果请求失败，返回一个拒绝的 Promise
    return Promise.reject(error);
  }
);

// 添加响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data; // 获取响应数据
    // 检查响应中的状态码
    if (res.code !== 2000) {
      //上传图片的接口格式不一致特殊判断
      if (!res?.errno) {
        return res;
      }
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
            userStore.logout(); // 调用 logout 方法
            window.location.reload(); // 刷新页面
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
      content: error.message || '网络错误，请稍后重试', // 显示错误信息，或默认提示
      duration: 5 * 1000 // 提示持续时间
    });
    return Promise.reject(error); // 返回拒绝的 Promise
  }
);

export default request;
