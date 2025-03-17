<script setup>
import ChatList from './ChatList.vue'
import ChatRoom from './ChatRoom.vue'
import { ref } from 'vue'
const chatInfo = ref()
const getMsg = (obj) => {
  chatInfo.value = obj
  console.log(chatInfo.value)
}
</script>

<template>
  <el-container class="chat-page">
    <chat-list @get-message="getMsg"></chat-list>
    <el-main>
      <chat-room v-if="chatInfo" :chatInfo="chatInfo"></chat-room>
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
