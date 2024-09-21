import { computed } from 'vue';
import type { RouteRecordRaw, RouteRecordNormalized } from 'vue-router';
import { appRoutes } from '@/router/routes';
import usePermission from '@/hooks/usePermission';
import { cloneDeep } from 'lodash';

// 导出一个名为 useMenuTree 的组合式函数
export default function useMenuTree() {
  // 获取权限相关的功能
  const permission = usePermission();

  // 计算属性，返回应用路由的映射
  const appRoute = computed(() => {
    return appRoutes.map(el => {
      const { name, path, meta, redirect, children } = el;
      return {
        name, // 路由名称
        path, // 路由路径
        meta, // 路由元信息
        redirect, // 路由重定向
        children // 子路由
      };
    });
  });

  // 计算属性，生成菜单树
  const menuTree = computed(() => {
    // 深拷贝 appRoute，以避免直接修改原始路由
    const copyRouter = cloneDeep(appRoute.value) as RouteRecordNormalized[];

    // 按照 meta.order 排序路由
    copyRouter.sort((a: RouteRecordNormalized, b: RouteRecordNormalized) => {
      return (a.meta.order || 0) - (b.meta.order || 0);
    });

    // 递归函数，用于遍历路由并构建菜单树
    function travel(_routes: RouteRecordRaw[], layer: number) {
      // 如果没有路由，返回 null
      if (!_routes) return null;

      // 使用 map 遍历路由，并构建菜单项
      const collector: any = _routes.map(element => {
        // 检查访问权限，如果没有访问权限，返回 null
        if (!permission.accessRouter(element)) {
          return null;
        }

        // 如果路由不显示子菜单或没有子路由，初始化 children 为一个空数组
        if (element.meta?.hideChildrenMenu || !element.children) {
          element.children = [];
          return element;
        }

        // 过滤掉 hideInMenu 为 true 的路由
        element.children = element.children.filter(
          x => x.meta?.hideInMenu !== true
        );

        // 递归调用 travel 函数处理子路由
        const subItem = travel(element.children, layer + 1);

        // 如果子路由存在，更新当前路由的 children
        if (subItem.length) {
          element.children = subItem;
          return element;
        }

        // 如果当前层级大于 1，返回元素并保持子路由
        if (layer > 1) {
          element.children = subItem;
          return element;
        }

        // 如果路由的 hideInMenu 为 false，返回当前路由
        if (element.meta?.hideInMenu === false) {
          return element;
        }

        // 默认返回 null，表示该路由不应包含在菜单中
        return null;
      });

      // 过滤掉值为 null 的元素，返回有效的菜单项
      return collector.filter(Boolean);
    }

    // 调用 travel 函数，开始构建菜单树
    return travel(copyRouter, 0);
  });

  // 返回菜单树
  return {
    menuTree
  };
}
