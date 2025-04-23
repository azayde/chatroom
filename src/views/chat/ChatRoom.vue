<script setup>
import GroupDetail from '../group/GroupDetail.vue'
import FriendDetail from '@/views/friend/FriendDetail.vue'
import {
  Position,
  MoreFilled,
  ChatDotRound,
  Delete,
  Star,
  Bell
} from '@element-plus/icons-vue'
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useUserStore, useChatStore, useGroupStore } from '@/stores'
import {
  // publishFileSerivce,
  sendFileService,
  getTopMsgService,
  getPinMsgService,
  getChatListByLastTime
} from '@/api/chat.js'
import { sendMsg_socket } from '@/utils/websocket'
import { revertImgToText } from '@/utils/emoji'
import { onMessage, offMessage, setMessageCallback } from '@/utils/websocket'

const userStore = useUserStore()
const chatStore = useChatStore()
const groupStore = useGroupStore()
// const route = useRoute()

const drawer = ref(false)
// 父传子
const props = defineProps({
  chatInfo: Object,
  groupMember: Object
})

// 聊天信息
const chatMsg = ref([])
const scrollbarRef = ref(null)
const scrollToBottom = (force = false) => {
  console.log('滑动')
  nextTick(() => {
    const scrollContainer = scrollbarRef.value?.$el.querySelector(
      '.el-scrollbar__wrap'
    )
    if (!scrollContainer) return

    // 计算是否需要滚动（距离底部50px内视为已到底部）
    if (force) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight
      // scrollContainer.scrollTo({
      //   top: scrollContainer.scrollHeight,
      //   behavior: 'smooth'
      // })
    }

    const shouldScroll =
      scrollContainer.scrollHeight -
        scrollContainer.scrollTop -
        scrollContainer.clientHeight <
      50

    if (shouldScroll) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight
      // 备用方案：平滑滚动
      // scrollContainer.scrollTo({
      //   top: scrollContainer.scrollHeight,
      //   behavior: 'smooth'
      // })
    }
  })
}
// 根据account_id获取用户信息进行渲染
const last_time = new Date('2026-04-01T00:00:00').getTime() / 1000
// 获取聊天信息
const getChatList = async () => {
  const res = await getChatListByLastTime({
    relation_id: props.chatInfo.relation_id,
    last_time: last_time,
    page: 1,
    page_size: 200
  })
  // console.log(res)
  chatMsg.value = res.data.data.list.filter((item) => item !== null)
  chatStore.setChatMsg(chatMsg.value)

  await nextTick() // 等待 DOM 更新
  scrollToBottom(true) // 确保数据渲染后滚动
}

// 处理收到的新消息
const handleNewMessage = (newMessage) => {
  if (newMessage.relation_id === props.chatInfo.relation_id) {
    chatStore.addChatMsg(newMessage)
    scrollToBottom(true)
  }
  console.log(newMessage)
}

// 判断该条消息的头像
const handleAvatar = (info) => {
  // console.log(info)
  // groupMember不为空
  // console.log(props.groupMember)
  if (props.groupMember) {
    // console.log('群聊')
    let member
    for (let ele of props.groupMember) {
      // console.log(ele)
      if (ele.account_id === info.account_id) {
        member = ele
        break
      }
    }
    return member ? member.avatar : ''
  }
  // 好友
  return info.account_id === userStore.accountInfo.id
    ? userStore.accountInfo.avatar
    : chatStore.chatInfo.friend_info?.avatar
}
//获取当前pin消息
const pinMsg = ref()
const getPinMsg = async () => {
  const res = await getPinMsgService({
    relation_id: chatStore.chatInfo.relation_id,
    page: 1,
    pageSize: 100
  })
  console.log(res.data)
  pinMsg.value = res.data.data.list
}
//获取当前置顶消息
const topMsg = ref()
const getTopMsg = async () => {
  const res = await getTopMsgService({
    relation_id: chatStore.chatInfo.relation_id,
    page: 1,
    pageSize: 100
  })
  console.log(res.data)
  topMsg.value = res.data.data?.msg_info || undefined
}
// 当前聊天相关信息
const activeChatInfo = ref(props.chatInfo)
activeChatInfo.value = props.chatInfo ? props.chatInfo : chatStore.chatInfo

// 聊天记录dialog
const chatDialog = ref()

// 发送图片或文件
const fileDialog = ref(false)

// 表情
const emoji = ref()
const emojiDis = ref(false)
const emoBoxPos = ref({ x: 0, y: 0 })
const handleEmoji = () => {
  emojiDis.value = !emojiDis.value
  const val = emoji.value.getBoundingClientRect()
  emoBoxPos.value.x = val.x
  emoBoxPos.value.y = val.y
}
const getEmoji = (val) => {
  inputEditorRef.value.emojiHandle(val)
}

// 发送消息
const inputEditorRef = ref(null)
const htmlToPlainText = (html) => {
  const tempDiv = document.createElement('div') // 创建一个临时 div 元素
  tempDiv.innerHTML = html // 将 HTML 设置为该 div 的内容
  return tempDiv.innerText // 返回普通文本
}

// 转换出的File与直接上传的有细微不同，测试时看能否成功
function base64toFile(dataurl, filename = 'file') {
  let arr = dataurl.split(',')
  let mime = arr[0].match(/:(.*?);/)[1]
  // suffix是该文件的后缀
  let suffix = mime.split('/')[1]
  // atob 对经过 base-64 编码的字符串进行解码
  let bstr = atob(arr[1])
  // n 是解码后的长度
  let n = bstr.length
  // Uint8Array 数组类型表示一个 8 位无符号整型数组 初始值都是 数子0
  let u8arr = new Uint8Array(n)
  // charCodeAt() 方法可返回指定位置的字符的 Unicode 编码。这个返回值是 0 - 65535 之间的整数
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  // new File返回File对象 第一个参数是 ArraryBuffer 或 Bolb 或Arrary 第二个参数是文件名
  // 第三个参数是 要放到文件中的内容的 MIME 类型
  return new File([u8arr], `${filename}.${suffix}`, {
    type: mime
  })
}
// 是否正在发送中
const isSending = ref(false)
const sendMsg = () => {
  // console.log(1111)
  // 发送内容
  if (isSending.value) return
  isSending.value = true
  try {
    // 获取输入框中的内容
    const content = revertImgToText(inputEditorRef.value.getContent())
    console.log(content)
    // const transformContent =
    // console.log(transformContent)

    // 区分纯文本or图片
    // 获取纯文本
    const plainText = htmlToPlainText(content)
    // 将纯文本编码为 UTF-8
    // 创建 TextEncoder 实例
    const encoder = new TextEncoder()
    // 编码为 UTF-8
    const encodedMessage = encoder.encode(plainText)
    // 发送时首先将其转换为字符串格式base64
    const byteArray = new Uint8Array(encodedMessage)
    // 转换为 Base64 字符串
    const base64Message = btoa(String.fromCharCode(...byteArray))

    // 直接复制粘贴进来的图片类型
    // DOM解析器
    const parser = new DOMParser()
    console.log(parser)
    // 将html字符串解析为文档对象
    const doc = parser.parseFromString(content, 'text/html')
    console.log(doc)
    // 获取图片标签
    // const imgTags = doc.querySelectorAll('img')
    // if (imgTags.length == 1) {
    //   imgTags.forEach((item) => {
    //     // getAttribute 获取节点元素的属性值
    //     const src = item.getAttribute('src')
    //     if (src && src.startsWith('data:image/')) {
    //       // const base64Data = src.split(',')[1]
    //       // console.log(base64Data)
    //       const file = base64toFile(src)
    //       console.log(file)
    //     }
    //   })
    // } else {
    //   ElMessage.warning('不能一次发送两张图片哦')
    //   return
    // }

    // 如果内容为空，不发送
    // if (plainText) {
    //   ElMessage.warning('发送内容不能为空')
    //   return
    // }

    // 发送消息（纯文本）

    const msg = ref({
      relation_id: props.chatInfo.relation_id,
      msg_content: base64Message
      // rly_msg_id
    })

    // 发送到服务器
    const sendSuccess = sendMsg_socket(JSON.stringify(msg.value))
    console.log(sendSuccess)

    // // 发送消息失败
    // if (!sendSuccess) {
    //   ElMessage.danger('发送失败')
    // }

    // 清除输入框
    inputEditorRef.value.clearContent()
  } finally {
    isSending.value = false
  }
}

// 回车发送，shift+回车换行
const handleKeyDown = (e) => {
  // console.log(e.shiftKey)
  if (e.key === 'Enter') {
    if (e.shiftKey) {
      return
    } else {
      e.preventDefault()
      sendMsg()
    }
  }
}
// 上传文件
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
// 选择文件上传
const formData = new FormData()
const selectFile = ref([])
const handleFileChange = async (file) => {
  // const formData = new FormData()
  // formData.append('file', file.raw) // 第三个参数 filename 可选
  // formData.append('relation_id', props.chatInfo.relation_id)
  // formData.append('account_id', userStore.accountInfo.id)
  // selectFile.value = [
  //   {
  //     id: file.uid,
  //     file_name: file.name,
  //     file_type: file.name.split('.').pop(),
  //     file_size: (file.size / 1024).toFixed(2) + 'KB',
  //     url: URL.createObjectURL(file.raw),
  //     create_at: new Date().toISOString()
  //   }
  // ]
  // fileDialog.value = true
  // const res = await publishFileSerivce(formData)
  // console.log(res)
  console.log(file)
  formData.append('relation_id', props.chatInfo.relation_id)
  formData.append('file', file.raw)
  selectFile.value = [
    {
      id: file.uid,
      file_name: file.name,
      file_type: file.name.split('.').pop(),
      file_size: (file.size / 1024).toFixed(2) + 'KB',
      url: URL.createObjectURL(file.raw),
      create_at: new Date().toISOString()
    }
  ]
  fileDialog.value = true
}

// 发送文件
const sendFile = async () => {
  fileDialog.value = false
  formData.forEach((value, key) => {
    console.log(`${key}: ${value}`)
  })
  const res = await sendFileService(formData)
  console.log(res)
  // 清空formData
  for (const key of formData.keys()) {
    formData.delete(key)
  }
}
// 清除存到本地的聊天记录
const cleanup = () => {
  chatStore.cleanChatMsg()
}

// 右键菜单
const menu = ref(false)
const menuTop = ref(0)
const menuLeft = ref(0)
const selectMessage = ref(null)
const getContentMenu = (val) => {
  console.log(val)
  menu.value = true
  menuTop.value = val.clientY
  menuLeft.value = val.clientX
  selectMessage.value = val.msg
}
window.addEventListener('click', function () {
  menu.value = false
})
watch(
  () => props.chatInfo,
  (newVal) => {
    getTopMsg()
    getPinMsg()
    // 切换时清除聊天记录
    cleanup()
    // 切换清除输入框？？TODO
    inputEditorRef.value.clearContent()
    activeChatInfo.value = newVal
    getChatList()
    scrollToBottom(true)
  }
)
onMounted(() => {
  getTopMsg()
  getPinMsg()
  getChatList()
  scrollToBottom(true)
  setMessageCallback(handleNewMessage)
  // 启动消息监听
  onMessage()
})
onUnmounted(() => {
  offMessage()
  setMessageCallback(null)
  cleanup()
})
</script>

<template>
  <el-container class="chat-room">
    <el-header>
      <div class="top">
        <h1>
          {{
            activeChatInfo.relation_type === 'friend'
              ? activeChatInfo.nick_name || activeChatInfo.friend_info.name
              : activeChatInfo.group_info.name
          }}{{
            activeChatInfo.relation_type === 'group'
              ? `(${groupMember?.length})`
              : ''
          }}
        </h1>
        <div class="more" @click="drawer = true">
          <el-icon><MoreFilled /></el-icon>
        </div>
      </div>
      <!-- 有置顶或有pin时展示 -->
      <div class="bottom" v-if="pinMsg || topMsg">
        <div class="is_top" v-if="topMsg">
          <el-icon><Bell /></el-icon>
          {{ topMsg.msg_content }}
        </div>
        <el-button text class="is_pin" v-if="pinMsg">
          <el-icon><Star /></el-icon>
          Pin
        </el-button>
      </div>
    </el-header>
    <el-main>
      <el-scrollbar ref="scrollbarRef" class="chat-msg">
        <div class="list">
          <!-- 聊天窗口  -->
          <chat-message-item
            v-for="item in chatMsg"
            :msgInfo="item"
            :headImage="handleAvatar(item)"
            :key="item.id"
            @setContextMenu="getContentMenu"
          ></chat-message-item>
          <context-menu
            v-show="menu"
            class="contextMenu"
            :style="{ top: menuTop + 'px', left: menuLeft + 'px' }"
            :msg="selectMessage"
          ></context-menu>
        </div>
      </el-scrollbar>
    </el-main>
    <el-footer>
      <div class="Ibox">
        <div class="fun">
          <!-- emoji表情 -->
          <el-icon @click="handleEmoji">
            <img ref="emoji" src="@/assets/smile.svg" alt="" />
          </el-icon>
          <!-- 上传图片 -->
          <el-upload class="pic-uploader" :on-change="handleFileChange">
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
          <input-editor
            ref="inputEditorRef"
            @keydown="handleKeyDown"
          ></input-editor>
        </div>

        <div class="footer">
          <el-button
            type="primary"
            text
            bg
            @click="sendMsg"
            :disabled="isSending"
            ><el-icon><Position /></el-icon>发送</el-button
          >
        </div>
      </div>
    </el-footer>
    <emoji-content
      v-show="emojiDis"
      :pos="emoBoxPos"
      @getEmoji="getEmoji"
    ></emoji-content>

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
                <span class="file_name">{{ item.file_name }}</span>
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
          <el-button type="primary" @click="sendFile"> 发送 </el-button>
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
      .is_top {
        cursor: pointer;
        color: #9ea0a3;
        font-size: 14px;
        text-align: center;
        height: 25px;
        line-height: 25px;
        width: 100px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        .el-icon {
          font-size: 16px;
          color: #ffc202;
          // background-color: #ffc202;
        }
      }
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
    background-color: #f5f5f5;
  }
  .el-footer {
    padding: 0;
    height: 150px;
    background-color: #f3f3f3;
    .Ibox {
      width: 100%;
      // height: 27%;
      border-top: 1px solid #c7c7c7;
      .fun {
        width: 100%;
        display: flex;
        align-items: center;
        .pic-uploader,
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
        background-color: #f3f3f3;
        padding: 0;
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
.contextMenu {
  position: fixed;
}
</style>
