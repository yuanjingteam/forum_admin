// 导入默认布局组件
import { DEFAULT_LAYOUT } from '../base';
// 导入路由类型定义
import type { AppRouteRecordRaw } from '../types';

// 定义仪表盘路由的配置
const DASHBOARD: AppRouteRecordRaw = {
  path: '/', // 路由路径
  name: 'Home', // 路由名称
  component: DEFAULT_LAYOUT, // 使用默认布局作为容器
  redirect: '/workplace', // 访问根路径时重定向到工作台
  meta: {
    locale: '工作台', // 路由的语言描述
    requiresAuth: true, // 该路由需要身份验证
    hideChildrenMenu: true, // 不在菜单中显示子路由
    icon: 'icon-dashboard', // 路由图标
    order: 0 // 路由的显示顺序
  },
  children: [
    // 子路由配置
    {
      path: '/workplace', // 子路由路径
      name: 'Workplace', // 子路由名称
      component: () => import('@/views/workplace/index.vue'), // 异步导入工作台组件
      meta: {
        activeMenu: 'Home' // 当前激活的菜单项
      }
    }
  ]
};

// 导出仪表盘路由配置
export default DASHBOARD;
