<script setup lang="ts">
import { reactive, ref, defineEmits } from 'vue';

// 邮箱
const email = ref('');

// 发布者
const publisher = ref('');

/// 文章标题
const article_title = ref('');

// 被回复的人:
const author = ref('');

const search = reactive({
  email: email,
  nickname: publisher,
  title: article_title,
  parent_nickname: author
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
  email.value = '';
  publisher.value = '';
  article_title.value = '';
  author.value = '';
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
              <a-form-item field="email" label="邮箱:">
                <a-input v-model="search.email" placeholder="用户邮箱" />
              </a-form-item>
            </a-col>
            <a-col :span="5">
              <a-form-item field="name" label="发布者:">
                <a-input
                  v-model="search.nickname"
                  placeholder="请输入文章作者"
                />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item field="number" label="文章标题:">
                <a-input v-model="search.title" placeholder="请输入文章标题" />
              </a-form-item>
            </a-col>
            <a-col :span="5">
              <a-form-item field="name" label="回复给:">
                <a-input
                  v-model="search.parent_nickname"
                  placeholder="请输入被回复的人"
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
