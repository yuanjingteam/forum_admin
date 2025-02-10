import request from '@/api/interceptor';

// 新增标签类型
export interface AddTagList {
  name: string;
  description: string;
  article_count: number;
  heat: number;
  fans_count: number;
  path: string[];
}

export interface TagData {
  tag_list: Array<Object>;
  total: number;
}

// 获取标签列表
export function getTagList(data) {
  return request.post<TagData>('/backstage_tag/batch_query', data); // 这里会自动拼接 baseURL
}

// 批量删除标签
export function deleteTag(data) {
  return request.post<TagData>('/backstage_tag/batch_delete', data);
}

// 修改标签
export function updateTag(data) {
  return request.post<TagData>('/backstage_tag/update', data);
}

// 新增标签
export function addTag(data) {
  return request.post<TagData>('/backstage_tag/add', data);
}
