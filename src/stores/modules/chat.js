import { defineStore } from 'pinia'
import { ref } from 'vue'

// 聊天模块
export const useChatStore = defineStore(
  'chat-chat',
  () => {
    const chatInfo = ref()
    const setChatInfo = (value) => {
      chatInfo.value = value
    }
    return { chatInfo, setChatInfo }
  },
  {
    persist: true
  }
)
