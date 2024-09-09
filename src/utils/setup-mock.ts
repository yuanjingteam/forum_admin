// 导入调试环境配置
import debug from './env';

// 默认导出一个函数，接受 mock 和 setup 参数
export default ({ mock, setup }: { mock?: boolean; setup: () => void }) => {
  // 如果 mock 参数不是 false 且 debug 为真，则调用 setup 函数
  if (mock !== false && debug) setup();
};

// 包装成功响应的函数，接受数据参数
export const successResponseWrap = (data: unknown) => {
  return {
    data, // 返回的数据
    status: 'ok', // 状态标识，表示请求成功
    msg: '请求成功', // 成功消息
    code: 20000 // 成功的状态码
  };
};

// 包装失败响应的函数，接受数据、消息和可选的状态码参数
export const failResponseWrap = (data: unknown, msg: string, code = 50000) => {
  return {
    data, // 返回的数据
    status: 'fail', // 状态标识，表示请求失败
    msg, // 失败消息
    code // 失败的状态码，默认为 50000
  };
};
