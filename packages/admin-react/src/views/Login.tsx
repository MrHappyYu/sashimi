import { useState } from 'react'
import { Form, Input, Button, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../store'
import { login } from '../store/slices/userSlice'
import styles from './Login.module.less'

export default function Login() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  async function handleLogin(values: { username: string; password: string }) {
    setLoading(true)
    try {
      await dispatch(login(values)).unwrap()
      message.success('登录成功')
      navigate('/')
    } catch {
      // error handled by request interceptor
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.logo}>🐟</span>
          <h2>刺身点单管理后台</h2>
        </div>

        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input prefix="👤" placeholder="用户名" size="large" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix="🔒" placeholder="密码" size="large" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              className={styles.submitBtn}
            >
              登 录
            </Button>
          </Form.Item>
        </Form>

        <div className={styles.hint}>默认账号：admin / admin123</div>
      </div>
    </div>
  )
}
