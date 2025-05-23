<!-- 聊天列表 -->
<script setup>
import { ref, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import {
  getChatPinListService,
  getChatShowListService,
  searchMsgByContent
} from '@/api/chat.js'
import { useRouter, useRoute } from 'vue-router'
import { useChatStore } from '@/stores'
import { formatTime } from '@/utils/time'
const route = useRoute()
const router = useRouter()
const chatStore = useChatStore()

const loading = ref(true)
// 搜索框
const input = ref('')

// 搜索列表切换
const IsSearch = ref(false)
const handleFocus = () => {
  IsSearch.value = true
}
const handleBlue = async () => {
  // 输入框为空 且 失焦 切换
  if (!input.value) {
    IsSearch.value = false
  }
  console.log(input.value)
  const res = await searchMsgByContent({
    relation_id: -1,
    content: input.value
  })
  console.log(res)
}

// 聊天列表
const chatList = ref([
  // {
  //   relation_id: 1,
  //   relation_type: 'friend',
  //   pin_time: '',
  //   is_show: true,
  //   friend_info: {
  //     account_id: 101,
  //     name: 'Alice Smith',
  //     avatar:
  //       'https://q1.itc.cn/q_70/images03/20241212/702ee264f5aa44a3aec02043acf3a694.jpeg'
  //   }
  // },
  // {
  //   relation_id: 24,
  //   relation_type: 'group',
  //   pin_time: '',
  //   group_info: {
  //     relation_id: 1212,
  //     name: '数据分析交流群',
  //     description: '分享数据分析技巧',
  //     avatar: 'https://img.shetu66.com/2023/06/28/1687937373741115.png'
  //   }
  // },
  // {
  //   relation_id: 3,
  //   relation_type: 'friend',
  //   pin_time: '2025-03-15T12:00:00Z',
  //   friend_info: {
  //     account_id: 103,
  //     name: 'Charlie',
  //     avatar:
  //       'https://img.ixintu.com/download/jpg/201911/e25b904bc42a74d7d77aed81e66d772c.jpg!con'
  //   }
  // },
  // {
  //   relation_id: 22,
  //   relation_type: 'group',
  //   pin_time: '',
  //   group_info: {
  //     relation_id: 1010,
  //     name: '低代码开发平台',
  //     description: '探索低代码/零代码开发',
  //     avatar: 'https://pic.616pic.com/ys_bnew_img/00/02/01/VafZfftlPM.jpg'
  //   }
  // }
])

const chatPinList = ref([])
// console.log(chatPinList.value)

// 获取置顶列表
const getChatPinList = async () => {
  const res = await getChatPinListService()
  console.log(res)
  chatPinList.value = res.data.data.list
}

// 获取聊天列表（置顶在上，已排序）
const getChatList = async () => {
  try {
    await getChatPinList()

    // 获取展示列表
    const res = await getChatShowListService()
    console.log(res)

    chatList.value = res.data.data.list || null
    console.log(chatPinList.value)
    // 然后再进行排序
    const pinOrderMap = new Map()
    chatPinList.value.forEach((item, index) => {
      pinOrderMap.set(item.relation_id, index)
    })

    chatList.value.sort((a, b) => {
      const aIsPinned = pinOrderMap.has(a.relation_id)
      const bIsPinned = pinOrderMap.has(b.relation_id)
      // a,b都是置顶项 - 按chatPinList中的顺序排序
      if (aIsPinned && bIsPinned) {
        return pinOrderMap.get(a.relation_id) - pinOrderMap.get(b.relation_id)
      }
      // a是置顶项，a排前面
      if (aIsPinned) {
        return -1
      }
      // b是置顶项，b排前面
      if (bIsPinned) {
        return 1
      }
      return 0
    })
    // console.log(chatList.value)
  } catch (err) {
    console.log(err)
    ElMessage.error('消息列表加载失败')
  } finally {
    loading.value = false
  }
  // 先获取到置顶列表
}
// 渲染列表
getChatList()

// 当前聊天页
const activeChat = ref(route.query.relation_id ? chatStore.chatInfo : {})
const emit = defineEmits(['get-message'])
// 切换聊天会话
const handleClick = (obj) => {
  // 重置聊天的未读消息
  chatStore.resetUnreadCount(obj.relation_id)
  activeChat.value = obj
  emit('get-message', obj)
  router.push({
    path: '/chat/chatroom',
    query: { relation_id: obj.relation_id }
  })
}
watch(
  () => route.query.relation_id,
  () => {
    getChatList()
  }
)
</script>

<template>
  <el-aside>
    <el-header>
      <el-input
        v-model="input"
        :prefix-icon="Search"
        placeholder="搜索"
        class="search"
        @focus="handleFocus"
        @blur="handleBlue"
      >
      </el-input>
    </el-header>
    <!-- 聊天列表 -->
    <el-main v-if="!IsSearch" class="list" v-loading="loading">
      <el-scrollbar v-if="chatList">
        <div
          class="list-item"
          v-for="item in chatList"
          :key="item.relation_id"
          @click="handleClick(item)"
          :class="{
            active: item.relation_id === activeChat.relation_id,
            pin: item.is_pin === true
          }"
        >
          <div class="left">
            <el-badge
              class="item"
              :value="chatStore.unreadCounts[item.relation_id] || 0"
              :hidden="chatStore.unreadCounts[item.relation_id] === 0"
              :max="99"
              :is-dot="item?.is_not_disturb"
            >
              <div class="avatar">
                <el-avatar
                  shape="square"
                  :src="
                    item.relation_type === 'friend'
                      ? item.friend_info.avatar
                      : item.group_info.avatar
                  "
                ></el-avatar>
              </div>
            </el-badge>
          </div>
          <div class="right">
            <div class="top">
              <span class="name">{{
                item.relation_type === 'friend'
                  ? item.nick_name || item.friend_info.name
                  : item.group_info.name
              }}</span>
              <span class="time_now">{{ formatTime(item.create_at) }}</span>
            </div>
            <span class="message">
              {{ item.msg_type === 'text' ? item.msg_content : '[文件]' }}
            </span>
          </div>
        </div>
      </el-scrollbar>
      <template v-else>
        <el-empty description="暂无聊天" />
      </template>
    </el-main>
    <!-- 搜索结果列表 -->
    <el-main v-else> <search-list></search-list></el-main>
  </el-aside>
</template>

<style lang="scss" scoped>
.el-aside {
  width: 215px;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  .el-header {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    height: 45px;
    padding: 10px;
    // padding-top: 10px;
    .el-input {
      width: 190px;
      // width: 100%;
      height: 25px;
    }
  }
  // .el-main {
  //   // background-color: #f0f0f0;
  //   background-color: #e8e8e8;
  // }
  .list {
    background-color: #e8e8e8;
    .list-item {
      cursor: pointer;
      height: 60px;
      // border: 1px solid #000;
      display: flex;
      align-items: center;
      padding-top: 5px;
      .left {
        margin: 0 10px;
      }
      .right {
        width: 150px;
        height: 60px;
        display: flex;
        padding: 0 6px;
        padding-right: 15px;
        flex-direction: column;
        justify-content: space-between;
        .top {
          display: flex;
          justify-content: space-between;
          min-width: 0; /* 防止 flex 容器溢出 */
          .name {
            font-size: 16px;
            width: 75px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .time_now {
            font-size: 12px;
            color: #b8b5b5;
          }
        }
        .message {
          width: 120px;
          font-size: 12px;
          margin-bottom: 10px;
          color: #b8b5b5;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
    .list-item:hover {
      // background-color: #e0e0e0;
      background-color: #d0d0d0;
    }
    .pin {
      // background-color: #cacaca;
      background-color: #d5d5d5;
    }
    .active {
      // background-color: #d6d6d6 !important; //点击后颜色
      background-color: #cacaca !important; //点击后颜色
    }
  }
}
</style>
