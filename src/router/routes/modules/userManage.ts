import type { AppRouteRecordRaw } from '../types';

const LIST: AppRouteRecordRaw = {
  path: '/userMgr',
  name: 'userMgr',
  redirect: '/userMgr',
  component: () => import('@/layout/default-layout.vue'),
  meta: {
    locale: '用户管理',
    requiresAuth: true,
    icon: 'icon-user-group',
    order: 1,
    hideChildrenMenu: true // 隐藏子菜单项
  },
  children: [
    {
      path: '/userMgr', // 使用空路径以匹配父路由
      name: 'userMgr', // 子路由名称
      component: () => import('@/views/userManager/index.vue'),
      meta: {
        activeMenu: 'userMgr',
        requiresAuth: true
      }
    }
  ]
};

export default LIST;
