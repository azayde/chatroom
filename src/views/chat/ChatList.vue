<!-- 聊天列表 -->
<script setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { getChatPinListService, getChatShowListService } from '@/api/chat.js'
import { useRouter, useRoute } from 'vue-router'
// const route = useRoute()
const router = useRouter()
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

const chatPinList = ref([
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
  }
])
// console.log(chatPinList.value)

// class:  pin 的样式(用is_pin判断) ！！！！！！！ TODO
// 获取置顶列表
// const getChatPinList = async () => {
//   const res = getChatPinListService()
//   chatPinList.value = res.data.data.list
//   console.log(res)
// }
// getChatPinList()

// 获取聊天列表（置顶在上，已排序）
const getChatList = async () => {
  // 获取展示列表
  // const res = await getChatShowListService()
  // console.log(res.data.data.list)
  // chatList.value = res.data.data.list

  // 排序
  // 提取置顶项的 relation_id 集合
  const pinIds = new Set(chatPinList.value.map((item) => item.relation_id))
  // console.log(pinIds)
  // 分离 chatList 中的置顶项和非置顶项
  const [pinnedItems, nonPinnedItems] = chatList.value.reduce(
    (acc, item) => {
      // 若当前项的 relation_id 在置顶集合中，归入 pinnedItems，否则归入 nonPinnedItems
      pinIds.has(item.relation_id) ? acc[0].push(item) : acc[1].push(item)
      return acc
    },
    [[], []] // 初始值
  )
  // 合并：置顶项按 chatPinList 顺序 + 原非置顶项
  const sortedList = [
    ...chatPinList.value,
    ...nonPinnedItems.filter((item) => !pinIds.has(item.relation_id))
  ]

  // 更新 chatList
  chatList.value = sortedList
}
// 渲染列表
getChatList()

// if (!route.path.split('/')[2]) {
//   router.push('/chat/chatroom')
// }
// 当前聊天页
const activeChat = ref(0)
const emit = defineEmits(['get-message'])
const handleClick = (obj) => {
  activeChat.value = obj
  console.log(obj)
  emit('get-message', obj)
  router.push({
    path: '/chat/chatroom',
    query: { relation_id: obj.relation_id }
  })
}
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
            pin: item.pin_time
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
                  ? item.friend_info.name
                  : item.group_info.name
              }}</span>
              <span class="time_now">19:30</span>
            </div>
            <span class="message">1234424343565655676676876875</span>
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
          color: #c4c4c4;
        }
        .message {
          width: 120px;
          font-size: 12px;
          margin-bottom: 10px;
          color: #c4c4c4;
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
