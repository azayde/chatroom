<!-- 群聊详细信息 -->
<script setup>
import { Plus, Minus, ArrowRight, Position } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
// import { getGroupMemberService } from '@/api/group.js'
// switch开关 （三个）
// pin 和 置顶 ？？
const isPin = ref(false)
const isShow = ref(false)
const isNotDisturb = ref(false)

const dialogFormVisible = ref(false)
// 点击头像出现名片(点击头像名片消失)  --- 改 TODO:
// const userCardVisible = ref(false)

// 添加群成员
const bools = ref(false)

const groupNotify = ref(false)

// 群成员列表 (TODO: ) 可以拿到信息： 共有多少人
const groupList = ref([
  {
    relation_id: 123,
    relation_type: 'friend',
    is_show: true,
    pin_time: '2025-03-06T10:00:00',
    last_show: '2025-03-06T09:55:00',
    friend_info: {
      account_id: 456,
      name: 'Alice Smith',
      avatar:
        'https://q1.itc.cn/q_70/images03/20241212/702ee264f5aa44a3aec02043acf3a694.jpeg'
    },
    is_not_disturb: false,
    is_pin: true
  },
  {
    relation_id: 456,
    relation_type: 'group',
    is_show: true,
    pin_time: '2025-03-05T18:00:00',
    last_show: '2025-03-06T10:05:00',
    friend_info: {
      account_id: 789,
      name: 'Tech Enthusiasts',
      avatar:
        'https://q1.itc.cn/q_70/images03/20241212/702ee264f5aa44a3aec02043acf3a694.jpeg'
    },
    is_not_disturb: true,
    is_pin: true
  },
  {
    relation_id: 789,
    relation_type: 'friend',
    is_show: false,
    pin_time: '2025-03-04T22:00:00',
    last_show: '2025-03-06T08:30:00',
    friend_info: {
      account_id: 101,
      name: 'Bob Johnson',
      avatar:
        'https://q1.itc.cn/q_70/images03/20241212/702ee264f5aa44a3aec02043acf3a694.jpeg'
    },
    is_not_disturb: false,
    is_pin: false
  },
  {
    relation_id: 101,
    relation_type: 'friend',
    is_show: true,
    pin_time: '2025-03-03T12:00:00',
    last_show: '2025-03-06T10:10:00',
    friend_info: {
      account_id: 202,
      name: 'Charlie Brown',
      avatar:
        'https://q1.itc.cn/q_70/images03/20241212/702ee264f5aa44a3aec02043acf3a694.jpeg'
    },
    is_not_disturb: true,
    is_pin: false
  }
])
// 群成员信息
// const groupMember = ref([
//   {
//     account_id: 12345,
//     name: 'Alice Smith',
//     avatar: 'https://example.com/alice.jpg',
//     nickname: 'Alice',
//     is_leader: false
//   },
//   {
//     account_id: 67890,
//     name: 'Bob Johnson',
//     avatar: 'https://example.com/bob.png',
//     nickname: 'Bob',
//     is_leader: true
//   },
//   {
//     account_id: 24680,
//     name: 'Charlie Brown',
//     avatar: 'https://example.com/charlie.gif',
//     nickname: 'Chuck',
//     is_leader: false
//   },
//   {
//     account_id: 13579,
//     name: 'Diana Miller',
//     avatar: 'https://example.com/diana.svg',
//     nickname: 'Di',
//     is_leader: false
//   }
// ])

// const res = await getGroupMemberService(props.groupInfo.relation_id)
// console.log(res)
// 存储user-card的显隐状态
const activeMemberId = ref(null)
// const popverStates = ref({})

const handleClickMember = (id) => {
  activeMemberId.value = activeMemberId.value === id ? null : id
}

// 聊天记录dialog
const chatDialog = ref()

const sendMsg = () => {
  router.push('/chat/chatroom')
}

// 群聊详情
const props = defineProps({
  groupInfo: Object
})

console.log(props.groupInfo.relation_id)
</script>

<template>
  <!-- {{ groupInfo.relation_id }} -->
  <el-container>
    <el-header>
      <h1>{{ groupInfo.group_info.name }}（4）</h1>
    </el-header>
    <el-main>
      <el-scrollbar>
        <div class="title">群描述</div>
        <div class="description">{{ groupInfo.group_info.description }}</div>
        <hr />
        <div class="title">群成员</div>
        <div class="member">
          <el-popover
            placement="right"
            trigger="click"
            width="450px"
            :visible="activeMemberId === item.friend_info.account_id"
            manual
            v-for="item in groupList"
            :key="item.friend_info.account_id"
          >
            <template #reference>
              <!-- 需修改 TODO -->
              <div
                class="member-item"
                @click="handleClickMember(item.friend_info.account_id)"
              >
                <!-- @click="userCardVisible = !userCardVisible" -->
                <el-avatar
                  shape="square"
                  :src="item.friend_info.avatar"
                  class="member-avatar"
                />
                <div class="member-name">{{ item.friend_info.name }}</div>
              </div>
            </template>
            <div class="user-info">
              <!-- <user-card style="padding: 10px;"  @close-dialog="userCardVisible = false"></user-card> -->
              <user-card :userInfo="item" style="padding: 10px"></user-card>
            </div>
          </el-popover>

          <div class="add" @click="bools = true">
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
        <div class="nickname">成员2</div>
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
        <!-- <div class="title">
          <div class="switch">
            <span>Pin</span>
            <el-switch
              v-model="isPin"
              size="small"
              style="--el-switch-on-color: #13ce66"
            ></el-switch>
          </div>
        </div> -->
        <hr />
        <!-- 群头像，群名称，群描述 -->
        <div class="title">
          <div class="update" @click="dialogFormVisible = true">
            <span>修改群聊消息</span>
            <span
              ><el-icon><ArrowRight /></el-icon
            ></span>
          </div>
        </div>
        <hr />

        <!-- <div class="title">清空聊天记录</div> -->

        <!-- 不是群主 -->
        <div class="title exit" v-if="true">退出群聊</div>
        <!-- 群主 -->
        <div class="title disband" v-else>解散群聊</div>
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
    v-model="dialogFormVisible"
    title="设置群聊信息"
    width="500"
    class="dialog"
  >
    <!-- 不能直接修改父组件传过来的信息 -->
    <el-form>
      <el-upload
        class="avatar-uploader"
        :auto-upload="false"
        :show-file-list="false"
      >
        <img v-if="imgUrl" :src="imgUrl" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon">
          <Plus />
        </el-icon>
      </el-upload>
      <el-form-item label="群聊名称">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="群描述">
        <el-input></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>

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

  <!-- 群公告 -->
  <el-dialog v-model="groupNotify" title="群公告"> </el-dialog>
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
</style>
