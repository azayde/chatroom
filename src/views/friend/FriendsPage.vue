<!-- 作用: 好友页面 -->
<script setup>
import FriendsList from './FriendsList.vue'
import NewFriend from './NewFriend.vue'

import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useFriendStore } from '@/stores'

const friendStore = useFriendStore()

const route = useRoute()

// 父传子 or  子传父 ？？？
// TODO

// FriendsList里的数据，传到 该页面
// 然后数据再传到 user-card
const IsNewFriend = ref(false)

// 申请信息
// const newFriend = ref()

// 好友信息
const friendInfo = ref(friendStore.friendInfo)
const friendShow = ref(false)
const getFriendInfo = (obj) => {
  // newFriend.value = obj.newFriend
  // console.log(newFriend.value)
  // console.log(typeof newFriend.value)
  IsNewFriend.value = obj.IsNewFriend
  friendInfo.value = obj.item
  console.log(friendInfo.value)
}
if (route.query.relation_id) {
  friendShow.value = true
}
watch(
  () => route.query.relation_id,
  (newid) => {
    friendShow.value = true
    friendInfo.value = friendStore.friendInfo
    console.log(newid)
  }
)
watch(
  () => friendInfo.value,
  (newVal) => {
    console.log(newVal)
    friendStore.setFriendInfo(newVal)
    friendInfo.value = newVal
  }
)
</script>

<template>
  <el-container>
    <friends-list @get-friend-info="getFriendInfo"></friends-list>
    <el-main>
      <!-- <new-friend v-if="IsNewFriend" :newFriend="newFriend"></new-friend> -->
      <new-friend v-if="IsNewFriend"></new-friend>
      <!-- friendInfo 不为空时，展示 -->
      <user-card
        v-else-if="friendShow"
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
