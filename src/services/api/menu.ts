import request from '@/utils/request';


export interface MenuListItem {
  menuId?: number;
  icon?: any;
  component?: string;
  children?: MenuListItem[],
  menuName?: string;
  menuType?: string;
  name?: string;
  path?: string;
  remark?: string;
  createTime?: string;
  visible?: string;
  routes?: MenuListItem[]
}
const currentUser = JSON.parse(localStorage.getItem('currentUser') || '0');
// 用户列表
export async function getRouter() {
  return request('/menu/getRouter', {
    method: 'get',
  });
}
