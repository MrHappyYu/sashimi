import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export enum orderStatus {
  UNDEAL = '0',
  DEAL = '1',
}
// 订单信息接口 / Order info interface
interface OrderInfo {
  id: string
  orderName: string
  orderContent: string
  orderStatus: orderStatus
  orderTime: string
  link: string
}

export const useOrderStore = defineStore('order', () => {
  // 从 localStorage 初始化 token / Initialize token from localStorage

  const orderInfo = ref<OrderInfo | null>(null)
  const orderArr = ref<OrderInfo[]>([])
  const hasNewOrder = computed(
    () => orderArr.value.filter(order => order.orderStatus === orderStatus.UNDEAL).length
  )
  // 通知 announce
  async function announce(order: OrderInfo) {
    orderArr.value.push(order)
  }
  // 已读 deal
  async function dealOrder(id: string) {
    if (id) {
      const ind = orderArr.value.findIndex(order => order.id == id)
      orderArr.value[ind].orderStatus = orderStatus.DEAL
    }
  }
  // 全部已读 deal
  async function dealAllOrder() {
    orderArr.value.forEach(element => {
      element.orderStatus = orderStatus.DEAL
    })
  }
  return { orderInfo, orderArr, hasNewOrder, announce, dealOrder, dealAllOrder }
})
