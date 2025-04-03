<script setup>
import { ref, watch } from 'vue'
import {
  UserFilled,
  Avatar,
  ChatDotRound,
  SwitchButton
} from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
import { useChatStore, useFriendStore, useGroupStore } from '@/stores'
const chatStore = useChatStore()
const friendStore = useFriendStore()
const groupStore = useGroupStore()

// 侧边栏高亮
const chatroom = ref(false)
const friend = ref(false)
const group = ref(false)
const highlightChange = async () => {
  const path = route.path.split('/')[2]
  if (path === 'chatroom') {
    chatroom.value = true
    friend.value = false
    group.value = false
  } else if (path === 'friend') {
    chatroom.value = false
    friend.value = true
    group.value = false
  } else if (path === 'group') {
    chatroom.value = false
    friend.value = false
    group.value = true
  } else {
    chatroom.value = false
    friend.value = false
    group.value = false
  }
}
highlightChange()
// 路由变化高亮变化
watch(route, () => {
  highlightChange()
})

// 退出登录
const logout = async () => {
  await ElMessageBox.confirm('确定退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  // 清楚本地数据
  router.push('/login')
}
</script>

<template>
  <!-- 外框架 + 最左侧 -->
  <div class="layout-page">
    <el-container>
      <!-- 最左侧 -->
      <el-aside class="left-nav">
        <div class="avatar" @click="router.push('/chat/user')">
          <img src="@/assets/avatar.jpg" alt="" />
        </div>
        <div
          class="li"
          :class="{ active: chatroom }"
          @click="
            router.push({
              path: '/chat/chatroom',
              query: chatStore.chatInfo
                ? { relation_id: chatStore.chatInfo.relation_id }
                : {}
            })
          "
        >
          <el-badge :value="0" class="item" :hidden="true" :offset="[0, 0]">
            <el-icon><ChatDotRound /></el-icon>
          </el-badge>
        </div>
        <div
          class="li"
          :class="{ active: friend }"
          @click="
            router.push({
              path: '/chat/friend',
              query: friendStore.friendInfo
                ? { relation_id: friendStore.friendInfo.relation_id }
                : ''
            })
          "
        >
          <el-badge :value="0" class="item" :hidden="true">
            <el-icon><UserFilled /></el-icon>
          </el-badge>
        </div>
        <div
          class="li"
          :class="{ active: group }"
          @click="
            router.push({
              path: '/chat/group',
              query: groupStore.groupInfo
                ? {
                    relation_id: groupStore.groupInfo.relation_id
                  }
                : {}
            })
          "
        >
          <el-badge :value="0" class="item" :hidden="true">
            <el-icon>
              <Avatar />
              <Avatar style="margin-left: -10px" />
              <!-- 重叠显示表示多人 -->
            </el-icon>
          </el-badge>
        </div>
        <div class="li" @click="logout">
          <el-icon><SwitchButton /></el-icon>
        </div>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.layout-page {
  height: 100vh;
  width: 100vw;
  .el-container {
    height: 94vh;
    width: 70vw;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    margin: 0 auto;
    .el-aside {
      overflow: hidden;
      width: 50px;
      background-color: #60b0ff;
      display: flex;
      flex-direction: column;
      .avatar {
        padding: 10px 5px;
        padding-bottom: 0;
      }
      img {
        width: 100%;
        margin-top: 5px;
        border-radius: 50%;
      }
      .li {
        padding: 6px;
        margin-top: 15px;
        .el-icon {
          font-size: 30px;
          color: #fff;
        }
      }
      .li:not(:last-child) {
        flex: 0 0 auto;
      }
      .li:last-child {
        // flex: 0 0 auto;
        margin-top: auto;
        margin-bottom: 20px;
        padding-left: 10px;
      }
      .li:hover {
        background-color: #409eff;
      }
      .active {
        background-color: #409eff;
      }
      #logout {
        position: relative;
        // bottom: 100px;
        // margin-bottom: 10px;
      }
    }
  }
}
</style>
