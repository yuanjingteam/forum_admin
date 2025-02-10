// 导入 axios 库用于进行 HTTP 请求
import axios from 'axios';
// 导入 TableData 类型，用于表格数据的定义
import type { TableData } from '@arco-design/web-vue/es/table/interface';

// 定义一个接口 ContentDataRecord，表示内容数据记录的结构
export interface ContentDataRecord {
  x: string; // x 轴数据，通常为字符串类型
  y: number; // y 轴数据，数字类型
}

// 定义一个函数 queryContentData，用于获取内容数据
export function queryContentData() {
  // 发起 GET 请求，返回内容数据记录数组
  return axios.get<ContentDataRecord[]>('/api/content-data');
}

// 定义一个接口 PopularRecord，表示热门记录的结构
export interface PopularRecord {
  key: number; // 记录的唯一键
  clickNumber: string; // 点击次数，字符串类型
  title: string; // 记录的标题
  increases: number; // 增长值，数字类型
}

// 定义一个函数 queryPopularList，用于获取热门记录列表
export function queryPopularList(params: { type: string }) {
  // 发起 GET 请求，返回热门记录列表，传递查询参数
  return axios.get<TableData[]>('/api/popular/list', { params });
}
