<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Message } from '@arco-design/web-vue';
import { getDicType, delDicType } from '@/api/dictionary';
import { GetDicList, EditDicList } from '@/api/dictionary';
import EditItem from '@/views/dictionaryMgr/dictionaryType/EditItem/index.vue';
import AddItem from '@/views/dictionaryMgr/dictionaryType/AddItem/index.vue';
type DictTypeItem = GetDicList['data']['dict_type_list'][number];
type DictType = GetDicList['data']['dict_type_list'];

const dic_list = ref<DictType>([]);

// 定义 `check` 事件,切换列表
const emit = defineEmits<{
  (e: 'check', payload: string);
  (e: 'update'): void; // 可以根据需要指定 payload 的类型
}>();

// 绑定选中行
const selectedKeys = ref<[number]>([0]);

// 选择弹框
const editType = ref<boolean>(false); // editType 为 boolean 类型
const deleteVisible = ref<boolean>(false); // deleteVisible 为 boolean 类型
const addVisible = ref<boolean>(false); // addVisible 为 boolean 类型
// 待扩展的搜索功能
const search = defineModel('search', {
  type: Object as () => {
    name: string;
    code: string;
    status: number;
    create_at: string;
  },
  required: true,
  default: () => ({
    name: '',
    code: '',
    status: 1,
    create_at: ''
  })
});

// 需要修改的值
const editData = ref<EditDicList>({
  id: -1,
  name: '',
  code: '',
  status: 1,
  description: ''
});

// 需要删除的值
const deleteList = ref<[number]>([0]); // 初始值为一个包含一个数字的数组

// 获取字典类型
const featchDicList = async () => {
  const { data } = await getDicType({
    name: search.value.name,
    code: search.value.code,
    create_at_begin: '',
    create_at_end: '',
    status: search.value.status,
    page: 1,
    limit: 100
  });
  dic_list.value = data.data.dict_type_list;
  selectedKeys.value[0] = dic_list.value[0].id;
};

// 编辑
const editSelect = (item: DictTypeItem) => {
  editType.value = true;
  // 解构出筛选条件并赋值
  const { id, name, code, status, description } = item;
  editData.value = { id, name, code, status, description };
};

// 删除
const deleteSelect = (id: number) => {
  deleteVisible.value = true;
  deleteList.value[0] = id;
};
// 新增
const addSelect = () => {
  addVisible.value = true;
};
// 确认删除
const submitDelete = async () => {
  try {
    await delDicType({
      id_list: deleteList.value
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
        <a-button v-permission="['acl:dic:add']" @click="addSelect">
          新增
        </a-button>
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
            <icon-edit
              v-permission="['acl:dic:edit']"
              :size="16"
              @click.stop="editSelect(item)"
            />
            <icon-delete
              v-permission="['acl:dic:delete']"
              :size="16"
              @click.stop="deleteSelect(item.id)"
            />
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
  border-radius: 5px;
  // background-color: #f2f3f5;
}

.layout:hover {
  background: #eff6ff;
}

:deep(.arco-menu .arco-menu-item .arco-icon) {
  margin: 0 3px;
  margin-right: 0;
}
</style>
