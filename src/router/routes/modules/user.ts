import type { AppRouteRecordRaw } from '../types';

const USER: AppRouteRecordRaw = {
  path: '/user',
  name: 'user',
  component: () => import('@/layout/default-layout.vue'),
  meta: {
    locale: '个人中心',
    icon: 'icon-user',
    requiresAuth: true,
    order: 9
  },
  children: [
    {
      path: 'info',
      name: 'Info',
      component: () => import('@/views/user/info/index.vue'),
      meta: {
        locale: '用户信息',
        requiresAuth: true
      }
    }
  ]
};

export default USER;
