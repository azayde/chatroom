<!-- 用户名片 -->
<!--头像点击 or 好友界面 -->
<script setup>
import { Position, MoreFilled, Delete } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { deleteFriendService } from '@/api/friend.js'
const router = useRouter()
// switch开关 （三个）
const isPin = ref(false)
const isShow = ref(false)
const isNotDisturb = ref(false)
const dialogFormVisible = ref(false)

// 判断是否是好友
const isFriend = ref(true)
// 更多（右上角三点）
const morePopver = ref(null)
const handleSetNote = () => {
  morePopver.value.hide()
  dialogFormVisible.value = true
}
// 发消息
const sendMsg = () => {
  router.push('/chat/chatroom')
}

const props = defineProps({
  userInfo: Object
})

// 删除好友
const deleteFriend = async () => {
  // await deleteFriendService(props.userInfo.value.relation_id)
  ElMessage.success('已删除')
}
// 没有数据传输时，怎么处理？？
// 好友  -  非好友
</script>

<template>
  <div class="user-card">
    <div class="content">
      <div class="left">
        <el-avatar
          size="large"
          shape="square"
          :src="userInfo.friend_info.avatar"
        ></el-avatar>
      </div>
      <div class="right">
        <!-- 点击设置备注 -->
        <div class="span" v-if="isFriend === true">
          备注：<span>{{ userInfo.friend_info.name }}</span>
        </div>
        <div class="span">
          昵称：<span>{{ userInfo.friend_info.name }}</span>
        </div>
        <div class="span">
          性别：<span>{{ userInfo.friend_info.gender }}</span>
        </div>
        <div class="span">
          账号：<span>{{ userInfo.friend_info.account_id }}</span>
        </div>
        <div class="span">
          个性签名：<span
            >他人很好购房合同如果还突然韩国发都让它发挥通过夫人的aaaaffggyy！！！！！！！！！</span
          >
        </div>
      </div>
      <el-popover ref="morePopver" placement="left" trigger="click">
        <template #reference>
          <el-button :icon="MoreFilled" class="more"></el-button>
        </template>
        <div class="more-content">
          <div class="note" style="cursor: pointer" @click.stop="handleSetNote">
            设置备注
          </div>
          <hr
            style="
              margin: 2px 0;
              border: none;
              height: 1px;
              background-color: #ececec;
            "
          />
          <div
            class="switch"
            style="display: flex; justify-content: space-between"
          >
            <span>消息免打扰</span>
            <el-switch
              v-model="isNotDisturb"
              size="small"
              style="--el-switch-on-color: #13ce66"
            ></el-switch>
          </div>
          <hr
            style="
              margin: 2px 0;
              border: none;
              height: 1px;
              background-color: #ececec;
            "
          />
          <div
            class="switch"
            style="display: flex; justify-content: space-between"
          >
            <span>置顶聊天</span>
            <el-switch
              v-model="isPin"
              size="small"
              style="--el-switch-on-color: #13ce66"
            ></el-switch>
          </div>
          <hr
            style="
              margin: 2px 0;
              border: none;
              height: 1px;
              background-color: #ececec;
            "
          />
          <div
            class="switch"
            style="display: flex; justify-content: space-between"
          >
            <span>显示在首页</span>
            <el-switch
              v-model="isShow"
              size="small"
              style="--el-switch-on-color: #13ce66"
            ></el-switch>
          </div>
          <!-- <hr
            style="
              margin: 2px 0;
              border: none;
              height: 1px;
              background-color: #ececec;
            "
          />
          <div
            class="switch"
            style="display: flex; justify-content: space-between"
          >
            <span>pin</span>
            <el-switch
              v-model="isPin"
              size="small"
              style="--el-switch-on-color: #13ce66"
            ></el-switch>
          </div> -->
        </div>
      </el-popover>
      <!-- <div class="more">
     <el-icon><MoreFilled /></el-icon>
    </div> -->
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
      <el-button v-else type="success" text bg
        ><el-icon><Delete /></el-icon>添加好友</el-button
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
</style>
