import request from '@/api/interceptor';

export interface dicList {
  code: number;
  data: { dic_list: Array<Object>; total: number };
  msg: string;
}

export interface dicItem {
  code: number;
  data: { dic_items: Array<Object>; total: number };
  msg: string;
}

// 获取字典项
export function getDicList(data) {
  return request.get<dicList>('/dict_item/get', data); // 这里会自动拼接 baseURL
}

// 获取字典详情
export function getDicItem(data) {
  return request.get<dicItem>('/dic_items/get', data); // 这里会自动拼接 baseURL
}
