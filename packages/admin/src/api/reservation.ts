import request from '@/utils/request'

export interface Reservation {
  id: number
  reservationDate: string
  reservationTime: string
  peopleCount: number
  contactName: string
  contactPhone: string
  status: number
  remark: string
}

export interface ReservationListParams {
  status?: number | null
  date?: string
}

export function getReservationList(params?: ReservationListParams) {
  return request.get<any, Reservation[]>('/admin/reservation/list', { params })
}

export function updateReservationStatus(id: number, status: number) {
  return request.put<any, void>(`/admin/reservation/${id}/status`, { status })
}
