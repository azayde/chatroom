import { getMonthDays } from 'element-plus/es/components/calendar/src/date-table'
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 群聊模块
export const useGroupStore = defineStore(
  'chat-group',
  () => {
    const groupInfo = ref()
    // 群成员总人数
    const groupMember = ref()
    const setGroupInfo = (value) => {
      groupInfo.value = value
    }
    const setGroupMember = (value) => {
      groupMember.value = value
    }
    const cleanGroup = () => {
      groupInfo.value = ''
      groupMember.value = ''
    }
    return { groupInfo, groupMember, setGroupInfo, setGroupMember, cleanGroup }
  },
  {
    persist: true
  }
)
