import { DEFAULT_LAYOUT } from '../base';
import type { AppRouteRecordRaw } from '../types';

const ACL: AppRouteRecordRaw = {
  path: '/acl',
  name: 'acl',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '权限管理',
    icon: 'icon-check-circle',
    requiresAuth: true,
    order: 5
  },
  children: [
    {
      path: 'role',
      name: 'Role',
      component: () => import('@/views/acl/role/index.vue'),
      meta: {
        locale: '角色管理',
        requiresAuth: true,
        roles: ['admin']
      }
    },
    {
      path: 'menu',
      name: 'Menu',
      component: () => import('@/views/acl/menu/index.vue'),
      meta: {
        locale: '菜单管理',
        requiresAuth: true,
        roles: ['admin']
      }
    },
    {
      path: 'api',
      name: 'Api',
      component: () => import('@/views/acl/apiManage/index.vue'),
      meta: {
        locale: 'api管理',
        requiresAuth: true,
        roles: ['admin']
      }
    }
  ]
};

export default ACL;
