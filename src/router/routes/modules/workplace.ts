import type { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/',
  name: 'Home',
  component: () => import('@/layout/default-layout.vue'),
  redirect: '/workplace',
  meta: {
    locale: '工作台',
    requiresAuth: true,
    hideChildrenMenu: true,
    icon: 'icon-dashboard',
    order: 0
  },
  children: [
    {
      path: '/workplace',
      name: 'Home',
      component: () => import('@/views/workplace/index.vue'),
      meta: {
        activeMenu: 'Home'
      }
    }
  ]
};
export default DASHBOARD;
