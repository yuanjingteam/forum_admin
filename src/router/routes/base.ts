// 导入 Vue Router 的类型定义
import type { RouteRecordRaw } from 'vue-router';
// 导入常量 REDIRECT_ROUTE_NAME
import { REDIRECT_ROUTE_NAME } from '@/router/constants';

// 定义默认布局组件的异步导入
export const DEFAULT_LAYOUT = () => import('@/layout/default-layout.vue');

// 定义重定向主路由
export const REDIRECT_MAIN: RouteRecordRaw = {
  path: '/redirect', // 路由路径
  name: 'redirectWrapper', // 路由名称
  component: DEFAULT_LAYOUT, // 使用默认布局作为容器
  meta: {
    requiresAuth: true, // 该路由需要身份验证
    hideInMenu: true // 不在菜单中显示
  },
  children: [
    // 子路由配置
    {
      path: '/redirect/:path', // 动态路径参数
      name: REDIRECT_ROUTE_NAME, // 子路由名称
      component: () => import('@/views/redirect/index.vue'), // 异步导入重定向视图组件
      meta: {
        requiresAuth: true, // 该子路由也需要身份验证
        hideInMenu: true // 不在菜单中显示
      }
    }
  ]
};

// 定义 404 未找到路由
export const NOT_FOUND_ROUTE: RouteRecordRaw = {
  path: '/:pathMatch(.*)*', // 捕获所有未匹配的路径
  name: 'notFound', // 路由名称
  component: () => import('@/views/not-found/index.vue') // 异步导入未找到视图组件
};
