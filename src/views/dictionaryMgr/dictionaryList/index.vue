<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { getDicList } from '@/api/dictionary';

const dic_list = ref([]);

const selectedKeys = computed(() => {
  return dic_list.value.length > 0 ? [String(dic_list.value[0].id)] : [];
});

const emit = defineEmits(['check']); // 定义 `check` 事件
const featchDicList = async () => {
  const { data } = await getDicList({});
  dic_list.value = data.data.dic_list;
};

const switchCheck = itemId => {
  emit('check', itemId); // 发射 `check` 事件，并传递 itemId
};

onMounted(() => {
  featchDicList();
});
</script>

<template>
  <!--  -->
  <a-space direction="vertical" size="large" class="main">
    <strong>字典列表</strong>
    <a-menu :default-selected-keys="selectedKeys">
      <a-menu-item v-for="(item, index) in dic_list" :key="item.id">
        <div class="layout">
          <div>{{ index }}</div>
          <span @click="switchCheck(item.id)">{{ item.dic_name }}</span>
          <span>111</span>
        </div>
      </a-menu-item>
    </a-menu>
  </a-space>
</template>

<style scoped>
.main {
  width: 100%;
}

.layout {
  display: flex;
  justify-content: space-between;
}
</style>
