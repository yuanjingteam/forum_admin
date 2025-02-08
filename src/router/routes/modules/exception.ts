import type { AppRouteRecordRaw } from '../types';

// 异常页
const EXCEPTION: AppRouteRecordRaw = {
  path: '/exception',
  name: 'exception',
  component: () => import('@/layout/default-layout.vue'),
  meta: {
    locale: '异常页',
    requiresAuth: true,
    icon: 'icon-exclamation-circle',
    order: 8
  },
  children: [
    {
      path: '403',
      name: '403',
      component: () => import('@/views/exception/403/index.vue'),
      meta: {
        locale: '403',
        requiresAuth: true
      }
    },
    {
      path: '404',
      name: '404',
      component: () => import('@/views/exception/404/index.vue'),
      meta: {
        locale: '404',
        requiresAuth: true
      }
    },
    {
      path: '500',
      name: '500',
      component: () => import('@/views/exception/500/index.vue'),
      meta: {
        locale: '500',
        requiresAuth: true
      }
    }
  ]
};

export default EXCEPTION;
