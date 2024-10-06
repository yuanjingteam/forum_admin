import { DEFAULT_LAYOUT } from '../base';
import type { AppRouteRecordRaw } from '../types';

const LIST: AppRouteRecordRaw = {
  path: '/userManager',
  name: 'userMan',
  redirect: '/userManager',

  component: DEFAULT_LAYOUT,
  meta: {
    locale: '用户管理',
    requiresAuth: true,
    icon: 'icon-user-group',
    order: 1,
    hideChildrenMenu: true // 隐藏子菜单项
  },
  // 将子路由的 path 设置为空字符串 ''，表示该子路由与父路由的路径完全匹配。
  // 这意味着访问 / role 时，实际上会加载子路由的组件。
  // 当用户访问 / role 时，Vue Router 会根据路径找到对应的路由配置，
  // 渲染 role-maragement / index.vue 组件。
  children: [
    {
      path: '/userManager', // 使用空路径以匹配父路由
      name: 'userManager', // 子路由名称
      component: () => import('@/views/userManager/index.vue'),
      meta: {
        activeMenu: 'userMan',
        locale: '查询表格',
        requiresAuth: true,
        roles: ['*']
      }
    }
  ]
};

export default LIST;
