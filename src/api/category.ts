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
  return request.get<dynamicMenuList[]>('/category/getAllCategories');
}

// 添加菜单
export function addCategory(data: any) {
  return request.post('/category/add', data);
}

// 修改菜单
export function updateCategory(data: any) {
  return request.post('/category/update', data);
}

// 批量删除菜单
export function deleteCategory(data: any) {
  return request.post('/category/delete', data);
}
