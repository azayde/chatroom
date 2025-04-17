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
    const updateFriendNickName = (newNickName) => {
      friendInfo.value.nick_name = newNickName
    }
    const cleanFriend = () => {
      friendInfo.value = ''
    }
    return { friendInfo, setFriendInfo, updateFriendNickName, cleanFriend }
  },
  {
    persist: true
  }
)
