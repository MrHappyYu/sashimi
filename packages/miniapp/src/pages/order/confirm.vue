<!-- 此页面通过 cart/index.vue 中直接提交，confirm 作为路由占位 -->
<template>
  <view style="padding:40rpx;text-align:center;color:#999">
    正在跳转...
  </view>
</template>
<script>
export default {
  onLoad() { uni.navigateBack() }
}
</script>
