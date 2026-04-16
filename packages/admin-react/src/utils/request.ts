import axios from 'axios'
import { message } from 'antd'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

request.interceptors.request.use(config => {
  const token = localStorage.getItem('admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

request.interceptors.response.use(
  res => {
    if (res.data.code === 200) return res.data.data
    message.error(res.data.msg || '请求失败')
    return Promise.reject(res.data.msg)
  },
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('admin_token')
      window.location.href = '/login'
    } else {
      message.error(err.response?.data?.msg || '网络错误')
    }
    return Promise.reject(err)
  }
)

export default request
