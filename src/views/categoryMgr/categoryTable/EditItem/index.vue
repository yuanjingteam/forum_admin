<script setup lang="ts">
import { ref, watch } from 'vue';
import { Message } from '@arco-design/web-vue';
import { updateCategory } from '@/api/category';

const emit = defineEmits(['refresh']);
// 编辑弹窗可见性
const editVisible = defineModel('visible', {
  type: Boolean,
  required: true
});

const props = defineProps({
  editData: {
    type: Object as () => {
      id: number;
      name: string;
      icon: string;
      sort: number;
      visible: number;
      type: number;
      category_id: number;
      tag_id: number;
    },
    required: true,
    default: () => ({
      id: -1,
      name: '',
      icon: '',
      sort: 0,
      visible: 1,
      type: 0,
      category_id: 0,
      tag_id: 0
    })
  }
});

const edit = ref({ ...props.editData }); // 创建一个拷贝
const formLoading = ref(false);

// 监听props变化，更新本地数据
watch(
  () => props.editData,
  newVal => {
    edit.value = { ...newVal };
  }
);

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

// 提交编辑
const submitEdit = async () => {
  try {
    formLoading.value = true;
    await updateCategory(edit.value);
    emit('refresh');
    Message.success('修改成功');
    editVisible.value = false;
  } catch (error) {
    Message.error('修改失败');
  } finally {
    formLoading.value = false;
  }
};

// 取消编辑
const cancelEdit = () => {
  editVisible.value = false;
};
</script>

<template>
  <a-drawer
    v-model:visible="editVisible"
    :width="500"
    title="编辑分类"
    @cancel="cancelEdit"
    @before-ok="submitEdit"
  >
    <a-form
      :model="edit"
      :rules="rules"
      label-align="right"
      :label-col-props="{ span: 6 }"
      :wrapper-col-props="{ span: 18 }"
    >
      <a-form-item field="name" label="分类名称">
        <a-input v-model="edit.name" placeholder="请输入分类名称" />
      </a-form-item>
      <a-form-item field="icon" label="图标代码">
        <a-input v-model="edit.icon" placeholder="请输入图标代码" />
      </a-form-item>
      <a-form-item field="sort" label="排序">
        <a-input-number v-model="edit.sort" placeholder="请输入排序值" />
      </a-form-item>
      <a-form-item field="visible" label="可见性">
        <a-radio-group v-model="edit.visible">
          <a-radio :value="1">显示</a-radio>
          <a-radio :value="0">隐藏</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button @click="cancelEdit">取消</a-button>
      <a-button type="primary" :loading="formLoading" @click="submitEdit">
        确定
      </a-button>
    </template>
  </a-drawer>
</template>
