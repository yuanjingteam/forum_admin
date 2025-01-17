import type { defineComponent } from 'vue';
import type { RouteMeta, NavigationGuard } from 'vue-router';

// 定义一个类型 Component，表示可以作为 Vue 组件的各种类型
export type Component<T = any> =
  | ReturnType<typeof defineComponent> // 1. Vue 组件的定义，使用 defineComponent 函数的返回类型
  | (() => Promise<typeof import('*.vue')>) // 2. 异步加载 .vue 文件的函数，返回一个 Promise
  | (() => Promise<T>); // 3. 返回一个 Promise 的函数，可以是任意类型的组件

// 定义了一个接口 AppRouteRecordRaw，用于描述 Vue Router 中的路由记录。
// 具体来说，它定义了路由的结构和属性，使得在应用程序中可以灵活地配置和管理路由。以下是该接口各个属性的详细作用：
// 路由管理: AppRouteRecordRaw 接口使得开发者能够清晰地定义和管理应用的路由结构，提供灵活性和可扩展性。
// 类型安全: 通过 TypeScript 的接口定义，确保在使用路由时具有类型安全，减少错误。
// 元信息支持: 允许将自定义信息与路由关联，便于进行动态处理和路由守卫的配置。
// 嵌套路由: 支持多级嵌套路由，使得应用结构更为清晰和有层次。

export interface AppRouteRecordRaw {
  path: string; // 路径
  name?: string | symbol; // 名字
  meta?: RouteMeta; // 路由元信息
  redirect?: string; // 重定向地址
  component: Component | string; // 组件
  children?: AppRouteRecordRaw[]; // 子路由
  alias?: string | string[]; // 别名
  props?: Record<string, any>; // 传递给路由的参数
  beforeEnter?: NavigationGuard | NavigationGuard[]; // 路由独享的守卫
  fullPath?: string; // 完整路径
}
