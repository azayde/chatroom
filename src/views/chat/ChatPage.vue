<script setup>
import ChatList from './ChatList.vue'
import ChatRoom from './ChatRoom.vue'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useChatStore } from '@/stores'

const chatStore = useChatStore()

const route = useRoute()

const chatInfo = ref(chatStore.chatInfo)
const chatShow = ref(false)

const getMsg = (obj) => {
  chatInfo.value = obj
  console.log(chatInfo.value)
}
if (route.query.relation_id) {
  chatShow.value = true
}
watch(
  () => route.query.relation_id,
  (newid) => {
    chatShow.value = true
    chatInfo.value = chatStore.chatInfo
    console.log(newid)
  }
)
watch(
  () => chatInfo.value,
  (newVal) => {
    // console.log(newVal)
    chatStore.setChatInfo(newVal)
    chatInfo.value = newVal
  }
)
</script>

<template>
  <el-container class="chat-page">
    <chat-list @get-message="getMsg"></chat-list>
    <el-main>
      <chat-room v-if="chatShow" :chatInfo="chatInfo"></chat-room>
    </el-main>
  </el-container>
</template>

<style lang="scss" scoped>
.el-container {
  height: 94vh;
  // .room{
  //   // overflow: hidden;
  //   // border: 1px solid #000;
  //   // height: 100%;
  // }
  .el-main {
    height: 94vh;
  }
}
</style>
