<script setup>
import { ref } from 'vue'
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
const handleDel = async (row) => {
  // 删除
  console.log(typeof row.id)
  const res = await deleteAccountService(row.id)
  // const res = await deleteAccountService(1021631791104)
  console.log(res)
  ElMessageBox.confirm('你确认删除该分类信息吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  console.log(row)
  // 重新渲染
}

// 提交
const handleSubmit = async (data) => {
  const index = accountList.value.findIndex((item) => item.id === data.id)
  // 判断是添加还是编辑
  if (index === -1) {
    // 添加新账号 TODO:
    // 调用接口 - 返回数据 - 放到数组
    const res = await accountRegisterServie(data)
    console.log(res)
    // 重新渲染
    getAccountList()
    ElMessage.success('添加成功')
  } else {
    // 更新现有账号
    console.log(data)
    const res = await updateAccountService({
      account_id: data.id,
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

//  根据id 获取账号信息
const res1 = getAccountInfoById(1021631791104)
console.log(res1)
// 当前账号id，读取store信息 TODO
const activeAccountId = ref(userStore.accountInfo.id)
// 账号切换
const handleSwtich = async (id) => {
  // 获取账号的token，存入store
  console.log(typeof id)
  const res = await getAccountTokenService(id)
  console.log(res.data.data.account_token.token)
  userStore.setAccountToken(res.data.data.account_token.token)

  // //  根据id 获取账号信息
  // const res1 = getAccountInfoById(id)
  // console.log(res1)

  // 账号信息存入store（覆盖之前的）
  // userStore.setAccountInfo()

  // 防抖，一直点不起作用 TODO:
  console.log(id)
  activeAccountId.value = id
  ElMessage.success('切换成功')
}

// 账号搜索
const handleSearch = () => {
  // 搜索接口
  const name = inputInfo.value
  console.log(name)
  const res = searchAccountByName(name)
  console.log(res)

  // accountList.value = []
}
// 搜索重置
const handleReset = () => {
  inputInfo.value = ''
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
          <el-table-column label="账号" prop="id"></el-table-column>
          <el-table-column label="操作" width="150">
            <template #default="{ row }">
              <!-- 当前账号 ---  switch按钮可消失（切换） -->
              <el-button
                v-if="row.id === activeAccountId"
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
                @click="handleSwtich(row.id)"
              ></el-button>
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
