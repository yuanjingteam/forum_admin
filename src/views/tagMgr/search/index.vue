<script setup lang="ts">
import { reactive, ref, defineEmits } from 'vue';

// 邮箱
const name = ref('');

const search = reactive({
  name: name
});

// 查询
// 定义更新事件  清空
const emit = defineEmits(['search', 'clearAll']);

// 搜索
const handleSearch = () => {
  emit('search', search);
};
// 重置
const handleReset = () => {
  name.value = '';
  emit('clearAll', search);
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
            <a-col :span="5">
              <a-form-item field="name" label="标签名:">
                <a-input v-model="search.name" placeholder="请输入标签名" />
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
