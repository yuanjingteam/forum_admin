import { ref } from 'vue';

/**
 * 加载状态Hook
 */
export default function useLoading(initValue = false) {
  const loading = ref(initValue);
  // 定义一个函数 setLoading，用于设置 loading 的值
  // 参数 value 为布尔类型，表示新的加载状态
  const setLoading = (value: boolean) => {
    loading.value = value;
  };
  // 切换loading的值
  const toggle = () => {
    loading.value = !loading.value;
  };
  return {
    loading,
    setLoading,
    toggle
  };
}
