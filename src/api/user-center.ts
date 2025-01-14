import axios from 'axios';
import request from '@/api/interceptor';
import type { Data } from '@/api/base';

// 获取用户个人资料
export interface BasicInfoModel {
  id: number;
  nickname: string;
  career_direction: string;
  user_home_page: string;
  user_signature: string;
  path: string;
  user_tags: string[];
  all_tag_names: string[];
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
export interface aaa {
  id: number;
  email: string;
  blog_link: string;
  weibo_link: string;
  github_link: string;
  password: string;
}

// 更新用户头像
export function userUploadApi(
  data: FormData,
  config: {
    controller: AbortController;
    onUploadProgress?: (progressEvent: any) => void;
  }
) {
  // const controller = new AbortController();
  return axios.post('/produce_image_url', data, config);
}

// 获取当前用户详细信息
export function getPersonalInfo(id: number) {
  return request.get<Data>(`/user/form_personal_data/${id}`); // 使用模板字符串插入 id
}

// 获取当前账号设置
export function getAccountInfo(id: number) {
  return request.get<Data>(`/user/account_settings/${id}`);
}

// 更新当前用户资料
export function updatePersonalInfo(data: BasicInfoModel) {
  return request.post<UpdateBasic>('/user/form_personal_data', data);
}

// 更新账号设置
export function updateAccountInfo(data: BasicInfoModel) {
  return request.post<aaa>('/user/form_personal_data', data);
}
