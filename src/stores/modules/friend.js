import { defineStore } from 'pinia'
import { ref } from 'vue'

// 好友模块
export const useFriendStore = defineStore(
  'chat-friend',
  () => {
    const friendInfo = ref()
    const setFriendInfo = (value) => {
      friendInfo.value = value
    }
    return { friendInfo, setFriendInfo }
  },
  {
    persist: true
  }
)
