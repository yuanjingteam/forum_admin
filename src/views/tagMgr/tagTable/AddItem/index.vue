<script setup lang="ts">
import { addTag } from '@/api/tag';
import { Message } from '@arco-design/web-vue';
import { reactive, ref } from 'vue';
import { upLoadFile } from '@/api/upload';
import { AddTagList } from '@/api/tag';
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
const file = ref(null);
const url = ref('');

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

const onChange = async (_, currentFile) => {
  // 更新 file 的值
  file.value = {
    ...currentFile
    // 如果需要，可以创建文件的 URL
    // url: URL.createObjectURL(currentFile.file),
  };

  // 创建 FormData 对象
  const formData = new FormData();
  const width = '20';

  // 确保正确附加文件
  formData.append('file', currentFile.file); // 使用 'file' 作为字段名
  formData.append('width', width); // 直接设置 width 的值为 20

  try {
    // 调用上传文件的接口
    const { data } = await upLoadFile(formData);
    url.value = data.data.url;
    console.log('上传成功:', url);
  } catch (error) {
    console.error('上传失败:', error);
  }
};

const onProgress = currentFile => {
  file.value = currentFile;
};
</script>

<template>
  <a-modal v-model:visible="addVisible" @ok="submitAdd" @cancel="cancelAdd">
    <template #title>新增标签</template>
    <div>
      <a-form ref="formRef" :model="addType" :style="{ width: '380px' }">
        <a-form-item
          field="name"
          tooltip="请输入标签名"
          label="标签名"
          label-col-flex="115px"
          :rules="[{ required: true, message: '标签名不能为空' }]"
        >
          <a-input v-model="addType.name" placeholder="输入标签名..." />
        </a-form-item>
        <a-form-item
          field="description"
          tooltip="输入标签描述"
          label="标签描述"
          label-col-flex="115px"
          :rules="[{ required: true, message: '标签描述不能为空' }]"
        >
          <a-textarea
            v-model="addType.description"
            placeholder="输入标签描述..."
            auto-size
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
            action="/"
            :fileList="file ? [file] : []"
            :show-file-list="false"
            list-type="picture-card"
            @change="onChange"
            @progress="onProgress"
          >
            <template #upload-button>
              <div
                :class="`arco-upload-list-item${
                  file && file.status === 'error'
                    ? ' arco-upload-list-item-error'
                    : ''
                }`"
              >
                <div
                  v-if="file && file.url"
                  class="arco-upload-list-picture custom-upload-avatar"
                >
                  <img :src="file.url" />
                  <div class="arco-upload-list-picture-mask">
                    <IconEdit />
                  </div>
                  <a-progress
                    v-if="file.status === 'uploading' && file.percent < 100"
                    :percent="file.percent"
                    type="circle"
                    size="mini"
                    :style="{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translateX(-50%) translateY(-50%)'
                    }"
                  />
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
  </a-modal>
</template>

<style scoped lang="less"></style>
