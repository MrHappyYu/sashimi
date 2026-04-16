import request from '@/utils/request'

export interface Category {
  id: number
  name: string
  icon: string
  sort: number
  status: number
}

export type CategoryForm = Omit<Category, 'id'> & { id: number | null }

export function getCategoryList() {
  return request.get<any, Category[]>('/admin/category/list')
}

export function createCategory(data: CategoryForm) {
  return request.post<any, void>('/admin/category', data)
}

export function updateCategory(data: CategoryForm) {
  return request.put<any, void>('/admin/category', data)
}

export function deleteCategory(id: number) {
  return request.delete<any, void>(`/admin/category/${id}`)
}
