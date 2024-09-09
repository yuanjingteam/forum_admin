import Mock from 'mockjs';

import './user';
import './message-box';
import './login';

import '@/views/workplace/mock';

// import '@/views/role-maragement/card/mock';

import '@/views/user/info/mock';
import '@/views/user/setting/mock';

Mock.setup({
  timeout: '200-900'
});
