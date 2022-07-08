export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: '首页',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/userManage',
    name: '用户管理',
    icon: 'UserOutlined',
    component: './userManage',
  },
  {
    path: '/roleImg',
    name: '轮播图管理',
    icon: 'UserOutlined',
    component: './roleImg',
  },
  {
    path: '/roleImg',
    name: '轮播图管理',
    icon: 'UserOutlined',
    component: './roleImg',
  },
  {
    path: '/types',
    name: '分类管理',
    icon: 'UserOutlined',
    component: './types',
  },
  {
    path: '/goods',
    name: '商品管理',
    icon: 'UserOutlined',
    component: './goods',
  },
  {
    path: '/journal',
    name: '通知公告',
    icon: 'UserOutlined',
    component: './journal',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
