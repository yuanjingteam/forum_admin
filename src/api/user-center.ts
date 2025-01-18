// import axios from 'axios';
import request from '@/api/interceptor';
// import type { Data } from '@/api/base';

// 获取用户个人资料
export interface BasicInfoModel {
  id: number;
  nickname: string;
  career_direction: string;
  user_home_page: string;
  user_signature: string;
  path: string;
  user_tags: string[];
  all_tag_names?: string[];
}

export interface PersonalInfoModel {
  id: number;
  avatar_path: string;
  nickname: string;
  email: string;
  user_status: number;
  role_ids: number[];
}

// 更新用户个人资料
export interface UpdateBasic {
  id: number;
  nickname: string;
  career_direction: string;
  user_home_page: string;
  user_signature: string;
  path: string;
  user_tags: string[];
}

// 获取/更新用户账号设置
export interface AccountInfoModel {
  id: number;
  email: string;
  blog_link: string;
  weibo_link: string;
  github_link: string;
  password: string;
}

// 更新用户头像
export function userUploadApi(data: FormData) {
  // const controller = new AbortController();
  return request.post<any>('/produce_image_url', data);
}

// 获取当前用户详细信息
export function getBasicInfo() {
  return request.get<BasicInfoModel>(`/user/form_personal_data`); // 使用模板字符串插入 id
}

export function getPersonalInfo(id: number) {
  return request.get<PersonalInfoModel>(`/user/getInfo=${id}`); // 使用模板字符串插入 id
}

// 获取当前账号设置
export function getAccountInfo() {
  return request.get<AccountInfoModel>(`/user/account_settings`);
}

// 更新用户基本信息
export function updateBasicInfo(data: BasicInfoModel) {
  console.log(data);

  return request.post<PersonalInfoModel>('/user/account_settings', data);
}

// 更新当前用户资料
export function updatePersonalInfo(data: PersonalInfoModel) {
  console.log(data);

  return request.post<PersonalInfoModel>('/user/edit', data);
}

// 更新账号设置
export function updateAccountInfo(data: AccountInfoModel) {
  return request.post<AccountInfoModel>('/user/form_personal_data', data);
}
