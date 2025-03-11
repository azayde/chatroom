<script setup>
import { useRouter } from 'vue-router'
import { Plus } from '@element-plus/icons-vue'
// import { getAccountTokenService } from '@/api/user.js'

import { useUserStore } from '@/stores'
// 路由
const router = useRouter()
// 仓库 - 用户
const userStore = useUserStore()

const props = defineProps({
  account: Array
})
console.log(props.account)

const getAccountId = async (obj) => {
  // const res = await getAccountTokenService(id)
  // userStore.setAccountToken(res.data.account_token.token)

  // 账号信息存入本地
  // userStore.setAccountInfo(obj)

  // console.log(obj)
  // console.log(res)
  ElMessage.success('登录成功')

  router.push('/')
}
</script>

<template>
  <div class="account-list">
    <template v-if="account.length > 0">
      <div
        class="member-item"
        v-for="item in account"
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
      <div class="add">
        <el-icon><Plus /></el-icon>
        <div class="member-name">添加账号</div>
      </div>
    </template>
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
