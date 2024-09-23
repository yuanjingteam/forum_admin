<script setup lang="ts">
import { ref, defineModel, defineProps, watch } from 'vue';
import { Message } from '@arco-design/web-vue';
import { updateTag } from '@/api/tag';

// 批量删除
const editVisible = defineModel('visible', {
  type: Boolean,
  required: true
});
const props = defineProps({
  editData: {
    type: Object as () => {
      id: number;
      name: string;
      description: string;
      article_count: number;
      heat: number;
      fans_count: number;
      path: string;
    },
    required: true,
    default: () => ({
      id: -1,
      name: '',
      description: '',
      article_count: 0,
      heat: 0,
      fans_count: 0,
      path: ''
    })
  }
});
const edit = ref({ ...props.editData }); // 创建一个拷贝
const formLoading = ref(false);
// 修改标签图片
const file = ref(null);

const onChange = (_, currentFile) => {
  file.value = {
    ...currentFile
    // url: URL.createObjectURL(currentFile.file),
  };
  console.log(file.value, 2341231);
};
const onProgress = currentFile => {
  file.value = currentFile;
};

const editOk = () => {
  console.log(edit.value);
};
const editCancel = () => {};

// Promise 表示这个函数会返回一个 Promise 对象，这个 Promise 在完成时会解析为以下类型：
const convertToFiles = async (
  path: string
): Promise<{ uid: string; name: string; url: string; file?: File } | null> => {
  try {
    // 使用 fetch 下载图片数据
    const response = await fetch(path);

    // 检查响应是否成功
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob(); // 转换为 Blob 对象
    const fileName = path.split('/').pop() || 'unknown.png'; // 获取文件名，默认文件名为 'unknown.png'

    // 创建 File 对象
    const file = new File([blob], fileName, { type: blob.type });

    console.log('success');

    // 返回符合你需要格式的对象
    return {
      uid: String(Date.now()), // 生成唯一的 uid
      name: fileName,
      url: path, // 使用原始链接
      file: file // 可选，保留对 File 对象的引用
    };
  } catch (error) {
    console.error('Error converting to files:', error);
    return null; // 返回 null 或者根据需要返回一个适当的错误对象
  }
};

const submitEdit = async () => {
  try {
    formLoading.value = true;
    const formData = new FormData();
    formData.append('id', edit.value.id.toString());
    formData.append('name', edit.value.name.toString());
    formData.append('description', edit.value.description.toString());
    formData.append('article_count', edit.value.article_count.toString());
    formData.append('heat', edit.value.heat.toString());
    formData.append('fans_count', edit.value.fans_count.toString());
    formData.append('upload[]', file.value); // 使用上传的文件
    console.log(file.value, 213123);

    await updateTag(formData);
    Message.info('修改成功');
    return true;
  } catch (error) {
    Message.info(error.msg);
    return false;
  } finally {
    formLoading.value = false;
  }
};

const formatter = value => {
  const values = value.split('.');
  values[0] = values[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return values.join('.');
};

const parser = value => {
  return value.replace(/,/g, '');
};

// 监听 props 的变化，更新本地响应式对象
watch(
  () => props.editData,
  async newValue => {
    edit.value = { ...newValue };
    file.value = await convertToFiles(newValue.path);
  }
);
</script>

<template>
  <a-drawer
    v-model:visible="editVisible"
    :width="380"
    unmountOnClose
    @before-ok="submitEdit"
    @ok="editOk"
    @cancel="editCancel"
  >
    <template #title>修改标签信息:</template>
    <a-spin :loading="formLoading" tip="This may take a while..." class="main">
      <div class="drawer">
        <a-form :model="edit" :style="{ width: '340px' }">
          <a-form-item
            field="path"
            tooltip="点击头像进行修改"
            label="修改头像"
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
                      <div style="margin-top: 10px; font-weight: 600">
                        Upload
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </a-upload>
          </a-form-item>
          <a-form-item
            field="name"
            tooltip="请输入标签名"
            label="标签名"
            label-col-flex="90px"
          >
            <a-input v-model="edit.name" placeholder="输入标签名..." />
          </a-form-item>
          <a-form-item
            field="description"
            tooltip="输入标签描述"
            label="标签描述"
            label-col-flex="90px"
          >
            <a-input v-model="edit.description" placeholder="输入标签描述..." />
          </a-form-item>
          <a-form-item
            field="article_count"
            tooltip="该标签关联的文章数量(不建议修改)"
            label="关联文章数"
            label-col-flex="90px"
          >
            <a-input-number
              v-model="edit.article_count"
              placeholder="输入关联文章数..."
              :parser="parser"
              :formatter="formatter"
              :min="0"
              :max="100000"
            />
          </a-form-item>
          <a-form-item
            field="heat"
            tooltip="标签热度"
            label="标签热度"
            label-col-flex="90px"
          >
            <a-input-number
              v-model="edit.heat"
              placeholder="请输入热度值..."
              :parser="parser"
              :formatter="formatter"
              :min="0"
              :max="100000"
            />
          </a-form-item>
          <a-form-item
            field="fans_count"
            tooltip="关注人数(不建议修改)"
            label="关注人数"
            label-col-flex="90px"
          >
            <a-input-number
              v-model="edit.fans_count"
              placeholder="修改关注人数..."
              :parser="parser"
              :formatter="formatter"
              :min="0"
              :max="100000"
            />
          </a-form-item>
        </a-form>
      </div>
    </a-spin>
  </a-drawer>
</template>

<style scoped></style>
