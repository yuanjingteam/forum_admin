import type { App, ComponentPublicInstance } from 'vue';
import axios from 'axios';

export default function handleError(Vue: App, baseUrl: string) {
  if (!baseUrl) {
    return;
  }
  // 配置 Vue 的全局错误处理器
  Vue.config.errorHandler = (
    err: unknown, // 捕获的错误对象，类型为未知
    instance: ComponentPublicInstance | null, // 发生错误的组件实例，可能为 null
    info: string // 错误发生的上下文信息，例如生命周期钩子
  ) => {
    // 发送错误信息到服务器
    axios.post(`${baseUrl}/report-error`, {
      err, // 发送捕获到的错误对象
      instance, // 发送发生错误的组件实例信息（可能不需要直接发送）
      info // 发送错误的上下文信息
      // 可选信息（可以根据需要取消注释并提供相应的值）
      // location: window.location.href, // 当前页面的 URL
      // message: err.message, // 错误的消息字符串
      // stack: err.stack, // 错误的堆栈跟踪，用于调试
      // browserInfo: getBrowserInfo(), // 用户的浏览器信息（需定义获取浏览器信息的函数）
      // 其他相关信息
      // user info, // 用户信息
      // dom info, // DOM 信息
      // url info, // 相关 URL 信息
      // ...
    });
  };
}
