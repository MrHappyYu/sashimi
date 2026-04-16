<template>
  <keep-alive>
    <a-button> 按钮组件 </a-button>
  </keep-alive>
</template>
<script setup lang="ts">
import { onMounted, onActivated, onDeactivated } from 'vue'
onMounted(() => {
  console.log('组件挂载')
})
onActivated(() => {
  console.log('组件激活')
})
onDeactivated(() => {
  console.log('组件缓存')
})
</script>
