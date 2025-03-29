<script lang="tsx">
import { defineComponent, ref, h, compile, computed } from 'vue';
import { useRoute, useRouter, RouteRecordRaw } from 'vue-router';
import type { RouteMeta } from 'vue-router';
import { useAppStore } from '@/store';
import { listenerRouteChange } from '@/utils/route-listener';
import { openWindow, regexUrl } from '@/utils';
import useMenuTree from './useMenuTree';

// 定义一个 Vue 组件
export default defineComponent({
  emit: ['collapse'], // 声明该组件可以发出 'collapse' 事件
  setup() {
    // 获取应用状态管理的 store
    const appStore = useAppStore();

    // 获取路由实例
    const router = useRouter();

    // 获取当前路由实例
    const route = useRoute();

    // 使用自定义组合式函数获取菜单树
    const { menuTree } = useMenuTree();

    // 定义一个计算属性 collapsed，用于控制菜单的折叠状态
    const collapsed = computed({
      get() {
        // 根据设备类型返回菜单的折叠状态
        if (appStore.device === 'desktop') return appStore.menuCollapse;
        return false; // 移动设备上不折叠菜单
      },
      set(value: boolean) {
        // 更新应用状态中的菜单折叠设置
        appStore.updateSettings({ menuCollapse: value });
      }
    });

    const topMenu = computed(() => appStore.topMenu);
    const openKeys = ref<string[]>([]);
    const selectedKey = ref<string[]>([]);

    const goto = (item: RouteRecordRaw) => {
      // 打开外部链链接 (Open external link)
      if (regexUrl.test(item.path)) {
        openWindow(item.path);
        selectedKey.value = [item.name as string];
        return;
      }
      // 消除外部链副作用(Eliminate external link side effects)
      const { hideInMenu, activeMenu } = item.meta as RouteMeta;
      if (route.name === item.name && !hideInMenu && !activeMenu) {
        selectedKey.value = [item.name as string];
        return;
      }
      // 触发路由更改(Trigger router change)
      router.push({
        name: item.name
      });
    };
    const findMenuOpenKeys = (target: string) => {
      const result: string[] = [];
      let isFind = false;
      const backtrack = (item: RouteRecordRaw, keys: string[]) => {
        if (item.name === target) {
          isFind = true;
          result.push(...keys);
          return;
        }
        if (item.children?.length) {
          item.children?.forEach(el => {
            backtrack(el, [...keys, el.name as string]);
          });
        }
      };
      menuTree.value?.forEach((el: RouteRecordRaw) => {
        if (isFind) return; // (性能优化)Performance optimization
        backtrack(el, [el.name as string]);
      });
      return result;
    };
    listenerRouteChange(newRoute => {
      const { requiresAuth, activeMenu, hideInMenu } = newRoute.meta;
      if (requiresAuth && (!hideInMenu || activeMenu)) {
        const menuOpenKeys = findMenuOpenKeys(
          (activeMenu || newRoute.name) as string
        );

        const keySet = new Set([...menuOpenKeys, ...openKeys.value]);
        openKeys.value = [...keySet];

        selectedKey.value = [
          activeMenu || menuOpenKeys[menuOpenKeys.length - 1]
        ];
      }
    }, true);
    const setCollapse = (val: boolean) => {
      if (appStore.device === 'desktop')
        appStore.updateSettings({ menuCollapse: val });
    };

    const renderSubMenu = () => {
      function travel(_route: RouteRecordRaw[], nodes = []) {
        if (_route) {
          _route?.forEach(element => {
            // (这是一个demo,可以根据需要修改节点)This is demo, modify nodes as needed
            const icon = element?.meta?.icon
              ? () => h(compile(`<${element?.meta?.icon}/>`))
              : null;
            const node =
              element?.children && element?.children.length !== 0 ? (
                <a-sub-menu
                  key={element?.name}
                  v-slots={{
                    icon,
                    title: () => h(compile(element?.meta?.locale || ''))
                  }}
                >
                  {travel(element?.children)}
                </a-sub-menu>
              ) : (
                <a-menu-item
                  key={element?.name}
                  v-slots={{ icon }}
                  onClick={() => goto(element)}
                >
                  {element?.meta?.locale || ''}
                </a-menu-item>
              );
            nodes.push(node as never);
          });
        }
        return nodes;
      }
      return travel(menuTree.value);
    };

    return () => (
      <a-menu
        // 设置菜单的模式，根据 topMenu 的值决定是水平还是垂直排列
        mode={topMenu.value ? 'horizontal' : 'vertical'}
        // 绑定 collapsed 状态，用于控制菜单的折叠状态
        v-model:collapsed={collapsed.value}
        // 绑定 open-keys，用于控制打开的子菜单
        v-model:open-keys={openKeys.value}
        // 仅在设备不是移动端时显示折叠按钮
        show-collapse-button={appStore.device !== 'mobile'}
        // 自动打开的功能设置为 false
        auto-open={false}
        // 绑定选中的菜单项的键，用于高亮显示
        selected-keys={selectedKey.value}
        // 选中项时自动打开子菜单
        auto-open-selected={true}
        // 设置子菜单的缩进间距
        level-indent={34}
        // 监听菜单的折叠事件，调用 setCollapse 方法
        onCollapse={setCollapse}
      >
        {/* 渲染子菜单内容 */}
        {renderSubMenu()}
      </a-menu>
    );
  }
});
</script>

<style lang="less" scoped>
:deep(.arco-menu-inner) {
  .arco-menu-inline-header {
    display: flex;
    align-items: center;
  }

  .arco-icon {
    &:not(.arco-icon-down) {
      font-size: 18px;
    }
  }
}
</style>
