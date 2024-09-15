import request from '@/api/interceptor';

export interface Data {
  code: number;
  data: { comlist: Array<Object>; total: number };
  msg: string;
}

// 获取评论列表
export function getCommentList(data) {
  return request.get<Data>('/backstage_comment/list', data); // 这里会自动拼接 baseURL
}

// 删除评论列表
export function deleteComment(data) {
  return request.delete<Data>('/backstage_comment/batch_delete', data); // 这里会自动拼接 baseURL
}
