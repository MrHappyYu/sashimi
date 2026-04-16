import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 侧边栏折叠状态 / Sidebar collapsed state
  const collapsed = ref(false)

  function toggleCollapsed() {
    collapsed.value = !collapsed.value
  }

  return { collapsed, toggleCollapsed }
})
