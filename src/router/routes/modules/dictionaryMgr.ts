import type { AppRouteRecordRaw } from '../types';

const LIsaST: AppRouteRecordRaw = {
  path: '/dictionary',
  name: 'dictionary',
  redirect: '/dictionary',

  component: () => import('@/layout/default-layout.vue'),
  meta: {
    locale: '字典管理',
    requiresAuth: true,
    icon: 'icon-list',
    order: 3,
    hideChildrenMenu: true // 隐藏子菜单项
  },
  children: [
    {
      path: '/dictionary', // 使用空路径以匹配父路由
      name: 'dictionary', // 子路由名称
      component: () => import('@/views/dictionaryMgr/index.vue'),
      meta: {
        activeMenu: 'dictionary',
        requiresAuth: true
      }
    }
  ]
};

export default LIsaST;
