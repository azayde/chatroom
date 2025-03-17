<!-- 聊天列表 -->
<script setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
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
    pin_time: '2025-03-01T10:00:00Z',
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
    pin_time: '2025-03-11T11:00:00',
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
    pin_time: '2025-03-10T15:00:00',
    group_info: {
      relation_id: 1010,
      name: '低代码开发平台',
      description: '探索低代码/零代码开发',
      avatar: 'https://pic.616pic.com/ys_bnew_img/00/02/01/VafZfftlPM.jpg'
    }
  }
])
// 当前聊天页
const activeChat = ref()
const emit = defineEmits(['get-message'])
const handleClick = (obj) => {
  activeChat.value = obj
  console.log(obj)
  emit('get-message', obj)
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
      <div
        class="list-item"
        v-for="item in chatList"
        :key="item.relation_id"
        @click="handleClick(item)"
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
      </div>
    </el-main>
    <!-- 搜索结果列表 -->
    <el-main v-else> <search-list></search-list></el-main>
  </el-aside>
</template>

<style lang="scss" scoped>
.el-aside {
  width: 215px;
  background-color: #f5f5f5;
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
        padding-right: 10px;
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
      background-color: #f0f0f0;
    }
    .active {
      background-color: #e9e9e9; //点击后颜色
    }
  }
}
</style>
