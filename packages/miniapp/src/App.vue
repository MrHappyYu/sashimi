<script>
export default {
  onLaunch() {
    console.log('刺身点单小程序启动')
    // 初始化购物车数量角标 / Init cart badge
    this.updateCartBadge()
  },
  methods: {
    updateCartBadge() {
      const cartItems = uni.getStorageSync('localCart') || []
      const count = cartItems.reduce((sum, item) => sum + item.quantity, 0)
      if (count > 0) {
        uni.setTabBarBadge({ index: 2, text: String(count) })
      } else {
        uni.removeTabBarBadge({ index: 2 })
      }
    }
  }
}
</script>

<style lang="scss">
/* 全局样式 / Global styles */
page {
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif;
}

.gold { color: #c9a96e; }
.dark-bg { background-color: #1a1a2e; }

/* 通用卡片 / Common card */
.card {
  background: #fff;
  border-radius: 12rpx;
  margin: 20rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.06);
}

/* 按钮 / Button */
.btn-primary {
  background: linear-gradient(135deg, #c9a96e, #a07840);
  color: #fff;
  border-radius: 48rpx;
  font-size: 28rpx;
  border: none;
  height: 80rpx;
  line-height: 80rpx;
}

.btn-primary:active { opacity: 0.85; }

/* 价格颜色 / Price color */
.price { color: #e74c3c; font-weight: bold; }

/* 状态标签 / Status badge */
.badge {
  display: inline-block;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
}
.badge-pending { background: #fff3e0; color: #e67e22; }
.badge-confirmed { background: #e8f5e9; color: #27ae60; }
.badge-cancelled { background: #fafafa; color: #999; }
.badge-done { background: #e3f2fd; color: #2196f3; }
</style>
