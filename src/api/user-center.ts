import axios from 'axios';
import request from '@/api/interceptor';
import type { Data } from '@/api/base';

// 用户基本信息
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
// 更新当前用户信息
export function updatePersonalInfo(data: BasicInfoModel) {
  return request.post<Data>('/user/form_personal_data', data);
}
