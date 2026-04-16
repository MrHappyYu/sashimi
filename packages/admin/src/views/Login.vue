<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <span class="logo-icon">🐟</span>
        <h2>刺身点单管理后台</h2>
      </div>
      <a-form :model="form" layout="vertical" @finish="handleLogin">
        <a-form-item name="username" :rules="[{ required: true, message: '请输入用户名' }]">
          <a-input v-model:value="form.username" placeholder="用户名" size="large" prefix="👤" />
        </a-form-item>
        <a-form-item name="password" :rules="[{ required: true, message: '请输入密码' }]">
          <a-input-password
            v-model:value="form.password"
            placeholder="密码"
            size="large"
            prefix="🔒"
          />
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            block
            size="large"
            :loading="loading"
            style="background: linear-gradient(135deg, #c9a96e, #a07840); border: none"
          >
            登 录
          </a-button>
        </a-form-item>
      </a-form>
      <div class="login-hint">默认账号：admin / admin123</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const form = reactive({ username: '', password: '' })

async function handleLogin() {
  loading.value = true
  try {
    await userStore.login(form.username, form.password)
    message.success('登录成功')
    router.push('/')
  } catch (e: any) {
    // 优先展示后端返回的错误信息，兜底显示通用提示
    // Prefer backend error message, fall back to generic hint
    const msg = typeof e === 'string' ? e : e?.message || '用户名或密码错误'
    message.error(msg)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  background: #fff;
  border-radius: 16px;
  padding: 48px 40px;
  width: 400px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.login-header {
  text-align: center;
  margin-bottom: 36px;

  .logo-icon {
    font-size: 48px;
    display: block;
    margin-bottom: 12px;
  }
  h2 {
    color: #1a1a2e;
    font-size: 22px;
    margin: 0;
  }
}

.login-hint {
  text-align: center;
  color: #999;
  font-size: 13px;
  margin-top: 16px;
}
</style>
