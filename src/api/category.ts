import request from '@/api/interceptor';

export interface GetcategoryList {
  data: dynamicMenuList[];
}

export interface dynamicMenuList {
  id: number;
  name: string;
  icon: string;
  created_at: string;
  updated_at: string;
  visible: boolean;
}

// 获取所有分类
export function getAllCategories() {
  return request.get<dynamicMenuList[]>('/backstage_category/getAllCategories');
}

// 添加分类
export function addCategory(data: any) {
  return request.post('/backstage_category/add', data);
}

// 修改分类
export function updateCategory(data: any) {
  return request.post('/backstage_category/update', data);
}

// 批量删除分类
// 批量删除分类
export function deleteCategory(ids: number[]) {
  return request.delete('/backstage_category/delete', {
    data: { id_list: ids } // 将数据放在请求体中
  });
}
