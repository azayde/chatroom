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
import { watch, ref, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  updateNickNameService,
  updateShowService,
  updateDisturbService,
  updatePinService
} from '@/api/setting'
import {
  quitGroupService,
  dissolveGroupService,
  getGroupMemberService,
  updateGroupInfoService
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
// pin 和 置顶 ？？
const isPin = ref(groupStore.groupInfo.is_pin || false)
const isShow = ref(groupStore.groupInfo.is_show || false)
const isNotDisturb = ref(groupStore.groupInfo.is_not_disturb || false)

// 点击头像出现名片(点击头像名片消失)  --- 改 TODO:
// const userCardVisible = ref(false)

const groupNotify = ref(false)

// 群成员信息
const groupMember = ref([
  {
    account_id: 12345,
    name: 'Alice Smith',
    avatar:
      'https://q1.itc.cn/q_70/images03/20241212/702ee264f5aa44a3aec02043acf3a694.jpeg',
    nickname: 'Alice',
    is_leader: false
  },
  {
    account_id: 704513048576,
    name: 'Bob Johnson',
    avatar:
      'https://picx.zhimg.com/v2-52a6e836434d15d74a2121bbd6bed34d_720w.jpg?source=172ae18b',
    nickname: 'Bob',
    is_leader: true
  },
  {
    account_id: 24680,
    name: 'Charlie Brown',
    avatar:
      'https://q1.itc.cn/q_70/images03/20241212/702ee264f5aa44a3aec02043acf3a694.jpeg',
    nickname: 'Chuck',
    is_leader: false
  },
  {
    account_id: 13579,
    name: 'Diana Miller',
    avatar:
      'https://img.ixintu.com/download/jpg/201911/e25b904bc42a74d7d77aed81e66d772c.jpg!con',
    nickname: 'Di',
    is_leader: false
  }
])
const totalMember = ref()
const getGroupMember = async () => {
  // console.log(groupStore.groupInfo.group_info.relation_id)
  const res = await getGroupMemberService(
    groupStore.groupInfo.group_info.relation_id
  )
  groupMember.value = res.data.data.List
  totalMember.value = res.data.data.List.length
  // groupStore.setGroupMember(totalMember.value)
  console.log(res)
}
// 存储user-card的显隐状态
// const activeMemberId = ref(null)
// const popverStates = ref({})

// 当前群聊
const activeGroup = ref(props.groupInfo)
// console.log(activeGroup.value)
activeGroup.value = props.groupInfo ? props.groupInfo : groupStore.groupInfo

watch(
  () => props.groupInfo,
  (newVal) => {
    activeGroup.value = newVal
    getGroupMember()
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
// const getFriendList = async () => {
//   const res = await getFriendListService()
//   console.log(res.data.data)
//   friendList.value = res.data.data.list
// }

const handleMember = (item) => {
  for (let ele of friendList.value) {
    // console.log(ele)
    if (item.account_id === ele.friend_info.account_id) {
      // console.log('好友', ele)
      return ele
    }
  }
  return item
}
const handleIs = (item) => {
  for (let ele of friendList.value) {
    if (item.account_id === ele.friend_info.account_id) {
      return true
    }
  }
  return false
}
// 修改昵称
const isEdit = ref(false)
const id = groupMember.value.findIndex(
  (item) => item.account_id === userStore.accountInfo.id
)

// const id = groupList.value.findIndex(
//   (item) => item.friend_info.account_id === userStore.accountInfo.id
// )
const nickName = ref()

// const nick_name = ref(groupMember.value[id].nickname)
// const nick_name = ref(groupList.value[id].friend_info.name)
const nick_name = ref(null)
const inp = ref(null)
// console.log(nick_name.value)
// console.log(ref.nick_name)

// // 双击切换编辑状态
const handleNickName = () => {
  console.log(nick_name.value)
  isEdit.value = true
  nick_name.value.innerHTML = 'abc'
  // nick_name.value = groupList.value[id].friend_info.name
  nextTick(() => {
    inp.value.focus()
    inp.value.select()
  })
}
// 提交昵称修改
const updateNickName = async () => {
  isEdit.value = false
  console.log(groupStore.groupInfo.group_info.relation_id)
  console.log(nickName.value)
  const res = await updateNickNameService({
    relation_id: groupStore.groupInfo.group_info.relation_id,
    nick_name: nickName.value
  })
  console.log(res)
  // if (nick_name.value) {
  //   ElMessage.success('修改备注成功')
  // }
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
const group_name = ref(groupStore.groupInfo.group_info.name)
const description = ref(groupStore.groupInfo.group_info.description)
const imgUrl = ref(groupStore.groupInfo.group_info.avatar)
const fd = new FormData()
const onUploadFile = async (File) => {
  imgUrl.value = URL.createObjectURL(File.raw)
  fd.append('avatar', File.raw)
  console.log(File)
}
const updateGroupInfo = async () => {
  groupInfoEdit.value = false
  fd.append('relation_id', groupStore.groupInfo.group_info.relation_id)
  fd.append('name', group_name.value)
  fd.append('description', description.value)
  const res = await updateGroupInfoService(fd)
  console.log(res)
  // ElMessage.success('修改成功')
}
// 退出群聊
const handleQuit = async () => {
  // await quitGroupService(props.groupInfo.relation_id)
  ElMessage.success('已退出')
}

// 解散群聊
const handleDissolve = async () => {
  // await dissolveGroupService(props.groupInfo.relation_id)
  ElMessage.success('已解散')
}

// 发消息
const sendMsg = () => {
  router.push({
    path: '/chat/chatroom',
    query: { relation_id: props.groupInfo.relation_id }
  })
  chatStore.setChatInfo(props.groupInfo)
}

const notifyList = [
  {
    id: 1,
    relation_id: 101,
    msg_content: 'Hello, this is the first message.',
    msg_extend: {
      remind: null
    },
    account_id: 501,
    create_at: '2025-04-01T10:00:00Z',
    read_ids: [2]
  },
  {
    id: 2,
    relation_id: 102,
    msg_content: 'This is the second message.',
    msg_extend: {
      remind: null
    },
    account_id: 502,
    create_at: '2025-04-01T11:00:00Z',
    read_ids: [3]
  },
  {
    id: 3,
    relation_id: 103,
    msg_content: "Here's the third message.",
    msg_extend: {
      remind: null
    },
    account_id: 503,
    create_at: '2025-04-01T12:00:00Z',
    read_ids: [4]
  },
  {
    id: 4,
    relation_id: 104,
    msg_content: 'And this is the fourth message.',
    msg_extend: {
      remind: null
    },
    account_id: 504,
    create_at: '2025-04-01T13:00:00Z',
    read_ids: [5]
  },
  {
    id: 4,
    relation_id: 104,
    msg_content: 'And this is the fourth message.',
    msg_extend: {
      remind: null
    },
    account_id: 504,
    create_at: '2025-04-01T13:00:00Z',
    read_ids: [5]
  },
  {
    id: 4,
    relation_id: 104,
    msg_content: 'And this is the fourth message.',
    msg_extend: {
      remind: null
    },
    account_id: 504,
    create_at: '2025-04-01T13:00:00Z',
    read_ids: [5]
  },
  {
    id: 4,
    relation_id: 104,
    msg_content: 'And this is the fourth message.',
    msg_extend: {
      remind: null
    },
    account_id: 504,
    create_at: '2025-04-01T13:00:00Z',
    read_ids: [5]
  },
  {
    id: 4,
    relation_id: 104,
    msg_content: 'And this is the fourth message.',
    msg_extend: {
      remind: null
    },
    account_id: 504,
    create_at: '2025-04-01T13:00:00Z',
    read_ids: [5]
  },
  {
    id: 4,
    relation_id: 104,
    msg_content: 'And this is the fourth message.',
    msg_extend: {
      remind: null
    },
    account_id: 504,
    create_at: '2025-04-01T13:00:00Z',
    read_ids: [5]
  }
]

const invite = ref()
const inviteFriend = () => {
  invite.value.open()
}
onMounted(() => {
  getGroupMember()
  getFriendList()
})
</script>

<template>
  <el-container>
    <el-header>
      <h1>{{ activeGroup.group_info.name }}({{ groupMember.length }})</h1>
    </el-header>
    <el-main>
      <el-scrollbar>
        <div class="title">群描述</div>
        <div class="description">{{ activeGroup.group_info.description }}</div>
        <hr />
        <div class="title">群成员</div>
        <div class="member">
          <avatar-card
            v-for="item in groupMember"
            :key="item.account_id"
            :member="handleMember(item)"
            :isFriend="handleIs(item)"
          ></avatar-card>
          <!-- <el-popover
            placement="right"
            trigger="click"
            width="450px"
            :visible="activeMemberId === item.account_id"
            manual
            v-for="item in groupMember"
            :key="item.account_id"
          >
            <template #reference>
              <div
                class="member-item"
                @click="handleClickMember(item.account_id)"
              >
                <el-avatar
                  shape="square"
                  :src="item.avatar"
                  class="member-avatar"
                />
                <div class="member-name">{{ item.name }}</div>
              </div>
            </template>
            <div class="user-info">
              <user-card :userInfo="item" style="padding: 10px"></user-card>
            </div>
          </el-popover> -->

          <div class="add" @click="inviteFriend">
            <el-icon><Plus /></el-icon>
            <div class="member-name">添加</div>
          </div>
          <div class="remove">
            <el-icon><Minus /></el-icon>
            <div class="member-name">移除</div>
          </div>
        </div>
        <hr />
        <div class="title">我在本群的昵称</div>
        <!-- 点击可修改 -->
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
        <hr />
        <div class="Notify" @click="groupNotify = true">
          <div class="title">群公告</div>
          <!-- 显示最近的一条 -->
          <div class="notify">
            <span>11111111111</span>
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
        <div class="title exit" @click="handleQuit" v-if="true">退出群聊</div>
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
    :title="'\'' + activeGroup.group_info.name + '\' 的群公告'"
  >
    <div class="editor">
      <el-table style="width: 100%" :data="notifyList" max-height="300">
        <el-table-column label="序号" prop="id" width="55"></el-table-column>
        <el-table-column label="公告" prop="msg_content"></el-table-column>
        <el-table-column label="操作" width="150" v-if="true">
          <template #default="{ row }">
            <el-button
              :icon="Edit"
              circle
              type="primary"
              plain
              @click="handleEdit(row)"
            ></el-button>
            <el-button
              :icon="Delete"
              circle
              type="danger"
              plain
              @click="handleDel(row)"
            ></el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="没有账号"></el-empty>
        </template>
      </el-table>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="groupNotify = false">取消</el-button>
        <el-button type="primary" @click="groupNotify = false">
          确定
        </el-button>
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
.editor {
  // background-color: red;
  // border: 1px solid #000;
}
</style>
