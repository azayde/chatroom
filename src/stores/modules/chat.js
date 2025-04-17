import { defineStore } from 'pinia'
import { ref } from 'vue'

// 聊天模块
export const useChatStore = defineStore(
  'chat-chat',
  () => {
    // 聊天对象
    const chatInfo = ref()
    const setChatInfo = (value) => {
      chatInfo.value = value
    }
    // 当前聊天对象的聊天记录
    const chatMsg = ref()
    // 设置消息列表
    const setChatMsg = (value) => {
      chatMsg.value = value
    }
    // 添加新消息
    const addChatMsg = (message) => {
      chatMsg.value.push(message)
    }
    // // 更新临时消息
    // const updateTempMessage = (tempId, serverMessage) => {
    //   // const index = chatMsg.value.findIndex((msg) => msg.temp_id === tempId)
    //   const index = chatMsg.value.findIndex((msg) => msg?.isTemp === true)
    //   console.log(index)
    //   if (index !== -1) {
    //     // 保留除isTemp外的其他属性
    //     const { isTemp, ...rest } = serverMessage
    //     console.let(serverMessage)
    //     chatMsg.value[index] = rest
    //     console.let(isTemp)
    //   }
    // }
    const cleanChatMsg = () => {
      chatMsg.value = ''
    }
    const cleanChat = () => {
      chatMsg.value = ''
      chatInfo.value = ''
    }
    return {
      chatInfo,
      chatMsg,
      setChatInfo,
      setChatMsg,
      addChatMsg,
      // updateTempMessage,
      cleanChatMsg,
      cleanChat
    }
  },
  {
    persist: true
  }
)
