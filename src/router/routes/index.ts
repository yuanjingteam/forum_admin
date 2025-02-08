function getViews(path) {
  // 首先把你需要动态路由的组件地址全部获取
  let modules = import.meta.glob('./modules/*.ts', { eager: true });
  // 然后动态路由的时候这样来取
  return modules[`@/views${path}.vue`];
}
// function getLayout(path) {
//   let modules = import.meta.glob('../../layout/default-layout.vue');
//   // 然后动态路由的时候这样来取
//   return modules[`@/views${path}.vue`];
// }

export default function generateDynamicRoutes(data) {
  debugger;

  const map = new Map();
  const routes = [];

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
            component: getViews(child.component_path),
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
              component: () => getViews(item.component_path),
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

  // routes.push({
  //   path: '/',
  //   name: 'Home',
  //   component: () => import('@/layout/default-layout.vue'),
  //   redirect: '/workplace',
  //   meta: {
  //     locale: '工作台',
  //     requiresAuth: true,
  //     hideChildrenMenu: true,
  //     icon: 'icon-dashboard',
  //     order: 0
  //   },
  //   children: [
  //     {
  //       path: '/workplace',
  //       name: 'Home',
  //       component: () => getViews('/workplace/index'),
  //       meta: {
  //         activeMenu: 'Home'
  //       }
  //     }
  //   ]
  // });
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
