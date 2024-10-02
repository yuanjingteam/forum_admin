<script setup lang="ts">
import { onMounted, ref, defineEmits } from 'vue';
import { Message } from '@arco-design/web-vue';
import { getDicType, delDicType } from '@/api/dictionary';
import EditItem from '@/views/dictionaryMgr/dictionaryType/EditItem/index.vue';
import AddItem from '@/views/dictionaryMgr/dictionaryType/AddItem/index.vue';
const dic_list = ref([]);

// 定义 `check` 事件,切换列表
const emit = defineEmits(['check', 'update']);

// 绑定选中行
const selectedKeys = ref([0]);

// 选择弹框
const editType = ref(false);
const deleteVisible = ref(false);
const addVisible = ref(false);
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
    status: 0,
    create_at: ''
  })
});

// 需要修改的值
const editData = ref({
  id: -1,
  name: '',
  code: '',
  status: 0,
  description: ''
});

// 需要删除的值
const deleteList = ref([0]);

// 获取字典类型
const featchDicList = async () => {
  const { data } = await getDicType({
    name: search.value.name,
    code: search.value.code,
    status: search.value.status,
    create_at: search.value.create_at,
    page: 1,
    limit: 100
  });
  dic_list.value = data.data.dict_type_list;
  selectedKeys.value[0] = dic_list.value[0].id;
};

// 编辑
const editSelect = item => {
  editType.value = true;
  // 解构出筛选条件并赋值
  const { id, name, code, status, description } = item;
  editData.value = { id, name, code, status, description };
};

// 删除
const deleteSelect = item => {
  deleteVisible.value = true;
  deleteList.value[0] = item;
};
// 新增
const addSelect = () => {
  addVisible.value = true;
};

const submitDelete = async () => {
  try {
    await delDicType({
      id_list: deleteList
    });
    Message.info('删除成功');
    // 更新
    updateDicType();
  } catch (error) {
    Message.info(error.msg);
  } finally {
  }
};

// 发射 check 事件，并传递 itemCode
const switchCheck = (itemCode: string) => {
  emit('check', itemCode);
};

// 更新表格数据
const updateDicType = () => {
  featchDicList();
  emit('update');
};

onMounted(async () => {
  await featchDicList();
});
</script>

<template>
  <div>
    <a-modal v-model:visible="deleteVisible" @ok="submitDelete">
      <template #title>确认删除</template>
      <div>确认要删除当前项吗,删除之后无法再恢复</div>
    </a-modal>
    <add-item v-model:visible="addVisible" @update="updateDicType"></add-item>
    <edit-item
      v-model:visible="editType"
      :editData="editData"
      @update="updateDicType"
    ></edit-item>
    <a-space direction="vertical" size="large" class="main">
      <div class="header">
        <strong>字典列表</strong>
        <a-button @click="addSelect">新增</a-button>
      </div>
      <a-menu
        v-model:selected-keys="selectedKeys"
        :default-selected-keys="selectedKeys"
      >
        <a-menu-item v-for="item in dic_list" :key="item.id" class="layout">
          <span class="title" @click="switchCheck(item.code)">
            {{ item.name }}
          </span>
          <span>
            <icon-edit :size="16" @click.stop="editSelect(item)" />
            <icon-delete :size="16" @click.stop="deleteSelect(item.id)" />
          </span>
        </a-menu-item>
      </a-menu>
    </a-space>
  </div>
</template>

<style scoped lang="less">
.main {
  min-width: 100%;
  height: 200px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 10px 0;
}

.title {
  min-width: 95px;
}

.layout {
  display: flex;
  justify-content: space-between;
  width: 100%;
  background-color: #f2f3f5;
  border-radius: 5px;
}

.layout:hover {
  background: #eff6ff;
}

:deep(.arco-menu .arco-menu-item .arco-icon) {
  margin: 0 3px;
  margin-right: 0;
}
</style>
