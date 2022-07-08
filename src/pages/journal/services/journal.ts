import request from '@/utils/request';

// 分页查询
export interface sendDataType {
  pageSize: number;
  pageNum: number;
  total: number;
}

// 日志列表
export interface journalType {
  id?: string;
  title?: string;
  show?: boolean;
  createTime: string;
  content?: string;
  journalImg?: string;
}

// 日志列表
export async function journalList(params: any) {
  return request('/journal/list', {
    method: 'get',
    params,
  });
}

// 日志新增
export async function journalInsert(data: any) {
  return request('/journal/insert', {
    method: 'post',
    data,
  });
}

// 日志显示/隐藏
export async function journalUpdateShow(params: any) {
  return request('/journal/updateShow', {
    method: 'get',
    params,
  });
}

// 编辑日志信息
export async function journalUpdate(data: journalType) {
  return request('/journal/update', {
    method: 'post',
    data,
  });
}
