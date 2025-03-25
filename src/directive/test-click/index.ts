import { Modal } from '@arco-design/web-vue';

// 定义一个函数 checkTest，用于检查元素的权限
async function checkTest(el: HTMLElement) {
  el.addEventListener('click', e => {
    e.preventDefault();
    Modal.warning({
      title: '提示',
      content: '不允许操作！'
    });
  });
}

// 导出一个对象，定义自定义指令的生命周期钩子
export default {
  // 在元素挂载时调用 checkTest 函数
  mounted(el: HTMLElement) {
    checkTest(el);
  },
  // 在元素更新时调用 checkTest 函数
  updated(el: HTMLElement) {
    checkTest(el);
  }
};
