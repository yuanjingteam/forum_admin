import type { DirectiveBinding } from 'vue';
import { useUserStore } from '@/store';

// 定义一个函数 checkPermission，用于检查元素的权限
function checkPermission(el: HTMLElement, binding: DirectiveBinding) {
  // 从绑定对象中获取权限值
  const { value } = binding;
  // 获取用户状态管理存储
  const userStore = useUserStore();
  // 获取当前用户的角色
  const { role } = userStore;

  // 检查 value 是否为数组
  if (Array.isArray(value)) {
    // 确保数组不为空
    if (value.length > 0) {
      const permissionValues = value;

      // 检查当前用户的角色是否在权限数组中
      const hasPermission = permissionValues.includes(role);
      // 如果没有权限且元素有父节点，移除该元素
      if (!hasPermission && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }
  } else {
    // 如果 value 不是数组，抛出错误
    throw new Error(`need roles! Like v-permission="['admin','user']"`);
  }
}

// 导出一个对象，定义自定义指令的生命周期钩子
export default {
  // 在元素挂载时调用 checkPermission 函数
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  },
  // 在元素更新时调用 checkPermission 函数
  updated(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  }
};
