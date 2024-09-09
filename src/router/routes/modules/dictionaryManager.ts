import { DEFAULT_LAYOUT } from '../base';
import type { AppRouteRecordRaw } from '../types';

const PROFILE: AppRouteRecordRaw = {
  path: '/profile',
  name: 'profile',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '详情页',
    requiresAuth: true,
    icon: 'icon-file',
    order: 4
  },
  children: [
    {
      path: 'sort',
      name: 'Sort',
      component: () => import('@/views/dictionaryManager/sort/index.vue'),
      meta: {
        locale: '分类管理',
        requiresAuth: true,
        roles: ['admin']
      }
    },
    {
      path: 'tag',
      name: 'Tag',
      component: () => import('@/views/dictionaryManager/tag/index.vue'),
      meta: {
        locale: '标签管理',
        requiresAuth: true,
        roles: ['admin']
      }
    }
  ]
};

export default PROFILE;
