import { ref, type UnwrapRef } from 'vue';
import type { AxiosResponse, HttpResponse } from 'axios';
import useLoading from './useLoading';

// use to fetch list
// Don't use async function. It doesn't work in async function.
// Use the bind function to add parameters
// example: useRequest(api.bind(null, {}))

export default function useRequest<T>(
  api: () => Promise<AxiosResponse<HttpResponse>>,
  defaultValue = [] as unknown as T,
  isLoading = true
) {
  // 使用 useLoading 组合式函数来管理加载状态
  const { loading, setLoading } = useLoading(isLoading);

  // 创建一个响应式引用，用于存储 API 响应数据
  const response = ref<T>(defaultValue);

  // 调用 API 函数并处理响应
  api()
    .then(res => {
      // 将响应数据赋值给 response
      response.value = res.data as unknown as UnwrapRef<T>;
    })
    .finally(() => {
      // 在请求完成后，设置加载状态为 false
      setLoading(false);
    });

  // 返回加载状态和响应数据
  return { loading, response };
}
