import request from '@/api/interceptor';

/**
 * Request
 */
export interface getDataRequest {
  code: number;
  data: getData;
  msg: string;
  [property: string]: any;
}

export interface getData {
  totalData: TotalData;
  [property: string]: any;
}

export interface TotalData {
  /**
   * 所有文章的数量
   */
  articleTotal: string;
  /**
   * 今天新增文章的比例
   */
  newAdd: string;
  /**
   * 今天发布评论数之和
   */
  todayComments: number;
  /**
   * 今天所有文章的访问量之和
   */
  todayViews: number;
  [property: string]: any;
}
export interface articleSumRequest {
  code: number;
  data: articleSumData;
  msg: string;
  [property: string]: any;
}

export interface articleSumData {
  articleSum: number[];
  [property: string]: any;
}

export interface hotArticleRequest {
  code: number;
  data: hotArticleData;
  msg: string;
  [property: string]: any;
}

export interface hotArticleData {
  articleList: ArticleList[];
  [property: string]: any;
}

export interface ArticleList {
  /**
   * 文章id
   */
  id: number;
  /**
   * 点赞量日增长
   */
  increases: string;
  /**
   * 点赞量（k,w）
   */
  likesCount: string;
  /**
   * 文章标题
   */
  title: string;
  [property: string]: any;
}

export interface pieRequest {
  code: number;
  data: pieData;
  msg: string;
  [property: string]: any;
}

export interface pieData {
  pieList: PieList[];
  [property: string]: any;
}

export interface PieList {
  /**
   * 标签名
   */
  type: string;
  /**
   * 占比
   */
  value: string;
  [property: string]: any;
}

//获取工作台首页计算数据
export function getWorkplaceDataService() {
  return request.get<getDataRequest>('/workplace/data');
}

// 获取近两周文章数
export function getWorkplaceArticleSumService() {
  return request.get<articleSumRequest>('/workplace/article_sum');
}

//获取前五篇热门文章数据
export function getWorkplaceHotArticlesService() {
  return request.get<hotArticleRequest>('/workplace/hot_articles');
}

//获取饼状图数据（前五个热门标签的文章量）
export function getWorkplacePielistService() {
  return request.get<pieRequest>('/workplace/pielist');
}
