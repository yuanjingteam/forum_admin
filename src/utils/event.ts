/**
 * 添加事件监听器
 * @param target - 事件目标，可以是 Window 对象或 HTML 元素
 * @param event - 要监听的事件类型（如 'click'、'resize' 等）
 * @param handler - 事件处理函数，可以是一个函数或事件监听器对象
 * @param capture - 可选，指示是否在捕获阶段调用事件处理程序，默认为 false
 */
export function addEventListen(
  target: Window | HTMLElement,
  event: string,
  handler: EventListenerOrEventListenerObject,
  capture = false
) {
  // 检查目标是否支持 addEventListener 方法
  if (
    target.addEventListener &&
    typeof target.addEventListener === 'function'
  ) {
    // 添加事件监听器
    target.addEventListener(event, handler, capture);
  }
}

/**
 * 移除事件监听器
 * @param target - 事件目标，可以是 Window 对象或 HTML 元素
 * @param event - 要移除的事件类型
 * @param handler - 之前添加的事件处理函数
 * @param capture - 可选，指示是否在捕获阶段移除事件处理程序，默认为 false
 */
export function removeEventListen(
  target: Window | HTMLElement,
  event: string,
  handler: EventListenerOrEventListenerObject,
  capture = false
) {
  // 检查目标是否支持 removeEventListener 方法
  if (
    target.removeEventListener &&
    typeof target.removeEventListener === 'function'
  ) {
    // 移除事件监听器
    target.removeEventListener(event, handler, capture);
  }
}
