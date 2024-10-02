import request from '@/api/interceptor';

export interface dicList {
  code: number;
  data: { dict_type_list: Array<Object>; total: number };
  msg: string;
}

export interface dicItem {
  code: number;
  data: { dict_item_list: Array<Object>; total: number };
  msg: string;
}

// 获取字典类型
export function getDicType(data) {
  return request.get<dicList>('/dict/get_type', data); // 这里会自动拼接 baseURL
}

// 新增字典类型
export function addDicType(data) {
  return request.get<dicList>('/dict/get_type', data); // 这里会自动拼接 baseURL
}

// 删除字典类型
export function delDicType(data) {
  return request.delete<dicItem>('/dict/delete_type', data); // 这里会自动拼接 baseURL
}

// 修改字典类型
export function updateDicType(data) {
  return request.delete<dicItem>('/dict/delete_type', data); // 这里会自动拼接 baseURL
}

// 获取字典项
export function getDicItem(data) {
  return request.get<dicItem>('/dict/get_item', data); // 这里会自动拼接 baseURL
}

// 新增字典项
export function addDicItem(data) {
  return request.get<dicList>('/dict/get_type', data); // 这里会自动拼接 baseURL
}

// 删除字典项
export function delDicItem(data) {
  return request.delete<dicItem>('/dict/delete_type', data); // 这里会自动拼接 baseURL
}

// 修改字典项
export function updateDicItem(data) {
  return request.delete<dicItem>('/dict/delete_type', data); // 这里会自动拼接 baseURL
}
