<script setup lang="ts">
import { addTag } from '@/api/tag';
import { Message } from '@arco-design/web-vue';
import { reactive, ref } from 'vue';
import { userUploadApi } from '@/api/user-center';
import { AddTagList } from '@/api/tag';
import useLoading from '@/hooks/useLoading';
import type {
  FileItem,
  RequestOption
} from '@arco-design/web-vue/es/upload/interfaces';

const { loading, setLoading } = useLoading(false);

// 定义模型
const addVisible = defineModel('visible', {
  type: Boolean,
  required: true
});

// 定义 emit 的类型
const emit = defineEmits<{
  (e: 'update'): void;
}>();

// 添加标签图片
const file = ref({
  uid: '-2',
  name: 'avatar.png',
  url: ''
});

const fileList = ref<FileItem[]>([file.value]);

// 定义初始状态
const initialState: AddTagList = {
  name: '',
  description: '',
  article_count: null,
  heat: null,
  fans_count: null,
  path: ['']
};
// 使用 reactive 创建响应式对象
const addType = reactive<AddTagList>({
  name: '',
  description: '',
  article_count: null,
  heat: null,
  fans_count: null,
  path: ['']
});
const formRef = ref();

// 提交添加函数
const submitAdd = async () => {
  const vaild = await formRef.value.validate();
  try {
    if (!vaild) {
      await addTag(addType);
      console.log(addType, 1231);
      emit('update');
      Message.info('添加成功');
      // 将 addType 重置为初始状态
      Object.assign(addType, initialState);
      fileList.value[0].url = '';
      file.value.url = '';
    } else {
      addVisible.value = true;
    }
  } catch (error) {
    Message.info(error.msg || '添加失败');
  }
};

// 取消添加函数
const cancelAdd = (): void => {
  // 将 addType 重置为初始状态
  Object.assign(addType, initialState);
};

// 上传文件变化的处理函数
const onChange = (_, currentFile) => {
  file.value = {
    ...currentFile
  };
};

// 自定义请求上传头像
const customRequest = (options: RequestOption) => {
  const controller = new AbortController(); // 创建一个 AbortController 实例

  (async () => {
    const { onError, onSuccess, fileItem, name = 'files' } = options; // 解构选项
    const formData = new FormData(); // 创建 FormData 对象
    formData.append('width', '200');
    formData.append(name as string, fileItem.file as Blob); // 将文件添加到 FormData
    try {
      setLoading(true);
      // 调用文件上传 API
      const res = await userUploadApi(formData);
      addType.path[0] = res.data[0].url;
      onSuccess(res); // 成功时调用成功回调
    } catch (error) {
      onError(error); // 发生错误时调用错误回调
    } finally {
      setLoading(false);
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
  <a-drawer
    v-model:visible="addVisible"
    :width="450"
    unmountOnClose
    @ok="submitAdd"
    @cancel="cancelAdd"
  >
    <template #title>新增标签</template>
    <div>
      <a-form ref="formRef" :model="addType" :style="{ width: '380px' }">
        <a-form-item
          field="name"
          tooltip="请输入标签名"
          label="标签名"
          label-col-flex="90px"
          :rules="[{ required: true, message: '标签名不能为空' }]"
        >
          <a-input v-model="addType.name" placeholder="输入标签名..." />
        </a-form-item>
        <a-form-item
          field="description"
          tooltip="输入标签描述"
          label="标签描述"
          label-col-flex="90px"
          :rules="[{ required: true, message: '标签描述不能为空' }]"
        >
          <a-textarea
            v-model="addType.description"
            placeholder="输入标签描述..."
            :auto-size="{ minRows: 3, maxRows: 6 }"
          />
        </a-form-item>
        <a-form-item
          field="path"
          tooltip="点击添加/修改图片"
          label="添加图片"
          label-col-flex="90px"
          label-align="left"
        >
          <a-upload
            :custom-request="customRequest"
            list-type="picture-card"
            :file-list="fileList"
            :show-upload-button="true"
            :show-file-list="false"
            @change="onChange"
          >
            <template #upload-button>
              <div>
                <div
                  v-if="file && file.url"
                  class="arco-upload-list-picture custom-upload-avatar"
                >
                  <img :src="file.url" />
                  <div class="arco-upload-list-picture-mask">
                    <IconEdit />
                  </div>
                </div>
                <div v-else class="arco-upload-picture-card">
                  <div class="arco-upload-picture-card-text">
                    <IconPlus />
                    <div style="margin-top: 10px; font-weight: 600">Upload</div>
                  </div>
                </div>
              </div>
            </template>
          </a-upload>
        </a-form-item>
      </a-form>
    </div>
  </a-drawer>
</template>

<style scoped lang="less"></style>
