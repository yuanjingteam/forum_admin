import request from '@/api/interceptor';

export interface Data {
  code: number;
  data: { tag_list: Array<Object>; total: number };
  msg: string;
}

// 获取评论列表
export function getTagList(data) {
  return request.get<Data>('/backstage_tag/batch_query', data); // 这里会自动拼接 baseURL
}
