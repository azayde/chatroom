<script setup>
import ChatList from './ChatList.vue'
import ChatRoom from './ChatRoom.vue'
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getGroupMemberService } from '@/api/group'
import { useChatStore } from '@/stores'

const chatStore = useChatStore()

const route = useRoute()

const chatInfo = ref(chatStore.chatInfo)
const chatShow = ref(false)

// 获取聊天对象的信息
const getMsg = (obj) => {
  chatInfo.value = obj
  console.log(chatInfo.value)
}
if (route.query.relation_id) {
  chatShow.value = true
}
// 群成员信息
const groupMember = ref()
const totalMember = ref()
const getGroupMember = async () => {
  console.log(route.query.relation_id)
  const res = await getGroupMemberService(route.query.relation_id)
  // console.log(res.data.data.List)
  groupMember.value = res.data.data?.List || null
  totalMember.value = res.data.data?.List.length || 0
}
onMounted(() => {
  getGroupMember()
})
watch(
  () => route.query.relation_id,
  (newid) => {
    chatShow.value = true
    chatInfo.value = chatStore.chatInfo
    console.log(newid)
    getGroupMember()
  }
)
watch(
  () => chatInfo.value,
  (newVal) => {
    chatStore.setChatInfo(newVal)
    chatInfo.value = newVal
  }
)
</script>

<template>
  <el-container class="chat-page">
    <chat-list @get-message="getMsg" class="chat-list"></chat-list>
    <el-main>
      <chat-room
        v-if="chatShow"
        :chatInfo="chatInfo"
        :groupMember="groupMember"
      ></chat-room>
    </el-main>
  </el-container>
</template>

<style lang="scss" scoped>
.el-container {
  height: 94vh;
  .chat-list {
    width: 215px;
  }
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
