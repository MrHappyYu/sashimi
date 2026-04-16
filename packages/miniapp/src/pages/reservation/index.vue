<template>
  <view class="reservation-page">
    <view class="form-card">
      <text class="form-title">📅 预订座位</text>

      <!-- 日期选择 / Date picker -->
      <view class="form-item">
        <text class="form-label">预订日期 *</text>
        <picker mode="date" :value="form.reservationDate" :start="today" @change="onDateChange">
          <view class="picker-value">
            {{ form.reservationDate || '请选择日期' }}
            <text class="picker-arrow">›</text>
          </view>
        </picker>
      </view>

      <!-- 时间段选择 / Time slot -->
      <view class="form-item">
        <text class="form-label">预订时段 *</text>
        <view v-if="!form.reservationDate" class="hint">请先选择日期</view>
        <view v-else-if="loadingSlots" class="hint">加载时段中...</view>
        <view v-else class="time-grid">
          <view
            v-for="slot in timeSlots"
            :key="slot.time"
            class="time-slot"
            :class="{
              active: form.reservationTime === slot.time,
              disabled: !slot.available
            }"
            @click="slot.available && (form.reservationTime = slot.time)"
          >
            <text class="slot-time">{{ slot.time }}</text>
            <text class="slot-remain">{{ slot.available ? `余${slot.remaining}位` : '已满' }}</text>
          </view>
        </view>
      </view>

      <!-- 用餐人数 / People count -->
      <view class="form-item">
        <text class="form-label">用餐人数 *</text>
        <view class="people-row">
          <view class="qty-btn" @click="adjustPeople(-1)">-</view>
          <text class="people-num">{{ form.peopleCount }}</text>
          <view class="qty-btn plus" @click="adjustPeople(1)">+</view>
        </view>
      </view>

      <!-- 联系人 / Contact -->
      <view class="form-item">
        <text class="form-label">联系人姓名 *</text>
        <input v-model="form.contactName" placeholder="请输入姓名" class="form-input" />
      </view>

      <view class="form-item">
        <text class="form-label">联系电话 *</text>
        <input
          v-model="form.contactPhone"
          placeholder="请输入手机号"
          type="number"
          maxlength="11"
          class="form-input"
        />
      </view>

      <!-- 备注 / Remark -->
      <view class="form-item">
        <text class="form-label">特殊需求（可选）</text>
        <textarea
          v-model="form.remark"
          placeholder="如：过敏食物、儿童椅等"
          class="form-textarea"
        />
      </view>

      <!-- 提交 / Submit -->
      <button class="btn-submit" :disabled="submitting" @click="submit">
        {{ submitting ? '提交中...' : '确认预订' }}
      </button>
    </view>

    <!-- 预订须知 / Notice -->
    <view class="notice-card">
      <text class="notice-title">预订须知</text>
      <text class="notice-item">• 请提前 30 分钟到店，超时视为自动取消</text>
      <text class="notice-item">• 如需取消，请提前 2 小时联系我们</text>
      <text class="notice-item">• 每桌最多 20 人，超出请分批预订</text>
      <text class="notice-item">• 营业时间：11:00 - 21:00</text>
    </view>
  </view>
</template>

<script>
import { reservation as reservationApi } from '../../utils/api.js'

export default {
  data() {
    const now = new Date()
    const today = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`
    return {
      today,
      form: {
        reservationDate: '',
        reservationTime: '',
        peopleCount: 2,
        contactName: '',
        contactPhone: '',
        remark: ''
      },
      timeSlots: [],
      loadingSlots: false,
      submitting: false
    }
  },
  methods: {
    async onDateChange(e) {
      this.form.reservationDate = e.detail.value
      this.form.reservationTime = ''
      this.loadingSlots = true
      try {
        this.timeSlots = await reservationApi.timeSlots(this.form.reservationDate) || []
      } catch (e) {
        console.error(e)
      } finally {
        this.loadingSlots = false
      }
    },
    adjustPeople(delta) {
      const next = this.form.peopleCount + delta
      if (next >= 1 && next <= 20) this.form.peopleCount = next
    },
    async submit() {
      const token = uni.getStorageSync('token')
      if (!token) {
        uni.showToast({ title: '请先登录', icon: 'none' })
        setTimeout(() => uni.switchTab({ url: '/pages/profile/index' }), 800)
        return
      }
      if (!this.form.reservationDate) return uni.showToast({ title: '请选择预订日期', icon: 'none' })
      if (!this.form.reservationTime) return uni.showToast({ title: '请选择预订时段', icon: 'none' })
      if (!this.form.contactName) return uni.showToast({ title: '请输入联系人姓名', icon: 'none' })
      if (!this.form.contactPhone) return uni.showToast({ title: '请输入联系电话', icon: 'none' })
      if (!/^1[3-9]\d{9}$/.test(this.form.contactPhone)) {
        return uni.showToast({ title: '手机号格式不正确', icon: 'none' })
      }

      this.submitting = true
      try {
        await reservationApi.create(this.form)
        uni.showToast({ title: '预订成功！等待确认', icon: 'success' })
        setTimeout(() => uni.navigateTo({ url: '/pages/reservation/list' }), 1200)
      } catch (e) {
        console.error(e)
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.reservation-page { background: #f5f5f5; min-height: 100vh; padding: 20rpx; }

.form-card, .notice-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 24rpx;
}

.form-title {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  color: #1a1a2e;
  margin-bottom: 30rpx;
}

.form-item { margin-bottom: 32rpx; }

.form-label {
  display: block;
  font-size: 26rpx;
  color: #333;
  margin-bottom: 16rpx;
  font-weight: 500;
}

.picker-value {
  background: #f8f8f8;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 26rpx;
  color: #333;
  display: flex;
  justify-content: space-between;

  .picker-arrow { color: #999; }
}

.hint { font-size: 24rpx; color: #999; padding: 12rpx 0; }

.time-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.time-slot {
  background: #f8f8f8;
  border-radius: 12rpx;
  padding: 16rpx 8rpx;
  text-align: center;
  border: 2rpx solid transparent;

  .slot-time { display: block; font-size: 28rpx; font-weight: bold; color: #333; }
  .slot-remain { display: block; font-size: 20rpx; color: #999; margin-top: 6rpx; }

  &.active {
    background: #f8f4ef;
    border-color: #c9a96e;
    .slot-time { color: #a07840; }
    .slot-remain { color: #c9a96e; }
  }

  &.disabled {
    opacity: 0.5;
    .slot-time { color: #999; }
  }
}

.people-row {
  display: flex;
  align-items: center;
  gap: 32rpx;
}

.qty-btn {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: #f0e8da;
  color: #a07840;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  font-weight: bold;

  &.plus {
    background: linear-gradient(135deg, #c9a96e, #a07840);
    color: #fff;
  }
}

.people-num { font-size: 36rpx; font-weight: bold; min-width: 60rpx; text-align: center; }

.form-input {
  background: #f8f8f8;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 26rpx;
  color: #333;
  width: 100%;
  box-sizing: border-box;
}

.form-textarea {
  background: #f8f8f8;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 26rpx;
  color: #333;
  width: 100%;
  box-sizing: border-box;
  height: 120rpx;
}

.btn-submit {
  width: 100%;
  background: linear-gradient(135deg, #c9a96e, #a07840);
  color: #fff;
  border-radius: 48rpx;
  font-size: 30rpx;
  height: 88rpx;
  line-height: 88rpx;
  border: none;
  margin-top: 10rpx;

  &[disabled] { opacity: 0.6; }
}

.notice-card {
  .notice-title { display: block; font-size: 28rpx; font-weight: bold; margin-bottom: 20rpx; color: #333; }
  .notice-item { display: block; font-size: 24rpx; color: #666; line-height: 2; }
}
</style>
