import { DEFAULT_LAYOUT } from '../base';
import type { AppRouteRecordRaw } from '../types';

// 异常页
const RESULT: AppRouteRecordRaw = {
  path: '/result',
  name: 'result',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '结果页',
    requiresAuth: true,
    icon: 'icon-check-circle',
    order: 7
  },
  children: [
    {
      path: 'success',
      name: 'Success',
      component: () => import('@/views/result/success/index.vue'),
      meta: {
        locale: '成功页',
        requiresAuth: true,
        // 角色权限控制：
        // 这个配置表明，只有具有 admin 角色的用户才能访问标记了这个权限的路由或组件。
        // roles: ['admin'],
        roles: ['*']
      }
    },
    {
      path: 'error',
      name: 'Error',
      component: () => import('@/views/result/error/index.vue'),
      meta: {
        locale: '失败页',
        requiresAuth: true,
        roles: ['*']
      }
    }
  ]
};

export default RESULT;
