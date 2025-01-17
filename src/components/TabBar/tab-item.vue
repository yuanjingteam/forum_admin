<template>
  <a-dropdown
    trigger="contextMenu"
    :popup-max-height="false"
    @select="actionSelect"
  >
    <span
      class="arco-tag arco-tag-size-medium arco-tag-checked"
      :class="{ 'link-activated': itemData.fullPath === $route.fullPath }"
      @click="goto(itemData)"
    >
      <span class="tag-link">
        {{ itemData.title }}
      </span>
      <span
        class="arco-icon-hover arco-tag-icon-hover arco-icon-hover-size-medium arco-tag-close-btn"
        @click.stop="tagClose(itemData, index)"
      >
        <icon-close />
      </span>
    </span>
    <template #content>
      <a-doption :disabled="disabledReload" :value="Eaction.reload">
        <icon-refresh />
        <span>重新加载</span>
      </a-doption>
      <a-doption
        class="sperate-line"
        :disabled="disabledCurrent"
        :value="Eaction.current"
      >
        <icon-close />
        <span>关闭当前标签页</span>
      </a-doption>
      <a-doption :disabled="disabledLeft" :value="Eaction.left">
        <icon-to-left />
        <span>关闭左侧标签页</span>
      </a-doption>
      <a-doption
        class="sperate-line"
        :disabled="disabledRight"
        :value="Eaction.right"
      >
        <icon-to-right />
        <span>关闭右侧标签页</span>
      </a-doption>
      <a-doption :value="Eaction.others">
        <icon-swap />
        <span>关闭其它标签页</span>
      </a-doption>
      <a-doption :value="Eaction.all">
        <icon-folder-delete />
        <span>关闭全部标签页</span>
      </a-doption>
    </template>
  </a-dropdown>
</template>

<script lang="ts" setup>
import { PropType, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTabBarStore } from '@/store';
import type { TagProps } from '@/store/modules/tab-bar/types';
import { DEFAULT_ROUTE_NAME, REDIRECT_ROUTE_NAME } from '@/router/constants';

enum Eaction {
  reload = 'reload',
  current = 'current',
  left = 'left',
  right = 'right',
  others = 'others',
  all = 'all'
}

const props = defineProps({
  itemData: {
    type: Object as PropType<TagProps>,
    default() {
      return [];
    }
  },
  index: {
    type: Number,
    default: 0
  }
});

const router = useRouter();
const route = useRoute();
const tabBarStore = useTabBarStore();
// 跳转到指定标签对应的路由
const goto = (tag: TagProps) => {
  router.push({ ...tag }); // 使用 router.push 方法导航到标签的路由
};

// 计算属性，获取标签列表
const tagList = computed(() => {
  return tabBarStore.getTabList; // 从状态管理中获取标签列表
});

// 计算属性，判断是否允许重新加载
const disabledReload = computed(() => {
  // 如果当前路由的完整路径与 itemData 的路径不相同，则允许重新加载
  return props.itemData.fullPath !== route.fullPath;
});

// 计算属性，判断当前标签是否为第一个标签
const disabledCurrent = computed(() => {
  return props.index === 0; // 如果索引为 0，返回 true，表示当前标签是第一个
});

// 计算属性，判断是否可以向左移动标签
const disabledLeft = computed(() => {
  // 如果索引为 0 或 1，返回 true，表示不能向左移动
  return [0, 1].includes(props.index);
});

// 计算属性，判断是否可以向右移动标签
const disabledRight = computed(() => {
  // 如果当前索引是标签列表的最后一个，返回 true，表示不能向右移动
  return props.index === tagList.value.length - 1;
});

// 关闭标签的处理函数
const tagClose = (tag: TagProps, idx: number) => {
  tabBarStore.deleteTag(idx, tag); // 从状态管理中删除指定标签
  // 如果关闭的标签是当前路由对应的标签
  if (props.itemData.fullPath === route.fullPath) {
    const latest = tagList.value[idx - 1]; // 获取队列中前一个标签
    router.push({ name: latest.name }); // 导航到前一个标签
  }
};

// 查找当前路由在标签列表中的索引
const findCurrentRouteIndex = () => {
  // 返回当前路由的索引，如果找不到则返回 -1
  return tagList.value.findIndex(el => el.fullPath === route.fullPath);
};
// 处理标签操作的异步函数
const actionSelect = async (value: any) => {
  const { itemData, index } = props; // 解构 props，获取当前标签的数据和索引
  const copyTagList = [...tagList.value]; // 创建当前标签列表的副本，以便进行修改

  // 判断用户选择的操作类型
  if (value === Eaction.current) {
    // 如果选择的是“关闭当前标签”
    tagClose(itemData, index); // 调用 tagClose 函数关闭当前标签
  } else if (value === Eaction.left) {
    // 如果选择的是“向左移动标签”
    const currentRouteIdx = findCurrentRouteIndex(); // 找到当前路由在标签列表中的索引
    copyTagList.splice(1, props.index - 1); // 从第二个标签开始删除到当前索引之前的标签

    tabBarStore.freshTabList(copyTagList); // 更新标签列表
    // 如果当前路由的索引小于被关闭标签的索引，则导航到当前标签
    if (currentRouteIdx < index) {
      router.push({ name: itemData.name });
    }
  } else if (value === Eaction.right) {
    // 如果选择的是“向右移动标签”
    const currentRouteIdx = findCurrentRouteIndex(); // 找到当前路由在标签列表中的索引
    copyTagList.splice(props.index + 1); // 从当前索引的下一个标签开始删除到最后的标签

    tabBarStore.freshTabList(copyTagList); // 更新标签列表
    // 如果当前路由的索引大于被关闭标签的索引，则导航到当前标签
    if (currentRouteIdx > index) {
      router.push({ name: itemData.name });
    }
  } else if (value === Eaction.others) {
    // 如果选择的是“保留当前标签和第一个标签”
    const filterList = tagList.value.filter((_el, idx) => {
      return idx === 0 || idx === props.index; // 仅保留第一个标签和当前标签
    });
    tabBarStore.freshTabList(filterList); // 更新标签列表
    router.push({ name: itemData.name }); // 导航到当前标签
  } else if (value === Eaction.reload) {
    // 如果选择的是“重新加载标签”
    tabBarStore.deleteCache(itemData); // 删除当前标签的缓存
    await router.push({
      name: REDIRECT_ROUTE_NAME, // 导航到重定向路由
      params: {
        path: route.fullPath // 传递当前路由的完整路径作为参数
      }
    });
    tabBarStore.addCache(itemData.name); // 将当前标签的名称添加到缓存
  } else {
    // 默认操作：重置标签列表
    tabBarStore.resetTabList(); // 重置标签列表为默认状态
    router.push({ name: DEFAULT_ROUTE_NAME }); // 导航到默认路由
  }
};
</script>

<style scoped lang="less">
.tag-link {
  color: var(--color-text-2);
  text-decoration: none;
}

.link-activated {
  color: rgb(var(--link-6));

  .tag-link {
    color: rgb(var(--link-6));
  }

  & + .arco-tag-close-btn {
    color: rgb(var(--link-6));
  }
}

:deep(.arco-dropdown-option-content) {
  span {
    margin-left: 10px;
  }
}

.arco-dropdown-open {
  .tag-link {
    color: rgb(var(--danger-6));
  }

  .arco-tag-close-btn {
    color: rgb(var(--danger-6));
  }
}

.sperate-line {
  border-bottom: 1px solid var(--color-neutral-3);
}
</style>
