<template>
  <!-- 仅当 navbar 不可用时，显示设置按钮 -->
  <div v-if="!appStore.navbar" class="fixed-settings" @click="setVisible">
    <a-button type="primary">
      <template #icon>
        <icon-settings />
        <!-- 设置图标 -->
      </template>
    </a-button>
  </div>

  <!-- 抽屉组件 -->
  <!-- 关闭时卸载 -->
  <!-- 控制抽屉的可见性 -->
  <!-- 点击确认时调用 copySettings 方法 -->
  <!-- 点击取消时调用 cancel 方法 -->
  <a-drawer
    :width="410"
    unmount-on-close
    :visible="visible"
    @ok="copySettings"
    @cancel="cancel"
  >
    <template #title>应用配置</template>

    <!-- 警告提示 -->
    <a-alert type="warning">
      配置之后仅是临时生效，要想真正作用于项目，点击下方的 "复制配置"
      按钮，将配置替换到 settings.json 中即可。
    </a-alert>

    <!-- 内容区域和其他设置区域 -->
    <Block :options="contentOpts" title="内容区域" />
    <Block :options="othersOpts" title="其他设置" />

    <!-- 颜色选择器 -->
    <a-color-picker v-model="color" @change="handleColorChange" />

    <!-- 抽屉底部的操作按钮 -->
    <template #footer>
      <a-button type="primary" style="margin: 0" shape="round" long>
        复制配置
      </a-button>
    </template>
  </a-drawer>
</template>

<script lang="ts" setup>
// 引入 Vue 的响应式 API
import { computed, ref } from 'vue';
// 引入消息提示组件
import { Message } from '@arco-design/web-vue';
// 引入剪贴板功能
import { useClipboard } from '@vueuse/core';
// 引入状态管理
import { useAppStore } from '@/store';
// 引入子组件
import Block from './block.vue';
// 引入自定义钩子
import useColorTheme from '@/hooks/useColorTheme';

// 定义事件
const emit = defineEmits(['cancel']);

// 使用状态管理
const appStore = useAppStore();
// 使用剪贴板功能
const { copy } = useClipboard();
// 控制抽屉可见性的计算属性
const visible = computed(() => appStore.globalSettings);

// 定义内容区域的选项
const contentOpts = computed(() => [
  { name: 'settings.navbar', key: 'navbar', defaultVal: appStore.navbar },
  { name: 'settings.menu', key: 'menu', defaultVal: appStore.menu },
  { name: 'settings.topMenu', key: 'topMenu', defaultVal: appStore.topMenu },
  { name: 'settings.footer', key: 'footer', defaultVal: appStore.footer },
  { name: 'settings.tabBar', key: 'tabBar', defaultVal: appStore.tabBar },
  {
    name: 'settings.menuWidth',
    key: 'menuWidth',
    defaultVal: appStore.menuWidth,
    type: 'number'
  }
]);

// 定义其他设置的选项
const othersOpts = computed(() => [
  {
    name: 'settings.colorWeak',
    key: 'colorWeak',
    defaultVal: appStore.colorWeak
  }
]);

// 取消操作的方法
const cancel = () => {
  appStore.updateSettings({ globalSettings: false });
  emit('cancel'); // 触发cancel事件
};

// 复制设置的方法
const copySettings = async () => {
  const text = JSON.stringify(appStore.$state, null, 2); // 将状态转换为 JSON 字符串
  console.log(text); // 打印到控制台
  await copy(text); // 复制到剪贴板
  Message.success('已拷贝配置'); // 显示成功消息
};

// 显示抽屉的方法
const setVisible = () => {
  appStore.updateSettings({ globalSettings: true });
};

// 颜色状态
const color = ref(appStore.themeColor);
// 更新主题颜色的方法
const { updateThemeColor } = useColorTheme();
const handleColorChange = color => {
  updateThemeColor(color); // 更新主题颜色
};
</script>

<style scoped lang="less">
.fixed-settings {
  position: fixed; // 固定在页面上
  top: 280px; // 距离顶部的距离
  right: 0; // 靠右对齐

  svg {
    font-size: 18px; // 图标大小
    vertical-align: -4px; // 垂直对齐
  }

  .arco-drawer-footer > .arco-btn {
    margin-left: 0; // 去除左边距
  }
}
</style>
