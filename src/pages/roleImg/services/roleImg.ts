import request from '@/utils/request';

// 分页查询
export interface sendDataType {
  pageSize: number;
  pageNum: number;
  total: number;
}

// 用户列表
export interface RoleImgListType {
  createTime?: string;
  rotaShow?: boolean;
  id?: string;
  rotaName?: string;
  rotaSort?: string;
  rotaUrl?: string;
}

// 轮播图新增
export async function roleImgInsert(data: any) {
  return request('/roleImg/insert', {
    method: 'post',
    data,
  });
}

// 轮播图列表
export async function roleImgList(params: any) {
  return request('/roleImg/list', {
    method: 'get',
    params,
  });
}

// 轮播图显示/隐藏
export async function updateRotaShow(params: any) {
  return request('/roleImg/updateRotaShow', {
    method: 'get',
    params,
  });
}

// 编辑轮播图信息
export async function roleImgUpdate(data: RoleImgListType) {
  return request('/roleImg/update', {
    method: 'post',
    data,
  });
}