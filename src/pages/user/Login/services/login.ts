import request from "@/utils/request";

export interface LoginType {
    username: string,
    password: string
}


export async function userLogin(params:LoginType) {
  return request('/user/login', {
      method: 'POST',
      data: params,
  });
}