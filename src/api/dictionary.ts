import request from '@/api/interceptor';
import type { TableData } from '@arco-design/web-vue';
import type { Data } from '@/api/base';

// 通用响应接口
export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
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
export interface GetDicList {
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

// 新增字典类型
export interface AddDicList {
  name: string;
  code: string;
  status: number;
  description: string;
}

// 删除字典类型
export interface DelDicList {
  id_list: number[];
}
// 编辑字典类型
export interface EditDicList {
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
export interface GetDicItem {

    dict_item_list: TableData[];
    total: number;
  };

// 新增字典项
export interface AddDicItem {
  dict_type_code: string;
  label: string;
  value: number;
  sort: number;
  status: number;
  description: string;
  extend_value: string;
}

// 删除字典项
export interface DelDicItem {
  id_list: number[];
  dict_type_code: string;
}

// 修改字典项
export interface EditDicItem {
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
  return request.get<GetDicList>('/dict/get_type', { params: data });
}

// 新增字典类型
export function addDicType(data: AddDicList) {
  return request.post<Data>('/dict/add_type', data);
}

// 删除字典类型
export function delDicType(data: DelDicList) {
  return request.delete<Data>('/dict/delete_type', { params: data });
}

// 修改字典类型
export function updateDicType(data: EditDicList) {
  return request.post<Data>('/dict/update_type', data);
}
// -------------------------------------------------------------------------------------//
// 获取字典项
export function getDicItem(data: DicItemForm) {
  return request.get<GetDicItem>('/dict/get_item', { params: data });
}

// 新增字典项
export function addDicItem(data: AddDicItem) {
  return request.post<Data>('/dict/add_item', data);
}

// 删除字典项
export function delDicItem(data: DelDicItem) {
  return request.delete<Data>('/dict/delete_item', { params: data });
}

// 修改字典项
export function updateDicItem(data: EditDicItem) {
  return request.post<Data>('/dict/update_item', data);
}
