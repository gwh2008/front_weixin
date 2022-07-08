import request from '@/utils/request';

// 分页查询
export interface sendDataType {
  pageSize: number;
  pageNum: number;
  total: number;
}

// 分类列表
export interface typeOneType {
  createTime?: string;
  typeName?: string;
  id?: string;
  remark?: string;
  show?: Boolean;
}

// 一级分类列表
export async function typeOneList(params: any) {
  return request('/typeOne/list', {
    method: 'get',
    params,
  });
}
// 一级分类新增
export async function typeOneInsert(data: any) {
  return request('/typeOne/insert', {
    method: 'post',
    data,
  });
}

// 分类新增/隐藏
export async function updateTypeOneShow(params: any) {
  return request('/typeOne/updateTypeOneShow', {
    method: 'get',
    params,
  });
}

// 一级分类编辑
export async function typeOneUpdate(data: typeOneType) {
  return request('/typeOne/update', {
    method: 'post',
    data,
  });
}
