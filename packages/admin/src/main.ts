import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd, { message } from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(Antd)

// 全局未捕获异常兜底，避免白屏时用户毫无提示
// Catch unhandled Vue errors globally so the user always sees a message
app.config.errorHandler = (err, instance, info) => {
  console.error('[Vue Error]', info, err)
  message.error('页面发生异常，请刷新重试')
}

app.mount('#app')
