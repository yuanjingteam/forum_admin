<script setup lang="ts">
import { addDicType } from '@/api/dictionary';
import { Message } from '@arco-design/web-vue';
import { reactive, defineEmits } from 'vue';

const addVisible = defineModel('visible', {
  type: Boolean,
  required: true
});

const emit = defineEmits(['update']);

const initialState = {
  name: '',
  code: '',
  status: 0,
  description: ''
};

const addType = reactive({
  name: '',
  code: '',
  status: 0,
  description: ''
});

const submitAdd = async () => {
  try {
    await addDicType(addType);
    emit('update');
    Message.info('添加成功');
    // 将 addType 重置为初始状态
    Object.assign(addType, initialState);
  } catch (error) {
    Message.info(error.msg);
  }
};

const cancelAdd = async () => {
  // 将 addType 重置为初始状态
  Object.assign(addType, initialState);
};

// 是否封禁
const switchChange = state => {
  console.log(state);
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
              :default-checked="addType.status == 0 ? true : false"
              :checked-value="0"
              :unchecked-value="1"
              @change="switchChange(addType.status)"
            />
            <span class="dic-state">
              {{ addType.status == 0 ? '开启' : '关闭' }}
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
