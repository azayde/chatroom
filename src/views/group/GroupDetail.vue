<!-- 群聊详细信息 -->
<script setup>
import {
  Plus,
  Minus,
  ArrowRight,
  Position,
  Edit,
  Delete
} from '@element-plus/icons-vue'
import { watch, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  // updateNickNameService,
  updateShowService,
  updateDisturbService,
  updatePinService
} from '@/api/setting'
import {
  quitGroupService,
  dissolveGroupService,
  getGroupMemberService,
  updateGroupInfoService,
  createNotifyService,
  getAllNotifyService,
  updateNotifyService,
  deleteNotifyService
} from '@/api/group'
import { getFriendListService } from '@/api/friend.js'
import { getAccountInfoById } from '@/api/user.js'
import { useUserStore, useChatStore, useGroupStore } from '@/stores'

const userStore = useUserStore()
const chatStore = useChatStore()
const groupStore = useGroupStore()

const router = useRouter()
// 群聊详情
const props = defineProps({
  groupInfo: Object
})
// switch开关 （三个）
let isPin = ref(props.groupInfo.is_pin || false)
let isShow = ref(props.groupInfo.is_show || false)
let isNotDisturb = ref(props.groupInfo.is_not_disturb || false)

const groupNotify = ref(false)
const is_leader = ref(false)
// 当前群聊
const activeGroup = ref(props.groupInfo)
// console.log(activeGroup.value)
activeGroup.value = props.groupInfo ? props.groupInfo : groupStore.groupInfo
// 群成员信息
const groupMember = ref([])
const getGroupMember = async () => {
  const res = await getGroupMemberService(
    activeGroup.value.group_info.relation_id
  )
  console.log(res)
  groupMember.value = res.data.data?.List || null
  // totalMember.value = res.data.data.List.length
  // console.log(groupMember.value[0])
  if (
    groupMember.value &&
    groupMember.value[0].account_id === userStore.accountInfo.account_id
  ) {
    is_leader.value = true
  } else {
    is_leader.value = false
  }
}

watch(
  () => props.groupInfo,
  (newVal) => {
    activeGroup.value = newVal
    isPin.value = props.groupInfo.is_pin || false
    isShow.value = props.groupInfo.is_show || false
    isNotDisturb.value = props.groupInfo.is_not_disturb || false
    getGroupMember()
    getNotifyList()
  },
  { deep: true }
)
// 点击群成员获取当前的id（用于名片）
// const handleClickMember = (id) => {
//   activeMemberId.value = activeMemberId.value === id ? null : id
// }
// 获取好友列表，一用于拉取好友，二用于判读群聊中的成员是否是好友
const friendList = ref([])
// 获取好友列表
const getFriendList = async () => {
  const res = await getFriendListService()
  // console.log(res.data.data)
  // 根据id获取账号信息
  for (let item of res.data.data.list) {
    // console.log(item)
    // console.log()
    const res1 = await getAccountInfoById(item.friend_info.account_id)
    // console.log(res1)
    const info = {
      ...res1.data.data.info,
      signature: res1.data.data.signature
    }
    // console.log(info)
    item.friend_info = info
  }
  friendList.value = res.data.data.list
  console.log(friendList.value)
}
// getFriendList()

// 获取群成员信息（区分好友与非好友）
const handleMember = (item) => {
  for (let ele of friendList.value) {
    if (item.account_id === ele.friend_info.account_id) {
      return ele
    }
  }
  return item
}
// 判断是否是本人好友
const handleIs = (item) => {
  for (let ele of friendList.value) {
    if (item.account_id === ele.friend_info.account_id) {
      return true
    }
  }
  return false
}

// 聊天记录dialog
const chatDialog = ref()

// 三个switch
const handleSwitch = async (msg) => {
  // 状态更改后，要更新一下store里面的内容，否则需要手动刷新
  const relation_id = ref(props.groupInfo.relation_id)
  console.log(relation_id.value)
  console.log(msg)
  if (msg === 'isNotDisturb') {
    const res = await updateDisturbService({
      relation_id: relation_id.value,
      isNotDisturb: isNotDisturb.value
    })
    console.log(res)
  } else if (msg === 'isPin') {
    const res = await updatePinService({
      relation_id: relation_id.value,
      is_pin: isPin.value
    })
    console.log(res)
  } else if (msg === 'isShow') {
    const res = await updateShowService({
      relation_id: relation_id.value,
      is_show: isShow.value
    })
    console.log(res)
  }
}
watch(isNotDisturb, () => handleSwitch('isNotDisturb'))
watch(isPin, () => handleSwitch('isPin'))
watch(isShow, () => handleSwitch('isShow'))

// 修改群聊信息
// const groupEdit = ref()
// const handleGroupEdit = () => {
//   groupEdit.value.open(activeGroup.value.group_info)
// }
const groupInfoEdit = ref(false)
const group_name = ref(activeGroup.value.group_info.name)
const description = ref(activeGroup.value.group_info.description)
const imgUrl = ref(activeGroup.value.group_info.avatar)
const fd = new FormData()
const onUploadFile = async (File) => {
  imgUrl.value = URL.createObjectURL(File.raw)
  fd.append('avatar', File.raw)
  console.log(File)
}
const updateGroupInfo = async () => {
  groupInfoEdit.value = false
  fd.append('relation_id', activeGroup.value.group_info.relation_id)
  fd.append('name', group_name.value)
  fd.append('description', description.value)
  try {
    const res = await updateGroupInfoService(fd)
    console.log(res)
    ElMessage.success('修改成功')
  } catch (err) {
    console.log(err)
    ElMessage.error('修改失败')
  }
}
// 退出群聊
const handleQuit = async () => {
  await ElMessageBox.confirm('确定退出群聊吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await quitGroupService(props.groupInfo.relation_id)
      console.log(res)
      ElMessage.success('已退出')
    } catch (err) {
      console.log(err)
      ElMessage.error('退出失败，请重试')
    }
  })
}

// 解散群聊
const handleDissolve = async () => {
  await ElMessageBox.confirm('确定解散群聊吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await dissolveGroupService(props.groupInfo.relation_id)
      console.log(res)
      ElMessage.success('已解散')
    } catch (err) {
      console.log(err)
      ElMessage.err('解散失败，请重试')
    }
  })
}

// 发消息
const sendMsg = () => {
  router.push({
    path: '/chat/chatroom',
    query: { relation_id: props.groupInfo.relation_id }
  })
  chatStore.setChatInfo(props.groupInfo)
}
// 群公告列表
const notifyList = ref()
// 最新一条
const lastNotify = ref()
// 获取群公告
const getNotifyList = async () => {
  console.log(activeGroup.value.relation_id)
  const res = await getAllNotifyService(activeGroup.value.relation_id)
  console.log(res)
  notifyList.value = res.data.data?.list || null
  if (notifyList.value) {
    lastNotify.value =
      notifyList.value[notifyList.value.length - 1]?.msg_content || '暂无群公告'
  }
}
const openGroupNotify = () => {
  groupNotify.value = true
  getNotifyList()
}
// 创建群公告
const notify_content = ref()
const createNotify = async () => {
  console.log(activeGroup.value.relation_id)
  console.log(notify_content.value)
  if (notify_content.value) {
    const res = await createNotifyService({
      relation_id: activeGroup.value.relation_id,
      msg_content: notify_content.value
    })
    console.log(res)
  }
  groupNotify.value = false
}
// 更新群公告
const newNotify = ref({
  id: 0,
  relation_id: activeGroup.value.relation_id,
  msg_content: ''
})
const handleUpdate = (obj) => {
  console.log(obj)
  newNotify.value.id = obj.id
  newNotify.value.msg_content = obj.msg_content
  updateNotify()
}
const updateNotify = async () => {
  const res = await updateNotifyService(newNotify.value)
  console.log(res)
  groupNotify.value = false
}
// 删除群公告
const handleDel = async (item) => {
  console.log(item.id)
  const res = await deleteNotifyService({
    id: item.id,
    relation_id: activeGroup.value.relation_id
  })
  console.log(res)
}
const invite = ref()
const inviteFriend = () => {
  invite.value.open()
}
onMounted(() => {
  getGroupMember()
  getNotifyList()
  getFriendList()
})
</script>

<template>
  <el-container>
    <el-header>
      <h1>{{ activeGroup.group_info.name }}({{ groupMember?.length || 0 }})</h1>
    </el-header>
    <el-main>
      <el-scrollbar>
        <div class="title">群描述</div>
        <div class="description">{{ activeGroup.group_info.description }}</div>
        <hr />
        <div class="title">群成员</div>
        <div class="member" v-if="groupMember">
          <avatar-card
            v-for="item in groupMember"
            :key="item.account_id"
            :member="handleMember(item)"
            :isFriend="handleIs(item)"
          ></avatar-card>
          <div class="add" @click="inviteFriend">
            <span>
              <el-icon><Plus /></el-icon>
            </span>
            <div class="member-name">添加</div>
          </div>
          <div class="remove">
            <el-icon><Minus /></el-icon>
            <div class="member-name">移除</div>
          </div>
        </div>
        <hr />
        <!-- <div class="title">我在本群的昵称</div>
        <div class="nickname">
          <input
            v-if="isEdit"
            type="text"
            v-model="nickName"
            ref="inp"
            @blur="updateNickName"
            @keyup.enter="inp.blur()"
          />
          <div v-else @click="handleNickName" ref="nick_name">
            {{ nickName || '未设置昵称' }}
          </div>
        </div>
        <hr /> -->
        <div class="Notify" @click="openGroupNotify">
          <div class="title">群公告</div>
          <!-- 显示最近的一条 -->
          <div class="notify">
            <span>{{ lastNotify }}</span>
            <span
              ><el-icon><ArrowRight /></el-icon
            ></span>
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
        <!-- 群头像，群名称，群描述 -->
        <div class="title">
          <!-- <div class="update" @click="handleGroupEdit"> -->
          <div class="update" @click="groupInfoEdit = true">
            <span>修改群聊消息</span>
            <span
              ><el-icon><ArrowRight /></el-icon
            ></span>
          </div>
        </div>
        <hr />
        <!-- <div class="title">清空聊天记录</div> -->
        <!-- 不是群主 -->
        <div class="title exit" @click="handleQuit" v-if="!is_leader">
          退出群聊
        </div>
        <!-- 群主 -->
        <div class="title disband" @click="handleDissolve" v-else>解散群聊</div>
        <hr />
        <div class="btn">
          <el-button type="primary" text bg @click="sendMsg"
            ><el-icon><Position /></el-icon>发消息</el-button
          >
        </div>
      </el-scrollbar>
    </el-main>
  </el-container>

  <!-- 对话框（设置群聊信息） -->
  <el-dialog
    v-model="groupInfoEdit"
    title="设置群聊信息"
    width="500"
    class="dialog"
  >
    <el-form>
      <el-upload
        class="avatar-uploader"
        :auto-upload="false"
        :show-file-list="false"
        @change="onUploadFile"
      >
        <img :src="imgUrl" class="avatar" />
      </el-upload>
      <el-form-item label="群聊名称">
        <el-input v-model="group_name"></el-input>
      </el-form-item>
      <el-form-item label="群描述">
        <el-input v-model="description"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="groupInfoEdit = false">取消</el-button>
        <el-button type="primary" @click="updateGroupInfo"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 添加群成员 -->
  <change-group-member
    ref="invite"
    :friendList="friendList"
  ></change-group-member>

  <!-- 聊天记录 -->
  <chat-history ref="chatDialog"></chat-history>

  <!-- 群公告 -->
  <el-dialog
    v-model="groupNotify"
    :title="`${activeGroup.group_info.name}的群公告`"
    class="notify_dialog"
  >
    <el-scrollbar>
      <div class="editor">
        <textarea
          v-if="is_leader"
          v-model="notify_content"
          name="notify"
          class="notify_editor"
          placeholder="在此创建新的公告，直接输入，并点击创建即可;
修改时可直接修改并点击修改按钮"
        ></textarea>
        <div class="item" v-for="(item, index) in notifyList" :key="index">
          <div>
            {{ index }}
          </div>
          <textarea
            v-if="is_leader"
            v-model="item.msg_content"
            name="notify"
            class="notify_editor"
          ></textarea>
          <div v-else class="notleader_notify">{{ item.msg_content }}</div>
          <el-button
            v-if="is_leader"
            :icon="Edit"
            circle
            type="primary"
            plain
            @click="handleUpdate(item)"
          ></el-button>
          <el-button
            v-if="is_leader"
            :icon="Delete"
            circle
            type="danger"
            plain
            @click="handleDel(item)"
          ></el-button>
        </div>
      </div>
    </el-scrollbar>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="groupNotify = false">取消</el-button>
        <el-button v-if="is_leader" type="primary" @click="createNotify">
          创建
        </el-button>
        <!-- <el-button v-if="is_leader" type="primary" @click="updateNotify">
          修改
        </el-button> -->
      </div>
    </template>
  </el-dialog>
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
      .add,
      .remove {
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
    .description,
    .nickname,
    .notify {
      padding-left: 20px;
      font-size: 13px;
      color: #606266;
    }
    .notify,
    .chat-history,
    .update,
    .switch {
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      padding-right: 25px;
    }
    .disband,
    .exit {
      cursor: pointer;
      text-align: center;
      color: red;
    }
    .btn {
      // display: inline-block;
      width: 80px;
      margin: 0 auto;
    }
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
.notify_dialog {
  .el-scrollbar {
    height: 387px;
    .editor {
      .item {
        display: flex;
        margin: 10px 0;
        margin-right: 30px;
        .notleader_notify {
          margin: 0 10px;
        }
      }
      textarea.notify_editor {
        box-sizing: border-box;
        width: 90%;
        height: auto;
        min-height: 50px; // 最小高度
        max-height: 300px; // 最大高度
        overflow-y: auto;
        font-size: 16px;
        border: none;
        resize: none;
        margin: 0 10px;
        // &:focus {
        //   outline: none;
        //   border-color: #409eff;
        // }
      }
    }
  }
}
</style>
