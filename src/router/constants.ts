// 定义一个白名单数组，包含不需要身份验证的路由
export const WHITE_LIST = [
  { name: 'notFound', children: [] }, // 404 未找到路由
  { name: 'login', children: [] } // 登录路由
];

// 定义一个常量，表示未找到路由的对象
export const NOT_FOUND = {
  name: 'notFound' // 路由名称
};

// 定义重定向路由的名称
export const REDIRECT_ROUTE_NAME = 'Redirect';
// 定义登录路由的名称
export const LOGIN_ROUTE_NAME = 'Login';
// 定义默认路由的名称
export const DEFAULT_ROUTE_NAME = 'Workplace';

// 定义默认路由的对象，包括标题、名称和完整路径
export const DEFAULT_ROUTE = {
  title: '工作台', // 路由标题
  name: DEFAULT_ROUTE_NAME, // 路由名称
  fullPath: '/workplace' // 路由的完整路径
};
