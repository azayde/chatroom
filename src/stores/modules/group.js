import { defineStore } from 'pinia'
import { ref } from 'vue'

// 群聊模块
export const useGroupStore = defineStore(
  'chat-group',
  () => {
    const groupInfo = ref()
    const setGroupInfo = (value) => {
      groupInfo.value = value
    }
    return { groupInfo, setGroupInfo }
  },
  {
    persist: true
  }
)
