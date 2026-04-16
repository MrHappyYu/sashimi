<template>
  <view class="menu-page">
    <!-- 搜索框 / Search bar -->
    <view class="search-bar">
      <input
        v-model="keyword"
        placeholder="搜索菜品..."
        class="search-input"
        @input="onSearch"
        confirm-type="search"
      />
    </view>

    <view class="content-wrap">
      <!-- 左侧分类栏 / Left category sidebar -->
      <scroll-view scroll-y class="cat-sidebar">
        <view
          v-for="cat in categories"
          :key="cat.id"
          class="cat-item"
          :class="{ active: activeCatId === cat.id }"
          @click="selectCategory(cat.id)"
        >
          {{ cat.name }}
        </view>
      </scroll-view>

      <!-- 右侧菜品列表 / Right dish list -->
      <scroll-view scroll-y class="dish-list">
        <view v-if="loading" class="loading-box">加载中...</view>
        <view v-else-if="dishes.length === 0" class="empty-box">暂无菜品</view>
        <view
          v-for="dish in dishes"
          :key="dish.id"
          class="dish-item"
        >
          <view class="dish-img-wrap">
            <text class="dish-emoji">🐟</text>
          </view>
          <view class="dish-detail">
            <text class="dish-name">{{ dish.name }}</text>
            <text class="dish-desc">{{ dish.description }}</text>
            <view class="dish-bottom">
              <view class="price-wrap">
                <text class="price">¥{{ dish.price }}</text>
                <text v-if="dish.originalPrice" class="ori-price">¥{{ dish.originalPrice }}</text>
              </view>
              <view class="qty-control">
                <view
                  v-if="getCartQty(dish.id) > 0"
                  class="qty-btn minus"
                  @click="decrease(dish)"
                >-</view>
                <text v-if="getCartQty(dish.id) > 0" class="qty-num">{{ getCartQty(dish.id) }}</text>
                <view class="qty-btn plus" @click="increase(dish)">+</view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 购物车悬浮 / Cart float -->
    <view class="cart-bar" @click="goCart">
      <view class="cart-icon-wrap">
        <text class="cart-icon">🛒</text>
        <text v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</text>
      </view>
      <text class="cart-total">¥{{ cartTotal.toFixed(2) }}</text>
      <view class="checkout-btn" @click.stop="goCart">去结算</view>
    </view>
  </view>
</template>

<script>
import { dish as dishApi, category as categoryApi, cart as cartApi } from '../../utils/api.js'

export default {
  data() {
    return {
      categories: [],
      dishes: [],
      activeCatId: null,
      keyword: '',
      loading: false,
      cartItems: [],  // 本地购物车缓存
      searchTimer: null
    }
  },
  computed: {
    cartCount() {
      return this.cartItems.reduce((sum, i) => sum + i.quantity, 0)
    },
    cartTotal() {
      return this.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
    }
  },
  onLoad() {
    this.init()
  },
  onShow() {
    this.loadCart()
    const dishId = uni.getStorageSync('pendingDishId')
    if (dishId) {
      uni.removeStorageSync('pendingDishId')
      // 高亮或滚动到指定菜品 / Highlight or scroll to the dish
      this.highlightDishId = dishId
    }
  },
  methods: {
    async init() {
      try {
        const cats = await categoryApi.list()
        this.categories = cats || []
        if (this.categories.length > 0) {
          this.activeCatId = this.categories[0].id
          await this.loadDishes()
        }
        await this.loadCart()
      } catch (e) {
        console.error(e)
      }
    },
    async loadDishes() {
      this.loading = true
      try {
        const result = await dishApi.list({
          categoryId: this.activeCatId,
          keyword: this.keyword || undefined
        })
        this.dishes = result || []
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    async loadCart() {
      const token = uni.getStorageSync('token')
      if (!token) return
      try {
        const result = await cartApi.list()
        this.cartItems = result || []
      } catch (e) {
        console.error(e)
      }
    },
    selectCategory(id) {
      this.activeCatId = id
      this.keyword = ''
      this.loadDishes()
    },
    onSearch() {
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => this.loadDishes(), 500)
    },
    getCartQty(dishId) {
      const item = this.cartItems.find(i => i.dishId === dishId)
      return item ? item.quantity : 0
    },
    async increase(dish) {
      const token = uni.getStorageSync('token')
      if (!token) {
        uni.showToast({ title: '请先登录', icon: 'none' })
        setTimeout(() => uni.switchTab({ url: '/pages/profile/index' }), 800)
        return
      }
      try {
        await cartApi.add(dish.id, 1)
        await this.loadCart()
        this.updateBadge()
      } catch (e) { console.error(e) }
    },
    async decrease(dish) {
      const item = this.cartItems.find(i => i.dishId === dish.id)
      if (!item) return
      try {
        await cartApi.update(item.id, item.quantity - 1)
        await this.loadCart()
        this.updateBadge()
      } catch (e) { console.error(e) }
    },
    updateBadge() {
      if (this.cartCount > 0) {
        uni.setTabBarBadge({ index: 2, text: String(this.cartCount) })
      } else {
        uni.removeTabBarBadge({ index: 2 })
      }
    },
    goCart() { uni.switchTab({ url: '/pages/cart/index' }) }
  }
}
</script>

<style lang="scss" scoped>
.menu-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
}

.search-bar {
  background: #1a1a2e;
  padding: 16rpx 24rpx 20rpx;
}

.search-input {
  background: rgba(255,255,255,0.12);
  border-radius: 36rpx;
  padding: 14rpx 30rpx;
  color: #fff;
  font-size: 26rpx;
  width: 100%;
  box-sizing: border-box;
}

.content-wrap {
  display: flex;
  flex: 1;
  overflow: hidden;
  padding-bottom: 120rpx;
}

.cat-sidebar {
  width: 180rpx;
  background: #fff;
  flex-shrink: 0;
  height: 100%;
}

.cat-item {
  padding: 28rpx 16rpx;
  font-size: 26rpx;
  color: #666;
  text-align: center;
  border-left: 4rpx solid transparent;
  line-height: 1.4;

  &.active {
    color: #c9a96e;
    background: #f8f4ef;
    border-left-color: #c9a96e;
    font-weight: bold;
  }
}

.dish-list {
  flex: 1;
  height: 100%;
  background: #f5f5f5;
}

.loading-box, .empty-box {
  text-align: center;
  padding: 80rpx 0;
  color: #999;
  font-size: 26rpx;
}

.dish-item {
  background: #fff;
  margin: 0 0 2rpx;
  padding: 24rpx;
  display: flex;
  gap: 20rpx;
}

.dish-img-wrap {
  width: 160rpx;
  height: 160rpx;
  background: linear-gradient(135deg, #1a1a2e, #0f3460);
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  .dish-emoji { font-size: 64rpx; }
}

.dish-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.dish-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #222;
  margin-bottom: 8rpx;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.dish-desc {
  font-size: 22rpx;
  color: #999;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.dish-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16rpx;
}

.price-wrap {
  display: flex;
  align-items: baseline;
  gap: 8rpx;

  .price { font-size: 32rpx; color: #e74c3c; font-weight: bold; }
  .ori-price { font-size: 22rpx; color: #bbb; text-decoration: line-through; }
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
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  font-weight: bold;

  &.plus {
    background: linear-gradient(135deg, #c9a96e, #a07840);
    color: #fff;
  }
  &.minus {
    background: #f0e8da;
    color: #a07840;
  }
}

.qty-num {
  font-size: 28rpx;
  font-weight: bold;
  min-width: 30rpx;
  text-align: center;
}

/* 购物车悬浮栏 / Cart float bar */
.cart-bar {
  position: fixed;
  bottom: 120rpx;
  left: 30rpx;
  right: 30rpx;
  background: #1a1a2e;
  border-radius: 60rpx;
  height: 96rpx;
  display: flex;
  align-items: center;
  padding: 0 16rpx 0 24rpx;
  box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.3);
  z-index: 100;
}

.cart-icon-wrap {
  position: relative;
  width: 64rpx;
  height: 64rpx;
  .cart-icon { font-size: 40rpx; }
}

.cart-badge {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  background: #e74c3c;
  color: #fff;
  border-radius: 20rpx;
  font-size: 18rpx;
  padding: 2rpx 8rpx;
  min-width: 28rpx;
  text-align: center;
}

.cart-total {
  flex: 1;
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
  margin-left: 16rpx;
}

.checkout-btn {
  background: linear-gradient(135deg, #c9a96e, #a07840);
  color: #fff;
  border-radius: 48rpx;
  padding: 16rpx 40rpx;
  font-size: 26rpx;
}
</style>
