<script setup lang="ts">
import { reactive, ref } from 'vue';

// 定义 SearchModel 接口
export interface SearchModel {
  email: string;
  nickname: string;
  title: string;
  parent_email: string;
}

// 邮箱
const email = ref<string>('');
// 发布者
const nickname = ref<string>('');
/// 文章标题
const article_title = ref<string>('');
// 被回复的人:
const parent_email = ref<string>('');

const search = reactive({
  email: email,
  nickname: nickname,
  title: article_title,
  parent_email: parent_email
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
  article_title.value = '';
  parent_email.value = '';
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
            <a-col :span="6">
              <a-form-item field="name" label="回复邮箱:">
                <a-input
                  v-model="search.parent_email"
                  placeholder="输入邮箱,查询被回复的所有评论"
                />
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
