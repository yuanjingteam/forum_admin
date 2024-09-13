import request from '@/api/interceptor';

export interface Data {
  code: number;
  data: { comlist: Array<Object> };
  msg: string;
}

// 获取评论列表
export function getCommentList(data) {
  return request.get<Data>('/backstage_comment/list', data); // 这里会自动拼接 baseURL
}
