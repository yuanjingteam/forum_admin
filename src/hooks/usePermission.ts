import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/store';

export default function usePermission() {
  const userStore = useUserStore();
  return {
    accessRouter(route: RouteLocationNormalized | RouteRecordRaw) {
      return (
        // 检查是否不需要认证
        !route.meta?.requiresAuth ||
        // 或者该路由没有角色限制
        !route.meta?.roles ||
        // 或者该路由的角色限制包含通配符 '*'
        route.meta?.roles?.includes('*') ||
        // 或者该路由的角色限制包含当前用户的角色
        route.meta?.roles?.includes(userStore.role)
      );
    },
    findFirstPermissionRoute(_routers: any, role = 'admin') {
      // 创建一个路由的副本，以避免修改原始路由数组
      const cloneRouters = [..._routers];

      // 当副本路由数组不为空时，继续处理
      while (cloneRouters.length) {
        // 从副本数组中取出第一个路由
        const firstElement = cloneRouters.shift();

        // 检查该路由的 meta.roles 是否包含当前角色或通配符 '*'
        if (
          firstElement?.meta?.roles?.find((el: string[]) => {
            return el.includes('*') || el.includes(role);
          })
        )
          // 如果找到符合条件的路由，返回该路由的名称
          return { name: firstElement.name };

        // 如果该路由有子路由，则将子路由添加到副本数组中
        if (firstElement?.children) {
          cloneRouters.push(...firstElement.children);
        }
      }
      // 如果没有找到符合条件的路由，返回 null
      return null;
    }
    // You can add any rules you want
  };
}
