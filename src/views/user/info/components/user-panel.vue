<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue';
import type {
  FileItem,
  RequestOption
} from '@arco-design/web-vue/es/upload/interfaces';
import { userUploadApi } from '@/api/user-center';
import { useUserStore } from '@/store';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';
import type { PersonalInfoModel } from '@/api/user-center';
import { updatePersonalInfo } from '@/api/user-center';
import { getPersonalInfo } from '@/api/user-center';
const userStore = useUserStore();

const userInfo = ref<PersonalInfoModel | null>({
  id: 0,
  avatar_path: '',
  nickname: '',
  email: '',
  user_status: 0,
  role_ids: []
});

const personalInfo = async () => {
  try {
    // 获取用户个人信息
    const { data } = await getPersonalInfo(userStore.id);
    userInfo.value = data as PersonalInfoModel; // 更新为获取到的数据
    console.log(userInfo.value, '111111111111111');
  } catch (error) {
    console.error('获取个人信息失败:', error);
  }
};

onMounted(() => {
  personalInfo(); // 调用异步函数
  console.log(111);
});

// 单独提取出需要的用户个人资料
// const reset = computed(() => {
//   const { avatar_path, ...rest } = userInfo.value; // 使用动态数据
//   return rest; // 返回需要的字段
// });

// 获取到父传子的头像
const file = computed(() => ({
  uid: '-2',
  name: 'avatar.png',
  url: userInfo.value.avatar_path
}));

// 创建 renderData 的计算属性
const renderData = computed<DescData[]>(() => {
  return [
    {
      label: '用户ID',
      value: userInfo.value.id
    },
    {
      label: '用户状态',
      value: userInfo.value.user_status // 使用默认值
    },
    {
      label: '用户邮箱',
      value: userInfo.value.email
    },
    {
      label: '用户角色',
      value: userInfo.value.role_ids
    }
  ] as DescData[]; // 强制类型断言
});
// 用户头像
const fileList = ref<FileItem[]>([file.value]);

// 更新头像
const uploadChange = (fileItemList: FileItem[], fileItem: FileItem) => {
  fileList.value = [fileItem];
};

// 当头像变化就动态更新
watch(file, newFile => {
  fileList.value = [newFile];
});

// 自定义请求上传头像
const customRequest = (options: RequestOption) => {
  const controller = new AbortController(); // 创建一个 AbortController 实例

  (async () => {
    const { onError, onSuccess, fileItem, name = 'files' } = options; // 解构选项
    const formData = new FormData(); // 创建 FormData 对象
    formData.append('width', '200');
    formData.append(name as string, fileItem.file as Blob); // 将文件添加到 FormData

    try {
      // 调用文件上传 API
      const res = await userUploadApi(formData);
      const url = res.data[0].url;

      await updatePersonalInfo({
        ...userInfo.value,
        avatar_path: url
      });

      onSuccess(res); // 成功时调用成功回调
    } catch (error) {
      onError(error); // 发生错误时调用错误回调
    }
  })(); // 立即执行异步请求

  return {
    abort() {
      controller.abort(); // 调用 abort 方法取消请求
    }
  };
};
</script>

<template>
  <a-card :bordered="false">
    <a-space :size="54">
      <a-upload
        :custom-request="customRequest"
        list-type="picture-card"
        :file-list="fileList"
        :show-upload-button="true"
        :show-file-list="false"
        @change="uploadChange"
      >
        <template #upload-button>
          <a-avatar :size="100" class="info-avatar">
            <template #trigger-icon>
              <icon-camera />
            </template>
            <img v-if="fileList.length" :src="fileList[0].url" />
          </a-avatar>
        </template>
      </a-upload>
      <!-- <a-progress v-if="uploadProgress > 0" :percent="uploadProgress" /> -->
      <a-descriptions
        :data="renderData"
        :column="2"
        align="right"
        layout="inline-horizontal"
        :label-style="{
          width: '140px',
          fontWeight: 'normal',
          color: 'rgb(var(--gray-8))'
        }"
        :value-style="{
          width: '200px',
          paddingLeft: '8px',
          textAlign: 'left'
        }"
      >
        <template #label="{ label }">{{ label }} :</template>
        <template #value="{ value, data }">
          <a-tag
            v-if="data.label === '用户状态'"
            :color="value === 1 ? 'green' : 'red'"
            size="small"
          >
            {{ value === 1 ? '正常' : '封禁' }}
          </a-tag>

          <span v-else-if="data.label === '用户角色'">
            <a-tag v-for="(item, index) in value" :key="index">
              {{ item === 1 ? '管理员' : '普通用户' }}
            </a-tag>
          </span>
          <span v-else>{{ value }}</span>
        </template>
      </a-descriptions>
    </a-space>
  </a-card>
</template>

<style scoped lang="less">
.arco-card {
  padding: 14px 0 4px 4px;
  border-radius: 4px;
}

:deep(.arco-avatar-trigger-icon-button) {
  width: 32px;
  height: 32px;
  line-height: 32px;
  background-color: #e8f3ff;

  .arco-icon-camera {
    margin-top: 8px;
    font-size: 14px;
    color: rgb(var(--arcoblue-6));
  }
}
</style>
