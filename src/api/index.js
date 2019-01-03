/*
包含n个接口请求函数的模块
每个函数返回promise
 */
import ajax from './ajax'
import jsonp from 'jsonp'

// const BASE = 'http://localhost:5000'
// const BASE = '/api'  // 开发环境下需要使用代理帮我们转发请求
const BASE = ''  // 生产环境打包

// 登陆
export const reqLogin = (username, password) => ajax(BASE + '/manage/user/login.do', {username, password}, 'POST')

// 获取一级或某个二级分类列表
export const reqCategorys = (categoryId) => ajax(BASE + '/manage/category/get_category.do', {categoryId})

// 添加分类
export const reqAddCategory = (parentId, categoryName) => ajax(BASE + '/manage/category/add_category.do', {
  parentId,
  categoryName
}, 'POST')

// 更新品类名称
export const reqUpdateCategory = (categoryId, categoryName) => ajax(BASE + '/manage/category/set_category_name.do', {
  categoryId,
  categoryName
}, 'POST')

// 获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list.do', {pageNum, pageSize})

// 根据ID/Name搜索产品分页列表
export const reqSearchProducts = ({pageNum, pageSize, searchType, searchWord}) => ajax(BASE + '/manage/product/search.do', {
  pageNum,
  pageSize,
  [searchType]: searchWord
})

// 获取某个商品详情
export const reqProductDetail = (productId) => ajax(BASE + '/manage/product/detail.do', {productId})

// 添加/更新商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/save.do', product)

// 对商品进行上架/下架处理
export const reqUpOrDownProduct = (productId, status) => ajax(BASE + '/manage/product/set_sale_status.do', {
  productId,
  status
})

// 获取订单分页列表
export const reqOrders = (pageNum) => ajax(BASE + '/manage/order/list.do', {pageNum})

// 获取某个订单的详情
export const reqOrder = (orderNo) => ajax(BASE + '/manage/order/detail.do', {orderNo})

// 根据订单号查询订单
export const reqSearchOrder = (orderNo) => ajax(BASE + '/manage/order/search.do', {orderNo})

// 获取用户分页列表
export const reqUsers = (pageNum) => ajax(BASE + '/manage/user/list.do', {pageNum})

// 通知jsonp请求获取天气信息
export function reqWeather(city) {
  const url = `http://api.map.baidu.com/telematics/v3/weather?location=%E5%8C%97%E4%BA%AC&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
  return new Promise((resolve, reject) => {
    jsonp(url, {
      param: 'callback'
    }, (error, response) => {
      if (!error && response.status == 'success') {
        const {dayPictureUrl, weather} = response.results[0].weather_data[0]
        resolve({dayPictureUrl, weather})
      } else {
        alert('获取天气信息失败')
      }
    })
  })
}
