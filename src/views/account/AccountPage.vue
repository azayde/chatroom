<script setup>
import { ref } from 'vue'
import { debounce } from 'lodash-es' // 用于实现防抖功能
import { Search, Switch, Edit, Delete, Check } from '@element-plus/icons-vue'
import {
  getAccountTokenService,
  getAccountService,
  accountRegisterServie,
  updateAccountService,
  searchAccountByName,
  deleteAccountService,
  getAccountInfoById
} from '@/api/user.js'
import { useUserStore } from '@/stores'
import { closeWebSocket, createWebSocket } from '@/utils/websocket.js'
const userStore = useUserStore()
// 搜索框
const inputInfo = ref('')

const accountList = ref([])
// 渲染数据
// 获取用户的所有账号(搜索时调用)
const getAccountList = async () => {
  const res = await getAccountService()
  console.log(res.data.data)
  accountList.value = res.data.data.list
}
getAccountList()

// 传到对话框里（修改 or 添加 账号）
const accountEditRef = ref()
// 添加账号
const handleAdd = () => {
  // accountEditRef.value = {}
  accountEditRef.value.open({})
}
// 修改账号
const handleEdit = (row) => {
  // console.log(data.id)
  accountEditRef.value.open({ row })
}
// 删除账号
const handleDel = (row) => {
  // 删除
  console.log(row.account_id)

  ElMessageBox.confirm('你确定要注销该账号吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  }).then(async () => {
    const res = await deleteAccountService(row.account_id)
    console.log(res)
  })
  console.log(row)
  // 重新渲染
}

// 提交
const handleSubmit = async (data) => {
  const index = accountList.value.findIndex(
    (item) => item.account_id === data.account_id
  )
  // 判断是添加还是编辑
  if (index === -1) {
    // 添加新账号
    // 调用接口 - 返回数据 - 放到数组
    const res = await accountRegisterServie(data)
    console.log(res)
    // 重新渲染
    getAccountList()
    ElMessage.success('添加成功')
  } else {
    accountEditRef.value.updateAvatar()
    // 更新现有账号
    console.log(data)
    const res = await updateAccountService({
      account_id: data.account_id,
      name: data.name,
      gender: data.gender,
      signature: data.signature
    })
    console.log(res)
    accountList.value[index] = data
    // 重新渲染
    getAccountList()
    // 如果修改的是当前登录的账号
    if (data.id === activeAccountId.value) {
      // 更新账号信息
      userStore.setAccountInfo(data)
      console.log(123)
    }
    ElMessage.success('编辑成功')
  }
  console.log(accountList.value)
}

// 当前账号id，读取store信息
const activeAccountId = ref(userStore.accountInfo.account_id)
// 账号切换（debounce防抖）
const handleSwtich = debounce(
  async (id) => {
    // 获取账号的token，存入store
    // console.log(id)
    try {
      const res = await getAccountTokenService(id)
      // console.log(res)
      // console.log(res.data.data.account_token.token)
      userStore.setAccountToken(res.data.data.account_token.token)
    } catch (err) {
      console.log(err)
    }

    //  根据id 获取账号信息
    const res1 = await getAccountInfoById(id)
    console.log(res1)
    // console.log(res1.data.data)
    const accountInfo = {
      ...res1.data.data.info,
      signature: res1.data.data.signature
    }
    // console.log(accountInfo)
    // 账号信息存入store（覆盖之前的）
    userStore.setAccountInfo(accountInfo)
    closeWebSocket()
    createWebSocket()
    // console.log(id)
    activeAccountId.value = id
    ElMessage.success('切换成功')
  },
  500, // wait: 500：500ms内重复点击无效
  { leading: true, trailing: false }
  // leading: true：首次点击立即执行
  // trailing: false：忽略后续连续点击
)

// 账号搜索
const handleSearch = async () => {
  // 搜索接口
  const name = inputInfo.value
  console.log(name)
  const res = await searchAccountByName(name)
  console.log(res)
  accountList.value = res.data.data.list
}
// 搜索重置
const handleReset = () => {
  inputInfo.value = ''
  getAccountList()
}
</script>

<template>
  <div>
    <el-container>
      <el-header>
        <h1>账号管理</h1>
        <div class="btn">
          <el-button type="primary" @click="handleAdd">添加账号</el-button>
        </div>
      </el-header>
      <el-main>
        <div class="search">
          <span class="title">账号搜索</span>
          <el-input
            v-model="inputInfo"
            :prefix-icon="Search"
            placeholder="搜索"
            class="search-input"
          >
          </el-input>
          <el-button type="primary" text bg @click="handleSearch"
            >搜索</el-button
          >
          <el-button plain text bg @click="handleReset">重置</el-button>
        </div>
        <el-table style="width: 100%" :data="accountList">
          <el-table-column label="头像" width="100">
            <template #default="{ row }">
              <div class="avatar">
                <el-avatar shape="square" :src="row.avatar"></el-avatar>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="昵称" prop="name"></el-table-column>
          <el-table-column label="账号" prop="account_id"></el-table-column>
          <el-table-column label="操作" width="150">
            <template #default="{ row }">
              <!-- 当前账号 ---  switch按钮可消失（切换） -->
              <el-button
                v-if="row.account_id === activeAccountId"
                :icon="Check"
                circle
                type="success"
                plain
              ></el-button>
              <el-button
                v-else
                :icon="Switch"
                circle
                type="primary"
                plain
                @click="handleSwtich(row.account_id)"
              ></el-button>
              <el-button
                :icon="Delete"
                circle
                type="danger"
                plain
                @click="handleDel(row)"
              ></el-button>
              <el-button
                v-if="row.account_id === activeAccountId"
                :icon="Edit"
                circle
                type="primary"
                plain
                @click="handleEdit(row)"
              ></el-button>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty description="没有账号"></el-empty>
          </template>
        </el-table>
      </el-main>
    </el-container>
    <!-- 修改 -->
    <account-edit ref="accountEditRef" @submit="handleSubmit"></account-edit>
  </div>
</template>

<style lang="scss" scoped>
.el-container {
  height: 94vh;
  background-color: #f8f8f8;
  .el-header {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    height: 45px;
    line-height: 45px;
    display: flex;
    justify-content: space-between;
    h1 {
      margin: 0;
      font-size: 22px;
    }
  }
  .el-main {
    .search {
      margin: 10px 0;
      display: flex;
      // justify-content: space-between;
      text-align: center;
      height: 30px;
      line-height: 30px;
      .title {
        color: #606266;
        padding: 0 15px;
        font-size: 15px;
      }
      .search-input {
        width: 400px;
        margin-right: 10px;
      }
    }
    .content {
      .list-item {
        cursor: pointer;
        height: 60px;
        display: flex;
        align-items: center;
        padding-top: 5px;
        .avatar {
          margin: 0 10px;
        }
        .name {
          font-size: 16px;
        }
      }
      .list-item:hover {
        background-color: #f0f0f0;
      }
    }
  }
}
</style>
