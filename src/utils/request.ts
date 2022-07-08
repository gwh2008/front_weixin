import { extend } from 'umi-request';

const request = extend({
  prefix: 'http://127.0.0.1:8089/api/v1',
  timeout: 3000,
  // credentials: 'include', // 默认请求是否带上cookie
});
const currentUser = JSON.parse(localStorage.getItem('currentUser') || '0');
// 请求拦截器添加token
request.interceptors.request.use(async (url, options) => {
  if (
    options.method === 'post' ||
    options.method === 'put' ||
    options.method === 'delete' ||
    options.method === 'get'
  ) {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      
      token:currentUser.token 
    };
    return {
      url,
      options: { ...options, headers },
    };
  }
});

export default request;
