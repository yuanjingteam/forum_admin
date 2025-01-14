import request from '@/api/interceptor';
// import type { UserState } from '@/store/modules/user/types';

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginRes {
  code: string;
  data: {
    token: string;
    userinfo: {
      id:number
      nickname:string
    };
  };
  msg: string;
}

export interface RightVerify {
  code: number;
  data: {
    Id: string;
    Hcode: string;
    B64: string;
  };
  msg: string;
}

export interface UserList {
  code: number;
  data: {
    user_list: Array<Object>;
  };
  msg: string;
}

export interface UserItem {
  code: number;
  data: {};
  msg: string;
}

// 登录
export function login(data: LoginData) {
  return request.post<LoginRes>('/user/login', data);
}

// 退出登录
export function logout() {
  return request.post<LoginRes>('/backstage/logout');
}

// 获取所有用户列表
export function getUserList() {
  return request.post<UserList>('/user/list');
}

// 获取当前列
export function editUserInfo(data: Object) {
  return request.post<UserItem>('/user/edit', data);
}

// 删除用户
export function deleteUserInfo(data: Object) {
  data;
  return request.post<UserItem>('/user/delete', data);
}
