import request from '@/utils/request';

// 分页查询
export interface sendDataType {
  pageSize: number;
  pageNum: number;
  total: number;
}

// 商品列表
export interface goodsType {
  id?: string;
  goodName?: string;
  price?: string;
  describe?: string;
  supplier?: string;
  goodsImg?: string;
  message?: string;
  recommend?: boolean;
  goodsShow?: string;
  createTime: string;
  firstImg?: string;
  type?: string;
}
// 分类列表
export interface typeOneType {
  createTime?: string;
  typeName?: string;
  id?: string;
  remark?: string;
  show?: Boolean;
}

// 分类菜单
export async function typeName(): Promise<any> {
  return request('/typeOne/typeName', {
    method: 'get',
  });
}

// 商品列表
export async function goodsList(params: any) {
  return request('/goods/list', {
    method: 'get',
    params,
  });
}

// 商品新增
export async function goodsInsert(data: any) {
  return request('/goods/insert', {
    method: 'post',
    data,
  });
}

// 商品显示/隐藏
export async function goodsUpdateShow(params: any) {
  return request('/goods/updateShow', {
    method: 'get',
    params,
  });
}

// 商品推荐
export async function goodsUpdateRecommend(params: any) {
  return request('/goods/updateRecommend', {
    method: 'get',
    params,
  });
}

// 编辑商品信息
export async function goodsUpdate(data: goodsType) {
  return request('/goods/update', {
    method: 'post',
    data,
  });
}
