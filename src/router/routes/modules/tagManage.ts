import type { AppRouteRecordRaw } from '../types';

const LIsaST: AppRouteRecordRaw = {
  path: '/tag',
  name: 'Tag',
  redirect: '/tag',
  component: () => import('@/layout/default-layout.vue'),
  meta: {
    locale: '标签管理',
    requiresAuth: true,
    icon: 'icon-list',
    order: 5,
    hideChildrenMenu: true // 隐藏子菜单项
  },
  children: [
    {
      path: '/tag', // 使用空路径以匹配父路由
      name: 'Tag', // 子路由名称
      component: () => import('@/views/tagMgr/index.vue'),
      meta: {
        activeMenu: 'Tag',
        requiresAuth: true
      }
    }
  ]
};

export default LIsaST;
