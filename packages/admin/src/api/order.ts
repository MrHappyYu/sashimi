import request from '@/utils/request'

export interface OrderItem {
  id: number
  dishName: string
  quantity: number
  price: number
}

export interface Order {
  id: number
  orderNo: string
  totalAmount: number
  orderType: number
  status: number
  createTime: string
  items?: OrderItem[]
}

export interface OrderListParams {
  status?: number | null
}

export function getOrderList(params?: OrderListParams) {
  return request.get<any, Order[]>('/admin/order/list', { params })
}

export function updateOrderStatus(id: number, status: number) {
  return request.put<any, void>(`/admin/order/${id}/status`, { status })
}
