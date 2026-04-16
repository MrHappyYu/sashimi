import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../components/Layout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/404',
      component: () => import('../views/404.vue'),
    },
    {
      path: '/',
      component: Layout,
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          component: () => import('../views/dashboard/index.vue'),
          meta: { title: '数据概览', icon: 'DashboardOutlined' },
        },
        {
          path: 'category',
          component: () => import('../views/category/index.vue'),
          meta: { title: '分类管理', icon: 'AppstoreOutlined' },
        },
        {
          path: 'dish',
          component: () => import('../views/dish/index.vue'),
          meta: { title: '菜品管理', icon: 'ShoppingOutlined' },
        },
        {
          path: 'order',
          component: () => import('../views/order/index.vue'),
          meta: { title: '订单管理', icon: 'OrderedListOutlined' },
        },
        {
          path: 'reservation',
          component: () => import('../views/reservation/index.vue'),
          meta: { title: '预订管理', icon: 'CalendarOutlined' },
        },
      ],
    },
    // 兜底：所有未匹配路由重定向到 404 / Catch-all: redirect unknown routes to 404
    { path: '/:pathMatch(.*)*', redirect: '/404' },
  ],
})

router.beforeEach(to => {
  // 避免循环依赖，直接从 localStorage 读取 token / Avoid circular dep, read token from localStorage directly
  const token = localStorage.getItem('admin_token')
  if (to.path !== '/login' && !token) return '/login'
})

export default router
