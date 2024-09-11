/**
 * Listening to routes alone would waste rendering performance. Use the publish-subscribe model for distribution management.
 * 单独监听路由会浪费渲染性能。使用发布订阅模式进行分发管理。
 */
import mitt, { type Handler } from 'mitt'; // 导入 mitt 库用于实现发布-订阅模式
import type { RouteLocationNormalized } from 'vue-router'; // 导入 Vue Router 中的路由类型

const emitter = mitt(); // 创建一个 mitt 实例，用于事件的发布与订阅

// 定义一个唯一的 symbol 作为路由变化事件的键
const key = Symbol('ROUTE_CHANGE');

let latestRoute: RouteLocationNormalized; // 用于存储最新的路由信息

/**
 * 触发路由变化事件并更新最新路由
 * @param to - 目标路由的位置
 */
export function setRouteEmitter(to: RouteLocationNormalized) {
  emitter.emit(key, to); // 触发 ROUTE_CHANGE 事件，传递目标路由
  latestRoute = to; // 更新最新路由
}

/**
 * 监听路由变化事件
 * @param handler - 处理路由变化的回调函数
 * @param immediate - 是否立即调用回调函数（默认值为 true）
 */
export function listenerRouteChange(
  handler: (route: RouteLocationNormalized) => void,
  immediate = true
) {
  emitter.on(key, handler as Handler); // 订阅 ROUTE_CHANGE 事件
  if (immediate && latestRoute) {
    handler(latestRoute); // 如果 immediate 为 true，立即调用回调函数，传入最新路由
  }
}

/**
 * 移除路由变化事件的监听
 */
export function removeRouteListener() {
  emitter.off(key); // 取消订阅 ROUTE_CHANGE 事件
}
