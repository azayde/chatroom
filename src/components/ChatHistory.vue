<script setup>
import { ref, nextTick, onMounted, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useUserStore, useChatStore } from '@/stores'
import { formatTime } from '@/utils/time'
import {
  // getChatListByLastTime,
  getChatListByLastTimeReverse
} from '@/api/chat.js'
import { throttle } from 'lodash-es' // 节流

const props = defineProps({
  groupMember: Object
})
const userStore = useUserStore()
const chatStore = useChatStore()
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

const chatMsg = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
// 更多消息
const hasMore = ref(true)
const last_time = ref(Math.floor(Date.now() / 1000))
const loading = ref(false)
// 滚动容器引用
const scrollbarRef = ref(null)
const scrollToBottom = (force = false) => {
  console.log('聊天记录滑动')
  nextTick(() => {
    const scrollContainer = scrollbarRef.value?.$el.querySelector(
      '.el-scrollbar__wrap'
    )
    if (!scrollContainer) return

    // 计算是否需要滚动（距离底部50px内视为已到底部）
    if (force) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight
    }

    const shouldScroll =
      scrollContainer.scrollHeight -
        scrollContainer.scrollTop -
        scrollContainer.clientHeight <
      50

    if (shouldScroll) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight
    }
  })
}
const getChatList = async () => {
  if (loading.value || !hasMore.value) return
  loading.value = true
  // 获取当前滚动状态
  const scrollContainer = scrollbarRef.value?.wrapRef
  // 之前滚动条的位置
  const prevState = {
    height: scrollContainer?.scrollHeight || 0,
    top: scrollContainer?.scrollTop || 0
  }
  try {
    const res = await getChatListByLastTimeReverse({
      relation_id: chatStore.chatInfo.relation_id,
      last_time: last_time.value,
      page: currentPage.value,
      page_size: pageSize.value
    })
    console.log(res)
    const newMsg = res.data.data.list
      .filter((item) => item !== null && item.notify_type === 'common')
      .reverse()
    if (newMsg.length === 0) {
      hasMore.value = false
      return
    }
    // 记录最早消息事件
    last_time.value = new Date(newMsg[0].create_at).getTime() / 1000
    // 插入到现在的数据头部
    chatMsg.value = [...newMsg, ...chatMsg.value]
    await nextTick() // 等待 DOM 更新

    if (scrollContainer) {
      const newHeight = scrollContainer.scrollHeight
      scrollContainer.scrollTop = prevState.top + (newHeight - prevState.height)
    }
  } finally {
    loading.value = false
  }
}
getChatList()

// 滚动处理
const handleScroll = throttle(() => {
  const scrollContainer = scrollbarRef.value?.wrapRef
  if (!scrollContainer || loading.value) return

  // 距离顶部50px时加载
  if (scrollContainer.scrollTop < 50) {
    getChatList()
  }
}, 500)
// 弹层是否出现
const dialog = ref(false)
const open = () => {
  dialog.value = true
  scrollToBottom(true)
}
defineExpose({
  open
})
onMounted(async () => {
  console.log('scrollbarRef 存在性:', !!scrollbarRef.value)
  await getChatList()
  await nextTick()
  scrollToBottom(true)
})
watch(
  () => chatStore.chatInfo,
  () => {
    // 清空消息列表
    chatMsg.value = []
    // 重置分页时间戳为当前时间
    last_time.value = Math.floor(Date.now() / 1000)
    // 重置其他参数
    hasMore.value = true
    currentPage.value = 1
    getChatList()
    scrollToBottom(true)
  }
)

// 判断该条消息的头像
const handleAvatar = (info) => {
  // groupMember不为空
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
  return info.account_id === userStore.accountInfo.account_id
    ? userStore.accountInfo.avatar
    : chatStore.chatInfo.friend_info?.avatar
}
// 判断发送该条消息的昵称
const handleName = (info) => {
  // console.log(info)
  if (info.notify_type === ' system') return
  // groupMember不为空
  if (props.groupMember) {
    let member
    for (let ele of props.groupMember) {
      // console.log(ele)
      if (ele.account_id === info.account_id) {
        member = ele
        break
      }
    }
    return member ? member.name : ''
  }
  // 好友
  return info.account_id === userStore.accountInfo.account_id
    ? userStore.accountInfo.name
    : chatStore.chatInfo.friend_info?.name
}

const fileTypeIcon = {
  pdf: 'icon-pdf',
  txt: 'icon-wenbenwendang-txt',
  ppt: 'icon-yanshiwendang-ppt_pptx',
  zip: 'icon-yasuowenjian-zip_rar_7z',
  excel: 'icon-biaoge-xlxs_xls',
  mp4: 'icon-shipin-mov_mp4_avi',
  doc: 'icon-wendang-docx_doc',
  docx: 'icon-wendang-docx_doc',
  exe: 'icon-kezhihangwenjian-exe'
}
</script>

<template>
  <!-- 聊天记录 -->
  <el-dialog v-model="dialog" title="聊天记录" :with-header="false" draggable>
    <el-input
      v-model="input"
      :prefix-icon="Search"
      placeholder="搜索"
      class="search"
      @focus="handleFocus"
      @blur="handleBlur"
    >
    </el-input>
    <!-- 正常展示 -->
    <el-scrollbar ref="scrollbarRef" @scroll="handleScroll">
      <div v-if="loading" class="loading-text">加载中...</div>
      <div v-if="!hasMore" class="no-more">没有更多消息了</div>
      <div class="list-item" v-for="(item, index) in chatMsg" :key="index">
        <div class="left">
          <el-badge class="item" :value="0" :hidden="true">
            <div class="avatar">
              <el-avatar shape="square" :src="handleAvatar(item)"></el-avatar>
            </div>
          </el-badge>
        </div>
        <div class="right">
          <div class="top">
            <span class="name">{{ handleName(item) }}</span>
            <span class="time_now">{{ formatTime(item.create_at) }}</span>
          </div>
          <span class="message" v-show="item.msg_type === 'text'">
            {{ item.msg_content }}
          </span>
          <div
            class="picture"
            v-show="item.msg_type === 'file'"
            v-if="
              item.msg_content.split('.').pop() === 'png' ||
              item.msg_content.split('.').pop() === 'jpg'
            "
          >
            <img class="img" :src="item.msg_content" alt="" />
          </div>
          <div class="file" v-show="item.msg_type === 'file'" v-else>
            <el-link :href="item?.msg_content" :underline="false">
              <div class="item">
                <div class="right">
                  <span class="file_name">{{ item.file_name }}</span>
                  <span class="file_size">{{
                    (item.file_size / 1024).toFixed(2) + 'KB'
                  }}</span>
                </div>
                <i
                  class="iconfont"
                  :class="
                    fileTypeIcon[item.msg_content.split('.').pop()] ||
                    'icon-qita'
                  "
                ></i>
              </div>
            </el-link>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </el-dialog>
</template>

<style lang="scss" scoped>
.el-dialog {
  .el-scrollbar {
    height: 387px;
    .no-more,
    .loading-text {
      text-align: center;
    }
  }
  .list-item {
    width: 98%;
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
      width: 98%;
      // width: 660px;
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
      .picture {
        border-radius: 6px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        .img {
          width: 100%;
          height: auto; // 高度自动按比例缩放
          display: block; // 去除图片底部间隙
          max-height: 300px; // 防止过高图片
          object-fit: contain; // 保持比例完整显示
        }
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
  }
  .list-item:hover {
    background-color: #f0f0f0;
  }
}
</style>
