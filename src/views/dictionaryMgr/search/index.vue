<script setup lang="ts">
import { reactive, ref, defineEmits } from 'vue';

const label = ref('');
const status = ref(0);
const create_at = ref([]);

const search = reactive({
  label: label,
  status: status,
  create_at: create_at
});

// 查询
// 定义更新事件  清空
const emit = defineEmits(['search', 'clearAll']);

// 搜索
const handleSearch = () => {
  console.log(search, 2131);
  emit('search', search);
};

// 重置
const handleReset = () => {
  label.value = '';
  status.value = 0;
  create_at.value = [];
  emit('clearAll', search);
};

const onChange = (dateString, date) => {
  console.log('onChange: ', dateString, date);
  console.log(create_at.value, 12313);
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
              <a-form-item field="status" label="是否禁用:">
                <a-select
                  v-model="search.status"
                  :style="{ width: '320px' }"
                  placeholder="Please select ..."
                >
                  <a-option :value="0">正常</a-option>
                  <a-option :value="1">禁用</a-option>
                  <a-option disabled>敬请期待</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="7">
              <a-form-item field="create_at" label="创建时间:">
                <a-range-picker
                  v-model="create_at"
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
