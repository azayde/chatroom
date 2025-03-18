<script setup>
import GroupDetail from '../group/GroupDetail.vue'
// import ChatHistory from '@/components/ChatHistory.vue'
import { Position, MoreFilled, ChatDotRound } from '@element-plus/icons-vue'
import { ref } from 'vue'
const drawer = ref(false)
// 父传子
const props = defineProps({
  chatInfo: Object
})
console.log(props.chatInfo)

// 聊天记录dialog
const chatDialog = ref()
</script>

<template>
  <el-container class="chat-room">
    <el-header>
      <h1>
        {{
          chatInfo.relation_type === 'friend'
            ? chatInfo.friend_info.name
            : chatInfo.group_info.name
        }}{{ chatInfo.relation_type === 'group' ? '（4）' : '' }}
      </h1>
      <div class="more" @click="drawer = true">
        <el-icon><MoreFilled /></el-icon>
      </div>
    </el-header>
    <el-main>
      <el-scrollbar>
        <!-- 左侧消息 -->
        <div class="chat-item left">
          <div class="user-avatar">
            <el-avatar
              shape="square"
              src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
            ></el-avatar>
          </div>
          <div class="chat-pao">能帮我看看这个需求怎么实现吗？</div>
        </div>
        <!-- 右侧消息 -->
        <div class="chat-item right">
          <div class="user-avatar">
            <el-avatar
              shape="square"
              src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
            ></el-avatar>
          </div>
          <div class="chat-pao">当然可以，请描述具体需求</div>
        </div>
      </el-scrollbar>
    </el-main>
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
          <el-icon class="chat-history" @click="chatDialog.open()"
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
      <group-detail
        v-if="chatInfo.relation_type === 'group'"
        :groupInfo="chatInfo"
      ></group-detail>
    </el-drawer>

    <chat-history ref="chatDialog"></chat-history>
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
    // text-align: center;
    // display: flex;
    // flex-direction: column;
    // align-items: center;
    // padding: 0 10px;
    // margin: 0 10px;
    background-color: #f5f5f5;
    .el-scrollbar {
      width: 100%;
    }
    .chat-item {
      // width: 95%;
      display: flex;
      align-items: center;
      margin: 8px 30px;
      .user-avatar {
        width: 40px;
        height: 40px;
      }
      .chat-pao {
        position: relative;
        padding: 5px;
        border-radius: 6px;
        // border: 1px solid #c2d9ea;
        background-color: #e0effb;
        // width: 90%;
        max-width: 60%;
      }
    }
    // before 是一个小的矩形
    .chat-pao::before {
      content: '';
      width: 10px;
      height: 10px;
      position: absolute;
      top: 10px;
      border: inherit;
      background: inherit;
      transform: rotate(45deg);
    }
    // 设置两个小矩形的位置和角度旋转
    .chat-item.right {
      flex-direction: row-reverse;
      .chat-pao {
        // margin-left: 0;
        margin-right: 15px;
        background-color: #95ec69;
        // border-color: #99c2ff;
        // &引用上一层选择器
        &::before {
          right: -5px;
          border-left: none;
          border-bottom: none;
        }
      }
    }
    .chat-item.left {
      .chat-pao {
        margin-left: 15px;
        background-color: #fff;
        &::before {
          border-right: none;
          border-bottom: none;
          left: -5px;
          transform: rotate(-45deg);
        }
      }
    }
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
          width: 30px;
          height: 20px;
          position: relative;
          top: -4px;
          padding-left: 7px;
        }
        .el-icon {
          width: 30px;
          height: 24px;
          margin-top: 5px;
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
}
</style>
