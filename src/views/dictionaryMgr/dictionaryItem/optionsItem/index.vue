<script setup lang="ts">
import { ref, watch } from 'vue';
import { Message } from '@arco-design/web-vue';
import useLoading from '@/hooks/useLoading';
import { updateDicItem, addDicItem } from '@/api/dictionary';

// 修改
const editVisible = defineModel('visible', {
  type: Boolean,
  required: true
});
const props = defineProps({
  editData: {
    type: Object as () => {
      id: number;
      label: string;
      value: number;
      sort: number;
      status: number;
      description: string;
      extend_value: string;
    },
    required: true,
    default: () => ({
      id: -1,
      label: '',
      value: 0,
      sort: 0,
      status: 1,
      description: '',
      extend_value: ''
    })
  },
  type: {
    type: String
  },
  dict_type_code: {
    type: String
  }
});
const emit = defineEmits<{
  (event: 'update'): void;
}>();

const edit = ref({ ...props.editData }); // 创建一个拷贝
const { loading, setLoading } = useLoading(false);

// 点击确定
const editOk = () => {
  // console.log(edit.value);
};

// 取消修改
const editCancel = () => {};

// 提交操作:修改/新增
const submitEdit = async () => {
  try {
    setLoading(true);
    console.log(edit.value, 111111);
    if (props.type == 'edit') {
      await updateDicItem(edit.value);
      Message.info('修改成功');
    } else {
      // 解构 edit 对象的属性
      const { label, value, sort, status, description, extend_value } =
        edit.value;
      // 调用 addDicItem 函数，并传递所需的参数
      await addDicItem({
        dict_type_code: props.dict_type_code,
        label,
        value,
        sort,
        status,
        description,
        extend_value
      });
      Message.info('添加成功');
    }
    emit('update');
    return true;
  } catch (error) {
    Message.info(error.msg);
    return false;
  } finally {
    setLoading(false);
  }
};

// 是否封禁
const switchChange = (state: number) => {
  console.log(state);
};

// 监听 props 的变化，更新本地响应式对象
watch(
  () => props.editData,
  async newValue => {
    edit.value = { ...newValue };
  }
);
</script>

<template>
  <a-drawer
    v-model:visible="editVisible"
    :width="420"
    unmountOnClose
    @before-ok="submitEdit"
    @ok="editOk"
    @cancel="editCancel"
  >
    <template #title>
      {{ props.type == 'edit' ? '修改信息:' : '新增' }}
    </template>
    <a-spin :loading="loading" tip="This may take a while..." class="main">
      <div class="drawer">
        <a-form :model="edit" :style="{ width: '380px' }">
          <a-form-item
            field="label"
            tooltip="请输入标签名"
            label="标签名"
            label-col-flex="90px"
          >
            <a-input v-model="edit.label" placeholder="输入标签名..." />
          </a-form-item>
          <a-form-item
            field="value"
            tooltip="请输入字典键值"
            label="字典键值"
            label-col-flex="90px"
          >
            <a-input-number
              v-model="edit.value"
              placeholder="Please Enter"
              class="input-demo"
              :min="0"
              :max="10000"
            />
          </a-form-item>
          <a-form-item
            field="value"
            tooltip="当前项在表中的顺序"
            label="排序"
            label-col-flex="90px"
          >
            <a-input-number
              v-model="edit.sort"
              placeholder="Please Enter"
              class="input-demo"
              :min="0"
              :max="10000"
            />
          </a-form-item>

          <a-form-item
            field="description"
            tooltip="标签状态"
            label="标签状态"
            label-col-flex="90px"
          >
            <div>
              <a-switch
                v-model="edit.status"
                :default-checked="edit.status == 1 ? true : false"
                :checked-value="1"
                :unchecked-value="2"
                @change="switchChange(edit.status)"
              />
              <span class="dic-state">
                {{ edit.status == 1 ? '开启' : '关闭' }}
              </span>
            </div>
          </a-form-item>
          <a-form-item
            field="description"
            tooltip="输入标签描述"
            label="标签描述"
            label-col-flex="90px"
          >
            <a-textarea
              v-model="edit.description"
              placeholder="输入标签描述..."
              auto-size
            />
          </a-form-item>
          <a-form-item
            field="extend_value"
            tooltip="扩展值"
            label="扩展值"
            label-col-flex="90px"
          >
            <a-input v-model="edit.extend_value" placeholder="输入扩展值..." />
          </a-form-item>
        </a-form>
      </div>
    </a-spin>
  </a-drawer>
</template>

<style scoped>
.dic-state {
  margin-left: 12px;
}
</style>
