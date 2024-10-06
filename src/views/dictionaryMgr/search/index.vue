<script setup lang="ts">
import { ref, computed } from 'vue';
import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';

export interface SearchItemModel {
  label: string;
  status: number;
  create_at: string[]; // 根据实际需求调整类型，例如可以使用 Date[]
}

// 生成搜索模型的函数
const generateSearchModel = (): SearchItemModel => {
  return {
    label: '',
    status: 0,
    create_at: []
  };
};

const search = ref<SearchItemModel>(generateSearchModel());

const selectOptions = computed<SelectOptionData[]>(() => [
  { label: '全部', value: 0 },
  { label: '正常', value: 1 },
  { label: '禁用', value: 2 },
  { label: '敬请期待', value: 3, disabled: true }
]);

// 定义更新事件
const emit = defineEmits<{
  (e: 'search', searchModel: SearchItemModel): void;
  (e: 'clearAll', searchModel: SearchItemModel): void;
}>();

// 搜索
const handleSearch = () => {
  console.log(search.value, 2131);
  emit('search', search.value);
};

// 重置
const handleReset = () => {
  search.value = generateSearchModel(); // 重置为初始状态
  emit('clearAll', search.value);
};

// 日期变化处理
const onChange = (dateString, date) => {
  console.log('onChange: ', dateString, date);
};
</script>

<template>
  <a-card class="general-card" title="搜索查询:">
    <a-row>
      <a-col :flex="1">
        <a-form
          :model="search"
          :label-col-props="{ span: 6 }"
          :wrapper-col-props="{ span: 18 }"
          label-align="left"
        >
          <a-row :gutter="16">
            <a-col :span="7">
              <a-form-item field="label" label="字典标签:">
                <a-input v-model="search.label" placeholder="请输入标签名" />
              </a-form-item>
            </a-col>
            <a-col :span="7">
              <a-form-item field="status" label="启用状态:">
                <a-select
                  v-model="search.status"
                  :style="{ width: '320px' }"
                  :options="selectOptions"
                  placeholder="Please select ..."
                />
              </a-form-item>
            </a-col>
            <a-col :span="7">
              <a-form-item field="create_at" label="创建时间:">
                <a-range-picker
                  v-model="search.create_at"
                  style="width: 254px"
                  @change="onChange"
                />
              </a-form-item>
            </a-col>
            <a-col :span="3">
              <a-form-item>
                <a-button type="primary" @click="handleSearch">查询</a-button>
                <a-button @click="handleReset">重置</a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-col>
    </a-row>
  </a-card>
</template>

<style></style>
