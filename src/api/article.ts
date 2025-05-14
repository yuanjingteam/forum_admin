import request from '@/api/interceptor';
import type { TableData } from '@arco-design/web-vue';

export interface ArticleForm {
  startTime: string;
  endTime: string;
  keyword: string;
  article_tags: number[];
  nickname: string;
  views_count: number;
  likes_count: number;
  collections_count: number;
  comments_count: number;
  heat: null;
  kind: number;
}

// 扩展 TableData 接口以包含额外的字段
export interface ArticleTableData extends TableData {
  article_condition: number;
  views_count: number;
  likes_count: number;
  collections_count: number;
  comments_count: number;
  heat: number;
  nickname: string;
  published_at: string;
  updated_at: string;
  tags: [
    {
      ID: number;
      name: string;
    }
  ];
}

export interface ArticleData {
  code: number; // 状态码
  data: {
    article_list: ArticleTableData[]; // 使用扩展后的 TableData 类型
    total: number; // 文章总数
  };
  msg: string; // 消息
}

// 获取文章
export function queryArticleList(data: ArticleForm) {
  return request.post<ArticleData>('/article/get_list', data); // 这里会自动拼接 baseURL
}

// 删除文章
export function delArticleList(data) {
  return request.post<ArticleData>('/article/delete', data); // 这里会自动拼接 baseURL
}

// 封禁文章
export function banArticleList(data) {
  return request.post<ArticleData>('/article/delete', data); // 这里会自动拼接 baseURL
}

// 解封文章
export function unsealArticleList(data) {
  return request.post<ArticleData>('/article/delete', data); // 这里会自动拼接 baseURL
}

// 审核文章
// export function auditArticleList(data) {
//   return request.post<ArticleData>('/article/audit', data); // 这里会自动拼接 baseURL
// }
