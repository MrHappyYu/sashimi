import request from '@/utils/request'

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  token: string
}

export function login(data: LoginParams) {
  return request.post<any, LoginResult>('/auth/admin-login', data)
}
