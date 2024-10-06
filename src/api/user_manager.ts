import request from '@/api/interceptor';

//发送用户请求的结构体
export interface UserForm {
  //创建时间
  createTimeBegin?: string;
  createTimeEnd?: string;
  //邮箱
  email?: string;
  //粉丝数
  fansCount?: number;
  //个人热度
  heat?: number;
  lastLoginTimeBegin?: string;
  lastLoginTimeEnd?: string;
  limit?: number;
  nickname?: string;
  page?: number;
  roleids?: number[];
  userStatus?: number;
  [property: string]: any;
}

export interface Request {
  code: number;
  data: object;
  msg: string;
  [property: string]: any;
}
//接受用户请求的结构体
export interface ListResult {
  code: number;
  data: Data;
  msg: string;
  [property: string]: any;
}

export interface Data {
  total: number;
  userList: UserList[];
  [property: string]: any;
}

export interface UserList {
  // 用户头像
  avatarPath: string;
  //创建账号时间
  createTime: string;
  // 用户邮箱
  email: string;
  // 粉丝数
  fansCount: number;
  // 个人热度
  heat: number;
  // 用户id
  id: number;
  //上次登录时间，格式是2022-12-09 08:20:02
  lastLoginTime: string;
  // 用户名
  nickname: string;
  roles: Role[];
  // 用户状态，0全部1正常2封禁
  userStatus: number;
  [property: string]: any;
}

export interface Role {
  // 角色id
  id: number;
  // 角色名称
  name: string;
  [property: string]: any;
}

export interface User {
  //用户id
  userid?: number | null;
  //邮箱
  email?: string;
  // 用户名
  nickname?: string;
  // 用户的角色id集合
  roleids?: number[];
  // 状态  1正常 2封禁 0全部
  userStatus?: number;
  [property: string]: any;
}
//用户详情结果
export interface UserDetail {
  code: number;
  data: UserData;
  msg: string;
  [property: string]: any;
}

export interface UserData {
  avatarPath: string;
  email: string;
  id: number;
  nickname: string;
  roles: Role[];
  userStatus: string;
  [property: string]: any;
}

// 检索用户获取列表
export function getUserListService(data: UserForm) {
  return request.post<ListResult>('/user/list', data);
}

// 添加用户
export function addUserService(data: User) {
  return request.post<Request>('/user/add', data);
}

// 编辑用户
export function editUserService(data: User) {
  return request.post<Request>('/user/edit', data);
}

// 删除用户
export function deleteUserService(data: { ids: number[] }) {
  return request.delete<Request>('/user/delete', { data });
}

//获取当前用户详情
export function getUserDetailService(params: { id?: number }) {
  return request.get<UserDetail>('/user/getInfo', { params });
}

//重置用户密码
export function resetUserService(id: number) {
  return request.post<Request>('/user/reset', { id });
}

//导入用户表
export function importUserService(file: File) {
  return request.post<Request>('/user/import', file);
}

//下载用户表模版
export function downloadTemService() {
  return request.get('/user/download_template');
}
//导出用户表
export function downloadUserService() {
  return request.get('/user/export');
}
