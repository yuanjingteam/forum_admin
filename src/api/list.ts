// 导入 axios 库用于进行 HTTP 请求
import axios from 'axios';
// 导入 query-string 库用于处理查询字符串
import qs from 'query-string';
// 导入 DescData 类型，用于描述接口数据
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';

// 定义一个接口 PolicyRecord，表示政策记录的结构
export interface PolicyRecord {
  id: string; // 政策的唯一标识符
  number: number; // 政策编号
  name: string; // 政策名称
  contentType: 'img' | 'horizontalVideo' | 'verticalVideo'; // 内容类型
  filterType: 'artificial' | 'rules'; // 过滤类型
  count: number; // 相关数据的计数
  status: 'online' | 'offline'; // 政策状态
  createdTime: string; // 创建时间
}

// 定义一个接口 PolicyParams，表示查询政策时的参数
export interface PolicyParams extends Partial<PolicyRecord> {
  current: number; // 当前页码
  pageSize: number; // 每页记录数
}

// 定义一个接口 PolicyListRes，表示政策列表的响应结构
export interface PolicyListRes {
  list: PolicyRecord[]; // 政策记录数组
  total: number; // 总记录数
}

// 定义一个函数 queryPolicyList，用于查询政策列表
export function queryPolicyList(params: PolicyParams) {
  // 发起 GET 请求，获取政策列表
  return axios.get<PolicyListRes>('/api/list/policy', {
    params, // 传递查询参数
    paramsSerializer: obj => {
      // 使用 query-string 库序列化参数对象
      return qs.stringify(obj);
    }
  });
}

// 定义一个接口 ServiceRecord，表示服务记录的结构
export interface ServiceRecord {
  id: number; // 服务的唯一标识符
  title: string; // 服务标题
  description: string; // 服务描述
  name?: string; // 服务名称（可选）
  actionType?: string; // 动作类型（可选）
  icon?: string; // 图标（可选）
  data?: DescData[]; // 相关数据（可选）
  enable?: boolean; // 是否启用（可选）
  expires?: boolean; // 是否过期（可选）
}

// 定义一个函数 queryInspectionList，用于查询质量检查列表
export function queryInspectionList() {
  // 发起 GET 请求，获取质量检查列表
  return axios.get('/api/list/quality-inspection');
}

// 定义一个函数 queryTheServiceList，用于查询服务列表
export function queryTheServiceList() {
  // 发起 GET 请求，获取服务列表
  return axios.get('/api/list/the-service');
}

// 定义一个函数 queryRulesPresetList，用于查询规则预设列表
export function queryRulesPresetList() {
  // 发起 GET 请求，获取规则预设列表
  return axios.get('/api/list/rules-preset');
}
