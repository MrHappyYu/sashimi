import request from '@/utils/request'

export interface Dish {
  id: number
  name: string
  categoryId: number
  categoryName: string
  description: string
  price: number
  originalPrice: number | null
  image: string
  sort: number
  status: number
  isRecommended: number
}

export type DishForm = Omit<Dish, 'id' | 'categoryName' | 'originalPrice'> & {
  id: number | null
  originalPrice?: number
}

export interface DishListParams {
  categoryId?: number | null
  keyword?: string
}

export function getDishList(params?: DishListParams) {
  return request.get<any, Dish[]>('/admin/dish/list', { params })
}

export function createDish(data: DishForm) {
  return request.post<any, void>('/admin/dish', data)
}

export function updateDish(data: DishForm) {
  return request.put<any, void>('/admin/dish', data)
}

export function deleteDish(id: number) {
  return request.delete<any, void>(`/admin/dish/${id}`)
}
