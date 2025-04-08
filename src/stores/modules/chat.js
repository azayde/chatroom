import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChatStore = defineStore(
  'chat-chat',
  () => {
    // 当前聊天对象信息
    const chatInfo = ref(null)

    // 聊天消息列表（保持响应式）
    const chatMsg = ref([])

    // 操作方法
    const setChatInfo = (info) => {
      chatInfo.value = info
    }

    const setChatMsg = (messages) => {
      chatMsg.value = messages.filter((msg) => msg !== null)
    }

    const addChatMsg = (message) => {
      chatMsg.value = [...chatMsg.value, message]
    }

    // 更新临时消息状态（发送成功时）
    const replaceTempMessage = (tempId, serverMsg) => {
      const index = chatMsg.value.findIndex((msg) => msg.temp_id === tempId)
      if (index === -1) return

      chatMsg.value.splice(index, 1, {
        ...serverMsg,
        // 保留临时消息的客户端生成时间
        create_at: chatMsg.value[index].create_at
      })
    }

    // 更新消息发送状态（失败时）
    const updateMessageStatus = (tempId, success) => {
      const index = chatMsg.value.findIndex((msg) => msg.temp_id === tempId)
      if (index === -1) return

      chatMsg.value[index] = {
        ...chatMsg.value[index],
        sending: false,
        failed: !success
      }
    }

    return {
      chatInfo,
      chatMsg,
      setChatInfo,
      setChatMsg,
      addChatMsg,
      replaceTempMessage,
      updateMessageStatus
    }
  },
  {
    persist:
      // key: 'chat-store',
      // paths: ['chatInfo'] // 只持久化聊天对象信息
      true
  }
)
