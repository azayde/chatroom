<script setup>
import GroupDetail from '../group/GroupDetail.vue'

import {
  Position,
  MoreFilled,
  ChatDotRound,
  Search
} from '@element-plus/icons-vue'
import { ref } from 'vue'
const drawer = ref(false)
const drawer1 = ref(false)
// 聊天记录搜索框
const input = ref('')
const handleFocus = () => {
  console.log('聚焦')
  // 渲染搜索到内容
  // 聊天记录数组替换 ?? TODO
}
const handleBlur = () => {
  console.log('失焦')
  // 恢复原来的
}
</script>

<template>
  <el-container class="chat-room">
    <el-header>
      <h1>张三（聊天对象）</h1>
      <div class="more" @click="drawer = true">
        <el-icon><MoreFilled /></el-icon>
      </div>
    </el-header>
    <el-main> 聊天 </el-main>
    <el-footer>
      <div class="Ibox">
        <div class="fun">
          <!-- emoji表情 -->
          <el-icon>
            <img ref="emoji" src="@/assets/smile.svg" alt="" />
          </el-icon>
          <!-- 上传图片 -->
          <el-upload class="avatar-uploader">
            <el-icon>
              <img src="@/assets/picture.svg" alt="" />
            </el-icon>
          </el-upload>
          <!-- 上传文件 -->
          <el-upload class="doc-uploader">
            <el-icon>
              <img ref="emoji" src="@/assets/document.svg" alt="" />
            </el-icon>
          </el-upload>
          <!-- 聊天记录 -->
          <el-icon class="chat-history" @click="drawer1 = true"
            ><ChatDotRound
          /></el-icon>
        </div>
        <!-- 富文本输入框 -->
        <div class="textarea">
          <!-- 输入框 -->
          <input-editor></input-editor>
        </div>

        <div class="footer">
          <el-button type="primary" text bg
            ><el-icon><Position /></el-icon>发送</el-button
          >
        </div>
      </div>
    </el-footer>

    <!-- 右上角 三点 -- 聊天对象的详细信息 -->
    <!-- TODO  -->
    <el-drawer v-model="drawer" :with-header="false">
      <group-detail></group-detail>
    </el-drawer>

    <!-- 抽屉 or  对话框 ？？ TODO -->
    <el-dialog v-model="drawer1" title="聊天记录" :with-header="false">
      <el-input
        v-model="input"
        :prefix-icon="Search"
        placeholder="搜索"
        class="search"
        @focus="handleFocus"
        @blur="handleBlur"
      >
      </el-input>
      <!-- TODO -->
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
          <span class="message">12344243435gfhghfhgfg65655676676876875</span>
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
          <span class="message"
            >12344243435gfhg的广泛认同个人奋斗通过夫人的好帖让的广泛
            认同个人奋斗通过夫人的好帖让的广泛认同个人奋斗通过夫人的好帖让的广泛认同个人奋斗
            通过夫人的好帖让个风格和他显然并非好帖让个巴菲特和个人部分hfhgfg65655676676876875</span
          >
        </div>
      </div>
    </el-dialog>
  </el-container>
</template>

<style lang="scss" scoped>
.el-container {
  // height: 94vh;
  // height: 70vh;
  // border: 1px solid #000;
  // background-color: #bfa;
  .el-header {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    height: 45px;
    line-height: 45px;
    display: flex;
    justify-content: space-between;
    h1 {
      margin: 0;
      font-size: 22px;
    }
    .more {
      cursor: pointer;
      text-align: center;
      width: 20px;
      height: 20px;
      line-height: 20px;
      margin-top: 15px;
    }
    .more:hover {
      background-color: #f0f0f0;
    }
  }
  .el-main {
    overflow: auto;
  }
  .el-footer {
    // border: 1px solid #000;
    padding: 0;
    height: 150px;
    background-color: #f3f3f3;
    .Ibox {
      width: 100%;
      // height: 27%;
      border-top: 1px solid #c7c7c7;
      // box-sizing: border-box;

      // display: flex;
      // flex-wrap: wrap;
      // align-items: flex-end;
      .fun {
        width: 100%;
        display: flex;
        align-items: center;
        .avatar-uploader,
        .doc-uploader {
          width: 45px;
          height: 30px;
        }
        .el-icon {
          width: 45px;
          height: 28px;
          margin-top: 2px;
          opacity: 60%;
          cursor: pointer;
        }
        .el-icon:hover {
          opacity: 80%;
        }
        img {
          width: 28px;
        }
        .chat-history {
          font-size: 24px;
        }
      }
      // 复制
      .textarea {
        height: 80px;
        // border: none;
        // font-size: 20px;
        background-color: #f3f3f3;

        padding: 0;
        // resize: none;
        // outline: none;
        // padding: 10px 30px;
        // box-sizing: border-box;
        // margin: 0;
        // -webkit-appearance: none;
        // -moz-appearance: none;
        // appearance: none;
        // background-image: none;
      }
      .footer {
        // height: 23%;
        width: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        div {
          margin-right: 20px;
          color: #5c5c5c;
        }
        .el-button {
          max-height: 100%;
          margin-right: 20px;
        }
      }
    }
  }
  .el-dialog {
    .list-item {
      width: 730px;
      cursor: pointer;
      // height: 60px;
      // border: 1px solid #000;
      display: flex;
      // align-items: center;
      // padding-top: 5px;
      padding: 5px 0;
      margin: 5px 0;
      // border: 1px solid #000;
      .left {
        margin: 0 10px;
      }
      .right {
        width: 730px;
        // height: 60px;
        // margin: 10px 0;
        display: flex;
        padding: 0 6px;
        padding-right: 10px;
        flex-direction: column;
        justify-content: space-between;
        // align-items: center;
        .top {
          display: flex;
          justify-content: space-between;
          // margin: 10px;
          // padding-top: 10px;
        }
        .name {
          font-size: 13px;
          color: #999;
        }
        .time_now {
          font-size: 12px;
          color: #999;
        }
        .message {
          font-size: 16px;
          margin-bottom: 10px;
          // color: #c4c4c4;
          word-break: break-all;
          white-space: pre-wrap;
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
