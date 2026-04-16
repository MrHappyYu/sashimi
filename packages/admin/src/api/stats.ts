import request from '@/utils/request'

export interface StatsOverview {
  todayOrders: number
  todayAmount: number
  pendingReservations: number
}

export function getStatsOverview() {
  return request.get<any, StatsOverview>('/admin/stats/overview')
}
