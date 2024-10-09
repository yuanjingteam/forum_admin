<script setup>
import { ref, watch } from 'vue';
import { getRoleMenuService, dispatchMenuForRoleService } from '@/api/menu';
import { Message } from '@arco-design/web-vue';
const props = defineProps({
  roleId: Number
});

//控制抽屉是否显示
const visible = defineModel();
//取消修改权限
const handleCancelApiDrawer = () => {
  visible.value = false;
};
//所有可以勾选的key
const menuAllCheckedKeys = [0, 1, 2, 10, 11, 12, 20, 21, 22];
//所有可以展开的key
const menuAllExpandedKeys = [10, 20];
//当前选中的key
const menuCheckedKeys = ref([]);
//从本地取出当前角色所有菜单权限赋值给当前选中的key
const menuTemp = [21, 22, 12];
//监听是否抽屉是否打开
watch(visible, (newvalue, oldvalue) => {
  if (newvalue) {
    menuCheckedKeys.value = menuTemp;
  }
});

//当前展开的key
const menuExpandedKeys = ref([]);
//全选
const toggleChecked = () => {
  menuCheckedKeys.value = menuCheckedKeys?.value.length
    ? []
    : menuAllCheckedKeys;
};
//全部展开
const toggleExpanded = () => {
  menuExpandedKeys.value = menuExpandedKeys?.value.length
    ? []
    : menuAllExpandedKeys;
};

//数据
const menuTreeData = [
  {
    title: '工作台',
    key: 0
  },
  {
    title: '用户管理',
    key: 1
  },
  {
    title: '文章管理',
    key: 2
  },
  {
    title: '权限管理',
    key: 10,
    children: [
      {
        title: '角色管理',
        key: 11
      },
      {
        title: '菜单管理',
        key: 12
      },
      {
        title: 'api管理',
        key: 12
      }
    ]
  },
  {
    title: '字典管理',
    key: 20,
    children: [
      {
        title: '标签管理',
        key: 21
      },
      {
        title: '某某管理',
        key: 22
      }
    ]
  }
];
//确认修改菜单权限
const handleOkApiDrawer = async () => {
  await dispatchMenuForRoleService({
    id: props.roleId,
    permIds: menuCheckedKeys.value
  });
  Message.success('设置菜单权限成功');
};
</script>

<template>
  <a-drawer
    v-model:visible="visible"
    :width="700"
    :header="false"
    unmountOnClose
    @ok="handleOkApiDrawer"
    @cancel="handleCancelApiDrawer"
  >
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" title="角色菜单">
        <a-button-group style="margin-bottom: 20px">
          <a-button
            type="primary"
            style="margin-right: 10px"
            @click="toggleChecked"
          >
            {{ menuCheckedKeys?.length ? '清空' : '全选' }}
          </a-button>
          <a-button type="primary" @click="toggleExpanded">
            {{ menuExpandedKeys?.length ? '折叠' : '展开' }}
          </a-button>
        </a-button-group>
        <a-tree
          v-model:checked-keys="menuCheckedKeys"
          v-model:expanded-keys="menuExpandedKeys"
          :checkable="true"
          :data="menuTreeData"
        />
      </a-tab-pane>
      <a-tab-pane key="2" title="角色api">角色api</a-tab-pane>
    </a-tabs>
  </a-drawer>
</template>
