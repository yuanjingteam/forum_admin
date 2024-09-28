import request from '@/api/interceptor';

export interface Request {
  code: number;
  data: object;
  msg: string;
  [property: string]: any;
}
export interface ListResult {
  code: number;
  data: Data;
  msg: string;
  [property: string]: any;
}
export interface DetailResult {
  code: number;
  data: Api;
  msg: string;
  [property: string]: any;
}
export interface Data {
  api: Api[];
  total: number;
  [property: string]: any;
}

export interface Api {
  //api简介
  briefIntroduction: string;
  //api分组
  grouping: string;
  //api分组id
  groupingId?: number;
  // api的ID
  id: number;
  // api路径
  path: string;
  // 请求方法
  requestMethod: string;
  // 请求方法id
  requestMethodid: number;
  [property: string]: any;
}

// 发送api请求的结构体
export interface ApiForm {
  //api的id
  id?: number;
  //api简介
  briefIntroduction?: string;
  //api分组
  groupingid?: number;
  grouping?: string;
  limit?: number;
  page?: number;
  //api路径
  path?: string;
  //请求方法id
  requestMethodid?: number;
  requestMethod?: string;
  [property: string]: any;
}

export interface APISelect {
  code: number;
  data: APIMethod | APIGroup;
  msg: string;
  [property: string]: any;
}

export interface APIMethod {
  methods: Select[];
  [property: string]: any;
}
export interface APIGroup {
  groups: Select[];
  [property: string]: any;
}

export interface Select {
  label: string;
  value: number;
  [property: string]: any;
}

// 检索api获取列表
export function getApiListService(data: ApiForm) {
  return request.post<ListResult>('/api/list', data);
}

// 添加api
export function addApiService(data: ApiForm) {
  return request.post<Request>('/api/add', data);
}

// 编辑api
export function editApiService(data: ApiForm) {
  return request.post<Request>('/api/update', data);
}

// 删除api
export function deleteApiService(data: { ids: number[] }) {
  return request.delete<Request>('/api/delete', { data });
}

//获取所有请求方法
export function getApiMethodsService() {
  return request.get<APISelect>('/api/get_methods');
}

//获取所有api分组列表
export function getApiGroupsService() {
  return request.get<APISelect>('/api/groups');
}

//获取当前api详情
export function getApiDetailService(params: { id?: number }) {
  return request.get<DetailResult>('/acl/api/detail', { params });
}
