<script setup lang="ts">
import { ref, watch } from 'vue';
import { Message } from '@arco-design/web-vue';
import { updateTag } from '@/api/tag';
import type {
  FileItem,
  RequestOption
} from '@arco-design/web-vue/es/upload/interfaces';
import { userUploadApi } from '@/api/user-center';

const emit = defineEmits(['refresh']);
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

const file = ref({
  uid: '',
  name: '',
  url: ''
});

const fileList = ref<FileItem[]>([file.value]);

const uploadChange = (fileItemList: FileItem[], fileItem: FileItem) => {
  fileList.value = [fileItem];
};

const editOk = () => {
  console.log(edit.value);
};
const editCancel = () => {};

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
      edit.value.path = res.data[0].url;
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
    formData.append('path', edit.value.path.toString());

    await updateTag(formData);
    emit('refresh');
    Message.info('修改成功');
    // 通知父组件刷新
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
    file.value.url = newValue.path;
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
            <a-textarea
              v-model="edit.description"
              placeholder="输入标签描述..."
              :auto-size="{ minRows: 3, maxRows: 6 }"
            />
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
