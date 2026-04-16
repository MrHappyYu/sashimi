<template>
  <view class="profile-page">
    <!-- 用户信息区 / User info -->
    <view class="user-section">
      <view v-if="isLoggedIn" class="user-info">
        <image class="avatar" :src="userInfo.avatarUrl || defaultAvatar" mode="aspectFill" />
        <view class="user-text">
          <text class="nickname">{{ userInfo.nickname || '刺身爱好者' }}</text>
          <text class="user-id">ID: {{ userInfo.id }}</text>
        </view>
        <text class="logout-btn" @click="logout">退出</text>
      </view>
      <view v-else class="login-area" @click="doLogin">
        <image class="avatar-placeholder" src="/static/images/avatar-default.png" mode="aspectFill" />
        <view class="login-text">
          <text class="login-hint">点击登录</text>
          <text class="login-sub">登录后享受完整服务</text>
        </view>
      </view>
    </view>

    <!-- 快捷入口 / Quick entries -->
    <view class="menu-group">
      <view class="menu-item" @click="goOrderList">
        <text class="menu-icon">📋</text>
        <text class="menu-label">我的订单</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="goReservationList">
        <text class="menu-icon">🗓️</text>
        <text class="menu-label">我的预订</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>

    <view class="menu-group">
      <view class="menu-item" @click="goReservation">
        <text class="menu-icon">📅</text>
        <text class="menu-label">预订座位</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>

    <!-- 关于 / About -->
    <view class="about-card">
      <text class="about-name">刺身点单</text>
      <text class="about-desc">精选深海食材，现切现上，体验最纯粹的刺身美味</text>
      <text class="about-time">营业时间：11:00 - 21:00（周一至周日）</text>
    </view>
  </view>
</template>

<script>
import { auth } from '../../utils/api.js'

export default {
  data() {
    return {
      isLoggedIn: false,
      userInfo: {},
      defaultAvatar: '/static/images/avatar-default.png',
      logging: false
    }
  },
  onShow() {
    this.checkLogin()
  },
  methods: {
    checkLogin() {
      const token = uni.getStorageSync('token')
      const userInfo = uni.getStorageSync('userInfo')
      if (token && userInfo) {
        this.isLoggedIn = true
        this.userInfo = typeof userInfo === 'string' ? JSON.parse(userInfo) : userInfo
      } else {
        this.isLoggedIn = false
        this.userInfo = {}
      }
    },
    async doLogin() {
      if (this.logging) return
      this.logging = true
      try {
        // 获取微信登录 code / Get WeChat login code
        const loginResult = await new Promise((resolve, reject) => {
          uni.login({
            provider: 'weixin',
            success: resolve,
            fail: reject
          })
        })

        // 获取用户信息 (需用户授权) / Get user info (requires authorization)
        let nickname = '刺身爱好者'
        let avatarUrl = ''
        try {
          const profileResult = await new Promise((resolve, reject) => {
            uni.getUserProfile({
              desc: '用于完善您的个人信息',
              success: resolve,
              fail: reject
            })
          })
          nickname = profileResult.userInfo.nickName
          avatarUrl = profileResult.userInfo.avatarUrl
        } catch (e) {
          // 用户拒绝授权，使用默认值 / User denied, use defaults
        }

        // 向后端发起登录 / Login with backend
        const result = await auth.wxLogin({
          code: loginResult.code,
          nickname,
          avatarUrl
        })

        uni.setStorageSync('token', result.token)
        uni.setStorageSync('userInfo', JSON.stringify({
          id: result.userId,
          nickname: result.nickname,
          avatarUrl: result.avatarUrl
        }))
        this.isLoggedIn = true
        this.userInfo = { id: result.userId, nickname: result.nickname, avatarUrl: result.avatarUrl }
        uni.showToast({ title: '登录成功', icon: 'success' })
      } catch (e) {
        console.error('登录失败', e)
        uni.showToast({ title: '登录失败，请重试', icon: 'none' })
      } finally {
        this.logging = false
      }
    },
    logout() {
      uni.showModal({
        title: '退出登录',
        content: '确定要退出登录吗？',
        success: res => {
          if (res.confirm) {
            uni.removeStorageSync('token')
            uni.removeStorageSync('userInfo')
            this.isLoggedIn = false
            this.userInfo = {}
            uni.showToast({ title: '已退出', icon: 'success' })
          }
        }
      })
    },
    goOrderList() {
      if (!this.checkNeedLogin()) return
      uni.navigateTo({ url: '/pages/order/list' })
    },
    goReservationList() {
      if (!this.checkNeedLogin()) return
      uni.navigateTo({ url: '/pages/reservation/list' })
    },
    goReservation() { uni.navigateTo({ url: '/pages/reservation/index' }) },
    checkNeedLogin() {
      if (!this.isLoggedIn) {
        uni.showToast({ title: '请先登录', icon: 'none' })
        return false
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-page { background: #f5f5f5; min-height: 100vh; }

.user-section {
  background: linear-gradient(135deg, #1a1a2e, #0f3460);
  padding: 60rpx 30rpx 40rpx;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.login-area {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.avatar, .avatar-placeholder {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  flex-shrink: 0;
}

.user-text, .login-text { flex: 1; }

.nickname { display: block; font-size: 32rpx; font-weight: bold; color: #fff; }
.user-id { display: block; font-size: 22rpx; color: rgba(255,255,255,0.6); margin-top: 6rpx; }

.login-hint { display: block; font-size: 32rpx; font-weight: bold; color: #fff; }
.login-sub { display: block; font-size: 24rpx; color: rgba(255,255,255,0.6); margin-top: 6rpx; }

.logout-btn { color: rgba(255,255,255,0.7); font-size: 24rpx; }

.menu-group {
  background: #fff;
  margin: 20rpx 0 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 32rpx 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
  gap: 16rpx;

  &:last-child { border-bottom: none; }

  .menu-icon { font-size: 36rpx; }
  .menu-label { flex: 1; font-size: 28rpx; color: #333; }
  .menu-arrow { color: #ccc; font-size: 36rpx; }
}

.about-card {
  background: #fff;
  margin: 20rpx;
  border-radius: 12rpx;
  padding: 30rpx;
  text-align: center;

  .about-name { display: block; font-size: 30rpx; font-weight: bold; color: #1a1a2e; margin-bottom: 16rpx; }
  .about-desc { display: block; font-size: 24rpx; color: #666; line-height: 1.8; margin-bottom: 12rpx; }
  .about-time { display: block; font-size: 22rpx; color: #999; }
}
</style>
