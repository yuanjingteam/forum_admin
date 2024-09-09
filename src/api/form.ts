// 导入 axios 库用于进行 HTTP 请求
import axios from 'axios';

// 定义一个接口 BaseInfoModel，表示基本信息模型的结构
export interface BaseInfoModel {
  activityName: string; // 活动名称，字符串类型
  channelType: string; // 渠道类型，字符串类型
  promotionTime: string[]; // 促销时间，字符串数组
  promoteLink: string; // 促销链接，字符串类型
}

// 定义一个接口 ChannelInfoModel，表示渠道信息模型的结构
export interface ChannelInfoModel {
  advertisingSource: string; // 广告来源，字符串类型
  advertisingMedia: string; // 广告媒体，字符串类型
  keyword: string[]; // 关键字数组
  pushNotify: boolean; // 是否推送通知，布尔值
  advertisingContent: string; // 广告内容，字符串类型
}

// 定义一个联合类型 UnitChannelModel，将基本信息模型和渠道信息模型结合在一起
export type UnitChannelModel = BaseInfoModel & ChannelInfoModel;

// 定义一个函数 submitChannelForm，用于提交渠道表单数据
export function submitChannelForm(data: UnitChannelModel) {
  // 发起 POST 请求，将表单数据发送到指定的 API 端点
  return axios.post('/api/channel-form/submit', { data });
}
