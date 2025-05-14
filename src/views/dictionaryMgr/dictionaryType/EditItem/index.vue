<script setup lang="ts">
import { ref, watch } from 'vue';
import { Message } from '@arco-design/web-vue';
import { updateDicType, EditDicList } from '@/api/dictionary';

const props = defineProps<{
  editData: EditDicList; // 使用定义的类型
}>();

// 定义emit通知更新
const emit = defineEmits<{
  (e: 'update'): void;
}>();

// 修改
const editVisible = defineModel('visible', {
  type: Boolean,
  required: true
});

const edit = ref<EditDicList>({ ...props.editData }); // 创建一个拷贝

const formLoading = ref<boolean>(false);

// 点击确定
const editOk = () => {
  // console.log(edit.value);
};

// 取消修改
const editCancel = () => {};

const switchChange = (status: number): void => {
  console.log(status);
};

// 提交修改
const submitEdit = async (): Promise<boolean> => {
  try {
    formLoading.value = true;
    await updateDicType(edit.value);
    Message.info('修改成功');
    emit('update');
    return true;
  } catch (error) {
    Message.info(error.msg);
    return false;
  } finally {
    formLoading.value = false;
  }
};

// 监听 props 的变化，更新本地响应式对象
watch(
  () => props.editData,
  async (newValue: EditDicList) => {
    edit.value = { ...newValue }; // 更新 edit 的值
  }
);
</script>

<template>
  <a-drawer
    v-model:visible="editVisible"
    :width="420"
    unmountOnClose
    @before-ok="submitEdit"
    @ok="editOk"
    @cancel="editCancel"
  >
    <template #title>修改标签信息:</template>
    <a-spin :loading="formLoading" tip="This may take a while..." class="main">
      <div class="drawer">
        <a-form :model="edit" :style="{ width: '380px' }">
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
              auto-size
            />
          </a-form-item>

          <a-form-item
            field="description"
            tooltip="标签状态"
            label="标签状态"
            label-col-flex="90px"
          >
            <div>
              <a-switch
                v-model="edit.status"
                :default-checked="edit.status == 1 ? true : false"
                :checked-value="1"
                :unchecked-value="2"
                @change="switchChange(edit.status)"
              />
              <span class="dic-state">
                {{ edit.status == 1 ? '开启' : '关闭' }}
              </span>
            </div>
          </a-form-item>
        </a-form>
      </div>
    </a-spin>
  </a-drawer>
</template>

<style scoped>
.dic-state {
  margin-left: 12px;
}
</style>
