import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi } from '@/api/auth'

// 用户信息接口 / User info interface
interface UserInfo {
  username: string
  role: string
}

export const useUserStore = defineStore('user', () => {
  // 从 localStorage 初始化 token / Initialize token from localStorage
  const token = ref<string>(localStorage.getItem('admin_token') || '')
  const userInfo = ref<UserInfo | null>(null)

  // 登录 / Login
  async function login(username: string, password: string) {
    const result = await loginApi({ username, password })
    token.value = result.token
    localStorage.setItem('admin_token', result.token)
  }
  // 退出登录 / Logout
  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('admin_token')
  }
  return { token, userInfo, login, logout }
})
