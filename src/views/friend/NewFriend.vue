<!-- 新的朋友 -->
<script setup>
import { ref } from 'vue'
import {
  acceptApplicationService,
  refuseApplicationService,
  deleteApplicationService,
  getApplicationService
} from '@/api/friend.js'

import { useUserStore } from '@/stores'
const userStore = useUserStore()

// 获取好友申请列表
const newFriendList = ref([
  // {
  //   account_id_1: 111111111111111,
  //   account_id_2: 749899612160,
  //   apply_msg: '请求添加你为好友',
  //   status: '已申请',
  //   create_at: '2025-03-12T10:00:00Z',
  //   update_at: '2025-03-12T10:00:00Z',
  //   name: '张三',
  //   avatar:
  //     'https://img.tukuppt.com/ad_preview/00/10/23/5c992ae114e20.jpg!/fw/980'
  // },
  // {
  //   account_id_1: 333333333333333,
  //   account_id_2: 749899612160,
  //   apply_msg: '想加入你的群组',
  //   refuse: '群组已满',
  //   status: '已拒绝',
  //   create_at: '2025-03-13T14:30:00Z',
  //   update_at: '2025-03-13T15:00:00Z',
  //   name: '李四',
  //   avatar: 'https://pic3.zhimg.com/v2-87d78fc44236a144aa52cd8ea18e9da2_r.jpg'
  // },
  // {
  //   account_id_1: 555555555555555,
  //   account_id_2: 749899612160,
  //   apply_msg: '请求访问你的项目',
  //   status: '已同意',
  //   create_at: '2025-03-14T08:00:00Z',
  //   update_at: '2025-03-14T09:00:00Z',
  //   name: '王五',
  //   avatar: 'https://img.shetu66.com/2023/07/05/1688537701771625.png'
  // },
  // {
  //   account_id_1: 777777777777777,
  //   account_id_2: 749899612160,
  //   apply_msg: '请求成为你的朋友',
  //   status: '已申请',
  //   create_at: '2025-03-15T16:45:00Z',
  //   update_at: '2025-03-15T17:00:00Z',
  //   name: '赵六',
  //   avatar:
  //     'https://img.tukuppt.com/png_preview/02/94/12/HUJ75JzwjF.jpg!/fw/780'
  // },
  // {
  //   account_id_1: 749899612160,
  //   account_id_2: 888888888888888,
  //   apply_msg: '我是成员1',
  //   status: '已申请',
  //   create_at: '2025-03-15T16:45:00Z',
  //   update_at: '2025-03-15T17:00:00Z',
  //   name: '申请好友',
  //   avatar:
  //     'https://tse4-mm.cn.bing.net/th/id/OIP-C.b1-zaQ3huVNNgYL6VYlGhgHaHa?rs=1&pid=ImgDetMain'
  // }
])
const getNewFriendList = async () => {
  const res = await getApplicationService()
  console.log(res.data.data)
  newFriendList.value = res.data.data
}
getNewFriendList()

// 创建好友申请
// const props = defineProps({ newFriend: Object })
// console.log(props.newFriend)
// if (props.newFriend) {
//   newFriendList.value.unshift(props.newFriend)
//   // 重新渲染一遍
//   getNewFriendList()
// }

// 接受好友申请
// const handleAccept = async (id) => {
const handleAccept = (id) => {
  console.log(id)
  // await acceptApplicationService(id)

  // 应该是后端修改了 ???  TODO: 重新获取列表 ??

  // const friend = newFriendList.value.find((item) => item.account_id_1 === id)
  // if (friend) {
  //   friend.status = '已同意'
  // }
  // newFriendList[id].status = '已同意'

  // 重新渲染
  // getNewFriendList()
  ElMessage.success('添加好友成功')
}

// 拒绝好友申请
// const handleRefuse = async ({ id, refuse }) => {
// const handleRefuse = ({ id, refuse }) => {
//   console.log({ id, refuse })
//   // await refuseApplicationService({ id, refuse })
//   // 传数据 id, refuse
//   // 下面调用的地方 TODO

//   // 重新渲染
//   // getNewFriendList()
//   ElMessage.error('已拒绝')
// }

// 删除好友申请
// const handleDelete = async (id) => {
const handleDelete = (id) => {
  console.log(id)
  // await deleteApplicationService(id)

  // 重新渲染
  // getNewFriendList()
  ElMessage.success('删除成功')
}

const handleRefuse = async (id) => {
  ElMessageBox.prompt('请输入拒绝的留言', {
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  }).then(async (refuse) => {
    console.log({ id, refuse: refuse.value })
    // await refuseApplicationService({ id, refuse: refuse.value })
    ElMessage({
      type: 'success',
      message: `已拒绝`
    })
  })
}
</script>

<template>
  <el-container>
    <el-header>
      <h1>新的朋友</h1>
    </el-header>
    <el-main class="list">
      <!-- key 的唯一性(目前不唯一)  TODO: -->
      <div
        class="list-item"
        v-for="item in newFriendList"
        :key="item.account_id_1"
      >
        <div class="content1">
          <div class="left">
            <div class="avatar">
              <el-avatar shape="square" :src="item.avatar"></el-avatar>
            </div>
          </div>
          <div class="right">
            <span class="name">{{ item.name }}</span>
            <span class="apply_msg">{{ item.apply_msg }}</span>
            <span class="refuse_msg">
              {{ item.status === '已拒绝' ? '拒绝：' + item.refuse : '' }}</span
            >
          </div>
        </div>
        <!-- 对方申请 -->
        <div
          class="content2"
          v-if="item.account_id_2 === userStore.accountInfo.id"
        >
          <div class="btn" v-if="item.status === '已申请'">
            <el-button
              type="success"
              text
              @click="handleAccept(item.account_id_1)"
              >接受</el-button
            >
            <el-button
              type="danger"
              text
              @click="handleRefuse(item.account_id_1)"
              >拒绝</el-button
            >
          </div>
          <div class="result" v-else-if="item.status === '已同意'">
            <span>已添加</span>
          </div>
          <div class="result" v-else-if="item.status === '已拒绝'">
            <span>已拒绝</span>
          </div>
        </div>

        <!-- 自己申请 删除 -->
        <div class="content2" v-else>
          <div class="btn">
            <el-button
              type="danger"
              text
              @click="handleDelete(item.account_id_2)"
              >删除</el-button
            >
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<style lang="scss" scoped>
.el-container {
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
    // margin-left: 100px;
    // margin: 0 auto;
    padding: 0 30px;
    // border: 1px solid #000;
    .list-item {
      cursor: pointer;
      height: 80px;
      display: flex;
      // align-items: center;
      justify-content: space-between;
      padding-top: 5px;
      .content1 {
        display: flex;
        align-items: center;
        .left {
          margin: 0 10px;
          .avatar {
            width: 60px;
            height: 60px;
            .el-avatar {
              width: 100%;
              height: 100%;
            }
          }
        }
        .right {
          // width: 150px;
          height: 60px;
          display: flex;
          padding: 0 6px;
          // padding-right: 10px;
          flex-direction: column;
          justify-content: space-between;
          .name {
            font-size: 16px;
          }
          .apply_msg,
          .refuse_msg {
            font-size: 14px;
            // margin-bottom: 5px;
            color: #c4c4c4;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      .content2 {
        display: flex;
        align-items: center;
        .btn {
          .el-button {
            font-size: 14px;
          }
        }
        .result {
          font-size: 14px;
          color: #c4c4c4;
          padding-right: 40px;
        }
      }
    }
    .list-item:hover {
      background-color: #f0f0f0;
      // background-color: #e9e9e9; 点击后颜色
    }
  }
}
</style>
