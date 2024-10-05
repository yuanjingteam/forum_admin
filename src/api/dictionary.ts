import request from '@/api/interceptor';
import type { TableData } from '@arco-design/web-vue';

export interface Data {
  data: object;
  code: number;
  msg: string;
}
// 请求字典类型
export interface DicListForm {
  name: string;
  code: string;
  status: number;
  create_at_begin: string;
  limit: number;
  page: number;
  create_at_end: string;
}
// 获取字典类型
export interface DicList {
  code: number;
  data: {
    dict_type_list: Array<{
      id: number;
      name: string;
      code: string;
      status: number;
      description: string;
      create_at: string;
    }>;
    total: number;
  };
  msg: string;
}
// 新增字典类型
export interface AddList {
  name: string;
  code: string;
  status: number;
  description: string;
}

// 删除字典类型
export interface DelList {
  id_list: number[];
}
// 编辑字典类型
export interface EditorList {
  name: string;
  code: string;
  status: number;
  description: string;
  id: number;
}

// ------------------------------------------------------------------------ //
// 请求字典项
export interface DicItemForm {
  dict_type_code: string;
  label: string;
  status: number;
  create_at_begin: string;
  page: number;
  limit: number;
  create_at_end: string;
}

// 获取字典项
export interface DicItem {
  code: number;
  data: {
    dict_item_list: TableData[];
    total: number;
  };
  msg: string;
}

// 新增字典项
export interface AddItem {
  dict_type_code: string;
  label: string;
  value: string;
  sort: number;
  status: number;
  description: string;
  extend_value: string;
}

// 删除字典项
export interface DelItem {
  id_list: number[];
  dict_type_code: string;
}

// 修改字典项
export interface EditorItem {
  id: number;
  label: string;
  value: number;
  sort: number;
  status: number;
  description: string;
  extend_value: string;
}

// 获取字典类型
export function getDicType(data: DicListForm) {
  return request.get<DicList>('/dict/get_type', { params: data });
}

// 新增字典类型
export function addDicType(data: AddList) {
  return request.post<Data>('/dict/add_type', data);
}

// 删除字典类型
export function delDicType(data: DelList) {
  return request.delete<Data>('/dict/delete_type', { params: data });
}

// 修改字典类型
export function updateDicType(data: EditorList) {
  return request.post<Data>('/dict/delete_type', data);
}
// -------------------------------------------------------------------------------------//
// 获取字典项
export function getDicItem(data: DicItemForm) {
  return request.get<DicItem>('/dict/get_item', { params: data });
}

// 新增字典项
export function addDicItem(data: AddItem) {
  return request.get<Data>('/dict/add_item', { params: data });
}

// 删除字典项
export function delDicItem(data: DelItem) {
  return request.delete<Data>('/dict/delete_item', { params: data });
}

// 修改字典项
export function updateDicItem(data: EditorItem) {
  return request.post<Data>('/dict/update_item', data);
}
