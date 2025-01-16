import request from '@/api/interceptor';

// 发送角色请求的结构体
export interface RoleForm {
  //角色id
  id?: number;
  //角色编码
  code?: string;
  //每页几条数据
  limit?: number;
  //角色名称/
  name?: string;
  //第几页
  page?: number;
  //角色状态，0全部1正常2封禁
  status?: number;
  [property: string]: any;
}
export interface Request {
  code: number;
  data: object;
  msg: string;
  [property: string]: any;
}
//接受角色请求的结构体
export interface ListResult {
  code: number;
  data: Data;
  msg: string;
  [property: string]: any;
}

export interface Data {
  roleList: Role[];
  //总条数
  total: number;
  [property: string]: any;
}

export interface Role {
  // 角色编码
  code: string;
  //创建时间
  createdAt: string;
  //角色id
  id: number;
  //角色名称
  name: string;
  //角色排序
  sort: number;
  // 角色状态
  status: number;
  [property: string]: any;
}
export interface RoleDetail {
  code: string;
  data: Role;
  msg: string;
  [property: string]: any;
}

// 检索role获取列表
export function getRoleListService(data: RoleForm) {
  return request.post<ListResult>('/role/search_role', data);
}

// 添加role
export function addRoleService(data: RoleForm) {
  return request.post<Request>('/role/add_role', data);
}

// 编辑role
export function editRoleService(data: RoleForm) {
  return request.post<Request>('/role/update_role', data);
}

// 删除role
export function deleteRoleService(data: { ids: number[] }) {
  return request.delete<Request>('/role/delete_role', { data });
}

//获取当前角色详情
export function getRoleDetailService(id: number) {
  return request.get<RoleDetail>(`/role/get_detail?id=${id}`);
}
//获取所有已启用的角色名称列表
export function getRoleNameService() {
  return request.get<Role>('/role/get_role_name');
}
