<script setup lang="ts">
import { addDicType } from '@/api/dictionary';
import { Message } from '@arco-design/web-vue';
import { reactive } from 'vue';
import { AddDicList } from '@/api/dictionary';
// 定义模型
const addVisible = defineModel('visible', {
  type: Boolean,
  required: true
});

// 定义 emit 的类型
const emit = defineEmits<{
  (e: 'update'): void;
}>();

// 定义初始状态
const initialState: AddDicList = {
  name: '',
  code: '',
  status: 1,
  description: ''
};

// 使用 reactive 创建响应式对象
const addType = reactive<AddDicList>({
  name: '',
  code: '',
  status: 1,
  description: ''
});

// 提交添加函数
const submitAdd = async () => {
  try {
    await addDicType(addType);
    emit('update');
    Message.info('添加成功');
    // 将 addType 重置为初始状态
    Object.assign(addType, initialState);
  } catch (error) {
    Message.info(error.msg || '添加失败');
  }
};

// 取消添加函数
const cancelAdd = (): void => {
  // 将 addType 重置为初始状态
  Object.assign(addType, initialState);
};

// 切换状态函数
const switchChange = (status: number): void => {
  console.log(status);
};
</script>

<template>
  <a-modal v-model:visible="addVisible" @ok="submitAdd" @cancel="cancelAdd">
    <template #title>新增字典</template>
    <div>
      <a-form :model="addType" :style="{ width: '380px' }">
        <a-form-item
          field="name"
          tooltip="请输入标签名"
          label="标签名"
          label-col-flex="90px"
        >
          <a-input v-model="addType.name" placeholder="输入标签名..." />
        </a-form-item>
        <a-form-item
          field="description"
          tooltip="输入标签描述"
          label="标签描述"
          label-col-flex="90px"
        >
          <a-textarea
            v-model="addType.description"
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
              v-model="addType.status"
              :default-checked="addType.status == 1 ? true : false"
              :checked-value="1"
              :unchecked-value="2"
              @change="switchChange(addType.status)"
            />
            <span class="dic-state">
              {{ addType.status == 1 ? '开启' : '关闭' }}
            </span>
          </div>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<style scoped>
.dic-state {
  margin-left: 12px;
}
</style>
