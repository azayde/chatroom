<!-- 好友详细信息 -->
<script setup>
import { Plus, ArrowRight } from '@element-plus/icons-vue'
import { watch, ref } from 'vue'
import {
  updateShowService,
  updateDisturbService,
  updatePinService
} from '@/api/setting.js'
// import { useRouter } from 'vue-router'
import { useChatStore } from '@/stores'
const chatStore = useChatStore()
// const router = useRouter()

// switch开关 （三个）
// pin 和 置顶 ？？
const isPin = ref(chatStore.chatInfo.is_pin)
const isShow = ref(chatStore.chatInfo.is_show)
const isNotDisturb = ref(chatStore.chatInfo.is_not_disturb)

// 点击头像出现名片(点击头像名片消失)  --- 改 TODO:
// const userCardVisible = ref(false)

// 添加群成员
const bools = ref(false)

//
const activeMemberId = ref(null)
// const popverStates = ref({})

// 详情
const props = defineProps({
  frinedInfo: Object
})

// 点击群成员获取当前的id（用于名片）
const handleClickMember = (id) => {
  activeMemberId.value = activeMemberId.value === id ? null : id
}

// 聊天记录dialog
const chatDialog = ref()

// 三个switch
const handleSwitch = async (msg) => {
  const relation_id = ref(props.frinedInfo.relation_id)
  console.log(relation_id.value)
  console.log(msg)
  console.log(isShow.value)
  if (msg === 'isNotDisturb') {
    // const res = await updateDisturbService({
    //   relation_id: relation_id.value,
    //   isNotDisturb: isNotDisturb.value
    // })
    // console.log(res)
  } else if (msg === 'isPin') {
    const res = await updatePinService({
      relation_id: relation_id.value,
      isPin: isPin.value
    })
    console.log(res)
  } else if (msg === 'isShow') {
    // const res = await updateShowService({
    //   relation_id: relation_id.value,
    //   isShow: isShow.value
    // })
    // console.log(res)
  }
}
watch(isNotDisturb, () => handleSwitch('isNotDisturb'))
watch(isPin, () => handleSwitch('isPin'))
watch(isShow, () => handleSwitch('isShow'))

// // 发消息
// const sendMsg = () => {
//   router.push('/chat/chatroom')
// }
</script>

<template>
  <!-- {{ frinedInfo.relation_id }} -->
  <el-container>
    <el-header>
      <h1>{{ frinedInfo.friend_info.name }}</h1>
    </el-header>
    <el-main>
      <el-scrollbar>
        <div class="member">
          <el-popover
            placement="right"
            trigger="click"
            width="450px"
            :visible="activeMemberId === frinedInfo.friend_info.account_id"
            manual
          >
            <template #reference>
              <!-- 需修改 TODO -->
              <div
                class="member-item"
                @click="handleClickMember(frinedInfo.friend_info.account_id)"
              >
                <!-- @click="userCardVisible = !userCardVisible" -->
                <el-avatar
                  shape="square"
                  :src="frinedInfo.friend_info.avatar"
                  class="member-avatar"
                />
                <div class="member-name">{{ frinedInfo.friend_info.name }}</div>
              </div>
            </template>
            <div class="user-info">
              <!-- <user-card style="padding: 10px;"  @close-dialog="userCardVisible = false"></user-card> -->
              <user-card
                :userInfo="frinedInfo"
                style="padding: 10px"
              ></user-card>
            </div>
          </el-popover>

          <div class="add" @click="bools = true">
            <el-icon><Plus /></el-icon>
            <div class="member-name">添加</div>
          </div>
        </div>
        <hr />
        <div class="title" @click="chatDialog.open()">
          <div class="chat-history">
            <span>聊天记录</span>
            <span
              ><el-icon><ArrowRight /></el-icon
            ></span>
          </div>
        </div>
        <hr />
        <!-- 按钮- true or false -->
        <div class="title">
          <div class="switch">
            <span>消息免打扰</span>
            <el-switch
              v-model="isNotDisturb"
              size="small"
              style="--el-switch-on-color: #13ce66"
            ></el-switch>
          </div>
        </div>
        <hr />
        <div class="title">
          <div class="switch">
            <span>置顶聊天</span>
            <el-switch
              v-model="isPin"
              size="small"
              style="--el-switch-on-color: #13ce66"
            ></el-switch>
          </div>
        </div>
        <hr />
        <div class="title">
          <div class="switch">
            <span>显示在首页</span>
            <el-switch
              v-model="isShow"
              size="small"
              style="--el-switch-on-color: #13ce66"
            ></el-switch>
          </div>
        </div>
        <hr />
        <!-- <div class="title">清空聊天记录</div> -->
        <!-- <div class="btn">
          <el-button type="primary" text bg @click="sendMsg"
            ><el-icon><Position /></el-icon>发消息</el-button
          >
        </div> -->
      </el-scrollbar>
    </el-main>
  </el-container>

  <!-- 添加群成员 -->
  <el-dialog v-model="bools" title="邀请好友">
    <!-- <change-group-member></change-group-member> -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="bools = false">取消</el-button>
        <el-button type="primary" @click="bools = false"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 聊天记录 -->
  <chat-history ref="chatDialog"></chat-history>
</template>

<style lang="scss" scoped>
.el-container {
  height: 94vh;
  .el-header {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    height: 45px;
    line-height: 45px;
    h1 {
      margin: 0;
      font-size: 22px;
    }
  }
  .el-main {
    // width: 90%;
    // margin: 0 auto;
    // padding: 5px 20px;
    // padding-top: 20px;
    // margin-top: 20px;
    padding-left: 5px;
    hr {
      // color: #000;
      margin: 5px 0;
      border: none;
      height: 1px;
      background-color: #ececec;
    }
    .title {
      margin-top: 10px;
      padding-left: 15px;
      font-size: 15px;
      margin-bottom: 5px;
    }
    .member {
      display: flex;
      flex-wrap: wrap;
      .member-item {
        margin: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .member-avatar {
          margin-bottom: 8px;
          // transition: transform 0.3s;
          cursor: pointer;
        }
        // .member-avatar:hover{
        //   transform: scale(1.1);
        // }
        .member-name {
          width: 55px;
          text-align: center;
          font-size: 13px;
          color: #606266;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding: 0 5px;
        }
      }

      .user-info {
        // max-width: 300px;
        height: auto;
        overflow-y: auto;
        padding: 10px;
      }
      .add {
        margin: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .el-icon {
          width: 40px;
          height: 40px;
          margin-bottom: 8px;
          cursor: pointer;
          color: #606266;
          border: 1px solid #dbdbdb;
        }
        .el-icon:hover {
          border: 1px solid #cfcfcf;
        }
        .member-name {
          width: 55px;
          text-align: center;
          font-size: 13px;
          color: #606266;
          padding: 0 5px;
        }
      }
    }
    .chat-history,
    .update,
    .switch {
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      padding-right: 25px;
    }
    // .btn {
    //   // display: inline-block;
    //   width: 80px;
    //   margin: 0 auto;
    // }
  }
}

.dialog {
  .avatar-uploader {
    :deep() {
      .avatar {
        width: 178px;
        height: 178px;
        display: block;
      }
      .el-upload {
        border: 1px dashed var(--el-border-color);
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration-fast);
        margin-bottom: 15px;
      }
      .el-upload:hover {
        border-color: var(--el-color-primary);
      }
      .el-icon.avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        text-align: center;
      }
    }
  }
}
</style>
