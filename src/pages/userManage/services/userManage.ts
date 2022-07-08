import request from '@/utils/request';

// 分页查询
export interface sendDataType {
  pageSize: number;
  pageNum: number;
  total: number;
  nickName: string;
  userName: string;
}

// 用户列表
export interface UserListType {
  createTime?: string;
  delFlag?: number;
  nikeName?: string;
  password?: any;
  sex?: number;
  status?: boolean;
  userId?: number;
  userName?: string;
  avatar?: string
}
// 用户列表
export async function userList(params: sendDataType) {
  return request('/user/list', {
    method: 'get',
    params,
  });
}

// 更新用户信息
export async function userUpdate(data: UserListType) {
  return request('/user/update', {
    method: 'post',
    data,
  });
}

// 更新用户状态
export async function userUpdateState(params: any) {
  return request('/user/updateState', {
    method: 'get',
    params,
  });
}

// 更新用户状态
export async function userDelete(params: any) {
  return request('/user/delete', {
    method: 'get',
    params,
  });
}

// 新增用户
export async function userInsert(data: any) {
  return request('/user/insert', {
    method: 'post',
    data,
  });
}
