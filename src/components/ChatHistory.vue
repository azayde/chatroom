<script setup>
import { ref, nextTick, onMounted, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useChatStore } from '@/stores'
import { formatTime } from '@/utils/time'
import {
  // getChatListByLastTime,
  getChatListByLastTimeReverse
} from '@/api/chat.js'
import { throttle } from 'lodash-es' // 节流

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
    console.log(newMsg)
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
  // console.log(scrollContainer)
  // console.log(scrollContainer.scrollTop)
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
  // console.log('activeName 初始值:', activeName.value)
  console.log('scrollbarRef 存在性:', !!scrollbarRef.value)
  await getChatList()
  await nextTick()
  scrollToBottom(true)
  // nextTick(() => {
  // const container = scrollbarRef.value?.wrapRef
  // console.log(scrollbarRef.value)
  // console.log(container)
  // if (container) {
  //   container.scrollTop = container.scrollHeight
  // }
  // })
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
    <!-- TODO 正常展示 -->
    <el-scrollbar ref="scrollbarRef" @scroll="handleScroll">
      <div v-if="loading" class="loading-text">加载中...</div>
      <div v-if="!hasMore" class="no-more">没有更多消息了</div>
      <div class="list-item" v-for="(item, index) in chatMsg" :key="index">
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
            <span class="time_now">{{ formatTime(item.create_at) }}</span>
          </div>
          <span class="message">{{ item.msg_content }}</span>
        </div>
      </div>
      <!-- <div class="list-item">
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
      </div> -->
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
    }
  }
  .list-item:hover {
    background-color: #f0f0f0;
  }
}
</style>
