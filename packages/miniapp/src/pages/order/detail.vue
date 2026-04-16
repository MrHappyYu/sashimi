<template>
  <view class="order-detail-page" v-if="orderData">
    <!-- 状态 / Status -->
    <view class="status-banner" :class="statusBannerClass">
      <text class="status-icon">{{ statusIcon }}</text>
      <text class="status-text">{{ statusText }}</text>
    </view>

    <!-- 订单信息 / Order info -->
    <view class="info-card">
      <view class="info-row">
        <text class="info-label">订单号</text>
        <text class="info-value">{{ orderData.orderNo }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">下单时间</text>
        <text class="info-value">{{ formatTime(orderData.createTime) }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">用餐方式</text>
        <text class="info-value">{{ orderData.orderType === 1 ? '堂食' : '外带' }}</text>
      </view>
      <view class="info-row" v-if="orderData.remark">
        <text class="info-label">备注</text>
        <text class="info-value">{{ orderData.remark }}</text>
      </view>
    </view>

    <!-- 商品明细 / Items -->
    <view class="items-card">
      <text class="card-title">订单明细</text>
      <view v-for="item in orderData.items" :key="item.id" class="item-row">
        <text class="item-name">{{ item.dishName }}</text>
        <text class="item-qty">× {{ item.quantity }}</text>
        <text class="item-subtotal">¥{{ item.subtotal }}</text>
      </view>
      <view class="total-row">
        <text class="total-label">合计</text>
        <text class="total-price">¥{{ orderData.totalAmount }}</text>
      </view>
    </view>

    <!-- 操作 / Actions -->
    <view class="actions" v-if="orderData.status === 0">
      <view class="pay-notice">
        <text>💡 提示：微信支付功能配置后即可使用，请联系店家完成支付</text>
      </view>
      <button class="btn-cancel" @click="cancel">取消订单</button>
    </view>
  </view>
  <view v-else class="loading">加载中...</view>
</template>

<script>
import { order as orderApi } from '../../utils/api.js'

export default {
  data() {
    return { orderData: null }
  },
  onLoad(options) {
    if (options.id) this.loadOrder(options.id)
  },
  computed: {
    statusText() {
      const map = { 0: '待支付', 1: '已支付', 2: '制作中', 3: '已完成', 4: '已取消' }
      return map[this.orderData?.status] || '-'
    },
    statusIcon() {
      const map = { 0: '⏳', 1: '✅', 2: '👨‍🍳', 3: '🎉', 4: '❌' }
      return map[this.orderData?.status] || ''
    },
    statusBannerClass() {
      const map = { 0: 'pending', 1: 'paid', 2: 'cooking', 3: 'done', 4: 'cancelled' }
      return map[this.orderData?.status] || ''
    }
  },
  methods: {
    async loadOrder(id) {
      try {
        this.orderData = await orderApi.detail(id)
      } catch (e) { console.error(e) }
    },
    async cancel() {
      const ok = await new Promise(res => uni.showModal({
        title: '确认取消', content: '确定取消订单吗？', success: r => res(r.confirm)
      }))
      if (!ok) return
      try {
        await orderApi.cancel(this.orderData.id)
        uni.showToast({ title: '已取消', icon: 'success' })
        setTimeout(() => uni.navigateBack(), 1000)
      } catch (e) { console.error(e) }
    },
    formatTime(t) {
      if (!t) return ''
      return t.replace('T', ' ').substring(0, 16)
    }
  }
}
</script>

<style lang="scss" scoped>
.order-detail-page { background: #f5f5f5; min-height: 100vh; }

.status-banner {
  padding: 50rpx;
  text-align: center;
  color: #fff;

  &.pending { background: linear-gradient(135deg, #f39c12, #e67e22); }
  &.paid, &.cooking { background: linear-gradient(135deg, #27ae60, #2ecc71); }
  &.done { background: linear-gradient(135deg, #2196f3, #1976d2); }
  &.cancelled { background: linear-gradient(135deg, #999, #777); }

  .status-icon { display: block; font-size: 80rpx; margin-bottom: 16rpx; }
  .status-text { font-size: 36rpx; font-weight: bold; }
}

.info-card, .items-card {
  background: #fff;
  margin: 20rpx;
  border-radius: 12rpx;
  padding: 24rpx;
}

.card-title {
  display: block;
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  color: #1a1a2e;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 12rpx 0;
  border-bottom: 1rpx solid #f5f5f5;

  .info-label { font-size: 26rpx; color: #999; }
  .info-value { font-size: 26rpx; color: #333; }
}

.item-row {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f5f5f5;

  .item-name { flex: 1; font-size: 26rpx; color: #333; }
  .item-qty { font-size: 24rpx; color: #999; margin-right: 20rpx; }
  .item-subtotal { font-size: 26rpx; color: #e74c3c; }
}

.total-row {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16rpx;
  padding-top: 20rpx;

  .total-label { font-size: 26rpx; color: #666; }
  .total-price { font-size: 36rpx; font-weight: bold; color: #e74c3c; }
}

.actions { padding: 20rpx; }

.pay-notice {
  background: #fff9e6;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 24rpx;
  color: #856404;
  margin-bottom: 20rpx;
}

.btn-cancel {
  width: 100%;
  background: #f5f5f5;
  color: #666;
  border-radius: 48rpx;
  font-size: 28rpx;
  height: 80rpx;
  line-height: 80rpx;
  border: none;
}

.loading { text-align: center; padding: 100rpx; color: #999; }
</style>
