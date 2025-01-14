// 导入 Vue Router 类型
import type { Router } from 'vue-router';
// 导入 NProgress 用于显示加载进度条
import NProgress from 'nprogress';

// 导入权限钩子
import usePermission from '@/hooks/usePermission';
// 导入用户状态管理
import { useUserStore } from '@/store';
// 导入应用路由配置
import { appRoutes } from '../routes';
// 导入常量 NOT_FOUND
import { NOT_FOUND } from '../constants';

// 导出一个函数 setupPermissionGuard，用于设置权限守卫
export default function setupPermissionGuard(router: Router) {
  // 在每次路由切换前执行的钩子
  router.beforeEach(async (to, _from, next) => {
    // 获取用户状态管理
    const userStore = useUserStore();
    // 获取权限钩子
    const Permission = usePermission();
    // 检查用户是否有权限访问目标路由
    const permissionsAllow = Permission.accessRouter(to);

    if (permissionsAllow) {
      // 如果有权限，继续路由导航
      next();
    } else {
      // // 如果没有权限，查找用户角色可以访问的第一个路由
      // const destination =
      //   Permission.findFirstPermissionRoute(appRoutes, userStore.role_ids[0]) ||
      //   NOT_FOUND; // 如果找不到，使用 NOT_FOUND 常量
      // next(destination); // 导航到找到的路由
    }

    // 完成进度条
    NProgress.done();
  });
}
