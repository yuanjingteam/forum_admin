// 导入 Vue Router 类型
import type { Router, LocationQueryRaw } from 'vue-router';
// 导入 NProgress 用于显示加载进度条
import NProgress from 'nprogress'; // progress bar

// 导入用户状态管理
import { useUserStore } from '@/store';
// 导入登录状态检查函数
import { isLogin } from '@/utils/auth';
// 导入常量，默认路由名称和登录路由名称
import { DEFAULT_ROUTE_NAME, LOGIN_ROUTE_NAME } from '@/router/constants';

// 导出一个函数 setupUserLoginInfoGuard，用于设置用户登录信息守卫
export default function setupUserLoginInfoGuard(router: Router) {
  // 在每次路由切换前执行的钩子
  router.beforeEach(async (to, _from, next) => {
    // 开始 NProgress 进度条
    NProgress.start();
    // 获取用户状态管理
    const userStore = useUserStore();

    // 检查用户是否已登录
    if (isLogin()) {
      console.log("已经登录");

      // 如果用户已登录且角色存在，继续路由导航
      if (userStore.id) {
        console.log(111);
        next();
      } else {
        try {
          // 如果角色不存在，获取用户信息
          await userStore.info();
          next(); // 获取成功后继续路由导航
        } catch (error) {
          // 如果获取用户信息失败，执行登出操作
          await userStore.logout();
          // 导航到登录页面，并携带重定向信息
          next({
            name: LOGIN_ROUTE_NAME,
            query: {
              redirect: to.name, // 重定向到原目标路由
              ...to.query // 保留原查询参数
            } as LocationQueryRaw
          });
        }
      }
    } else {
      // 如果用户未登录
      if (to.name === LOGIN_ROUTE_NAME) {
        next(); // 如果目标路由是登录页面，直接导航
        return;
      }

      // 创建查询参数，准备重定向到登录页面
      let query: LocationQueryRaw = { ...to.query };
      // 如果目标路由不是默认路由，添加重定向信息
      if (to.name !== DEFAULT_ROUTE_NAME) {
        query.redirect = to.name as string; // 保存当前路由名称
      }
      // 导航到登录页面，并携带查询参数
      next({ name: LOGIN_ROUTE_NAME, query });
    }
  });
}
