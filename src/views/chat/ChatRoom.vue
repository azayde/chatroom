<script setup>
import GroupDetail from '../group/GroupDetail.vue'
import FriendDetail from '@/views/friend/FriendDetail.vue'
import {
  Position,
  MoreFilled,
  ChatDotRound,
  Delete,
  Star
} from '@element-plus/icons-vue'
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useUserStore, useChatStore } from '@/stores'
// import { useRoute } from 'vue-router'
import { getChatListByLastTime } from '@/api/chat.js'
import {
  sendMsg_socket,
  onMessage,
  setMessageCallback
} from '@/utils/websocket'

const userStore = useUserStore()
const chatStore = useChatStore()
// const route = useRoute()

const drawer = ref(false)
// 父传子
const props = defineProps({
  chatInfo: Object
})
console.log(props.chatInfo)
// 当前聊天相关信息
const activeChatInfo = ref(props.chatInfo)
activeChatInfo.value = props.chatInfo ? props.chatInfo : chatStore.chatInfo
console.log(activeChatInfo.value)

// 聊天记录dialog
const chatDialog = ref()

// 发送图片或文件
const fileDialog = ref(false)

// 聊天信息
const chatMsg = ref([
  {
    id: 0,
    notify_type: 'common',
    msg_type: 'text',
    msg_content: 'common notification content 1',
    msg_extend: {
      remind: null
    },
    file_id: 1,
    account_id: 734124834816,
    relation_id: 200,
    create_at: '2025-03-27T10:00:00Z',
    pin_time: '2025-03-27T10:05:00Z',
    rly_msg: null
  },
  {
    id: 1,
    notify_type: 'common',
    msg_type: 'text',
    msg_content: 'Common message content 2',
    msg_extend: {
      remind: null
    },
    file_id: 2,
    account_id: 101,
    relation_id: 200,
    create_at: '2025-03-27T10:10:00Z',
    pin_time: '2025-03-27T10:15:00Z',
    rly_msg: null
  },
  {
    id: 2,
    notify_type: 'common',
    msg_type: 'text',
    msg_content: 'common notification content 3',
    msg_extend: {
      remind: null
    },
    file_id: 3,
    account_id: 101,
    relation_id: 200,
    create_at: '2025-03-27T10:20:00Z',
    pin_time: '2025-03-27T10:25:00Z',
    rly_msg: null
  },
  {
    id: 3,
    notify_type: 'common',
    msg_type: 'text',
    msg_content: 'Common message content 4',
    msg_extend: {
      remind: null
    },
    file_id: 4,
    account_id: 734124834816,
    relation_id: 200,
    create_at: '2025-03-27T10:30:00Z',
    pin_time: '2025-03-27T10:35:00Z',
    rly_msg: null
  }
])

// 根据account_id获取用户信息进行渲染
const last_time = new Date('2026-04-01T00:00:00').getTime() / 1000
const getChatList = async () => {
  // const res = await getChatListByLastTime(props.chatInfo.relation_id, last_time)
  const res = await getChatListByLastTime({
    relation_id: props.chatInfo.relation_id,
    last_time: last_time,
    page: 1,
    page_size: 100
  })
  // console.log(res.data.data.list)
  chatMsg.value = res.data.data.list.filter((item) => item !== null)
  // console.log(chatMsg.value)
  chatStore.setChatMsg(chatMsg.value)
}
getChatList()
// 发送消息
const inputEditorRef = ref(null)
const htmlToPlainText = (html) => {
  const tempDiv = document.createElement('div') // 创建一个临时 div 元素
  tempDiv.innerHTML = html // 将 HTML 设置为该 div 的内容
  return tempDiv.innerText // 返回普通文本
}

const sendMsg = () => {
  // console.log(data)
  const content = inputEditorRef.value.getContent()
  console.log('发送内容', content)
  const plainText = htmlToPlainText(content) // 获取纯文本
  // 将纯文本编码为 UTF-8
  // 创建 TextEncoder 实例
  const encoder = new TextEncoder()
  // 编码为 UTF-8
  const encodedMessage = encoder.encode(plainText)
  // 发送时首先将其转换为字符串格式base64
  const byteArray = new Uint8Array(encodedMessage)
  // 转换为 Base64 字符串（示例）
  const base64Message = btoa(String.fromCharCode(...byteArray))
  const msg = ref({
    relation_id: props.chatInfo.relation_id,
    msg_content: base64Message
  })
  // 创建临时消息对象
  const tempMsg = {
    account_id: userStore.accountInfo.id,
    create_at: new Date().toISOString(),
    // file_id: 0,
    msg_content: base64Message,
    // msg_extend: null,
    // msg_type: 'text',
    // notify_type: 'common',
    // pin_time: 0,
    // rly_msg: null,
    relation_id: props.chatInfo.relation_id,
    temp_id: Date.now().toString(), // 临时ID
    isTemp: true // 标记为临时消息
  }
  console.log(tempMsg)

  const messageElement = document.createElement('div')
  const div = document.querySelector('.chat-msg .list')
  console.log(div)
  messageElement.html = `
      <div class="chat-item right">
        <div class="user-avatar">
          <el-avatar
            shape="square"
            :src="userStore.accountInfo.avatar"
          ></el-avatar>
        </div>
        <div class="chat-pao" v-if="true">${tempMsg.msg_content}</div>
      </div>
  `
  div.appendChild(messageElement)
  // chatStore.addChatMsg(tempMsg)
  // 滚动到最新消息
  nextTick(() => {
    scrollToBottom()
  })
  // 发送到服务器

  const sendSuccess = sendMsg_socket(JSON.stringify(msg.value))
  console.log(sendSuccess)

  // 发送消息失败
  // if (!sendSuccess) {
  //   ElMessage.danger('发送失败')
  // }

  // 清除输入框
  inputEditorRef.value.clearContent()
  // getChatList()

  // // 接收消息并渲染
  // const res = onMessage()
  // console.log(res)
  // // 新发送的消息添加到消息队列里
  // chatMsg.value.push(res)
}

onMounted(() => {
  console.log(11)
  scrollToBottom()
  setMessageCallback((newMessage) => {
    // 如果是自己发送的消息且是临时消息，则替换为服务器确认的消息
    if (newMessage.temp_id) {
      chatStore.updateTempMessage(newMessage.temp_id, newMessage)
    } else {
      chatStore.addChatMsg(newMessage)
    }
  })
  onMessage()
})

onUnmounted(() => {
  // 清理回调
  setMessageCallback(null)
})
const scrollbarRef = ref(null)
const scrollToBottom = () => {
  // const scrollbar =
  // console.log(scrollbar)
  // if (scrollbar) {
  //   scrollbar.scrollTop = scrollbar.scrollHeight
  // }
  nextTick(() => {
    if (scrollbarRef.value) {
      const scrollContainer = document.querySelector('.chat-msg .list')
      console.log(scrollContainer.scrollHeight)
      console.log(scrollContainer.scrollTop)
      scrollContainer.scrollTop = scrollContainer.scrollHeight
      console.log(scrollContainer.scrollTop)
    }
  })
}
scrollToBottom()

// 上传文件
// const fileUpdate = [
//   {
//     id: 0,
//     file_type: 'pdf',
//     file_size: 1024,
//     url: 'http://example.com/file1.pdf',
//     create_at: '2025-03-31T10:00:00Z'
//   },
//   {
//     id: 1,
//     file_type: 'doc',
//     file_size: 2048,
//     url: 'http://example.com/file2.doc',
//     create_at: '2025-03-31T11:00:00Z'
//   },
//   {
//     id: 2,
//     file_type: 'text',
//     file_size: 512,
//     url: 'http://example.com/file3.txt',
//     create_at: '2025-03-31T12:00:00Z'
//   },
//   {
//     id: 3,
//     file_type: 'ppt',
//     file_size: 4096,
//     url: 'http://example.com/file4.ppt',
//     create_at: '2025-03-31T13:00:00Z'
//   }
// ]
const fileTypeIcon = {
  pdf: 'icon-pdf',
  txt: 'icon-wenbenwendang-txt',
  ppt: 'icon-yanshiwendang-ppt_pptx',
  zip: 'icon-yasuowenjian-zip_rar_7z',
  excel: 'icon-biaoge-xlxs_xls',
  mp4: 'icon-shipin-mov_mp4_avi',
  doc: 'icon-wendang-docx_doc',
  docx: 'icon-wendang-docx_doc'
}
const selectFile = ref([])
const handleFileChange = (file) => {
  // console.log(URL.createObjectURL(file.raw))
  selectFile.value = [
    {
      id: file.uid,
      file_type: file.name.split('.').pop(),
      file_size: (file.size / 1024).toFixed(2) + 'KB',
      url: URL.createObjectURL(file.raw),
      create_at: new Date().toISOString()
    }
  ]
  console.log(file)
  fileDialog.value = true
  console.log(selectFile.value)
}

watch(
  () => props.chatInfo,
  (newVal) => {
    // console.log(newVal)
    activeChatInfo.value = newVal
    getChatList()
  }
)
</script>

<template>
  <el-container class="chat-room">
    <el-header>
      <div class="top">
        <h1>
          {{
            activeChatInfo.relation_type === 'friend'
              ? activeChatInfo.friend_info.name
              : activeChatInfo.group_info.name
          }}{{ activeChatInfo.relation_type === 'group' ? '（4）' : '' }}
        </h1>
        <div class="more" @click="drawer = true">
          <el-icon><MoreFilled /></el-icon>
        </div>
      </div>
      <!-- 有置顶或有pin时展示 -->
      <div class="bottom" v-if="true">
        <el-button text class="is_top">置顶</el-button>
        <el-button text class="is_pin">
          <el-icon><Star /></el-icon>
          Pin
        </el-button>
      </div>
    </el-header>
    <el-main>
      <!-- 聊天信息 -->
      <el-scrollbar ref="scrollbarRef" class="chat-msg">
        <div class="list">
          <div
            class="chat-item"
            v-for="item in chatStore.chatMsg"
            :key="item.id"
            :class="{
              left: item.account_id !== userStore.accountInfo.id,
              right: item.account_id === userStore.accountInfo.id
            }"
          >
            <div class="user-avatar">
              <el-avatar
                shape="square"
                :src="userStore.accountInfo.avatar"
              ></el-avatar>
            </div>
            <!-- 文字类 -->
            <div class="chat-pao" v-if="true">{{ item.msg_content }}</div>
            <!-- <div class="chat-pao" v-if="true">{{ item.msg_content }}</div> -->
            <div class="picture" v-else>
              <!-- <img class="img" src="@/assets/play.svg" alt="" /> -->
              <!-- <img class="img" src="@/assets/test1.png" alt="" /> -->
              <!-- <img
              class="img"
              src="https://img.ixintu.com/download/jpg/201911/e25b904bc42a74d7d77aed81e66d772c.jpg!con"
              alt=""
            /> -->
            </div>
            <!-- <div class="file">
            <el-link href="https://element-plus.org" :underline="false">
              <div class="item">
                <div class="right">
                  <span class="file_name">文件1</span>
                  <span class="file_size">1090024</span>
                </div>
                <i class="iconfont icon-pdf pdf"></i>
              </div>
            </el-link>
          </div> -->
          </div>
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
          <el-upload class="doc-uploader" :on-change="handleFileChange">
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
          <input-editor ref="inputEditorRef"></input-editor>
        </div>

        <div class="footer">
          <el-button type="primary" text bg @click="sendMsg"
            ><el-icon><Position /></el-icon>发送</el-button
          >
        </div>
      </div>
    </el-footer>
    <!-- 右上角 三点 -- 聊天对象的详细信息 -->
    <!-- TODO  -->
    <el-drawer v-model="drawer" :with-header="false">
      <group-detail
        v-if="activeChatInfo.relation_type === 'group'"
        :groupInfo="activeChatInfo"
      ></group-detail>
      <friend-detail
        v-if="activeChatInfo.relation_type === 'friend'"
        :frinedInfo="activeChatInfo"
      ></friend-detail>
    </el-drawer>
    <!-- 聊天记录 -->
    <chat-history ref="chatDialog"></chat-history>
    <!-- 发送文件或图片 -->
    <el-dialog v-model="fileDialog" class="file" draggable>
      <template #header>
        发送给：
        <div class="info dialog-header">
          <div class="avatar">
            <el-avatar
              shape="square"
              :src="
                activeChatInfo.relation_type === 'friend'
                  ? activeChatInfo.friend_info.avatar
                  : activeChatInfo.group_info.avatar
              "
            ></el-avatar>
          </div>
          <span class="name">{{
            activeChatInfo.relation_type === 'friend'
              ? activeChatInfo.friend_info.name
              : activeChatInfo.group_info.name
          }}</span>
        </div>
        <hr />
      </template>
      <div class="file_update">
        <el-scrollbar class="file_scrollbar">
          <el-link
            href="https://element-plus.org"
            :underline="false"
            v-for="item in selectFile"
            :key="item.id"
          >
            <div class="item">
              <i class="iconfont" :class="fileTypeIcon[item.file_type]"></i>
              <div class="right">
                <span class="file_name"></span>
                <span class="file_size">{{ item.file_size }}</span>
              </div>
              <el-button class="delete_btn" :icon="Delete" text circle />
            </div>
          </el-link>
        </el-scrollbar>
      </div>
      <!-- <div class="file-update"></div> -->
      <template #footer>
        <div class="dialog-footer">
          <!-- <el-button type="primary" @click="onSubmit"> 发送 </el-button> -->
          <!-- <el-button @click="accountEditForm = false">取消</el-button> -->
          <el-button type="primary" @click="fileDialog = false">
            发送
          </el-button>
          <el-button @click="fileDialog = false">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </el-container>
</template>

<style lang="scss" scoped>
.el-container {
  .el-header {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: 45px;
    height: auto;
    .top {
      display: flex;
      justify-content: space-between;
      height: 45px;
      line-height: 45px;
    }
    .bottom {
      display: flex;
    }
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
      display: flex;
      align-items: center;
      margin: 8px 30px;
      .user-avatar {
        width: 40px;
        height: 40px;
      }
      // 文字
      .chat-pao {
        position: relative;
        padding: 5px;
        border-radius: 6px;
        // border: 1px solid #c2d9ea;
        background-color: #e0effb;
        // width: 90%;
        max-width: 60%;
      }
      // 图片
      .picture {
        max-width: 60%; // 与文字消息保持一致
        margin: 0 15px; // 保持与文字相同的边距
        border-radius: 6px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        .img {
          width: 100%;
          height: auto; // 高度自动按比例缩放
          display: block; // 去除图片底部间隙
          max-height: 300px; // 防止过高图片
          object-fit: contain; // 保持比例完整显示
        }
      }
      // 文件类
      .el-link {
        width: 100%;
      }
      .el-link__inner {
        width: 100%;
        background-color: #fff;
      }
      .file {
        width: 200px;
        .item {
          width: 200px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 8px;
          height: 55px;
          background-color: #fff;
          padding-left: 15px;
          .iconfont {
            font-size: 40px;
            padding-right: 10px;
          }
          .right {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .file_name {
              font-size: 16px;
              max-width: 100px;
              color: #000;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .file_size {
              font-size: 12px;
              max-width: 50px;
              color: #c4c4c4;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
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
      .picture {
        margin-right: 10px;
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
      .picture {
        margin-left: 10px;
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
:deep(.file) {
  width: 25%;
  .el-dialog__header {
    padding: 0;
  }
  .file_update {
    display: flex;
    justify-content: space-between;

    flex-direction: column;

    .file_scrollbar {
      height: 370px;
    }
    .el-link {
      width: 100%;
    }
    .el-link__inner {
      width: 100%;
    }
    .item {
      width: 100%;
      display: flex;
      align-items: center;
      margin: 8px;
      height: 55px;
      .iconfont {
        font-size: 40px;
        padding-right: 10px;
      }
      .right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .file_name {
          font-size: 16px;
          color: #000;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .file_size {
          font-size: 12px;
          color: #c4c4c4;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .delete_btn {
        position: absolute;
        right: 15px;
        top: 20px;
      }
    }
  }
}
.info {
  height: 60px;
  display: flex;
  align-items: center;
  .avatar {
    margin: 0 5px;
  }
}

hr {
  margin: 5px 0;
  border: none;
  height: 1px;
  background-color: #ececec;
}
</style>
