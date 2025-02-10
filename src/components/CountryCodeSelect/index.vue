<!-- 实现了一个国家代码选择下拉框，选择后会显示对应的国家代码和中文名称，
在功能上可以用于选择国家或地区。下拉框的样式和行为通过 Vue 和 Ant Design Vue 的属性和插槽机制进行定制。 -->
<template>
  <a-select
    v-model="value"
    style="width: 85px; padding-right: 6px"
    :options="countryCodes"
    :field-names="fieldNames"
    :triggerProps="{
      contentStyle: { width: '200px' }
    }"
    unmount-on-close
  >
    <template #label="{ data }">
      <span>+{{ data?.code }}</span>
    </template>
    <template #option="{ data }">+{{ data?.code }} {{ data?.zh }}</template>
  </a-select>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import countryCodes from './country-code.json';

// countryCodes排序
countryCodes.sort((a, b) => Number(a.code) - Number(b.code));

const value = ref('86');
const fieldNames = {
  label: 'zh',
  value: 'code'
};
</script>

<style lang="less" scoped>
:deep(.arco-select-view-suffix) {
  padding-left: 6px;
}
</style>
