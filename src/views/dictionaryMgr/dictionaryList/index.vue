<script setup lang="ts">
import { onMounted, ref, defineEmits } from 'vue';
import { getDicList } from '@/api/dictionary';

const dic_list = ref([]);

// 定义 `check` 事件,切换列表
const emit = defineEmits(['check']);

// 绑定选中行
const selectedKeys = ref([0]);

// 待扩展的搜索功能
const search = defineModel('search', {
  type: Object as () => {
    name: String;
    code: String;
    status: String;
    create_at: String;
  },
  required: true,
  default: () => ({
    name: '',
    code: '',
    status: '',
    create_at: ''
  })
});

const featchDicList = async () => {
  const { data } = await getDicList({
    name: search.value.name,
    code: search.value.code,
    status: search.value.status,
    create_at: search.value.create_at,
    page: 1,
    limit: 10
  });
  dic_list.value = data.data.dict_type_list;
  selectedKeys.value[0] = dic_list.value[0]?.id;
};

// 发射 `check` 事件，并传递 itemCode
const switchCheck = (itemCode: string) => {
  emit('check', itemCode);
};

onMounted(async () => {
  await featchDicList();
});
</script>

<template>
  <!--  -->
  <a-space direction="vertical" size="large" class="main">
    <strong>字典列表</strong>
    <a-menu :default-selected-keys="selectedKeys">
      <a-menu-item v-for="item in dic_list" :key="item.id">
        <div class="layout" @click="switchCheck(item.code)">
          <span>{{ item.name }}</span>
          <span>111</span>
        </div>
      </a-menu-item>
    </a-menu>
  </a-space>
</template>

<style scoped>
.main {
  min-width: 100%;
}

.layout {
  display: flex;
  justify-content: space-between;
}
</style>
