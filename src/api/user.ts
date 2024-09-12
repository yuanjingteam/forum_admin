import request from '@/api/interceptor';
import type { UserState } from '@/store/modules/user/types';

export interface LoginData {
  username: string;
  password: string;
  captcha: string;
}

export interface LoginRes {
  token: string;
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

export function login(data: LoginData) {
  return request.post<LoginRes>('/api/user/login', data);
}

export function logout() {
  return request.post<LoginRes>('/api/user/logout');
}

export function getUserInfo() {
  return request.post<UserState>('/api/user/info');
}

// 获取图形验证码
export function getPicCode() {
  return request.post<RightVerify>('/user/get_verification'); // 这里会自动拼接 baseURL
}

// 获取所有用户列表
export function getUserList() {
  return request.post<UserList>('/user/list'); // 这里会自动拼接 baseURL
}

// 获取当前列
export function getUerItem(data: Object) {
  data;
  return request.post<UserItem>('/user/edit', data); // 这里会自动拼接 baseURL
}
