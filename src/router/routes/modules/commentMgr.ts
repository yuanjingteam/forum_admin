import type { AppRouteRecordRaw } from '../types';

const LIsaST: AppRouteRecordRaw = {
  path: '/comment',
  name: 'comment',
  redirect: '/comment',
  component: () => import('@/layout/default-layout.vue'),
  meta: {
    locale: '评论管理',
    requiresAuth: true,
    icon: 'icon-list',
    order: 4,
    hideChildrenMenu: true // 隐藏子菜单项
  },
  children: [
    {
      path: '/comment', // 使用空路径以匹配父路由
      name: 'comment', // 子路由名称
      component: () => import('@/views/commentMgr/index.vue'),
      meta: {
        activeMenu: 'comment',
        requiresAuth: true
      }
    }
  ]
};

export default LIsaST;
