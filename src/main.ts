import { createApp } from 'vue';
import store from './store';

import globalComponents from '@/components';
import router from './router';
import directive from './directive';
import './mock';
import App from './App.vue';
import '@/assets/style/global.less';
import '@/api/interceptor';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import '@arco-design/web-vue/es/message/style/index.less';
import '@arco-design/web-vue/es/notification/style/index.less';
import '@arco-design/web-vue/es/modal/style/index.less';

import { initVChartArcoTheme } from '@visactor/vchart-arco-theme';
initVChartArcoTheme();

const app = createApp(App);

app.use(store);
app.use(router);
app.use(ArcoVueIcon);
app.use(globalComponents);
app.use(directive);

app.mount('#app');
