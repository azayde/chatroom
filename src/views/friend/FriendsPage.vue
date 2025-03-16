<!-- 作用: 好友页面 -->
<script setup>
import FriendsList from './FriendsList.vue'
import NewFriend from './NewFriend.vue'

import { ref } from 'vue'
// 父传子 or  子传父 ？？？
// TODO

// FriendsList里的数据，传到 该页面
// 然后数据再传到 user-card
const IsNewFriend = ref(false)

// 申请信息
// const newFriend = ref()

// 好友信息
const friendInfo = ref()
const getFriendInfo = (obj) => {
  // newFriend.value = obj.newFriend
  // console.log(newFriend.value)
  // console.log(typeof newFriend.value)
  IsNewFriend.value = obj.IsNewFriend
  friendInfo.value = obj.item
  console.log(friendInfo.value)
}
</script>

<template>
  <el-container>
    <friends-list @get-friend-info="getFriendInfo"></friends-list>
    <el-main>
      <!-- <new-friend v-if="IsNewFriend" :newFriend="newFriend"></new-friend> -->
      <new-friend v-if="IsNewFriend"></new-friend>
      <!-- friendInfo 不为空时，展示 -->
      <user-card
        v-else-if="friendInfo"
        :userInfo="friendInfo"
        class="user-card"
      ></user-card>
    </el-main>
  </el-container>
</template>

<style lang="scss" scoped>
.el-container {
  height: 94vh;
  .user-card {
    margin: 60px auto;
    // margin-top: 20px;
    width: 55%;
  }
}
</style>
