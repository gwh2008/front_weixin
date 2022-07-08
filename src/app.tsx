import React from 'react';
import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { SettingDrawer } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import * as Icon from '@ant-design/icons/lib/icons';
import defaultSettings from '../config/defaultSettings';
import { getRouter, MenuListItem } from '@/services/api/menu'
import { MenuDataItem } from '@ant-design/pro-layout'
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
let menuAllData: MenuListItem[] = []
/**
 * 路由登录页
 */
/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
}> {
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    // const currentUser = await fetchUserInfo();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '0');
    const result = await getRouter()
    menuAllData = generatorMenuData(result.data)
    return {
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    settings: defaultSettings,
  };
}

const generatorMenuData = (menus: MenuListItem[]): MenuListItem[] => {
  let menuData: MenuListItem[] = [];
  menus.forEach((menu) => {
    if (menu.children.length > 0) {
      menuData.push({
        icon: React.createElement(Icon[menu.icon]),
        name: menu.menuName,
        path: menu.path,
        component: menu.component,
        routes: generatorMenuData(menu.children),
      })
    } else {
      menuData.push({
        icon: React.createElement(Icon[menu.icon]),
        name: menu.menuName,
        path: menu.path,
        component: menu.component
      })
    }
  })
  return menuData;
}


// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      // 地址
      const { location } = history;
      // 判断用户是否存在，不存在则跳转到登录界面
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
      // TOTD 为完善 判断是否有权限登录改页面 没有则跳到首页
    },
    links: isDev
      ? [
        <Link to="/umi/plugin/openapi" target="_blank">
          <LinkOutlined />
          <span>OpenAPI 文档</span>
        </Link>,
        <Link to="/~docs">
          <BookOutlined />
          <span>业务组件文档</span>
        </Link>,
      ]
      : [],
    menuHeaderRender: undefined,
    postMenuData: () => menuAllData,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};
