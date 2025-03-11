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
      <div class="list-item">
        <div class="left">
          <el-badge class="item" :value="0" :hidden="true">
            <div class="avatar">
              <el-avatar
                shape="square"
                src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
              ></el-avatar>
            </div>
          </el-badge>
        </div>
        <div class="right">
          <div class="top">
            <span class="name">张三</span>
            <span class="time_now">19:30</span>
          </div>
          <span class="message">1234424343565655676676876875</span>
        </div>
      </div>
      <div class="list-item">
        <div class="left">
          <el-badge class="item" :value="0" :hidden="true">
            <div class="avatar">
              <el-avatar
                shape="square"
                src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
              ></el-avatar>
            </div>
          </el-badge>
        </div>
        <div class="right">
          <div class="top">
            <span class="name">张三</span>
            <span class="time_now">19:30</span>
          </div>
          <span class="message">1234424343565655676676876875</span>
        </div>
      </div>
      <div class="list-item">
        <div class="left">
          <el-badge class="item" :value="0" :hidden="true">
            <div class="avatar">
              <el-avatar
                shape="square"
                src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
              ></el-avatar>
            </div>
          </el-badge>
        </div>
        <div class="right">
          <div class="top">
            <span class="name">张三</span>
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
      // background-color: #e9e9e9; 点击后颜色
    }
  }
}
</style>
