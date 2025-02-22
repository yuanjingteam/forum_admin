<script setup lang="ts">
import { reactive, ref, Ref } from 'vue';
import type { SearchModel } from '@/api/manager';

// 邮箱
const email = ref<string>('');
// 管理员ID
const nickname = ref<string>('');

// reactive 返回的对象类型是自动推导的，而不是通过显式声明的 Ref < T > 类型。
// 因此，你不能直接将 reactive 的结果赋值给一个 Ref < T > 类型的变量。reactive 返回的是一个普通的响应式对象，而不是 Ref 类型。
const search = reactive({
  email: email,
  name: nickname
});

// 定义更新事件  清空
const emit = defineEmits<{
  (event: 'search', model: SearchModel): void;
  (event: 'clearAll', model: SearchModel): void;
}>();

// 搜索
const handleSearch = () => {
  emit('search', search);
};
// 重置
const handleReset = () => {
  email.value = '';
  nickname.value = '';
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
          <a-row :gutter="15">
            <a-col :span="4">
              <a-form-item field="email" label="邮箱:">
                <a-input v-model="search.email" placeholder="用户邮箱" />
              </a-form-item>
            </a-col>
            <a-col :span="5">
              <a-form-item field="name" label="管理员ID:">
                <a-input v-model="search.name" placeholder="请输入管理员ID" />
              </a-form-item>
            </a-col>
            <a-col :span="3">
              <a-form-item>
                <a-button
                  v-permission="['acl:comment:search']"
                  type="primary"
                  @click="handleSearch"
                >
                  查询
                </a-button>
                <a-button
                  v-permission="['acl:comment:search']"
                  @click="handleReset"
                >
                  重置
                </a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-col>
    </a-row>
  </a-card>
</template>

<style scoped></style>
