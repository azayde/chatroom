<script setup>
import ChatList from './ChatList.vue'
import ChatRoom from './ChatRoom.vue'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const chatInfo = ref()
const chat = ref(false)

const getMsg = (obj) => {
  chatInfo.value = obj
  console.log(chatInfo.value)
}
watch(
  () => route.query.relation_id,
  (newid) => {
    chat.value = true
    console.log(newid)
  }
)
</script>

<template>
  <el-container class="chat-page">
    <chat-list @get-message="getMsg"></chat-list>
    <el-main>
      <chat-room v-if="chat" :chatInfo="chatInfo"></chat-room>
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
