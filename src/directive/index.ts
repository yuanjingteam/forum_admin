import type { App } from 'vue';
import permission from './permission';
import testClick from './test-click';

export default {
  install(Vue: App) {
    Vue.directive('permission', permission);
    Vue.directive('testClick', testClick);
  }
};
