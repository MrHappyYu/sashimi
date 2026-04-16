<template>
  <view class="order-list-page">
    <!-- Tab / Status filter -->
    <scroll-view scroll-x class="tab-bar">
      <view
        v-for="tab in tabs"
        :key="tab.value"
        class="tab-item"
        :class="{ active: activeTab === tab.value }"
        @click="switchTab(tab.value)"
      >
        {{ tab.label }}
      </view>
    </scroll-view>

    <view v-if="loading" class="loading">加载中...</view>
    <view v-else-if="orders.length === 0" class="empty">
      <text class="empty-icon">📋</text>
      <text>暂无订单记录</text>
    </view>
    <view v-else class="order-list">
      <view
        v-for="order in orders"
        :key="order.id"
        class="order-card"
        @click="goDetail(order.id)"
      >
        <view class="order-header">
          <text class="order-no">订单号：{{ order.orderNo }}</text>
          <text class="order-status" :class="statusClass(order.status)">
            {{ statusText(order.status) }}
          </text>
        </view>
        <view class="order-items">
          <text v-for="item in (order.items || []).slice(0, 2)" :key="item.id" class="item-name">
            {{ item.dishName }} × {{ item.quantity }}
          </text>
          <text v-if="(order.items || []).length > 2" class="more-items">
            等 {{ order.items.length }} 件
          </text>
        </view>
        <view class="order-footer">
          <text class="order-time">{{ formatTime(order.createTime) }}</text>
          <text class="order-total">合计 ¥{{ order.totalAmount }}</text>
        </view>
        <view class="order-actions">
          <button
            v-if="order.status === 0"
            class="action-btn cancel-btn"
            @click.stop="cancelOrder(order.id)"
          >取消订单</button>
          <button class="action-btn detail-btn" @click.stop="goDetail(order.id)">查看详情</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { order as orderApi } from '../../utils/api.js'

export default {
  data() {
    return {
      tabs: [
        { label: '全部', value: null },
        { label: '待支付', value: 0 },
        { label: '制作中', value: 2 },
        { label: '已完成', value: 3 },
        { label: '已取消', value: 4 }
      ],
      activeTab: null,
      orders: [],
      loading: false
    }
  },
  onShow() { this.loadOrders() },
  methods: {
    async loadOrders() {
      const token = uni.getStorageSync('token')
      if (!token) { this.orders = []; return }
      this.loading = true
      try {
        this.orders = await orderApi.list(this.activeTab) || []
      } catch (e) { console.error(e) } finally { this.loading = false }
    },
    switchTab(val) {
      this.activeTab = val
      this.loadOrders()
    },
    async cancelOrder(id) {
      const ok = await new Promise(res => uni.showModal({
        title: '确认取消', content: '确定取消该订单吗？', success: r => res(r.confirm)
      }))
      if (!ok) return
      try {
        await orderApi.cancel(id)
        uni.showToast({ title: '已取消', icon: 'success' })
        this.loadOrders()
      } catch (e) { console.error(e) }
    },
    goDetail(id) { uni.navigateTo({ url: `/pages/order/detail?id=${id}` }) },
    statusText(s) {
      const map = { 0: '待支付', 1: '已支付', 2: '制作中', 3: '已完成', 4: '已取消' }
      return map[s] || '-'
    },
    statusClass(s) {
      const map = { 0: 'pending', 1: 'paid', 2: 'cooking', 3: 'done', 4: 'cancelled' }
      return map[s] || ''
    },
    formatTime(t) {
      if (!t) return ''
      return t.replace('T', ' ').substring(0, 16)
    }
  }
}
</script>

<style lang="scss" scoped>
.order-list-page { background: #f5f5f5; min-height: 100vh; }

.tab-bar {
  background: #fff;
  white-space: nowrap;
  padding: 0 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.tab-item {
  display: inline-block;
  padding: 24rpx 30rpx;
  font-size: 26rpx;
  color: #666;
  border-bottom: 4rpx solid transparent;

  &.active { color: #c9a96e; border-bottom-color: #c9a96e; font-weight: bold; }
}

.loading, .empty {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 26rpx;

  .empty-icon { display: block; font-size: 100rpx; margin-bottom: 20rpx; }
}

.order-list { padding: 20rpx; }

.order-card {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
}

.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16rpx;

  .order-no { font-size: 24rpx; color: #999; }
  .order-status { font-size: 24rpx; font-weight: bold; }
}

.order-status {
  &.pending { color: #e67e22; }
  &.paid, &.cooking { color: #27ae60; }
  &.done { color: #2196f3; }
  &.cancelled { color: #999; }
}

.order-items {
  margin-bottom: 16rpx;
  .item-name { display: block; font-size: 26rpx; color: #333; line-height: 1.8; }
  .more-items { font-size: 24rpx; color: #999; }
}

.order-footer {
  display: flex;
  justify-content: space-between;
  padding-top: 16rpx;
  border-top: 1rpx solid #f5f5f5;
  margin-bottom: 16rpx;

  .order-time { font-size: 22rpx; color: #bbb; }
  .order-total { font-size: 26rpx; color: #e74c3c; font-weight: bold; }
}

.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16rpx;
}

.action-btn {
  font-size: 24rpx;
  padding: 12rpx 28rpx;
  border-radius: 30rpx;
  line-height: 1;

  &.cancel-btn {
    background: #f5f5f5;
    color: #666;
    border: 1rpx solid #ddd;
  }
  &.detail-btn {
    background: #f8f4ef;
    color: #a07840;
    border: 1rpx solid #c9a96e;
  }
}
</style>
