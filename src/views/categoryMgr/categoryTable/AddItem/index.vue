<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Message } from '@arco-design/web-vue';
import { addCategory } from '@/api/category';
import useLoading from '@/hooks/useLoading';

// 定义模型
const addVisible = defineModel('visible', {
  type: Boolean,
  required: true
});

// 定义 emit
const emit = defineEmits(['update']);

// 定义初始状态
const initialState = {
  name: '',
  icon: '',
  sort: 0,
  visible: 1,
  type: 0,
  category_id: 0,
  tag_id: 0
};

// 使用 reactive 创建响应式对象
const formData = reactive({
  ...initialState
});

const formRef = ref();
const { loading, setLoading } = useLoading(false);

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入分类名称' },
    { maxLength: 50, message: '分类名称不能超过50个字符' }
  ],
  icon: [{ required: true, message: '请输入图标代码' }],
  sort: [
    { required: true, message: '请输入排序值' },
    { type: 'number', message: '排序值必须为数字' }
  ]
};

// 提交添加函数
const submitAdd = async () => {
  try {
    setLoading(true);
    const valid = await formRef.value.validate();
    if (!valid) {
      await addCategory(formData);
      emit('update');
      Message.success('添加成功');
      // 将表单重置为初始状态
      Object.assign(formData, initialState);
      addVisible.value = false;
    }
  } catch (error) {
    Message.error('添加失败');
  } finally {
    setLoading(false);
  }
};

// 取消添加函数
const cancelAdd = () => {
  // 将表单重置为初始状态
  Object.assign(formData, initialState);
  addVisible.value = false;
};
</script>

<template>
  <a-modal
    v-model:visible="addVisible"
    title="添加分类"
    @cancel="cancelAdd"
    @before-ok="submitAdd"
  >
    <a-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-align="right"
      :label-col-props="{ span: 6 }"
      :wrapper-col-props="{ span: 18 }"
    >
      <a-form-item field="name" label="分类名称">
        <a-input v-model="formData.name" placeholder="请输入分类名称" />
      </a-form-item>
      <a-form-item field="icon" label="图标代码">
        <a-input v-model="formData.icon" placeholder="请输入图标代码" />
      </a-form-item>
      <a-form-item field="sort" label="排序">
        <a-input-number v-model="formData.sort" placeholder="请输入排序值" />
      </a-form-item>
      <a-form-item field="visible" label="可见性">
        <a-radio-group v-model="formData.visible">
          <a-radio :value="1">显示</a-radio>
          <a-radio :value="0">隐藏</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button @click="cancelAdd">取消</a-button>
      <a-button type="primary" :loading="loading" @click="submitAdd">
        确定
      </a-button>
    </template>
  </a-modal>
</template>
