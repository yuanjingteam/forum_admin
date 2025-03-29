import type { RouteLocationNormalized } from 'vue-router';
import { defineStore } from 'pinia';
import {
  DEFAULT_ROUTE,
  DEFAULT_ROUTE_NAME,
  REDIRECT_ROUTE_NAME
} from '@/router/constants';
import { isString } from '@/utils/is';
import type { TabBarState, TagProps } from './types';

const formatTag = (route: RouteLocationNormalized): TagProps => {
  const { name, meta, fullPath, query } = route;
  return {
    title: meta.locale || '',
    name: String(name),
    fullPath,
    query,
    ignoreCache: meta.ignoreCache
  };
};

const BAN_LIST = [REDIRECT_ROUTE_NAME];

// 定义一个名为 'tabBar' 的状态管理 Store
const useAppStore = defineStore('tabBar', {
  // 状态定义
  state: (): TabBarState => ({
    cacheTabList: new Set([DEFAULT_ROUTE_NAME]), // 初始化缓存标签列表，默认包含 DEFAULT_ROUTE_NAME
    tagList: [DEFAULT_ROUTE] // 初始化标签列表，默认包含 DEFAULT_ROUTE
  }),

  // 计算属性（Getters）
  getters: {
    // 获取当前的标签列表
    getTabList(): TagProps[] {
      return this.tagList;
    },
    // 获取当前的缓存列表
    getCacheList(): string[] {
      return Array.from(this.cacheTabList); // 将 Set 转换为数组
    }
  },

  // 行为（Actions）
  actions: {
    // 更新标签列表
    updateTabList(route: RouteLocationNormalized) {
      // 如果路由在禁止列表中，直接返回
      if (BAN_LIST.includes(route.name as string)) return;

      // 格式化标签并添加到标签列表中
      this.tagList.push(formatTag(route));

      // 如果路由不需要忽略缓存，则将其名称添加到缓存列表中
      if (!route.meta.ignoreCache) {
        this.cacheTabList.add(route.name as string);
      }
    },

    // 删除指定索引的标签
    deleteTag(idx: number, tag: TagProps) {
      // 从标签列表中删除指定索引的标签
      this.tagList.splice(idx, 1);
      // 从缓存列表中删除该标签的名称
      this.cacheTabList.delete(tag.name);
    },

    // 添加缓存项
    addCache(name: string) {
      // 检查名称是否为字符串且不为空，然后添加到缓存列表中
      if (isString(name) && name !== '') this.cacheTabList.add(name);
    },

    // 删除缓存项
    deleteCache(tag: TagProps) {
      // 从缓存列表中删除指定标签的名称
      this.cacheTabList.delete(tag.name);
    },

    // 刷新标签列表
    freshTabList(tags: TagProps[]) {
      // 更新标签列表为传入的标签
      this.tagList = tags;
      // 清空缓存列表
      this.cacheTabList.clear();
      // 重新添加不忽略缓存的标签名称到缓存列表中
      this.tagList
        .filter(el => !el.ignoreCache) // 过滤掉需要忽略缓存的标签
        .map(el => el.name) // 获取标签名称
        ?.forEach(x => this.cacheTabList.add(x)); // 添加到缓存列表
    },

    // 重置标签列表
    resetTabList() {
      // 将标签列表重置为默认路由
      this.tagList = [DEFAULT_ROUTE];
      // 清空缓存列表
      this.cacheTabList.clear();
      // 重新添加默认路由的名称到缓存列表
      this.cacheTabList.add(DEFAULT_ROUTE_NAME);
    }
  }
});

export default useAppStore;
