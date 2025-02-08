// 导入 Vue Router 的函数
import { createRouter, createWebHistory } from 'vue-router';
// 导入 NProgress 用于显示加载进度条
import NProgress from 'nprogress';
// 导入 NProgress 的样式
import 'nprogress/nprogress.css';

// 导入应用路由配置
// import { appRoutes } from './routes';
// 导入重定向和未找到路由配置
import { REDIRECT_MAIN, NOT_FOUND_ROUTE } from './routes/base';
// 导入常量，默认路由名称和登录路由名称
import { DEFAULT_ROUTE_NAME, LOGIN_ROUTE_NAME } from './constants';
// 导入路由守卫配置
import createRouteGuard from './guard';
import generateDynamicRoutes from '@/router/routes';

// 配置 NProgress，设置不显示加载指示器
NProgress.configure({ showSpinner: false });
// 创建 Vue Router 实例
let router = createRouter({
  history: createWebHistory(), // 使用 HTML5 的历史模式
  routes: [
    {
      path: '/', // 根路径
      redirect: DEFAULT_ROUTE_NAME // 默认重定向到默认路由
    },
    {
      path: '/login', // 登录路径
      name: LOGIN_ROUTE_NAME, // 登录路由名称
      component: () => import('@/views/login/index.vue'), // 异步导入登录组件
      meta: {
        requiresAuth: false // 登录路由不需要身份验证
      }
    },
    {
      path: '/',
      name: 'Home',
      component: () => import('@/layout/default-layout.vue'),
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
          name: 'Home',
          component: () => import('@/views/workplace/index.vue'),
          meta: {
            activeMenu: 'Home'
          }
        }
      ]
    }
  ],
  scrollBehavior() {
    return { top: 0 }; // 每次路由切换时，滚动到页面顶部
  }
});

//路由拦截
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next();
  } else {
    //获取本地存储的当前用户的菜单权限
    const permissionMenu = JSON.parse(localStorage.getItem('permissionMenu'));
    //拿到侧边栏生成树结果
    const dynamic = generateDynamicRoutes(permissionMenu);

    dynamic.forEach(route => {
      router.addRoute(route);
    });
    // 添加 REDIRECT_MAIN 路由
    router.addRoute(REDIRECT_MAIN);
    // 添加 NOT_FOUND_ROUTE 路由
    router.addRoute(NOT_FOUND_ROUTE);

    //动态处理路由
    next();
  }
});

// export function restRouter() {
//   router = createRouter({
//     history: createWebHistory(), // 使用 HTML5 的历史模式
//     routes: [
//       {
//         path: '/', // 根路径
//         redirect: DEFAULT_ROUTE_NAME // 默认重定向到默认路由
//       },
//       {
//         path: '/login', // 登录路径
//         name: LOGIN_ROUTE_NAME, // 登录路由名称
//         component: () => import('@/views/login/index.vue'), // 异步导入登录组件
//         meta: {
//           requiresAuth: false // 登录路由不需要身份验证
//         }
//       },
//       REDIRECT_MAIN, // 引入重定向路由配置
//       NOT_FOUND_ROUTE // 引入未找到路由配置
//     ],
//     scrollBehavior() {
//       return { top: 0 }; // 每次路由切换时，滚动到页面顶部
//     }
//   });
// }

// 设置路由守卫
createRouteGuard(router);

// 导出 router 实例
export default router;
