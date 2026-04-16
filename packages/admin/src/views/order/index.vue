<template>
  <div class="page-container">
    <div class="page-header">
      <span class="page-title">订单管理</span>
    </div>

    <!-- 状态筛选 / Status filter -->
    <a-radio-group
      v-model:value="filterStatus"
      button-style="solid"
      style="margin-bottom: 16px"
      @change="loadList"
    >
      <a-radio-button :value="null">全部</a-radio-button>
      <a-radio-button :value="0">待支付</a-radio-button>
      <a-radio-button :value="1">已支付</a-radio-button>
      <a-radio-button :value="2">制作中</a-radio-button>
      <a-radio-button :value="3">已完成</a-radio-button>
      <a-radio-button :value="4">已取消</a-radio-button>
    </a-radio-group>

    <a-table
      :data-source="list"
      :columns="columns"
      :loading="loading"
      row-key="id"
      :expand-row-by-click="true"
    >
      <template #expandedRowRender="{ record }">
        <div style="padding: 8px 0">
          <div v-for="item in record.items" :key="item.id" style="margin-bottom: 4px; color: #555">
            {{ item.dishName }} × {{ item.quantity }} — ¥{{ item.subtotal }}
          </div>
        </div>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'totalAmount'">
          <span style="color: #e74c3c; font-weight: bold">¥{{ record.totalAmount }}</span>
        </template>
        <template v-if="column.key === 'orderType'">
          {{ record.orderType === 1 ? '堂食' : '外带' }}
        </template>
        <template v-if="column.key === 'status'">
          <a-tag :color="statusColor(record.status)">{{ statusText(record.status) }}</a-tag>
        </template>
        <template v-if="column.key === 'action'">
          <a-select
            :value="record.status"
            style="width: 110px"
            size="small"
            @change="val => updateStatus(record.id, val as number)"
          >
            <a-select-option :value="0">待支付</a-select-option>
            <a-select-option :value="1">已支付</a-select-option>
            <a-select-option :value="2">制作中</a-select-option>
            <a-select-option :value="3">已完成</a-select-option>
            <a-select-option :value="4">已取消</a-select-option>
          </a-select>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'
import { getOrderList, updateOrderStatus, type Order } from '@/api/order'

const list = ref<Order[]>([])
const loading = ref(false)
const filterStatus = ref<number | null>(null)

const columns = [
  { title: '订单号', dataIndex: 'orderNo', width: 200, ellipsis: true },
  { title: '金额', key: 'totalAmount', width: 120 },
  { title: '用餐方式', key: 'orderType', width: 100 },
  {
    title: '下单时间',
    dataIndex: 'createTime',
    width: 170,
    customRender: ({ text }: any) => text?.replace('T', ' ').substring(0, 16),
  },
  { title: '状态', key: 'status', width: 100 },
  { title: '更新状态', key: 'action', width: 130 },
]

async function loadList() {
  loading.value = true
  try {
    list.value = await getOrderList(
      filterStatus.value != null ? { status: filterStatus.value } : {}
    )
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function updateStatus(id: number, status: number) {
  try {
    await updateOrderStatus(id, status)
    message.success('状态已更新')
    loadList()
  } catch (e) {
    console.error(e)
  }
}

function statusText(s: number) {
  const map: Record<number, string> = {
    0: '待支付',
    1: '已支付',
    2: '制作中',
    3: '已完成',
    4: '已取消',
  }
  return map[s] || '-'
}

function statusColor(s: number) {
  const map: Record<number, string> = {
    0: 'orange',
    1: 'cyan',
    2: 'blue',
    3: 'green',
    4: 'default',
  }
  return map[s] || 'default'
}

onMounted(loadList)
onActivated(() => console.log('组件激活了'))
onDeactivated(() => console.log('组件缓存了'))
</script>

<style scoped>
.page-container {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.page-title {
  font-size: 18px;
  font-weight: bold;
  color: #1a1a2e;
}
</style>
