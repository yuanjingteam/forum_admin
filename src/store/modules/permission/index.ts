import { defineStore } from 'pinia';
// import { ref } from 'vue';
import router from '@/router';

export const usePermissionNavStore = defineStore('permissionNav', () => {
  // const permissionNav = ref([]);
  // function setPermissionNav(data) {
  //   permissionNav.value = data;
  // }

  function formatRoutes(permissionNav) {
    const result = [];
    const allowedNames = JSON.parse(localStorage.getItem('permissionMenu'));
    // 遍历模块列表
    permissionNav.forEach(route => {
      // 检查当前路由或其子路由是否包含在允许的名称数组中
      if (allowedNames?.includes(route.name)) {
        // 如果当前路由名称允许，直接添加
        result.push(route);
      } else if (route.children) {
        // 如果当前路由名称不允许，但有子路由，检查子路由
        route.children = route.children.filter(child =>
          allowedNames?.includes(child.name)
        );
        // 如果子路由中有允许的项，则保留当前路由
        if (route.children.length > 0) {
          result.push(route);
        }
      }
    });
    // 添加动态路由
    result.forEach(route => {
      router.addRoute(route); // 为每个路由调用 addRoute
    });
  }
  return { formatRoutes };
});
