import type { AppRouteRecordRaw } from '../types';

const ACL: AppRouteRecordRaw = {
  path: '/acl',
  name: 'Acl',
  component: () => import('@/layout/default-layout.vue'),
  meta: {
    locale: '权限管理',
    icon: 'icon-desktop',
    order: 6,
    requiresAuth: true,
    hideChildrenMenu: false
  },
  children: [
    {
      path: 'role',
      name: 'Role',
      component: () => import('@/views/acl/role/index.vue'),
      meta: {
        locale: '角色管理',
        requiresAuth: true
      }
    },
    {
      path: 'menu',
      name: 'Menu',
      component: () => import('@/views/acl/menu/index.vue'),
      meta: {
        locale: '菜单管理',
        requiresAuth: true
      }
    },
    {
      path: 'api',
      name: 'Api',
      component: () => import('@/views/acl/apiManage/index.vue'),
      meta: {
        locale: 'api管理',
        requiresAuth: true
      }
    }
  ]
};

export default ACL;
