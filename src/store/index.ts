import { createPinia } from 'pinia';
import useAppStore from './modules/app';
import { usePermissionNavStore } from './modules/permission';
import useUserStore from './modules/user';
import useTabBarStore from './modules/tab-bar';
import { useMenuStore } from './modules/menu';
import { useApiStore } from './modules/apiManage';
import { useUserManageStore } from './modules/userManage';

const pinia = createPinia();

export {
  useAppStore,
  useTabBarStore,
  useUserStore,
  useMenuStore,
  useApiStore,
  useUserManageStore,
  usePermissionNavStore
};
export default pinia;
