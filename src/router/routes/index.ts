export default function generateDynamicRoutes(data) {
  const map = new Map();
  const routes = [];
  // 定义静态映射
  const componentMap = {
    '/userManager/index': () => import('../../views/userManager/index.vue'),
    '/articleManager/index': () =>
      import('../../views/articleManager/index.vue'),
    '/commentMgr/index': () => import('../../views/commentMgr/index.vue'),
    '/tagMgr/index': () => import('../../views/tagMgr/index.vue'),
    '/dictionaryMgr/index': () => import('../../views/dictionaryMgr/index.vue'),
    '/acl/role/index': () => import('../../views/acl/role/index.vue'),
    '/acl/menu/index': () => import('../../views/acl/menu/index.vue'),
    '/acl/apiManage/index': () => import('../../views/acl/apiManage/index.vue'),
    '/result/success/index': () =>
      import('../../views/result/success/index.vue'),
    '/result/error/index': () => import('../../views/result/error/index.vue'),
    '/exception/403/index': () => import('../../views/exception/403/index.vue'),
    '/exception/404/index': () => import('../../views/exception/404/index.vue'),
    '/exception/500/index': () => import('../../views/exception/500/index.vue'),
    '/managerMgr/index': () => import('../../views/managerMgr/index.vue')
  };

  // 首先将所有节点存入 map
  data.forEach(item => {
    map.set(item.id, { ...item, children: [] });
  });

  // 构建树结构
  data.forEach(item => {
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
          component: () => import('../../layout/default-layout.vue'),
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
          component: () => import('../../layout/default-layout.vue'),
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

  routes.push({
    path: '/',
    name: 'Home',
    component: () => import('../../layout/default-layout.vue'),
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
  });
  console.log(routes, 'routes');

  return routes;
}

//测试数据
// const data = [
//   {
//     id: 1,
//     pid: 0,
//     route_name: 'Acl',
//     name: '权限管理',
//     icon: 'icon-desktop',
//     sort: 2,
//     route_path: '/acl',
//     component_path: ''
//   },
//   {
//     id: 2,
//     pid: 1,
//     route_name: 'Role',
//     name: '角色管理',
//     icon: '',
//     sort: 0,
//     route_path: 'role',
//     component_path: '/acl/role/index'
//   },
//   ,
//   {
//     id: 3,
//     pid: 1,
//     route_name: 'Menu',
//     name: '菜单管理',
//     icon: '',
//     sort: 0,
//     route_path: 'menu',
//     component_path: '/acl/menu/index'
//   },
//   {
//     id: 4,
//     pid: 1,
//     route_name: 'Api',
//     name: 'api管理',
//     icon: '',
//     sort: 0,
//     route_path: 'api',
//     component_path: '/acl/api/index'
//   },
//   {
//     id: 5,
//     pid: 0,
//     route_name: 'comment',
//     name: '评论管理',
//     icon: 'icon-list',
//     sort: 1,
//     route_path: '/comment',
//     component_path: '/commentMgr/index'
//   }
// ];
//数据模板
//pid-0但children.length！==0
// const hasChildrenMenu = {
//   id: 'id',
//   path: 'route_path',
//   name: 'route_name',
//   component: () => import('@/layout/default-layout.vue'),
//   meta: {
//     locale: 'name',
//     icon: 'icon',
//     order: 'sort',
//     requiresAuth: true,
//     hideChildrenMenu: false
//   }
// };

// //pid==0且children.length==0
// const singleMenu = {
//   id: 'id',
//   path: 'route_path',
//   name: 'route_name',
//   redirect: 'route_path',
//   component: () => import('@/layout/default-layout.vue'),
//   meta: {
//     locale: 'name',
//     icon: 'icon',
//     order: 'sort',
//     requiresAuth: true,
//     hideChildrenMenu: true
//   },
//   children: [
//     {
//       path: 'route_path',
//       name: 'route_name',
//       // component: () => import('@/views${component_path}.vue')
//       meta: {
//         activeMenu: 'route_name',
//         requiresAuth: true
//       }
//     }
//   ]
// };

// //pid!==0,作为孩子
// const childrenMenu = {
//   path: 'route_path',
//   name: 'route_name',
//   // component: () => import('@/views${component_path}.vue')
//   meta: {
//     locale: 'name',
//     requiresAuth: true
//   }
// };
