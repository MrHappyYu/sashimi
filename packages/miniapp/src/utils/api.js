import { get, post, put, del } from './request.js'

// 认证 / Auth
export const auth = {
  wxLogin: (data) => post('/api/auth/wx-login', data),
  getInfo: () => get('/api/auth/info')
}

// 分类 / Category
export const category = {
  list: () => get('/api/category/list')
}

// 菜品 / Dish
export const dish = {
  list: (params) => get('/api/dish/list', params),
  detail: (id) => get(`/api/dish/${id}`),
  recommended: () => get('/api/dish/recommended')
}

// 购物车 / Cart
export const cart = {
  list: () => get('/api/cart/list'),
  add: (dishId, quantity = 1) => post('/api/cart/add', { dishId, quantity }),
  update: (id, quantity) => put('/api/cart/update', { id, quantity }),
  remove: (id) => del(`/api/cart/remove/${id}`),
  clear: () => del('/api/cart/clear')
}

// 订单 / Order
export const order = {
  create: (data) => post('/api/order/create', data),
  list: (status) => get('/api/order/list', status != null ? { status } : {}),
  detail: (id) => get(`/api/order/${id}`),
  cancel: (id) => post(`/api/order/${id}/cancel`)
}

// 预订 / Reservation
export const reservation = {
  create: (data) => post('/api/reservation/create', data),
  list: () => get('/api/reservation/list'),
  detail: (id) => get(`/api/reservation/${id}`),
  cancel: (id) => del(`/api/reservation/${id}/cancel`),
  timeSlots: (date) => get('/api/reservation/time-slots', { date })
}
