<!-- 聊天列表 -->
<script setup>
import { ref, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { getChatPinListService, getChatShowListService } from '@/api/chat.js'
import { useRouter, useRoute } from 'vue-router'
import { useChatStore } from '@/stores'
const route = useRoute()
const router = useRouter()
const chatStore = useChatStore()

// 搜索框
const input = ref('')

// 搜索列表切换
const IsSearch = ref(false)
const handleFocus = () => {
  IsSearch.value = true
}
const handleBlue = () => {
  // 输入框为空 且 失焦 切换
  if (!input.value) {
    IsSearch.value = false
  }
}

// 聊天列表
const chatList = ref([
  {
    relation_id: 1,
    relation_type: 'friend',
    pin_time: '',
    friend_info: {
      account_id: 101,
      name: 'Alice Smith',
      avatar:
        'https://q1.itc.cn/q_70/images03/20241212/702ee264f5aa44a3aec02043acf3a694.jpeg'
    }
  },
  {
    relation_id: 24,
    relation_type: 'group',
    pin_time: '',
    group_info: {
      relation_id: 1212,
      name: '数据分析交流群',
      description: '分享数据分析技巧',
      avatar: 'https://img.shetu66.com/2023/06/28/1687937373741115.png'
    }
  },
  {
    relation_id: 3,
    relation_type: 'friend',
    pin_time: '2025-03-15T12:00:00Z',
    friend_info: {
      account_id: 103,
      name: 'Charlie',
      avatar:
        'https://img.ixintu.com/download/jpg/201911/e25b904bc42a74d7d77aed81e66d772c.jpg!con'
    }
  },
  {
    relation_id: 22,
    relation_type: 'group',
    pin_time: '',
    group_info: {
      relation_id: 1010,
      name: '低代码开发平台',
      description: '探索低代码/零代码开发',
      avatar: 'https://pic.616pic.com/ys_bnew_img/00/02/01/VafZfftlPM.jpg'
    }
  }
])

const chatPinList = ref([])
// console.log(chatPinList.value)

// class:  pin 的样式(用is_pin判断) ！！！！！！！ TODO
// 获取置顶列表
const getChatPinList = async () => {
  const res = await getChatPinListService()
  console.log(res)
  chatPinList.value = res.data.data.list
}

// 获取聊天列表（置顶在上，已排序）
const getChatList = async () => {
  // 先获取到置顶列表
  await getChatPinList()

  // 获取展示列表
  const res = await getChatShowListService()
  console.log(res)

  chatList.value = res.data.data.list
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
  console.log(chatList.value)
  // chatList.value.forEach((item) => {
  //   // const time = new Date(item.create_at)
  //   const time = formatTime(item.creat_at)

  //   console.log(time)
  //   // console.log(time.getHours())
  //   // console.log(time.getMinutes())
  // })
  // pinOrderMap.forEach((value, key) => {
  //   console.log(`Key: ${key}, Value: ${value}`)
  // })
  console.log(pinOrderMap)
}
// 渲染列表
getChatList()

// const formatTime = (timestamp) => {
//   if (!timestamp) return ''
//   const date = new Date(timestamp)
//   const hours = String(date.getHours()).padStart(2, '0')
//   const minutes = String(date.getMinutes()).padStart(2, '0')
//   return `${hours}:${minutes}`
// }

// if (!route.path.split('/')[2]) {
//   router.push('/chat/chatroom')
// }
// 当前聊天页

// console.log()
const activeChat = ref(route.query.relation_id ? chatStore.chatInfo : 0)
const emit = defineEmits(['get-message'])
const handleClick = (obj) => {
  activeChat.value = obj
  // console.log(obj)
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
  // (newid) => {
  //   chatShow.value = true
  //   chatInfo.value = chatStore.chatInfo
  //   console.log(newid)
  // }
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
    <el-main v-if="!IsSearch" class="list">
      <el-scrollbar>
        <!-- TODO pin 样式 is_pin -->
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
            <el-badge class="item" :value="0" :hidden="true">
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
              <span class="time_now">19:30</span>
            </div>
            <span class="message">
              {{ item.msg_type === 'text' ? item.msg_content : '[文件]' }}
            </span>
          </div>
        </div></el-scrollbar
      >
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
        // align-items: center;
        .top {
          display: flex;
          justify-content: space-between;
        }
        .name {
          font-size: 16px;
          width: 100px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .time_now {
          font-size: 12px;
          color: #b8b5b5;
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
      background-color: #e0e0e0;
    }
    .pin {
      background-color: #e4e4e4;
    }
    .active {
      background-color: #d6d6d6 !important; //点击后颜色
    }
  }
}
</style>
