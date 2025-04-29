<!-- 用户名片 -->
<!--头像点击 or 好友界面 -->
<script setup>
import { Position, MoreFilled, Delete, Plus } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { deleteFriendService, createApplicationService } from '@/api/friend.js'
import { updateNickNameService } from '@/api/setting.js'
import { useChatStore, useFriendStore } from '@/stores'

const chatStore = useChatStore()
const friendStore = useFriendStore()

const router = useRouter()

const props = defineProps({
  userInfo: Object,
  isFriend: Boolean
})
// switch开关 （三个）
const isPin = ref(props.userInfo.is_pin || false)
const isShow = ref(props.userInfo.is_show || false)
const isNotDisturb = ref(props.userInfo.is_not_disturb || false)
const dialogFormVisible = ref(false)

// 判断是否是好友
// const isFriend = ref(true)
// 更多（右上角三点）
const morePopver = ref(null)
const handleSetNote = () => {
  morePopver.value.hide()
  dialogFormVisible.value = true
}
// 发消息
const sendMsg = () => {
  router.push({
    path: '/chat/chatroom',
    query: { relation_id: props.userInfo.relation_id }
  })
  chatStore.setChatInfo(props.userInfo)
}

// console.log(props.userInfo)

const activeFiendInfo = ref(props.userInfo)
// console.log(activeFiendInfo.value)
activeFiendInfo.value = props.userInfo ? props.userInfo : friendStore.friendInfo
watch(
  () => props.userInfo,
  (newVal) => {
    if (newVal !== undefined) {
      isPin.value = newVal.is_pin
      isShow.value = newVal.is_show
      isNotDisturb.value = newVal.is_not_disturb
      activeFiendInfo.value = newVal
    }
  },
  { immediate: true }
)

const handleSwitch = async (msg) => {
  const relation_id = ref(props.userInfo.relation_id)
  // console.log(relation_id.value)
  // console.log(msg)
  if (msg === 'isNotDisturb') {
    // await updateDisturbService({
    //   relation_id: relation_id.value,
    //   isNotDisturb: isNotDisturb.value
    // })
    // console.log(111)
  } else if (msg === 'isPin') {
    // updatePinService({
    //   relation_id: relation_id.value,
    //   isPin: isPin.value
    // })
  } else if (msg === 'isShow') {
    // updateShowService({
    //   relation_id: relation_id.value,
    //   isShow: isShow.value
    // })
  }
}
watch(isNotDisturb, () => handleSwitch('isNotDisturb'))
watch(isPin, () => handleSwitch('isPin'))
watch(isShow, () => handleSwitch('isShow'))

// const relation_id = props.userInfo.relation_id
// console.log(relation_id)
// 删除好友
const deleteFriend = async () => {
  const res = await deleteFriendService(props.userInfo.relation_id)
  console.log(res)
  ElMessage.success('已删除')
}

const addFriend = async () => {
  const res = await createApplicationService({
    account_id:
      activeFiendInfo.value.friend_info?.account_id ||
      activeFiendInfo.value.account_id,
    application_msg: '你好'
  })
  console.log(res)
}
// 好友  -  非好友

// 设置备注
const nick_name = ref()
const updateNickName = async () => {
  await updateNickNameService({
    relation_id: props.userInfo.relation_id,
    nick_name: nick_name.value
  })
  friendStore.updateFriendNickName(nick_name.value)
  if (nick_name.value) {
    ElMessage.success('修改备注成功')
    nick_name.value = ''
  }
  dialogFormVisible.value = false
}
</script>

<template>
  <div class="user-card">
    <div class="content">
      <div class="left">
        <el-avatar
          size="large"
          shape="square"
          :src="activeFiendInfo.friend_info?.avatar || activeFiendInfo.avatar"
        ></el-avatar>
      </div>
      <div class="right">
        <!-- 点击设置备注 -->
        <div class="span" v-if="isFriend === true">
          备注：<span>{{
            activeFiendInfo.nick_name || activeFiendInfo.friend_info.name
          }}</span>
        </div>
        <div class="span">
          昵称：<span>{{
            activeFiendInfo.friend_info?.name || activeFiendInfo.name
          }}</span>
        </div>
        <div class="span">
          性别：<span>{{
            activeFiendInfo.friend_info?.gender || activeFiendInfo.gender
          }}</span>
        </div>
        <div class="span">
          账号：<span>{{
            activeFiendInfo.friend_info?.account_id ||
            activeFiendInfo.account_id
          }}</span>
        </div>
        <div class="span">
          个性签名：<span>{{
            activeFiendInfo.friend_info?.signature || activeFiendInfo.signature
          }}</span>
        </div>
      </div>

      <!-- 更多 -->
      <el-popover ref="morePopver" placement="left" trigger="click">
        <template #reference v-if="isFriend === true">
          <el-button :icon="MoreFilled" class="more"></el-button>
        </template>
        <div class="more-content">
          <div class="note" style="cursor: pointer" @click.stop="handleSetNote">
            设置备注
          </div>
          <hr class="hr" />
          <div class="switch">
            <span>消息免打扰</span>
            <el-switch
              v-model="isNotDisturb"
              size="small"
              class="elSwitch"
            ></el-switch>
          </div>
          <hr class="hr" />
          <div class="switch">
            <span>置顶聊天</span>
            <el-switch
              v-model="isPin"
              size="small"
              class="elSwitch"
            ></el-switch>
          </div>
          <hr class="hr" />
          <div class="switch">
            <span>显示在首页</span>
            <el-switch
              v-model="isShow"
              size="small"
              class="elSwitch"
            ></el-switch>
          </div>
        </div>
      </el-popover>
    </div>
    <div class="btn">
      <el-button
        v-if="isFriend === true"
        type="primary"
        text
        bg
        @click="sendMsg"
        ><el-icon><Position /></el-icon>发消息</el-button
      >
      <el-button v-if="isFriend" type="danger" text bg @click="deleteFriend"
        ><el-icon><Delete /></el-icon>删除好友</el-button
      >
      <el-button v-else type="success" text bg @click="addFriend"
        ><el-icon><Plus /></el-icon>添加好友</el-button
      >
    </div>

    <!-- 设置备注 -->
    <el-dialog
      v-model="dialogFormVisible"
      title="设置备注"
      width="500"
      class="dialog"
    >
      <el-form>
        <el-form-item label="备注">
          <el-input v-model="nick_name"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="updateNickName"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.user-card {
  // border: 1px solid #000;
  // overflow: hidden;
  // width: 70%;
  padding: 50px;
  // padding-top: 100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  .content {
    width: 100%;
    // max-width: 100px;
    display: flex;
    justify-content: space-between;

    .left {
      .el-avatar {
        width: 120px;
        height: 120px;
      }
    }
    .right {
      margin-left: 40px;
      // font-size: 19px;
      flex: 1;
      min-width: 200px;
      max-width: 400px;
      // font-size: 14px;
      line-height: 1.6;
      .span {
        margin-bottom: 8px;
        word-break: break-all;
        white-space: pre-wrap;
      }
      .span:last-child {
        margin-bottom: 0;
      }
      span {
        user-select: text;
      }
    }
    .more {
      padding: 0;
      // width: 10px;
      height: 14px;
      border: none;
    }
    .more:hover {
      // background-color: #f0f0f0;
      --el-button-bg-color: #f8f8f8;
      --el-button-hover-text-color: #606266;
    }
    // .more{
    //   cursor: pointer;
    //   text-align: center;
    //   width: 20px;
    //   height: 20px;
    //   margin-left: 120px;
    // }
    // .more:hover{
    //   background-color: #f0f0f0;
    // }
  }
  .btn {
    margin-top: 30px;
    display: flex;
    gap: 12px;
    // justify-content: center;
  }
}
// :deep(.more_div) {
//   .more-content {
//     background-color: #bfa;
//   }
//   .split {

//   }
// }
</style>

<style lang="scss">
.more-content {
  .hr {
    margin: 2px 0;
    border: none;
    height: 1px;
    background-color: #ececec;
  }
  .switch {
    display: flex;
    justify-content: space-between;
    .elSwitch {
      --el-switch-on-color: #13ce66;
    }
  }
}
</style>
