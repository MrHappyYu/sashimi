<template>
  <view class="cart-page">
    <view v-if="cartItems.length === 0" class="empty-cart">
      <text class="empty-icon">🛒</text>
      <text class="empty-text">购物车还是空的</text>
      <button class="btn-go-menu" @click="goMenu">去点单</button>
    </view>

    <view v-else>
      <!-- 购物车列表 / Cart list -->
      <view class="cart-list">
        <view
          v-for="item in cartItems"
          :key="item.id"
          class="cart-item"
        >
          <view class="item-img">
            <text class="item-emoji">🐟</text>
          </view>
          <view class="item-info">
            <text class="item-name">{{ item.dishName }}</text>
            <text class="item-price">¥{{ item.price }}</text>
          </view>
          <view class="qty-control">
            <view class="qty-btn" @click="decrease(item)">-</view>
            <text class="qty-num">{{ item.quantity }}</text>
            <view class="qty-btn plus" @click="increase(item)">+</view>
          </view>
        </view>
      </view>

      <!-- 清空购物车 / Clear cart -->
      <view class="clear-bar">
        <text class="clear-btn" @click="clearCart">清空购物车</text>
      </view>

      <!-- 订单备注 / Order remark -->
      <view class="remark-box card">
        <text class="remark-label">用餐方式</text>
        <view class="order-type-row">
          <view
            class="type-option"
            :class="{ active: orderType === 1 }"
            @click="orderType = 1"
          >🍽️ 堂食</view>
          <view
            class="type-option"
            :class="{ active: orderType === 2 }"
            @click="orderType = 2"
          >🥡 外带</view>
        </view>
        <input
          v-model="remark"
          placeholder="备注（如：少辣、忌口等）"
          class="remark-input"
        />
      </view>
    </view>

    <!-- 底部结算栏 / Bottom checkout bar -->
    <view v-if="cartItems.length > 0" class="checkout-bar">
      <view class="total-wrap">
        <text class="total-label">合计</text>
        <text class="total-price">¥{{ total.toFixed(2) }}</text>
      </view>
      <view class="checkout-btn" @click="submitOrder" :class="{ disabled: submitting }">
        {{ submitting ? '提交中...' : '提交订单' }}
      </view>
    </view>
  </view>
</template>

<script>
import { cart as cartApi, order as orderApi } from '../../utils/api.js'

export default {
  data() {
    return {
      cartItems: [],
      orderType: 1,
      remark: '',
      loading: false,
      submitting: false
    }
  },
  computed: {
    total() {
      return this.cartItems.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0)
    }
  },
  onShow() {
    this.loadCart()
  },
  methods: {
    async loadCart() {
      const token = uni.getStorageSync('token')
      if (!token) { this.cartItems = []; return }
      try {
        this.cartItems = await cartApi.list() || []
        this.updateBadge()
      } catch (e) { console.error(e) }
    },
    async increase(item) {
      try {
        await cartApi.update(item.id, item.quantity + 1)
        await this.loadCart()
      } catch (e) { console.error(e) }
    },
    async decrease(item) {
      try {
        await cartApi.update(item.id, item.quantity - 1)
        await this.loadCart()
      } catch (e) { console.error(e) }
    },
    async clearCart() {
      const confirmed = await new Promise(resolve => {
        uni.showModal({
          title: '确认清空',
          content: '确定要清空购物车吗？',
          success: res => resolve(res.confirm)
        })
      })
      if (!confirmed) return
      try {
        await cartApi.clear()
        this.cartItems = []
        uni.removeTabBarBadge({ index: 2 })
      } catch (e) { console.error(e) }
    },
    async submitOrder() {
      if (this.submitting) return
      this.submitting = true
      try {
        const result = await orderApi.create({
          cartIds: this.cartItems.map(i => i.id),
          orderType: this.orderType,
          remark: this.remark
        })
        this.cartItems = []
        this.remark = ''
        uni.removeTabBarBadge({ index: 2 })
        // 模拟支付弹窗 / Mock payment dialog
        this.showPayment(result.id, result.totalAmount)
      } catch (e) {
        console.error(e)
      } finally {
        this.submitting = false
      }
    },
    showPayment(orderId, amount) {
      uni.showModal({
        title: '确认支付',
        content: `订单金额：¥${parseFloat(amount).toFixed(2)}\n支付方式：微信支付`,
        confirmText: '立即支付',
        cancelText: '稍后支付',
        success: (res) => {
          if (res.confirm) {
            // 模拟支付成功 / Simulate payment success
            uni.showLoading({ title: '支付中...' })
            setTimeout(() => {
              uni.hideLoading()
              uni.showToast({ title: '支付成功！', icon: 'success' })
              setTimeout(() => {
                uni.navigateTo({ url: `/pages/order/detail?id=${orderId}` })
              }, 1000)
            }, 1500)
          } else {
            // 稍后支付，跳转订单详情 / Pay later, go to order detail
            uni.showToast({ title: '订单已提交', icon: 'success' })
            setTimeout(() => {
              uni.navigateTo({ url: `/pages/order/detail?id=${orderId}` })
            }, 1000)
          }
        }
      })
    },
    updateBadge() {
      const count = this.cartItems.reduce((s, i) => s + i.quantity, 0)
      if (count > 0) {
        uni.setTabBarBadge({ index: 2, text: String(count) })
      } else {
        uni.removeTabBarBadge({ index: 2 })
      }
    },
    goMenu() { uni.switchTab({ url: '/pages/menu/index' }) }
  }
}
</script>

<style lang="scss" scoped>
.cart-page { background: #f5f5f5; min-height: 100vh; padding-bottom: 140rpx; }

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 160rpx 0;
  gap: 24rpx;

  .empty-icon { font-size: 120rpx; }
  .empty-text { font-size: 28rpx; color: #999; }
}

.btn-go-menu {
  background: linear-gradient(135deg, #c9a96e, #a07840);
  color: #fff;
  border-radius: 40rpx;
  font-size: 28rpx;
  padding: 20rpx 60rpx;
  border: none;
  margin-top: 20rpx;
}

.cart-list { background: #fff; margin-bottom: 20rpx; }

.cart-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  border-bottom: 1rpx solid #f5f5f5;
  gap: 20rpx;
}

.item-img {
  width: 100rpx;
  height: 100rpx;
  background: linear-gradient(135deg, #1a1a2e, #0f3460);
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  .item-emoji { font-size: 48rpx; }
}

.item-info {
  flex: 1;
  .item-name { display: block; font-size: 28rpx; color: #222; margin-bottom: 8rpx; }
  .item-price { font-size: 28rpx; color: #e74c3c; font-weight: bold; }
}

.qty-control {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.qty-btn {
  width: 52rpx;
  height: 52rpx;
  border-radius: 50%;
  background: #f0e8da;
  color: #a07840;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: bold;

  &.plus {
    background: linear-gradient(135deg, #c9a96e, #a07840);
    color: #fff;
  }
}

.qty-num { font-size: 28rpx; font-weight: bold; min-width: 30rpx; text-align: center; }

.clear-bar {
  text-align: center;
  padding: 20rpx;
  .clear-btn { color: #999; font-size: 24rpx; }
}

.card {
  background: #fff;
  margin: 0 0 20rpx;
  padding: 24rpx;
}

.remark-box {
  .remark-label { display: block; font-size: 28rpx; font-weight: bold; margin-bottom: 16rpx; }
}

.order-type-row {
  display: flex;
  gap: 20rpx;
  margin-bottom: 24rpx;
}

.type-option {
  flex: 1;
  text-align: center;
  padding: 20rpx;
  border-radius: 12rpx;
  background: #f5f5f5;
  font-size: 26rpx;
  color: #666;
  border: 2rpx solid transparent;

  &.active {
    background: #f8f4ef;
    color: #a07840;
    border-color: #c9a96e;
  }
}

.remark-input {
  background: #f8f8f8;
  border-radius: 8rpx;
  padding: 16rpx 20rpx;
  font-size: 26rpx;
  color: #333;
  width: 100%;
  box-sizing: border-box;
}

.checkout-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 20rpx 30rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  display: flex;
  align-items: center;
  box-shadow: 0 -2rpx 12rpx rgba(0,0,0,0.1);
}

.total-wrap {
  flex: 1;
  .total-label { font-size: 26rpx; color: #666; }
  .total-price { display: block; font-size: 36rpx; font-weight: bold; color: #e74c3c; }
}

.checkout-btn {
  background: linear-gradient(135deg, #c9a96e, #a07840);
  color: #fff;
  border-radius: 48rpx;
  padding: 20rpx 60rpx;
  font-size: 28rpx;

  &.disabled { opacity: 0.6; }
}
</style>
