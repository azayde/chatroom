<!-- 好友列表 -->
<script setup>
import { watch, ref } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import {
  getFriendListService,
  createApplicationService,
  searchFriendByName
} from '@/api/friend.js'

import { useRouter, useRoute } from 'vue-router'
import { useFriendStore } from '@/stores'
const route = useRoute()
const router = useRouter()
const friendStore = useFriendStore()

// 搜索框
const input = ref('')
// 搜索列表切换
const IsSearch = ref(false)
const handleFocus = () => {
  IsSearch.value = true
  // if (input.value) {
  //   searchFriendByName(input.value)
  //   console.log(11)
  // }
}
const handleBlue = async () => {
  // 输入框为空 且 失焦 切换
  if (!input.value) {
    IsSearch.value = false
  }
  // 查询
  console.log(22)
  const res = await searchFriendByName(input.value)
  console.log(res)
}
watch(input, () => {
  // 一直搜索吗？？ TODO:
  console.log(11)
  // searchFriendByName(input.value)
})

const createApplication = ref(false)
// 好友列表
const friendList = ref([
  {
    relation_id: 1,
    relation_type: 'friend',
    is_show: true,
    pin_time: '2025-03-06T10:00:00',
    last_show: '2025-03-06T09:55:00',
    friend_info: {
      account_id: 101,
      name: 'Alice Smith',
      gender: '女',
      avatar:
        'https://q1.itc.cn/q_70/images03/20241212/702ee264f5aa44a3aec02043acf3a694.jpeg'
    },
    is_not_disturb: false,
    is_pin: true
  },
  {
    relation_id: 456,
    relation_type: 'friend',
    is_show: true,
    pin_time: '2025-03-05T18:00:00',
    last_show: '2025-03-06T10:05:00',
    friend_info: {
      account_id: 789,
      name: 'Tech Enthusiasts',
      gender: '男',
      avatar:
        'https://picx.zhimg.com/v2-52a6e836434d15d74a2121bbd6bed34d_720w.jpg?source=172ae18b'
    },
    is_not_disturb: true,
    is_pin: true
  },
  {
    relation_id: 789,
    relation_type: 'friend',
    is_show: false,
    pin_time: '2025-03-04T22:00:00',
    last_show: '2025-03-06T08:30:00',
    friend_info: {
      account_id: 101,
      name: 'Bob Johnson',
      gender: '男',
      avatar:
        'https://q1.itc.cn/q_70/images03/20241212/702ee264f5aa44a3aec02043acf3a694.jpeg'
    },
    is_not_disturb: false,
    is_pin: false
  },
  {
    relation_id: 3,
    relation_type: 'friend',
    is_show: true,
    pin_time: '2025-03-03T12:00:00',
    last_show: '2025-03-06T10:10:00',
    friend_info: {
      account_id: 103,
      name: 'Charlie',
      gender: '女',
      avatar:
        'https://img.ixintu.com/download/jpg/201911/e25b904bc42a74d7d77aed81e66d772c.jpg!con'
    },
    is_not_disturb: true,
    is_pin: false
  }
])

// 获取好友列表
const getFriendList = async () => {
  const res = await getFriendListService()
  console.log(res.data.data)
  friendList.value = res.data.data.list
}
getFriendList()

// 点击好友 - 显示对应信息
const activeFriend = ref(route.query.relation_id ? friendStore.friendInfo : 0)
// 子传父  好友信息传到FriendsPage
const emit = defineEmits(['get-friend-info'])
const sendMsg = (obj) => {
  activeFriend.value = obj.item
  emit('get-friend-info', obj)
  // console.log(obj.item)
  router.push({
    path: '/chat/friend',
    query: { relation_id: obj.item.relation_id }
  })
}

// 发送好友申请
const form = ref()
const applicationInfo = ref({
  account_id: null,
  application_msg: ''
})
const handleCreateApplication = async () => {
  createApplication.value = false
  console.log(applicationInfo.value)

  // 调接口
  const res = await createApplicationService(applicationInfo.value)
  console.log(res)
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
      <el-button
        :icon="Plus"
        plain
        size="small"
        @click="createApplication = true"
      />
    </el-header>
    <el-main v-if="!IsSearch" class="list">
      <el-scrollbar>
        <!-- IsNewFriend 判断是否点击了 “新的朋友” -->
        <div
          class="list-item"
          @click="sendMsg({ item: {}, IsNewFriend: true })"
        >
          <div class="avatar">
            <el-avatar
              shape="square"
              src="https://bpic.51yuansu.com/pic3/cover/01/81/34/596f92ddd06f8_610.jpg"
            ></el-avatar>
          </div>
          <span class="name">新的朋友</span>
        </div>
        <div
          class="list-item"
          v-for="item in friendList"
          :key="item.relation_id"
          @click="sendMsg({ item, IsNewFriend: false })"
          :class="{ active: item.relation_id === activeFriend.relation_id }"
        >
          <div class="avatar">
            <el-avatar
              shape="square"
              :src="item.friend_info.avatar"
            ></el-avatar>
          </div>
          <span class="name">{{ item.friend_info.name }}</span>
        </div>
      </el-scrollbar>
    </el-main>
    <!-- 搜索结果列表 -->
    <el-main v-else> <search-list></search-list> </el-main>

    <!-- 添加好友 -->
    <el-dialog
      v-model="createApplication"
      title="添加好友"
      width="500"
      class="dialog"
    >
      <el-form :model="applicationInfo" ref="form">
        <el-form-item label="账号id">
          <el-input v-model.number="applicationInfo.account_id"></el-input>
        </el-form-item>
        <!-- 可选 -->
        <el-form-item label="打招呼">
          <el-input v-model="applicationInfo.application_msg"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="createApplication = false">取消</el-button>
          <el-button type="primary" @click="handleCreateApplication">
            发送申请
          </el-button>
        </div>
      </template>
    </el-dialog>
  </el-aside>
</template>

<style lang="scss" scoped>
.el-aside {
  width: 215px;
  background-color: #f5f5f5;
  // height: 94vh;
  display: flex;
  flex-direction: column;
  .el-header {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    height: 45px;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    .el-input {
      width: 170px;
      height: 25px;
    }
    .el-button {
      width: 10px;
    }
  }
  .el-main {
    .list-item {
      cursor: pointer;
      height: 60px;
      display: flex;
      align-items: center;
      padding-top: 5px;
      .avatar {
        margin: 0 10px;
      }
      .name {
        font-size: 16px;
      }
    }
    .list-item:hover {
      background-color: #f0f0f0;
      // background-color: #e9e9e9; 点击后颜色
    }
    .active {
      background-color: #d6d6d6 !important; //点击后颜色
    }
  }
}
</style>
