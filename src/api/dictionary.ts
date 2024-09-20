import request from '@/api/interceptor';

export interface Data {
  code: number;
  data: { dic_list: Array<Object>; total: number };
  msg: string;
}

export function login(data: Data) {
  return request.post<Data>('/api/user/login', data);
}

// 获取评论列表
export function getDicList(data) {
  return request.get<Data>('/backstage_comment/list', data); // 这里会自动拼接 baseURL
}
