<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue';
import { getTagList } from '@/api/tag';
import type { ArticleForm } from '@/api/article';
import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
import ArticleTable from '@/views/articleManager/articleTable/index.vue';

//表格上方搜素框的样式
const customStyle = {
  marginBottom: '18px',
  border: '1px solid #e5e6eb',
  overflow: 'hidden'
};
// ---------------- 表格配置----------------

const itemType = ref('1');

const artTable1 = ref();
const artTable2 = ref();
const artTable3 = ref();

const total_1 = ref(0);
const total_2 = ref(0);
const total_3 = ref(0);
// -------------------搜索配置----------------------------
// 原始数据
const searchFromModel = (): ArticleForm => {
  return {
    startTime: '2025-01-09T00:00:00.000Z',
    endTime: '2025-02-09T00:00:00.000Z',
    keyword: '',
    article_tags: [],
    nickname: '',
    views_count: null,
    likes_count: null,
    collections_count: null,
    comments_count: null,
    heat: null,
    kind: 1 // 0: 最热 1: 最新
  };
};

// 筛选的标签项
const tag_list = ref([]);
// 筛选的创建时间
const create_time = ref([]);

// 搜索的数据
const searchModel = ref(searchFromModel());

// 获取标签
const getTags = async () => {
  const { data } = await getTagList({
    offset: 1,
    limit: 1000,
    name: ''
  });
  tag_list.value = data.tag_list;
};

// 初始化
onMounted(() => {
  // 初始化标签
  getTags();
});

// 标签项
const tagTypeOptions = computed<SelectOptionData[]>(() => [
  ...tag_list.value.map(tag => ({
    label: tag.name,
    value: tag.id
  }))
]);

// 状态栏
const stateTypeOptions = computed<SelectOptionData[]>(() => [
  {
    label: '公开',
    value: 0
  },
  {
    label: '全部',
    value: 1
  },
  {
    label: '封禁',
    value: 2
  }
]);

// 排序
const hotOptions = computed<SelectOptionData[]>(() => [
  {
    label: '最热',
    value: 0
  },
  {
    label: '最新',
    value: 1
  }
]);

// 多选框:
const selected = ref([]);
const treeData = ref([]);

// 搜索时间
const onChangeTime = dateString => {
  // searchModel.value.startTime = dateString[0];
  // searchModel.value.endTime = dateString[1];
  const startDate = new Date(dateString[0]); // 从输入的字符串创建日期对象
  const endDate = new Date(dateString[1]); // 从输入的字符串创建日期对象

  // 将日期转换为 ISO 格式并添加时区偏移
  searchModel.value.startTime = startDate.toISOString(); // 例如 "2024-11-05T07:21:28.000Z"
  searchModel.value.endTime = endDate.toISOString(); // 例如 "2024-11-05T07:21:28.000Z"
};

// 搜索
const search = () => {
  console.log(searchModel.value, 11);
  // 子组键在当前条件下刷新
  // 调用子组件的 refresh 方法
  if (itemType.value === '1') {
    artTable1.value.reFresh();
  } else if (itemType.value == '2') {
    artTable2.value.reFresh();
  } else if (itemType.value == '3') {
    artTable3.value.reFresh();
  }
};

// 重置
const reset = () => {
  searchModel.value = searchFromModel();
  search();
};
</script>

<script lang="ts">
export default {
  name: 'SearchTable'
};
</script>

<template>
  <div class="container">
    <Breadcrumb :items="['文章管理']" />
    <a-collapse :default-active-key="['1']" :bordered="false">
      <a-collapse-item key="1" header="搜索" :style="customStyle">
        <a-row>
          <a-col :flex="1">
            <a-form
              :model="searchModel"
              :label-col-props="{ span: 6 }"
              :wrapper-col-props="{ span: 18 }"
              label-align="left"
            >
              <a-row :gutter="16">
                <a-col :span="8">
                  <a-form-item field="title" label="文章标题">
                    <a-input
                      v-model="searchModel.keyword"
                      placeholder="请输入文章标题"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item field="nickname" label="作者">
                    <a-input
                      v-model="searchModel.nickname"
                      placeholder="请输入文章作者"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item field="article_tags" label="标签类型">
                    <a-select
                      v-model="searchModel.article_tags"
                      :default-value="[]"
                      :options="tagTypeOptions"
                      placeholder="请选择标签类型"
                      multiple
                      allow-clear
                      scrollbar:true
                    />
                  </a-form-item>
                </a-col>
                <!-- <a-col :span="8">
                  <a-form-item field="article_condition" label="文章状态:">
                    <a-select
                      v-model="searchModel.article_condition"
                      :default-value="searchModel.article_condition"
                      :options="stateTypeOptions"
                      placeholder="是否封禁"
                    />
                  </a-form-item>
                </a-col> -->
                <a-col :span="8">
                  <a-form-item field="heat" label="排序方式:">
                    <a-select
                      v-model="searchModel.kind"
                      :default-value="searchModel.kind"
                      :options="hotOptions"
                      placeholder="请选择排序方式"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item field="published_at" label="创建时间">
                    <a-range-picker
                      v-model="create_time"
                      style="width: 100%"
                      @change="onChangeTime"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item field="published_at" label="多条件筛选:">
                    <a-space>
                      <a-tree-select
                        v-model="selected"
                        :multiple="true"
                        :allow-clear="true"
                        :allow-search="true"
                        :data="treeData"
                        placeholder="Please select ..."
                        style="width: 300px"
                      ></a-tree-select>
                    </a-space>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-col>
          <a-col :flex="'86px'" style="text-align: right">
            <a-space direction="vertical" :size="18">
              <a-button
                v-permission="['acl:article:search']"
                type="primary"
                @click="search"
              >
                <template #icon>
                  <icon-search />
                </template>
                查询
              </a-button>
              <a-button v-permission="['acl:article:search']" @click="reset">
                <template #icon>
                  <icon-refresh />
                </template>
                重置
              </a-button>
            </a-space>
          </a-col>
        </a-row>
      </a-collapse-item>
    </a-collapse>
    <a-card>
      <a-row>
        <a-tabs v-model:active-key="itemType" type="line" style="width: 100%">
          <a-tab-pane key="1" :title="`全部文章${total_1} `">
            <article-table
              ref="artTable1"
              v-model:total="total_1"
              :itemType="itemType"
              :searchModel="searchModel"
              :article_condition="1"
            ></article-table>
          </a-tab-pane>
          <a-tab-pane key="2" :title="`已批准${total_2}`">
            <article-table
              ref="artTable2"
              v-model:total="total_2"
              :itemType="itemType"
              :searchModel="searchModel"
              :article_condition="0"
            ></article-table>
          </a-tab-pane>
          <a-tab-pane key="3" :title="`已封禁${total_3}`">
            <article-table
              ref="artTable3"
              v-model:total="total_3"
              :itemType="itemType"
              :searchModel="searchModel"
              :article_condition="2"
            ></article-table>
          </a-tab-pane>
        </a-tabs>
      </a-row>
    </a-card>
  </div>
</template>

<style scoped lang="less">
.container {
  padding: 0 20px 20px;
}

:deep(.arco-table-th) {
  &:last-child {
    .arco-table-th-item-title {
      margin-left: 16px;
    }
  }
}

.active {
  color: #0960bd;
  background-color: #e3f4fc;
}
</style>
