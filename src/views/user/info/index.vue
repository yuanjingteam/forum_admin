<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import UserPanel from './components/user-panel.vue';
import BasicInformation from './components/basic-information.vue';
import SecuritySettings from './components/security-settings.vue';
import type { BasicInfoModel } from '@/api/user-center';
import { getPersonalInfo } from '@/api/user-center';

const userInfo = ref<BasicInfoModel | null>({
  id: 0,
  nickname: '',
  career_direction: '',
  user_home_page: '',
  user_signature: '',
  path: '',
  user_tags: [],
  all_tag_names: []
});

const PersonalInfo = async () => {
  try {
    // 获取用户个人信息
    const { data } = await getPersonalInfo();
    userInfo.value = data as BasicInfoModel; // 更新为获取到的数据
    console.log(userInfo.value, '111111111111111');
  } catch (error) {
    console.error('获取个人信息失败:', error);
  }
};

onMounted(() => {
  PersonalInfo(); // 调用异步函数
  console.log(111);
});
</script>

<script lang="ts">
export default {
  name: 'Setting'
};
</script>

<template>
  <div class="container">
    <Breadcrumb :items="['用户菜单', '用户信息']" />
    <a-row style="margin-bottom: 16px">
      <a-col :span="24">
        <UserPanel v-model:userInfo="userInfo" />
      </a-col>
    </a-row>
    <a-row class="wrapper">
      <a-col :span="24">
        <a-tabs default-active-key="1" type="rounded">
          <a-tab-pane key="1" title="基础信息">
            <BasicInformation v-model:userInfo="userInfo" />
          </a-tab-pane>
          <a-tab-pane key="2" title="账号设置">
            <SecuritySettings />
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped lang="less">
.container {
  padding: 0 20px 20px;
}

.wrapper {
  min-height: 580px;
  padding: 20px 0 0 20px;
  background-color: var(--color-bg-2);
  border-radius: 4px;
}

:deep(.section-title) {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 14px;
}
</style>
