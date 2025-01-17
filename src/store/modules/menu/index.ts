import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getIconListService, getAllMenuListService } from '@/api/menu';
// import { convertToHierarchy } from '@/utils/convertToHierarchy';

//话题分类列表管理
export const useMenuStore = defineStore('menu', () => {
  //存储菜单图标列表
  const iconList = ref([]);
  //获取菜单图标列表
  const getIconList = async () => {
    const {
      data: {
        data: { icon_list }
      }
    } = await getIconListService();
    iconList.value = icon_list;
  };
  //下拉框权限点状态内容
  const aclStatusOptions = [
    {
      label: '正常',
      value: 1
    },
    {
      label: '隐藏',
      value: 2
    }
  ];
  //下拉框权限点类型内容
  const aclTypesOptions = [
    {
      label: '目录',
      value: '1'
    },
    {
      label: '菜单',
      value: '2'
    },
    {
      label: '按钮',
      value: '3'
    }
  ];
  //下拉框父级菜单内容
  const menuList = ref([]);
  const getMenuList = async () => {
    const {
      data: {
        data: { menus }
      }
    } = await getAllMenuListService({});
    menuList.value = menus;
  };
  //密度数据
  const densityList = [
    {
      name: '迷你',
      value: 'mini'
    },
    {
      name: '偏小',
      value: 'small'
    },
    {
      name: '中等',
      value: 'medium'
    },
    {
      name: '偏大',
      value: 'large'
    }
  ];
  const typeOptions = [
    { label: '目录', value: '1' },
    { label: '菜单', value: '2' },
    { label: '按钮', value: '3' }
  ];
  return {
    typeOptions,
    densityList,
    iconList,
    getIconList,
    aclStatusOptions,
    aclTypesOptions,
    menuList,
    getMenuList
  };
});
