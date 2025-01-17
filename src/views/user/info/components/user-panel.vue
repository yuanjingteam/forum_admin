<script lang="ts" setup>
import { ref, computed } from 'vue';
import type {
  FileItem,
  RequestOption
} from '@arco-design/web-vue/es/upload/interfaces';
import { userUploadApi } from '@/api/user-center';
import { useUserStore } from '@/store';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';
import type { BasicInfoModel } from '@/api/user-center';
import { updatePersonalInfo } from '@/api/user-center';

const userStore = useUserStore();
const userInfo = defineModel('userInfo', {
  type: Object as () => BasicInfoModel,
  required: true
});

// 更新用户个人资料
// const userBasic = ref(userInfo)

// 单独提取出需要的用户个人资料
const { all_tag_names, ...reset } = userInfo.value;

console.log(userStore.email, 3424);

const file = computed(() => ({
  uid: '-2',
  name: 'avatar.png',
  url: userInfo.value.path
}));

// 创建 renderData 的计算属性
const renderData = computed(
  () =>
    [
      {
        label: '用户ID',
        value: userInfo.value.id
      },
      {
        label: '用户状态',
        value: '封禁' // 使用默认值
      },
      {
        label: '用户邮箱',
        value: userStore.email
      },
      {
        label: '用户角色',
        value: userInfo.value.all_tag_names
      }
    ] as DescData[]
);
const fileList = ref<FileItem[]>([file.value]);
const uploadChange = (_fileItemList: FileItem[], fileItem: FileItem) => {
  fileList.value = [fileItem];
};

// const uploadProgress = ref(0); // 用于存储上传进度

const customRequest = (options: RequestOption) => {
  const controller = new AbortController(); // 创建一个 AbortController 实例

  (async function requestWrap() {
    // 自执行异步函数
    const {
      onProgress,
      onError,
      onSuccess,
      fileItem,
      name = 'files'
    } = options; // 解构选项
    onProgress(20); // 初始进度更新
    const formData = new FormData(); // 创建 FormData 对象
    formData.append('width', '200');
    formData.append(name as string, fileItem.file as Blob); // 将文件添加到 FormData

    try {
      // 调用文件上传 API
      const res = await userUploadApi(formData);

      await updatePersonalInfo({
        ...reset,
        path: res.data[0].url
      });
      onSuccess(res); // 成功时调用成功回调
    } catch (error) {
      onError(error); // 发生错误时调用错误回调
    }
  })(); // 立即执行异步请求
  return {
    abort() {
      // 返回一个包含 abort 方法的对象
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
              {{ item }}
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
