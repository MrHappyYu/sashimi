<template>
  <div class="page-container">
    <div class="page-header">
      <span class="page-title">预订管理</span>
    </div>

    <!-- 筛选 / Filter -->
    <a-space style="margin-bottom: 16px">
      <a-radio-group v-model:value="filterStatus" button-style="solid" @change="loadList">
        <a-radio-button :value="null">全部</a-radio-button>
        <a-radio-button :value="0">待确认</a-radio-button>
        <a-radio-button :value="1">已确认</a-radio-button>
        <a-radio-button :value="2">已取消</a-radio-button>
        <a-radio-button :value="3">已完成</a-radio-button>
      </a-radio-group>
      <a-date-picker v-model:value="filterDate" placeholder="按日期筛选" @change="loadList" />
    </a-space>

    <a-table :data-source="list" :columns="columns" :loading="loading" row-key="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'dateTime'">
          <div>{{ record.reservationDate }}</div>
          <div style="color: #999; font-size: 12px">{{ record.reservationTime }}</div>
        </template>
        <template v-if="column.key === 'contact'">
          <div>{{ record.contactName }}</div>
          <div style="color: #999; font-size: 12px">{{ record.contactPhone }}</div>
        </template>
        <template v-if="column.key === 'status'">
          <a-tag :color="statusColor(record.status)">{{ statusText(record.status) }}</a-tag>
        </template>
        <template v-if="column.key === 'action'">
          <a-space v-if="record.status === 0">
            <a-button
              type="primary"
              size="small"
              style="background: #27ae60; border: none"
              @click="updateStatus(record.id, 1)"
              >确认</a-button
            >
            <a-button danger size="small" @click="updateStatus(record.id, 2)">取消</a-button>
          </a-space>
          <a-button v-else-if="record.status === 1" size="small" @click="updateStatus(record.id, 3)"
            >标记完成</a-button
          >
          <span v-else style="color: #ccc">-</span>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { getReservationList, updateReservationStatus, type Reservation } from '@/api/reservation'

const list = ref<Reservation[]>([])
const loading = ref(false)
const filterStatus = ref<number | null>(null)
const filterDate = ref<any>(null)

const columns = [
  { title: '预订日期/时段', key: 'dateTime', width: 130 },
  { title: '人数', dataIndex: 'peopleCount', width: 70 },
  { title: '联系人', key: 'contact', width: 130 },
  { title: '备注', dataIndex: 'remark', ellipsis: true },
  {
    title: '提交时间',
    dataIndex: 'createTime',
    width: 160,
    customRender: ({ text }: any) => text?.replace('T', ' ').substring(0, 16),
  },
  { title: '状态', key: 'status', width: 90 },
  { title: '操作', key: 'action', width: 150 },
]

async function loadList() {
  loading.value = true
  const params: { status?: number; date?: string } = {}
  if (filterStatus.value != null) params.status = filterStatus.value
  if (filterDate.value) params.date = dayjs(filterDate.value).format('YYYY-MM-DD')
  try {
    list.value = await getReservationList(params)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function updateStatus(id: number, status: number) {
  try {
    await updateReservationStatus(id, status)
    message.success('状态已更新')
    loadList()
  } catch (e) {
    console.error(e)
  }
}

function statusText(s: number) {
  return ['待确认', '已确认', '已取消', '已完成'][s] || '-'
}

function statusColor(s: number) {
  const map: Record<number, string> = { 0: 'orange', 1: 'green', 2: 'default', 3: 'blue' }
  return map[s] || 'default'
}

onMounted(loadList)
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
