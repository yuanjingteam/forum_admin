// 导入 Vue Router 类型
import type { Router } from 'vue-router';
// 导入设置路由变化监听器的函数
import { setRouteEmitter } from '@/utils/route-listener';
// 导入用户登录信息守卫的设置函数
import setupUserLoginInfoGuard from './userLoginInfo';
// 导入权限守卫的设置函数
import setupPermissionGuard from './permission';

// 定义一个函数 setupPageGuard，用于设置页面级路由守卫
function setupPageGuard(router: Router) {
  // 在每次路由切换前执行的钩子
  router.beforeEach(async to => {
    // 触发路由变化事件，传递目标路由对象
    setRouteEmitter(to);
  });
}

// 导出一个函数 createRouteGuard，用于创建路由守卫
export default function createRouteGuard(router: Router) {
  // 设置页面级路由守卫
  setupPageGuard(router);
  // 设置用户登录信息守卫
  setupUserLoginInfoGuard(router);
  // 设置权限守卫
  setupPermissionGuard(router);
}
