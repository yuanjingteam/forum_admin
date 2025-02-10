import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getApiMethodsService, getApiGroupsService } from '@/api/api';

export const useApiStore = defineStore('api', () => {
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
  //存储api方法列表
  const apiMethods = ref([]);
  //获取所有api方法
  const getApiMethods = async () => {
    const {
      data: { methods }
    } = await getApiMethodsService();
    apiMethods.value = methods;
  };
  //存储api方法列表
  const apiGroups = ref([]);
  //获取所有api方法
  const getApiGroups = async () => {
    const {
      data: { groups }
    } = await getApiGroupsService();
    apiGroups.value = groups;
  };
  return { densityList, apiMethods, getApiMethods, apiGroups, getApiGroups };
});
