<template>
  <view class="res-list-page">
    <view v-if="loading" class="loading">加载中...</view>
    <view v-else-if="list.length === 0" class="empty">
      <text class="empty-icon">🗓️</text>
      <text>还没有预订记录</text>
      <button class="btn-book" @click="goBook">立即预订</button>
    </view>
    <view v-else class="list">
      <view v-for="item in list" :key="item.id" class="res-card">
        <view class="res-header">
          <view>
            <text class="res-date">{{ item.reservationDate }} {{ item.reservationTime }}</text>
            <text class="res-people">{{ item.peopleCount }} 人</text>
          </view>
          <text class="res-status" :class="statusClass(item.status)">{{ statusText(item.status) }}</text>
        </view>
        <view class="res-contact">
          <text>联系人：{{ item.contactName }} &nbsp; {{ item.contactPhone }}</text>
        </view>
        <view class="res-remark" v-if="item.remark">
          <text>备注：{{ item.remark }}</text>
        </view>
        <view class="res-actions" v-if="item.status === 0">
          <button class="btn-cancel" @click="cancel(item.id)">取消预订</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { reservation as reservationApi } from '../../utils/api.js'

export default {
  data() { return { list: [], loading: false } },
  onShow() { this.loadList() },
  methods: {
    async loadList() {
      const token = uni.getStorageSync('token')
      if (!token) { this.list = []; return }
      this.loading = true
      try { this.list = await reservationApi.list() || [] }
      catch (e) { console.error(e) }
      finally { this.loading = false }
    },
    async cancel(id) {
      const ok = await new Promise(res => uni.showModal({
        title: '确认取消', content: '确定取消预订吗？', success: r => res(r.confirm)
      }))
      if (!ok) return
      try {
        await reservationApi.cancel(id)
        uni.showToast({ title: '已取消', icon: 'success' })
        this.loadList()
      } catch (e) { console.error(e) }
    },
    statusText(s) {
      return ['待确认','已确认','已取消','已完成'][s] || '-'
    },
    statusClass(s) {
      return ['pending','confirmed','cancelled','done'][s] || ''
    },
    goBook() { uni.navigateTo({ url: '/pages/reservation/index' }) }
  }
}
</script>

<style lang="scss" scoped>
.res-list-page { background: #f5f5f5; min-height: 100vh; padding: 20rpx; }

.loading, .empty {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 26rpx;

  .empty-icon { display: block; font-size: 100rpx; margin-bottom: 20rpx; }
}

.btn-book {
  background: linear-gradient(135deg, #c9a96e, #a07840);
  color: #fff;
  border-radius: 40rpx;
  font-size: 28rpx;
  padding: 20rpx 60rpx;
  border: none;
  margin-top: 30rpx;
}

.res-card {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}

.res-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16rpx;
}

.res-date { display: block; font-size: 30rpx; font-weight: bold; color: #1a1a2e; }
.res-people { font-size: 24rpx; color: #999; margin-top: 6rpx; display: block; }

.res-status {
  font-size: 24rpx; font-weight: bold;
  &.pending { color: #e67e22; }
  &.confirmed { color: #27ae60; }
  &.cancelled { color: #999; }
  &.done { color: #2196f3; }
}

.res-contact, .res-remark {
  font-size: 24rpx;
  color: #666;
  padding: 8rpx 0;
  border-top: 1rpx solid #f5f5f5;
}

.res-actions { margin-top: 16rpx; text-align: right; }

.btn-cancel {
  display: inline-block;
  background: #f5f5f5;
  color: #666;
  border-radius: 30rpx;
  font-size: 24rpx;
  padding: 12rpx 30rpx;
  border: 1rpx solid #ddd;
}
</style>
