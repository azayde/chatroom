<!-- 聊天窗 -->
<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useUserStore, useChatStore } from '@/stores'
import { getChatListByLastTime } from '@/api/chat.js'
import { onMessage, offMessage, setMessageCallback } from '@/utils/websocket'
import { transform } from '@/utils/emoji'

const userStore = useUserStore()
const chatStore = useChatStore()

const props = defineProps({
  chatInfo: Object
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
const getChatList = async () => {
  const res = await getChatListByLastTime({
    relation_id: props.chatInfo.relation_id,
    last_time: last_time,
    page: 1,
    page_size: 200
  })
  chatMsg.value = res.data.data.list.filter((item) => item !== null)
  chatStore.setChatMsg(chatMsg.value)

  await nextTick() // 等待 DOM 更新
  scrollToBottom(true) // 确保数据渲染后滚动
}

const handleNewMessage = (newMessage) => {
  if (newMessage.relation_id === props.chatInfo.relation_id) {
    chatStore.addChatMsg(newMessage)
    scrollToBottom(true)
  }
  console.log(newMessage)
}
onMounted(() => {
  console.log(props.chatInfo)
  scrollToBottom(true)
  setMessageCallback(handleNewMessage)
  // 启动消息监听
  onMessage()
})
onUnmounted(() => {
  offMessage()
  setMessageCallback(null)
})
watch(
  () => props.chatInfo,
  (newVal) => {
    if (newVal?.relation_id) {
      getChatList()
      scrollToBottom(true)
    }
  },
  { deep: true, immediate: true }
)

const selectMessage = ref(null)
const menu = ref(false)
const menuTop = ref(200)
const menuLeft = ref(700)

const handleRightClick = (e, item) => {
  console.log(e.target)
  console.log(item)
  const mouseX = e.clientX
  const mouseY = e.clientY
  menu.value = true
  menuTop.value = mouseY
  menuLeft.value = mouseX
  selectMessage.value = item
}
window.addEventListener('click', function () {
  menu.value = false
})
</script>

<template>
  <el-scrollbar ref="scrollbarRef" class="chat-msg">
    <div class="list">
      <div
        class="chat-item"
        v-for="item in chatStore.chatMsg"
        :key="item?.id || 0"
        :class="{
          left: item.account_id !== userStore.accountInfo.id,
          right: item.account_id === userStore.accountInfo.id
        }"
      >
        <div class="user-avatar">
          <el-avatar
            shape="square"
            :src="
              item.account_id === userStore.accountInfo.id
                ? userStore.accountInfo.avatar
                : chatInfo.relation_type === 'friend'
                  ? chatInfo.friend_info.avatar
                  : chatInfo.group_info.avatar
            "
          ></el-avatar>
        </div>
        <div
          class="chat-pao"
          v-if="item.msg_type === 'text'"
          @contextmenu="handleRightClick($event, item)"
          v-html="transform(item.msg_content)"
        ></div>
        <div
          class="picture"
          v-else-if="item.msg_type === 'file'"
          @contextmenu="handleRightClick($event, item)"
        >
          <img class="img" :src="item.msg_content" alt="" />
          <!-- <audio :src="item.msg_content"></audio> -->
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
  <context-menu
    v-show="menu"
    class="contextMenu"
    :style="{ top: menuTop + 'px', left: menuLeft + 'px' }"
    :msg="selectMessage"
  ></context-menu>
</template>
<style lang="scss" scoped>
.el-scrollbar {
  width: 100%;
  // overflow: hidden;
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
.contextMenu {
  position: absolute;
  // top: 154px;
  // left: 752px;
}
</style>
