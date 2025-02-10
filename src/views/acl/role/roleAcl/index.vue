<script setup>
import { ref, watch } from 'vue';
import {
  dispatchMenuForRoleService,
  getApiListService,
  getMenuTypeService,
  getAllApiListService,
  getRoleMenuService,
  dispatchApiForRoleService
} from '@/api/menu';
import { Message } from '@arco-design/web-vue';
import { convertToNestedTree } from '@/utils/convertToNestedTree';
const props = defineProps({
  roleId: Number
});

//控制抽屉是否显示
const visible = defineModel();
//记录当前显示的是哪个tab
const activeKey = ref('1');
const loading = ref(false);

// --------------------------设置菜单权限-------------------------------
//数据
let TreeData = ref([]);
//   {
//     title: '工作台',
//     key: 0
//   },
//   {
//     title: '用户管理',
//     key: 1
//   },
//   {
//     title: '文章管理',
//     key: 2
//   },
//   {
//     title: '权限管理',
//     key: 10,
//     children: [
//       {
//         title: '角色管理',
//         key: 11
//       },
//       {
//         title: '菜单管理',
//         key: 12
//       },
//       {
//         title: 'api管理',
//         key: 12
//       }
//     ]
//   },
//   {
//     title: '字典管理',
//     key: 20,
//     children: [
//       {
//         title: '标签管理',
//         key: 21
//       },
//       {
//         title: '某某管理',
//         key: 22
//       }
//     ]
//   }
// ];

// --------------------共有--------------------------------

//当前选中的key
const CheckedKeys = ref([]);
//监听是否抽屉是否打开
watch(visible, (newvalue, oldvalue) => {
  loading.value = true;
  activeKey.value = '1';
  if (newvalue) {
    //一开始就获取第一部分菜单的数据赋值
    getMenuType();
    getRoleMenu();
    console.log(CheckedKeys.value, 'checked');
  }
  loading.value = false;
});

//获取所有菜单权限列表
const getMenuType = async () => {
  loading.value = true;

  const {
    data: { menu_type_list }
  } = await getMenuTypeService();
  console.log(menu_type_list);
  //将处理过后的数据放到treedata里面
  TreeData.value = convertToNestedTree(menu_type_list);
  console.log(TreeData, 'menu-tree');
  loading.value = false;
};

//获取所有api列表
const getApiList = async () => {
  loading.value = true;

  const {
    data: { api_list }
  } = await getApiListService();
  console.log(api_list);
  //将处理过后的数据放到treedata里面
  api_list.forEach(item => {
    item.key += 100000;
  });
  TreeData.value = api_list;
  console.log(TreeData.value, 'api-tree');
  loading.value = false;
};

//获取当前角色拥有的菜单权限
const getRoleMenu = async () => {
  loading.value = true;
  const {
    data: { perm }
  } = await getRoleMenuService(props.roleId);
  console.log(perm, 'perm');
  //将处理过后的数据放到CheckedKeys里面
  CheckedKeys.value = extractIds(perm);
  loading.value = false;
};
//获取当前角色拥有的api权限
const getAllApiList = async () => {
  loading.value = true;

  const {
    data: { group }
  } = await getAllApiListService(props.roleId);
  console.log(group, 'group');
  //将处理过后的数据放到CheckedKeys里面
  CheckedKeys.value = group;
  loading.value = false;
};

//确认修改菜单权限
const handleOkAclDrawer = async () => {
  if (activeKey.value == '1') {
    //发送修改菜单权限的请求
    await dispatchMenuForRoleService({
      id: props.roleId,
      permIds: CheckedKeys.value
    });
  } else {
    CheckedKeys.value.forEach((item, index) => {
      if (item >= 100000) {
        CheckedKeys.value[index] -= 100000;
      }
    });
    //发送修改api权限的请求
    await dispatchApiForRoleService({
      id: props.roleId,
      apis: CheckedKeys.value
    });
  }

  Message.success('设置菜单权限成功');
};
//取消修改权限
const handleCancelAclDrawer = () => {
  visible.value = false;
};
//改变当前选中的tab
const changeTab = () => {
  if (activeKey.value == '1') {
    //当前显示的是菜单
    console.log(111);
    //获取菜单相应的数据并渲染
    getMenuType();
    getRoleMenu();
  } else {
    //当前显示的是api
    console.log(222);
    //获取api相应的数据并渲染
    getApiList();
    getAllApiList();
  }
};
function extractIds(data) {
  if (data) {
    // 使用map方法提取每个对象的id
    const ids = data.map(item => item.id);
    return ids;
  }
}
</script>

<template>
  <a-drawer
    v-model:visible="visible"
    :width="700"
    :header="false"
    unmountOnClose
    @ok="handleOkAclDrawer"
    @cancel="handleCancelAclDrawer"
  >
    <a-tabs
      v-model:active-key="activeKey"
      :default-active-key="1"
      @change="changeTab"
    >
      <a-tab-pane key="1" title="角色菜单">
        <a-spin :loading="loading" dot>
          <a-tree
            v-model:checked-keys="CheckedKeys"
            :checkable="true"
            :data="TreeData"
            :fieldNames="{
              key: 'id',
              title: 'name'
            }"
          />
        </a-spin>
      </a-tab-pane>
      <a-tab-pane key="2" title="角色api">
        <a-spin :loading="loading" dot>
          <a-tree
            v-model:checked-keys="CheckedKeys"
            :checkable="true"
            :data="TreeData"
          />
        </a-spin>
      </a-tab-pane>
    </a-tabs>
  </a-drawer>
</template>
