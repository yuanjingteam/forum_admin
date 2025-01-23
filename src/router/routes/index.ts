// 导入 Vue Router 的类型定义
import type { RouteRecordNormalized } from 'vue-router';

// 使用 glob API 动态导入指定目录下的所有模块
const modules = import.meta.glob('./modules/*.ts', { eager: true });

localStorage.setItem(
  'permissionMenu',
  JSON.stringify([
    'Workplace',
    'userManager',
    'Acl',
    'Role',
    'article',
    'dictionaryMgr',
    'commentMgr',
    'tagMgr',
    'user',
    'Info',
    'Api',
    'Menu'
  ])
);

// 定义允许的路由名称数组
const allowedNames = JSON.parse(localStorage.getItem('permissionMenu'));

// 定义一个函数 formatModules，用于格式化导入的路由模块
function formatModules(
  _modules: any,
  result: RouteRecordNormalized[]
): RouteRecordNormalized[] {
  // 遍历所有导入的模块
  Object.keys(_modules).forEach(key => {
    // 获取模块的默认导出
    const defaultModule = _modules[key].default;
    // 如果模块没有默认导出，直接返回
    if (!defaultModule) return;

    // 将默认导出转换为数组，以便统一处理
    const moduleList = Array.isArray(defaultModule)
      ? [...defaultModule] // 如果已经是数组，复制一份
      : [defaultModule]; // 如果不是，包装成数组

    //实现路由权限管理，渲染侧边栏
    // 遍历模块列表
    moduleList.forEach(route => {
      // 检查当前路由或其子路由是否包含在允许的名称数组中
      if (allowedNames?.includes(route.name as string)) {
        // 如果当前路由名称允许，直接添加
        result.push(route);
      } else if (route.children) {
        // 如果当前路由名称不允许，但有子路由，检查子路由
        route.children = route.children.filter(child =>
          allowedNames?.includes(child.name as string)
        );
        // 如果子路由中有允许的项，则保留当前路由
        if (route.children.length > 0) {
          result.push(route);
        }
      }
    });
  });

  // 返回格式化后的结果数组
  return result;
}

// 导出格式化后的应用路由数组
export const appRoutes: RouteRecordNormalized[] = formatModules(modules, []);

// 动态路由加载
// 模块化路由: 通过动态导入多个路由模块，您可以将路由逻辑分散到多个文件中，使代码结构更加清晰和可维护。
// 按需加载: 仅在需要时加载特定的路由模块，可以提高应用程序的性能，减少初始加载时间。
// 2. 统一的路由结构
// 格式化统一: formatModules 函数确保所有导入的路由模块具有统一的格式，这样后续处理（如添加守卫、权限检查等）就会变得简单。
// 便于扩展: 随着应用程序的扩展，可以方便地添加新的路由模块，只需在./ modules / 目录中添加新文件，自动纳入路由配置。
// 3. 集中管理
// 集中路由配置: appRoutes 提供了一个集中管理应用路由的方式。其他部分的代码（如路由器实例）可以直接使用这个数组来配置路由。
// 提高可读性: 将所有路由定义集中在一个地方，便于开发者快速了解应用程序的路由结构。
// 4. 支持路由元信息
// 附加元信息: 在不同的路由模块中可以定义各自的元信息（如 requiresAuth、hideInMenu），这些信息可以用于路由守卫、菜单生成等逻辑。
// 5. 灵活性和可维护性
// 便于维护: 分散的路由模块使得管理和维护变得更加容易，开发者可以专注于各自的功能模块，而不必担心整个路由文件。
// 团队协作: 在团队开发中，不同的开发者可以独立工作在不同的路由模块上，减少冲突。
// 示例
// 假设您在./ modules / 目录中有以下文件：

// userRoutes.ts
// adminRoutes.ts
// productRoutes.ts
// 每个文件定义了一组相关的路由，最终通过 appRoutes 组合成一个完整的路由配置供 Vue Router 使用。
