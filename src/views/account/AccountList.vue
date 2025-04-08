<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Plus } from '@element-plus/icons-vue'
import {
  getAccountService,
  getAccountTokenService,
  accountRegisterServie
} from '@/api/user.js'

import { useUserStore } from '@/stores'
// 路由
const router = useRouter()
// 仓库 - 用户
const userStore = useUserStore()

// 账号信息
const accountInfo = ref([])

// 进入账号页面 调用这个函数
const getAccount = async () => {
  const res = await getAccountService()
  console.log(res.data.data)
  accountInfo.value = res.data.data.list
}
getAccount()

const getAccountId = async (obj) => {
  console.log(typeof obj.id)
  console.log(obj.id)
  const res = await getAccountTokenService(obj.id)
  console.log(res)
  console.log(res.data.data.account_token.token)
  userStore.setAccountToken(res.data.data.account_token.token)
  // 账号信息存入本地
  userStore.setAccountInfo(obj)
  ElMessage.success('登录成功')

  router.push('/')
}

// 传到对话框里（修改 or 添加 账号）
const accountEditRef = ref()
// 添加账号
const handleAdd = () => {
  // accountEditRef.value = {}
  accountEditRef.value.open({})
}
// 提交
const handleSubmit = async (data) => {
  console.log(data)
  // 添加新账号
  // 调用接口 - 返回数据 - 放到数组
  const res = await accountRegisterServie(data)
  console.log(res)
  // 重新渲染
  getAccount()
  ElMessage.success('添加成功')
  console.log(accountInfo.value)
}
</script>

<template>
  <div class="account-list">
    <template v-if="accountInfo.length > 0">
      <div
        class="member-item"
        v-for="item in accountInfo"
        :key="item.id"
        @click="getAccountId(item)"
      >
        <el-avatar shape="square" :src="item.avatar" class="member-avatar" />
        <div class="member-name">
          {{ item.name }}
        </div>
      </div>
    </template>
    <template v-else>
      <!-- <el-empty description="没有账号"></el-empty> -->
      <div class="add" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        <div class="member-name">添加账号</div>
      </div>
    </template>
    <account-edit ref="accountEditRef" @submit="handleSubmit"></account-edit>
  </div>
</template>

<style lang="scss" scoped>
.account-list {
  width: 344px;
  display: flex;
  flex-wrap: wrap;
  .member-item {
    padding: 10px;
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
  .member-item:hover {
    background-color: #f5f5f5;
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
</style>
