<script setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useChatStore } from '@/stores'
import { getChatListByLastTime } from '@/api/chat.js'

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

// tab切换
const activeName = ref('')
// console.log(activeName.value)

// 日期
const value1 = ref('')

// const last_time = new Date('2026-04-01T00:00:00').getTime() / 1000
// const getChatList = async () => {
//   const res = await getChatListByLastTime({
//     relation_id: props.chatInfo.relation_id,
//     last_time: last_time,
//     page: 1,
//     page_size: 1000
//   })
//   // chatMsg.value = res.data.data.list.filter((item) => item !== null)
//   // chatStore.setChatMsg(chatMsg.value)

//   // await nextTick() // 等待 DOM 更新
//   // scrollToBottom(true) // 确保数据渲染后滚动
// }
// getChatList()

// 弹层是否出现
const dialog = ref(false)
const open = () => {
  dialog.value = true
}
defineExpose({
  open
})

// 分类切换没做好(取消分类查找？？) TODO:
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

    <!-- 按条件展示 -->
    <el-tabs v-model="activeName" type="card" class="demo-tabs">
      <el-tab-pane label="文件" name="file">
        <el-scrollbar v-if="activeName === 'file'">
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
                >12344243435gfhghfhgfg65655676676876875</span
              >
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
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane label="Pin" name="pin">
        <el-scrollbar v-if="activeName === 'pin'">
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
                >12344243435gfhghfhgfg65655676676876875</span
              >
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
        </el-scrollbar>
        <!-- <template #empty>
          <el-empty description="无内容"></el-empty>
        </template> -->
      </el-tab-pane>
      <el-tab-pane name="date">
        <template #label>
          <div class="demo-date-picker">
            <el-date-picker
              v-model="value1"
              type="date"
              placeholder="日期"
              size="small"
            />
          </div>
        </template>

        <el-scrollbar v-if="activeName === 'date'">
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
                >12344243435gfhghfhgfg65655676676876875</span
              >
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
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
    <!-- TODO
      正常展示
    -->
    <el-scrollbar v-if="activeName === ''">
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
    </el-scrollbar>
  </el-dialog>
</template>

<style lang="scss" scoped>
.el-dialog {
  .el-scrollbar {
    height: 387px;
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
    // background-color: #e9e9e9; 点击后颜色
  }
}
</style>
