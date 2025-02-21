import { createApp } from 'vue';
import store from './store';

import globalComponents from '@/components';
import router from './router';
import directive from './directive';
import './mock';
import App from './App.vue';
import '@/assets/style/global.less';
import '@/api/interceptor';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import '@arco-design/web-vue/es/message/style/index.less';
import '@arco-design/web-vue/es/notification/style/index.less';
import '@arco-design/web-vue/es/modal/style/index.less';

import { initVChartArcoTheme } from '@visactor/vchart-arco-theme';
initVChartArcoTheme();

const app = createApp(App);

const componentMap = {
  '/userManager/index': () => import('./views/userManager/index.vue'),
  '/managerMgr/index': () => import('./views/managerMgr/index.vue'),
  '/articleManager/index': () => import('./views/articleManager/index.vue'),
  '/commentMgr/index': () => import('./views/commentMgr/index.vue'),
  '/tagMgr/index': () => import('./views/tagMgr/index.vue'),
  '/dictionaryMgr/index': () => import('./views/dictionaryMgr/index.vue'),
  '/acl/role/index': () => import('./views/acl/role/index.vue'),
  '/acl/menu/index': () => import('./views/acl/menu/index.vue'),
  '/acl/apiManage/index': () => import('./views/acl/apiManage/index.vue'),
  '/result/success/index': () => import('./views/result/success/index.vue'),
  '/result/error/index': () => import('./views/result/error/index.vue'),
  '/exception/403/index': () => import('./views/exception/403/index.vue'),
  '/exception/404/index': () => import('./views/exception/404/index.vue'),
  '/exception/500/index': () => import('./views/exception/500/index.vue'),
  '/managerMgr/index': () => import('./views/managerMgr/index.vue')
};

//获取本地存储的当前用户的菜单权限
const permissionMenuLocal = localStorage.getItem('permissionMenu');

const map = new Map();
const routes = [];

if (permissionMenuLocal) {
  const permissionMenu = JSON.parse(permissionMenuLocal);
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
}

app.use(store);
app.use(router);
app.use(ArcoVueIcon);
app.use(globalComponents);
app.use(directive);

app.mount('#app');
