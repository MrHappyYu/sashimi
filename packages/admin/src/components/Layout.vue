<template>
  <a-layout style="min-height: 100vh">
    <!-- 侧边栏 / Sidebar -->
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      width="200"
      style="background: #1a1a2e"
    >
      <div class="logo">
        <span v-if="!collapsed">🐟 刺身管理</span>
        <span v-else>🐟</span>
      </div>
      <a-menu
        v-model:selected-keys="selectedKeys"
        theme="dark"
        mode="inline"
        :style="{ background: '#1a1a2e' }"
        @click="handleMenuClick"
      >
        <a-menu-item key="dashboard">
          <template #icon><DashboardOutlined /></template>
          数据概览
        </a-menu-item>
        <a-menu-item key="category">
          <template #icon><AppstoreOutlined /></template>
          分类管理
        </a-menu-item>
        <a-menu-item key="dish">
          <template #icon><ShoppingOutlined /></template>
          菜品管理
        </a-menu-item>
        <a-menu-item key="order">
          <template #icon><OrderedListOutlined /></template>
          订单管理
        </a-menu-item>
        <a-menu-item key="reservation">
          <template #icon><CalendarOutlined /></template>
          预订管理
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <!-- 顶部 / Header -->
      <a-layout-header
        style="
          background: #fff;
          padding: 0 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
        "
      >
        <menu-unfold-outlined
          v-if="collapsed"
          style="font-size: 18px; cursor: pointer"
          @click="collapsed = false"
        />
        <menu-fold-outlined
          v-else
          style="font-size: 18px; cursor: pointer"
          @click="collapsed = true"
        />
        <div style="display: flex; align-items: center; gap: 16px">
          <span class="new-order-bell" @click="test"
            ><BellOutlined :class="hasNewOrder ? 'bell-bell' : null"
          /></span>
          <span style="color: #666">管理员</span>
          <a-button type="link" danger @click="logout">退出登录</a-button>
        </div>
      </a-layout-header>

      <!-- 内容 / Content -->
      <a-layout-content style="margin: 16px; background: #f0f2f5; min-height: 280px">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  DashboardOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  OrderedListOutlined,
  CalendarOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
} from '@ant-design/icons-vue'
import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/app'
import { useUserStore } from '../stores/user'
import { useOrderStore, orderStatus } from '../stores/notification'
const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const userStore = useUserStore()
const orderStore = useOrderStore()
// 用 store 中的 collapsed 替换本地 ref / Use store collapsed instead of local ref
const { collapsed } = storeToRefs(appStore)
const { hasNewOrder } = storeToRefs(orderStore)
const selectedKeys = ref([route.path.split('/')[1] || 'dashboard'])
watch(
  () => route.path,
  path => {
    selectedKeys.value = [path.split('/')[1] || 'dashboard']
  }
)

function test() {
  console.log('test', hasNewOrder.value, orderStore.orderArr)
  orderStore.announce({
    id: 'string',
    orderName: 'string',
    orderContent: 'string',
    orderStatus: orderStatus.UNDEAL,
    orderTime: 'string',
    link: 'string',
  })
}
function handleMenuClick({ key }: MenuInfo) {
  router.push('/' + String(key))
}

function logout() {
  userStore.logout()
  router.push('/login')
}
</script>

<style lang="less" scoped>
.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c9a96e;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.new-order-bell {
  cursor: pointer;
  .bell-bell {
    color: #c9a96e;
    @keyframes colorChange {
      from {
        color: red;
        transform: rotate(-15deg);
      }
      to {
        color: #c9a96e;
        transform: rotate(15deg);
      }
    }
    animation: colorChange 1s infinite alternate;
  }
}
</style>
