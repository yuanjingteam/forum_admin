// 声明一个模块 'axios'，用于扩展 Axios 库的类型
export declare module 'axios' {
  // 定义一个 HttpResponse 接口，表示 HTTP 响应的结构
  interface HttpResponse<T = unknown> {
    // 表示业务逻辑状态码，通常用于表示成功或错误状态
    code: number;
    // 泛型 T 表示响应体的数据，默认为 unknown
    data: T;
    // 表示响应的消息文本
    msg: string;
    // 可选属性 status，表示 HTTP 响应状态码
    status?: number;

  }
  // 扩展 AxiosResponse 接口，使其包含 HttpResponse 接口的所有属性
  interface AxiosResponse<T = any> extends HttpResponse<T> { }
}
