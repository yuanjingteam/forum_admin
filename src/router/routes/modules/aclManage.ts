import { DEFAULT_LAYOUT } from '../base';
import type { AppRouteRecordRaw } from '../types';

const ACL: AppRouteRecordRaw = {
  path: '/acl',
  name: 'Acl',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '权限管理',
    icon: 'icon-desktop',
    requiresAuth: true,
    order: 6,
    hideChildrenMenu: false // 隐藏子菜单项
  },
  children: [
    {
      path: 'role',
      name: 'Role',
      component: () => import('@/views/acl/role/index.vue'),
      meta: {
        locale: '角色管理',
        requiresAuth: true,
        roles: ['*']
      }
    },
    {
      path: 'menu',
      name: 'Menu',
      component: () => import('@/views/acl/menu/index.vue'),
      meta: {
        locale: '菜单管理',
        requiresAuth: true,
        roles: ['*']
      }
    },
    {
      path: 'api',
      name: 'Api',
      component: () => import('@/views/acl/apiManage/index.vue'),
      meta: {
        locale: 'api管理',
        requiresAuth: true,
        roles: ['*']
      }
    }
  ]
};

export default ACL;
