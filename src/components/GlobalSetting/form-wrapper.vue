<template>
  <!-- 这段代码实现了一个动态输入控件，根据 type 的值选择使用数字输入框或开关组件：
如果 type 为 'number'，则渲染一个数字输入框，用户可以输入数字。
如果 type 不是 'number'，则渲染一个开关，用户可以通过开关来选择 true 或 false。 -->
  <a-input-number
    v-if="type === 'number'"
    :style="{ width: '80px' }"
    size="small"
    :default-value="defaultValue as number"
    @change="handleChange"
  />
  <a-switch
    v-else
    :default-checked="defaultValue as boolean"
    size="small"
    @change="handleChange"
  />
</template>

<script lang="ts" setup>
const props = defineProps({
  type: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  defaultValue: {
    type: [String, Boolean, Number],
    default: ''
  }
});
const emit = defineEmits(['inputChange']);
const handleChange = (value: unknown) => {
  emit('inputChange', {
    value,
    key: props.name
  });
};
</script>
