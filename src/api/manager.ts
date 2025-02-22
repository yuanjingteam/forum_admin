import request from '@/api/interceptor';

export interface ManagerDetail {
  id: number;
  name: string;
  email: string;
  role_ids: number[];
  avatar: string;
}

export interface ManagerList {
  administrator_list: {
    id: number;
    name: string;
    email: string;
    role_ids: number[];
    avatar: string;
    last_login_time: string;
    created_at: string;
  }[];
}

export interface SearchModel {
  name: string;
  email: string;
}

// 获取管理员列表
export const getManagerList = (data: SearchModel) => {
  return request.get<ManagerList>('/backstage_manager/batch_query', {
    params: data
  });
};

// 新增管理员
export const addManager = data => {
  return request.post<ManagerList>('/backstage_manager/add', data);
};

// 修改管理员
export const updateManager = data => {
  return request.post<ManagerList>('/backstage_manager/update', data);
};

// 删除管理员
export const deleteManager = (data: { id: number }) => {
  return request.delete<ManagerList>('/backstage_manager/delete', { data });
};

// 获取管理员详细信息
export const getManagerDetail = (data: { id: number }) => {
  return request.get<ManagerDetail>('/backstage_manager/query', {
    params: data
  });
};

// 重置密码
export const resetPassword = (data: { id: number }) => {
  return request.post<ManagerList>('/backstage_manager/reset_password', data);
};

// // 导入
// export const importManager = (data: FormData) => {
//   return request.post<ManagerList>('/backstage_manager/import', data);
// };

// // 导出
// export const exportManager = () => {
//   return request.get<ManagerList>('/backstage_manager/export', {
//   });
// };
