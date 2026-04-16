<template>
  <view class="index-page">
    <!-- 顶部 Banner / Top banner -->
    <view class="hero">
      <view class="hero-content">
        <text class="hero-title">精选刺身</text>
        <text class="hero-subtitle">来自深海的极致鲜味</text>
        <button class="btn-order" @click="goMenu">立即点单</button>
      </view>
    </view>

    <!-- 快捷入口 / Quick entries -->
    <view class="quick-grid">
      <view class="quick-item" @click="goMenu">
        <text class="quick-icon">🐟</text>
        <text class="quick-text">点单</text>
      </view>
      <view class="quick-item" @click="goReservation">
        <text class="quick-icon">📅</text>
        <text class="quick-text">预订</text>
      </view>
      <view class="quick-item" @click="goOrderList">
        <text class="quick-icon">📋</text>
        <text class="quick-text">我的订单</text>
      </view>
      <view class="quick-item" @click="goReservationList">
        <text class="quick-icon">🗓️</text>
        <text class="quick-text">我的预订</text>
      </view>
    </view>

    <!-- 分类导航 / Category nav -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">菜品分类</text>
        <text class="section-more" @click="goMenu">查看全部 ›</text>
      </view>
      <scroll-view scroll-x class="category-scroll">
        <view
          v-for="cat in categories"
          :key="cat.id"
          class="category-tag"
          @click="goMenuWithCategory(cat.id)"
        >
          {{ cat.name }}
        </view>
      </scroll-view>
    </view>

    <!-- 推荐菜品 / Recommended dishes -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">🏆 主厨推荐</text>
      </view>
      <view v-if="loading" class="loading-box">
        <text>加载中...</text>
      </view>
      <view v-else class="dish-grid">
        <view
          v-for="dish in recommended"
          :key="dish.id"
          class="dish-card"
          @click="goDishDetail(dish.id)"
        >
          <view class="dish-img-placeholder">
            <text class="dish-emoji">🐟</text>
          </view>
          <view class="dish-info">
            <text class="dish-name">{{ dish.name }}</text>
            <text class="dish-desc">{{ dish.description }}</text>
            <view class="dish-footer">
              <text class="dish-price">¥{{ dish.price }}</text>
              <view class="add-btn" @click.stop="addToCart(dish)">+</view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部信息 / Footer info -->
    <view class="footer-info">
      <text>营业时间：11:00 - 21:00</text>
      <text>新鲜食材，当日现切</text>
    </view>
  </view>
</template>

<script>
import { dish as dishApi, category as categoryApi, cart as cartApi } from '../../utils/api.js'

export default {
  data() {
    return {
      recommended: [],
      categories: [],
      loading: true
    }
  },
  onLoad() {
    this.loadData()
  },
  onShow() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.loading = true
      try {
        const [recResult, catResult] = await Promise.all([
          dishApi.recommended(),
          categoryApi.list()
        ])
        this.recommended = recResult || []
        this.categories = catResult || []
      } catch (e) {
        console.error('加载首页数据失败', e)
      } finally {
        this.loading = false
      }
    },
    async addToCart(dish) {
      try {
        const token = uni.getStorageSync('token')
        if (!token) {
          uni.showToast({ title: '请先登录', icon: 'none' })
          setTimeout(() => uni.switchTab({ url: '/pages/profile/index' }), 1000)
          return
        }
        await cartApi.add(dish.id, 1)
        uni.showToast({ title: '已加入购物车', icon: 'success' })
        this.updateCartBadge()
      } catch (e) {
        console.error(e)
      }
    },
    updateCartBadge() {
      // 刷新购物车角标 / Refresh cart badge
      getApp().updateCartBadge && getApp().updateCartBadge()
    },
    goMenu() { uni.switchTab({ url: '/pages/menu/index' }) },
    goReservation() { uni.navigateTo({ url: '/pages/reservation/index' }) },
    goOrderList() { uni.navigateTo({ url: '/pages/order/list' }) },
    goReservationList() { uni.navigateTo({ url: '/pages/reservation/list' }) },
    goMenuWithCategory(id) { uni.switchTab({ url: '/pages/menu/index' }) },
    goDishDetail(id) {
      uni.setStorageSync('pendingDishId', id)
      uni.switchTab({ url: '/pages/menu/index' })
    }
  }
}
</script>

<style lang="scss" scoped>
.index-page { background: #f5f5f5; min-height: 100vh; }

.hero {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  height: 380rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &::after {
    content: '🐟 🦐 🦑';
    position: absolute;
    bottom: 20rpx;
    right: 30rpx;
    font-size: 48rpx;
    opacity: 0.3;
  }
}

.hero-content {
  text-align: center;
  color: #fff;
  padding: 40rpx;

  .hero-title {
    display: block;
    font-size: 56rpx;
    font-weight: bold;
    color: #c9a96e;
    letter-spacing: 8rpx;
  }
  .hero-subtitle {
    display: block;
    font-size: 26rpx;
    color: rgba(255,255,255,0.7);
    margin: 16rpx 0 40rpx;
  }
}

.btn-order {
  background: linear-gradient(135deg, #c9a96e, #a07840);
  color: #fff;
  border-radius: 40rpx;
  font-size: 28rpx;
  padding: 16rpx 60rpx;
  border: none;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  background: #fff;
  padding: 30rpx 20rpx;
  margin-bottom: 20rpx;
}

.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  padding: 16rpx;

  .quick-icon { font-size: 48rpx; }
  .quick-text { font-size: 24rpx; color: #333; }
}

.section {
  background: #fff;
  margin-bottom: 20rpx;
  padding: 24rpx 20rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;

  .section-title { font-size: 30rpx; font-weight: bold; color: #1a1a2e; }
  .section-more { font-size: 24rpx; color: #c9a96e; }
}

.category-scroll { white-space: nowrap; }

.category-tag {
  display: inline-block;
  background: #f8f4ef;
  color: #a07840;
  border-radius: 30rpx;
  padding: 12rpx 28rpx;
  font-size: 26rpx;
  margin-right: 16rpx;
}

.loading-box {
  text-align: center;
  padding: 60rpx;
  color: #999;
}

.dish-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.dish-card {
  border-radius: 12rpx;
  overflow: hidden;
  background: #fff;
  border: 1rpx solid #f0e8da;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.06);
}

.dish-img-placeholder {
  background: linear-gradient(135deg, #1a1a2e, #0f3460);
  height: 200rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  .dish-emoji { font-size: 80rpx; }
}

.dish-info {
  padding: 16rpx;

  .dish-name {
    display: block;
    font-size: 26rpx;
    font-weight: bold;
    color: #222;
    margin-bottom: 8rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .dish-desc {
    display: block;
    font-size: 22rpx;
    color: #999;
    margin-bottom: 16rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.dish-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .dish-price { font-size: 28rpx; color: #e74c3c; font-weight: bold; }
}

.add-btn {
  width: 52rpx;
  height: 52rpx;
  background: linear-gradient(135deg, #c9a96e, #a07840);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  font-weight: bold;
}

.footer-info {
  text-align: center;
  padding: 40rpx 20rpx;
  color: #999;
  font-size: 24rpx;
  line-height: 2;
}
</style>
