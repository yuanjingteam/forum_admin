import { onMounted, onBeforeMount, onBeforeUnmount } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { useAppStore } from '@/store';
import { addEventListen, removeEventListen } from '@/utils/event';

// 定义一个常量 WIDTH，表示大于等于992px的屏幕宽度
const WIDTH = 992; // https://arco.design/vue/component/grid#responsivevalue

// 定义一个函数 queryDevice，用于判断当前设备是否为移动设备
function queryDevice() {
  // 获取文档主体的边界矩形信息
  const rect = document.body.getBoundingClientRect();

  // 检查当前视口宽度是否小于 WIDTH
  // 如果小于 WIDTH，返回 true，表示为移动设备，否则返回 false
  return rect.width - 1 < WIDTH;
}

// 导出一个名为 useResponsive 的默认函数，用于处理窗口大小变化的响应
export default function useResponsive(immediate?: boolean) {
  // 获取应用的状态管理存储
  const appStore = useAppStore();

  // 定义一个处理窗口调整大小的函数
  function resizeHandler() {
    // 检查文档是否可见，避免在隐藏状态下执行
    if (!document.hidden) {
      // 调用 queryDevice 函数判断当前设备类型
      const isMobile = queryDevice();
      // 根据设备类型切换 appStore 的设备状态（移动或桌面）
      appStore.toggleDevice(isMobile ? 'mobile' : 'desktop');
      // 根据设备类型切换菜单的显示状态
      appStore.toggleMenu(isMobile);
    }
  }

  // 使用防抖函数包装 resizeHandler，避免频繁执行
  const debounceFn = useDebounceFn(resizeHandler, 100);

  // 在组件挂载后，立即执行一次防抖函数（如果 immediate 为 true）
  onMounted(() => {
    if (immediate) debounceFn();
  });

  // 在组件挂载前添加窗口大小变化的事件监听
  onBeforeMount(() => {
    addEventListen(window, 'resize', debounceFn);
  });

  // 在组件卸载前移除窗口大小变化的事件监听
  onBeforeUnmount(() => {
    removeEventListen(window, 'resize', debounceFn);
  });
}
