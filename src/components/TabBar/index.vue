<template>
  <div class="tab-bar-container">
    <a-affix ref="affixRef" :offset-top="offsetTop">
      <div class="tab-bar-box">
        <div class="tab-bar-scroll">
          <div class="tags-wrap">
            <tab-item
              v-for="(tag, index) in tagList"
              :key="tag.fullPath"
              :index="index"
              :item-data="tag"
            />
          </div>
        </div>
        <div class="tag-bar-operation"></div>
      </div>
    </a-affix>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onUnmounted } from 'vue';
import type { RouteLocationNormalized } from 'vue-router';
import {
  listenerRouteChange,
  removeRouteListener
} from '@/utils/route-listener';
import { useAppStore, useTabBarStore } from '@/store';
import tabItem from './tab-item.vue';
// 使用状态管理 Store 获取应用和标签栏的状态
const appStore = useAppStore(); // 获取应用状态管理的 Store 实例
const tabBarStore = useTabBarStore(); // 获取标签栏状态管理的 Store 实例

// 创建一个引用，用于存储 affix 组件的引用
const affixRef = ref();

// 计算属性，获取当前标签列表
const tagList = computed(() => {
  return tabBarStore.getTabList; // 从标签栏 Store 获取标签列表
});

// 计算属性，设置顶部偏移量
const offsetTop = computed(() => {
  return appStore.navbar ? 60 : 0; // 如果存在导航栏，返回 60，否则返回 0
});

// 观察 appStore 中的 navbar 属性变化
watch(
  () => appStore.navbar, // 监视 navbar 的变化
  () => {
    affixRef.value.updatePosition(); // 当导航栏变化时，更新 affix 组件的位置
  }
);

// 监听路由变化
listenerRouteChange((route: RouteLocationNormalized) => {
  // 如果当前路由的 meta 中没有 noAffix，并且标签列表中没有当前路由
  if (
    !route.meta.noAffix &&
    !tagList.value.some(tag => tag.fullPath === route.fullPath)
  ) {
    // 更新标签列表
    tabBarStore.updateTabList(route);
  }
}, true); // true 表示在组件挂载时立即执行

// 在组件卸载时移除路由变化监听
onUnmounted(() => {
  removeRouteListener(); // 移除路由变化的监听器
});
</script>

<style scoped lang="less">
.tab-bar-container {
  position: relative;
  background-color: var(--color-bg-2);

  .tab-bar-box {
    display: flex;
    padding: 0 0 0 20px;
    background-color: var(--color-bg-2);
    border-bottom: 1px solid var(--color-border);

    .tab-bar-scroll {
      flex: 1;
      height: 32px;
      overflow: hidden;

      .tags-wrap {
        height: 48px;
        padding: 4px 0;
        overflow-x: auto;
        white-space: nowrap;

        :deep(.arco-tag) {
          display: inline-flex;
          align-items: center;
          margin-right: 6px;
          cursor: pointer;

          &:first-child {
            .arco-tag-close-btn {
              display: none;
            }
          }
        }
      }
    }
  }

  .tag-bar-operation {
    width: 100px;
    height: 32px;
  }
}
</style>
