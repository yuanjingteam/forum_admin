import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getRoleNameService } from '@/api/role';

export const useUserManageStore = defineStore('userManage', () => {
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
  //下拉框用户状态内容
  const filterMethodOptions = [
    {
      label: '正常',
      value: 1
    },
    {
      label: '封禁',
      value: 2
    }
  ];
  //记录所有角色的名称列表
  const roleNameList = ref([]);
  //获取所有角色列表名称的方法
  const getRoleNameList = async () => {
    const {
      data: {
        data: { role_list }
      }
    } = await getRoleNameService();
    roleNameList.value = role_list;
  };
  return { densityList, filterMethodOptions, roleNameList, getRoleNameList };
});
