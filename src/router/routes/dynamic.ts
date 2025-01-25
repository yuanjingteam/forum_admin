import { DEFAULT_LAYOUT } from './base';
// import type { AppRouteRecordRaw } from '../types';

const dynamic = [
  {
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
  },
  {
    path: '/article',
    name: 'article',
    component: DEFAULT_LAYOUT,
    redirect: '/articleManager',
    meta: {
      locale: '文章管理',
      requiresAuth: true,
      icon: 'icon-list',
      order: 2,
      hideChildrenMenu: true // 隐藏子菜单项
    },
    // 将子路由的 path 设置为空字符串 ''，表示该子路由与父路由的路径完全匹配。
    // 这意味着访问 / role 时，实际上会加载子路由的组件。
    // 当用户访问 / role 时，Vue Router 会根据路径找到对应的路由配置，
    // 渲染 role-maragement / index.vue 组件。
    children: [
      {
        path: '/articleManager', // 使用空路径以匹配父路由
        name: 'articleManager', // 子路由名称
        component: () => import('@/views/articleManager/index.vue'),
        meta: {
          activeMenu: 'article',
          locale: '文章管理',
          requiresAuth: true,
          roles: ['*']
        }
      }
    ]
  },
  {
    path: '/comment',
    name: 'comment',
    redirect: '/commentMgr',
    component: DEFAULT_LAYOUT,
    meta: {
      locale: '评论管理',
      requiresAuth: true,
      icon: 'icon-list',
      order: 4,
      hideChildrenMenu: true // 隐藏子菜单项
    },
    // 将子路由的 path 设置为空字符串 ''，表示该子路由与父路由的路径完全匹配。
    // 这意味着访问 / role 时，实际上会加载子路由的组件。
    // 当用户访问 / role 时，Vue Router 会根据路径找到对应的路由配置，
    // 渲染 role-maragement / index.vue 组件。
    children: [
      {
        path: '/commentMgr', // 使用空路径以匹配父路由
        name: 'commentMgr', // 子路由名称
        component: () => import('@/views/commentMgr/index.vue'),
        meta: {
          activeMenu: 'comment',
          locale: '评论管理',
          requiresAuth: true,
          roles: ['*']
        }
      }
    ]
  },
  {
    path: '/dictionary',
    name: 'dictionary',
    redirect: '/dictionaryMgr',

    component: DEFAULT_LAYOUT,
    meta: {
      locale: '字典管理',
      requiresAuth: true,
      icon: 'icon-list',
      order: 3,
      hideChildrenMenu: true // 隐藏子菜单项
    },
    // 将子路由的 path 设置为空字符串 ''，表示该子路由与父路由的路径完全匹配。
    // 这意味着访问 / role 时，实际上会加载子路由的组件。
    // 当用户访问 / role 时，Vue Router 会根据路径找到对应的路由配置，
    // 渲染 role-maragement / index.vue 组件。
    children: [
      {
        path: '/dictionaryMgr', // 使用空路径以匹配父路由
        name: 'dictionaryMgr', // 子路由名称
        component: () => import('@/views/dictionaryMgr/index.vue'),
        meta: {
          activeMenu: 'dictionary',
          locale: '字典管理',
          requiresAuth: true,
          roles: ['*']
        }
      }
    ]
  },
  {
    path: '/exception',
    name: 'exception',
    component: DEFAULT_LAYOUT,
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
          requiresAuth: true,
          roles: ['*']
        }
      },
      {
        path: '404',
        name: '404',
        component: () => import('@/views/exception/404/index.vue'),
        meta: {
          locale: '404',
          requiresAuth: true,
          roles: ['*']
        }
      },
      {
        path: '500',
        name: '500',
        component: () => import('@/views/exception/500/index.vue'),
        meta: {
          locale: '500',
          requiresAuth: true,
          roles: ['*']
        }
      }
    ]
  },
  {
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
  },
  {
    path: '/tag',
    name: 'Tag',
    redirect: '/tagMgr',

    component: DEFAULT_LAYOUT,
    meta: {
      locale: '标签管理',
      requiresAuth: true,
      icon: 'icon-list',
      order: 5,
      hideChildrenMenu: true // 隐藏子菜单项
    },
    // 将子路由的 path 设置为空字符串 ''，表示该子路由与父路由的路径完全匹配。
    // 这意味着访问 / role 时，实际上会加载子路由的组件。
    // 当用户访问 / role 时，Vue Router 会根据路径找到对应的路由配置，
    // 渲染 role-maragement / index.vue 组件。
    children: [
      {
        path: '/tagMgr', // 使用空路径以匹配父路由
        name: 'tagMgr', // 子路由名称
        component: () => import('@/views/tagMgr/index.vue'),
        meta: {
          activeMenu: 'Tag',
          locale: '标签管理',
          requiresAuth: true,
          roles: ['*']
        }
      }
    ]
  },
  {
    path: '/user',
    name: 'user',
    component: DEFAULT_LAYOUT,
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
          requiresAuth: true,
          roles: ['*']
        }
      }
    ]
  },
  {
    path: '/userMgr',
    name: 'userMgr',
    redirect: '/userManager',

    component: DEFAULT_LAYOUT,
    meta: {
      locale: '用户管理',
      requiresAuth: true,
      icon: 'icon-user-group',
      order: 1,
      hideChildrenMenu: true // 隐藏子菜单项
    },
    // 将子路由的 path 设置为空字符串 ''，表示该子路由与父路由的路径完全匹配。
    // 这意味着访问 / role 时，实际上会加载子路由的组件。
    // 当用户访问 / role 时，Vue Router 会根据路径找到对应的路由配置，
    // 渲染 role-maragement / index.vue 组件。
    children: [
      {
        path: '/userManager', // 使用空路径以匹配父路由
        name: 'userManager', // 子路由名称
        component: () => import('@/views/userManager/index.vue'),
        meta: {
          activeMenu: 'userMgr',
          locale: '用户管理',
          requiresAuth: true,
          roles: ['*']
        }
      }
    ]
  },
  {
    path: '/',
    name: 'Home',
    component: DEFAULT_LAYOUT,
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
        name: 'Workplace',
        component: () => import('@/views/workplace/index.vue'),
        meta: {
          activeMenu: 'Home'
        }
      }
    ]
  }
];

export default dynamic;
