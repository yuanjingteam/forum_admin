<!-- 动态表单组件，允许根据 options 数组中的数据渲染多个表单项（如开关）。
每个表单项显示名称并使用 form-wrapper 组件处理输入。通过 handleChange 方法，
可以响应用户的输入变化。整体上，它提供了一种灵活的方式来设置和管理多个选项的状态。 -->
<template>
  <div class="block">
    <h5 class="title">{{ title }}</h5>
    <div v-for="option in options" :key="option.name" class="switch-wrapper">
      <span>{{ option.name }}</span>
      <form-wrapper
        :type="option.type || 'switch'"
        :name="option.key"
        :default-value="option.defaultVal"
        @input-change="handleChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { useAppStore } from '@/store';
import FormWrapper from './form-wrapper.vue';

interface OptionsProps {
  name: string;
  key: string;
  type?: string;
  defaultVal?: boolean | string | number;
}
defineProps({
  title: {
    type: String,
    default: ''
  },
  options: {
    type: Array as PropType<OptionsProps[]>,
    default() {
      return [];
    }
  }
});
const appStore = useAppStore();
const handleChange = async ({
  key,
  value
}: {
  key: string;
  value: unknown;
}) => {
  if (key === 'colorWeak') {
    document.body.style.filter = value ? 'invert(80%)' : 'none';
  }
  if (key === 'topMenu') {
    appStore.updateSettings({
      menuCollapse: false
    });
  }
  appStore.updateSettings({ [key]: value });
};
</script>

<style scoped lang="less">
.block {
  margin-bottom: 24px;
}

.title {
  padding: 0;
  margin: 10px 0;
  font-size: 14px;
}

.switch-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
}
</style>
