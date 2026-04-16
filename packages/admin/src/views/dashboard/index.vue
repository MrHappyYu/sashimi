<template>
  <div class="dashboard">
    <div class="page-title">数据概览</div>

    <!-- 统计卡片 / Stats cards -->
    <a-row :gutter="16" style="margin-bottom: 24px">
      <a-col :span="8">
        <a-card>
          <a-skeleton :loading="loadingStats" :paragraph="{ rows: 1 }" active>
            <a-statistic
              title="今日订单"
              :value="stats.todayOrders"
              suffix="单"
              :value-style="{ color: '#c9a96e' }"
            >
              <template #prefix><shopping-outlined /></template>
            </a-statistic>
          </a-skeleton>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card>
          <a-skeleton :loading="loadingStats" :paragraph="{ rows: 1 }" active>
            <a-statistic
              title="今日营业额"
              :value="stats.todayAmount"
              prefix="¥"
              :precision="2"
              :value-style="{ color: '#27ae60' }"
            />
          </a-skeleton>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card>
          <a-skeleton :loading="loadingStats" :paragraph="{ rows: 1 }" active>
            <a-statistic
              title="待处理预订"
              :value="stats.pendingReservations"
              suffix="条"
              :value-style="{ color: '#e74c3c' }"
            >
              <template #prefix><calendar-outlined /></template>
            </a-statistic>
          </a-skeleton>
        </a-card>
      </a-col>
    </a-row>

    <!-- 快捷操作 / Quick actions -->
    <a-row :gutter="16">
      <a-col :span="12">
        <a-card title="最近订单" :loading="loadingOrders">
          <a-table
            :data-source="recentOrders"
            :columns="orderColumns"
            :pagination="false"
            size="small"
          />
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="待确认预订" :loading="loadingReservations">
          <a-table
            :data-source="pendingReservations"
            :columns="reservationColumns"
            :pagination="false"
            size="small"
          />
        </a-card>
      </a-col>
    </a-row>
  </div>
  <div style="height: 1000px"></div>
  <img src="@/assets/images/test.png" alt="" loading="lazy" />
</template>

<script setup lang="ts">
import { ShoppingOutlined, CalendarOutlined } from '@ant-design/icons-vue'
import { getStatsOverview, type StatsOverview } from '@/api/stats'
import { getOrderList, type Order } from '@/api/order'
import { getReservationList, type Reservation } from '@/api/reservation'

const stats = ref<StatsOverview>({ todayOrders: 0, todayAmount: 0, pendingReservations: 0 })
const recentOrders = ref<Order[]>([])
const pendingReservations = ref<Reservation[]>([])
const loadingStats = ref(false)
const loadingOrders = ref(false)
const loadingReservations = ref(false)

const orderColumns = [
  { title: '订单号', dataIndex: 'orderNo', ellipsis: true },
  { title: '金额', dataIndex: 'totalAmount', customRender: ({ text }: any) => `¥${text}` },
  {
    title: '状态',
    dataIndex: 'status',
    customRender: ({ text }: any) => {
      const map: Record<number, string> = {
        0: '待支付',
        1: '已支付',
        2: '制作中',
        3: '已完成',
        4: '已取消',
      }
      return map[text] || '-'
    },
  },
]

const reservationColumns = [
  { title: '日期', dataIndex: 'reservationDate' },
  { title: '时段', dataIndex: 'reservationTime' },
  { title: '人数', dataIndex: 'peopleCount' },
  { title: '联系人', dataIndex: 'contactName' },
]

async function loadStats() {
  loadingStats.value = true
  try {
    stats.value = await getStatsOverview()
  } catch (e) {
    console.error(e)
  } finally {
    loadingStats.value = false
  }
}

async function loadOrders() {
  loadingOrders.value = true
  try {
    const data = await getOrderList()
    recentOrders.value = (data || []).slice(0, 5)
  } catch (e) {
    console.error(e)
  } finally {
    loadingOrders.value = false
  }
}

async function loadReservations() {
  loadingReservations.value = true
  try {
    pendingReservations.value = await getReservationList({ status: 0 })
  } catch (e) {
    console.error(e)
  } finally {
    loadingReservations.value = false
  }
}

onMounted(() => {
  loadStats()
  loadOrders()
  loadReservations()
})
</script>

<style scoped>
.dashboard {
  padding: 0;
}
.page-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 24px;
  color: #3232bd;
}
</style>
