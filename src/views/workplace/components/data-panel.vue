<script lang="ts" setup>
import { getWorkplaceDataService } from '@/api/workplace';
import { ref } from 'vue';

const articleTotal = ref('');
const newAdd = ref('');
const todayComments = ref(0);
const todayViews = ref(0);

const loadData = async () => {
  const {
    data: { total_data }
  } = await getWorkplaceDataService();
  articleTotal.value = total_data.article_total;
  newAdd.value = total_data.new_add;
  todayComments.value = total_data.today_comments;
  todayViews.value = total_data.today_views;
};
loadData();
</script>

<template>
  <a-grid :cols="24" :row-gap="8" class="panel">
    <a-grid-item
      class="panel-col"
      :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 6 }"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <img
            alt="avatar"
            src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/288b89194e657603ff40db39e8072640.svg~tplv-49unhts6dw-image.image"
          />
        </a-avatar>
        <a-statistic
          title="线上总文章"
          :value="Number(articleTotal)"
          :precision="1"
          :value-from="0"
          animation
          show-group-separator
        >
          <template #suffix>
            +
            <span class="unit">个</span>
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item
      class="panel-col"
      :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 6 }"
      style="border-right: none"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <img
            alt="avatar"
            src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/c8b36e26d2b9bb5dbf9b74dd6d7345af.svg~tplv-49unhts6dw-image.image"
          />
        </a-avatar>
        <a-statistic
          title="较昨日新增"
          :value="Number(newAdd)"
          :precision="1"
          :value-from="0"
          animation
        >
          <template #suffix>
            %
            <icon-caret-up class="up-icon" />
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item
      class="panel-col"
      :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 6 }"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <img
            alt="avatar"
            src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/fdc66b07224cdf18843c6076c2587eb5.svg~tplv-49unhts6dw-image.image"
          />
        </a-avatar>
        <a-statistic
          title="今日访问量"
          :value="todayViews"
          :value-from="0"
          animation
          show-group-separator
        >
          <!-- <template #suffix>
            <span class="unit">个</span>
          </template> -->
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item
      class="panel-col"
      :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 6 }"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <img
            alt="avatar"
            src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/77d74c9a245adeae1ec7fb5d4539738d.svg~tplv-49unhts6dw-image.image"
          />
        </a-avatar>
        <a-statistic
          title="日新增评论"
          :value="todayComments"
          :value-from="0"
          animation
          show-group-separator
        >
          <template #suffix>
            <span class="unit">个</span>
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>

    <a-grid-item :span="24">
      <a-divider class="panel-border" />
    </a-grid-item>
  </a-grid>
</template>

<style lang="less" scoped>
.arco-grid.panel {
  padding: 16px 20px 0;
  margin-bottom: 0;
}

.panel-col {
  padding-left: 43px;
  border-right: 1px solid rgb(var(--gray-2));
}

.col-avatar {
  margin-right: 12px;
  background-color: var(--color-fill-2);
}

.up-icon {
  color: rgb(var(--red-6));
}

.unit {
  margin-left: 8px;
  font-size: 12px;
  color: rgb(var(--gray-8));
}

:deep(.panel-border) {
  margin: 4px 0 0;
}
</style>
