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
// import generateDynamicRoutes from '@/router/routes';
import { useUserStore } from '@/store';
// 定义静态映射
const componentMap = {
  '/userManager/index': () => import('../views/userManager/index.vue'),
  '/articleManager/index': () => import('../views/articleManager/index.vue'),
  '/commentMgr/index': () => import('../views/commentMgr/index.vue'),
  '/tagMgr/index': () => import('../views/tagMgr/index.vue'),
  '/dictionaryMgr/index': () => import('../views/dictionaryMgr/index.vue'),
  '/acl/role/index': () => import('../views/acl/role/index.vue'),
  '/acl/menu/index': () => import('../views/acl/menu/index.vue'),
  '/acl/apiManage/index': () => import('../views/acl/apiManage/index.vue'),
  '/result/success/index': () => import('../views/result/success/index.vue'),
  '/result/error/index': () => import('../views/result/error/index.vue'),
  '/user/info/index': () => import('../views/user/info/index.vue'),
  '/exception/403/index': () => import('../views/exception/403/index.vue'),
  '/exception/404/index': () => import('../views/exception/404/index.vue'),
  '/exception/500/index': () => import('../views/exception/500/index.vue')
};

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
  if (from.path === '/' || to.path === '/login') {
    next();
  } else {
    const userStore = useUserStore();

    if (!userStore.isRoles) {
      //获取本地存储的当前用户的菜单权限
      const permissionMenu = JSON.parse(localStorage.getItem('permissionMenu'));

      const map = new Map();
      const routes = [];

      // 首先将所有节点存入 map
      permissionMenu.forEach(item => {
        map.set(item.id, { ...item, children: [] });
      });

      // 构建树结构
      permissionMenu.forEach(item => {
        if (item.pid !== 0) {
          const parent = map.get(item.pid);
          if (parent) {
            parent.children.push(map.get(item.id));
          }
        }
      });

      // 生成路由配置
      map.forEach(item => {
        if (item.pid === 0) {
          if (item.children.length > 0) {
            // 有子菜单的情况
            routes.push({
              path: item.route_path,
              name: item.route_name,
              component: () => import('@/layout/default-layout.vue'),
              meta: {
                locale: item.name,
                icon: item.icon,
                order: item.sort,
                requiresAuth: true,
                hideChildrenMenu: false
              },
              children: item.children.map(child => ({
                path: child.route_path,
                name: child.route_name,
                component: componentMap[child.component_path],
                meta: {
                  locale: child.name,
                  requiresAuth: true
                }
              }))
            });
          } else {
            // 无子菜单的情况
            routes.push({
              path: item.route_path,
              name: item.route_name,
              redirect: item.route_path,
              component: () => import('@/layout/default-layout.vue'),
              meta: {
                locale: item.name,
                icon: item.icon,
                order: item.sort,
                requiresAuth: true,
                hideChildrenMenu: true
              },
              children: [
                {
                  path: item.route_path,
                  name: item.route_name,
                  component: componentMap[item.component_path],
                  meta: {
                    activeMenu: item.route_name,
                    requiresAuth: true
                  }
                }
              ]
            });
          }
        }
      });
      //拿到侧边栏生成树结果
      routes.forEach(route => {
        router.addRoute(route);
      });
      // 添加 REDIRECT_MAIN 路由
      router.addRoute(REDIRECT_MAIN);
      // 添加 NOT_FOUND_ROUTE 路由
      router.addRoute(NOT_FOUND_ROUTE);

      userStore.changeRole();
      //动态处理路由
      next(to.path);
    } else {
      next();
    }
  }
});

// 设置路由守卫
createRouteGuard(router);

// 导出 router 实例
export default router;
