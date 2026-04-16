import { createSlice } from '@reduxjs/toolkit'

const OrderStatus = {
  UNDEAL: '0',
  DEAL: '1',
} as const

export interface OrderInfo {
  id: string
  orderName: string
  orderContent: string
  orderStatus: string
  orderTime: string
  link: string
}

interface NotificationState {
  orderArr: OrderInfo[]
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    orderArr: [],
  } as NotificationState,
  reducers: {
    announce(state, action) {
      state.orderArr.push(action.payload)
    },
    dealOrder(state, action) {
      const item = state.orderArr.find(o => o.id === action.payload)
      if (item) item.orderStatus = OrderStatus.DEAL
    },
    dealAllOrders(state) {
      state.orderArr.forEach(o => {
        o.orderStatus = OrderStatus.DEAL
      })
    },
  },
})

export const { announce, dealOrder, dealAllOrders } = notificationSlice.actions
export default notificationSlice.reducer
