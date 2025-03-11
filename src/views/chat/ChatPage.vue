<script setup>
import ChatList from './ChatList.vue'
import ChatRoom from './ChatRoom.vue'
</script>

<template>
  <el-container class="chat-page">
    <chat-list></chat-list>
    <el-main>
      <chat-room class="room"></chat-room>
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
