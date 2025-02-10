import request from '@/api/interceptor';

//获取当前角色所有菜单权限
export function getRoleMenuService(id?: number) {
  return request.get(`/acl/get_role_menu?id=${id}`);
}
//为角色分配菜单权限
export function dispatchMenuForRoleService(data) {
  return request.post('/acl/dispatch/role_menu', data);
}
//获取所有菜单列表
export function getAllMenuListService(data) {
  return request.post('/acl/menu/getlist', data);
}
//获取所有菜单图标
export function getIconListService() {
  return request.get('/acl/icon/list');
}
//新建菜单
export function addMenuService(data) {
  return request.post('/acl/menu/add', data);
}
//获取当前角色的api权限
export function getAllApiListService(id) {
  return request.get(`/acl/get_role_api?id=${id}`);
}
//为角色分配api权限
export function dispatchApiForRoleService(data) {
  return request.post('/acl/dispatch/role_api', data);
}
// 删除菜单
export function deleteMenuService(data: { ids: number[] }) {
  return request.delete('/acl/menu/delete', { data });
}
//获取所有api列表
export function getApiListService() {
  return request.get('/acl/api/list');
}
//修改菜单
export function editMenuService(data) {
  return request.post('/acl/menu/update', data);
}
//获取当前菜单详情
export function getMenuDetailService(id) {
  return request.get(`/acl/menu/detail?id=${id}`);
}
//获取当前角色的所有权限标识
export function getRoleAllCodeService(id) {
  return request.get(`/acl/get_role_code?id=${id}`);
}
//获取所有type为1和2的菜单
export function getMenuTypeService() {
  return request.get('/acl/get_menu_type_list');
}
