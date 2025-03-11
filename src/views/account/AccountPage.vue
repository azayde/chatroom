<script setup>
import { ref } from 'vue'
import { Search, Switch, Edit, Delete, Plus } from '@element-plus/icons-vue'

// 搜索框
const input = ref('')
const AccountList1 = [
  {
    avatar:
      'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    name: '张三',
    account_id: '1111111',
    gender: '男',
    signature: '我想了一个好主意！'
  },
  {
    avatar:
      'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    name: '张三',
    account_id: '1111111',
    gender: '男',
    signature: '我想了一个好主意！'
  },
  {
    avatar:
      'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    name: '张三',
    account_id: '1111111',
    gender: '男',
    signature: '我想了一个好主意！'
  },
  {
    avatar:
      'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    name: '张三',
    account_id: '1111111',
    gender: '男',
    signature: '我想了一个好主意！'
  }
]

// 对话框（修改信息）
const bools = ref(false)

// 性别（单选框）
const radio1 = ref(1)
</script>

<template>
  <div>
    <el-container>
      <el-header>
        <h1>账号管理</h1>
        <div class="btn">
          <el-button type="primary">添加账号</el-button>
        </div>
      </el-header>
      <el-main>
        <div class="search">
          <span class="title">账号搜索</span>
          <el-input
            v-model="input"
            :prefix-icon="Search"
            placeholder="搜索"
            class="search-input"
          >
          </el-input>
          <el-button type="primary" text bg>搜索</el-button>
          <el-button type="plain" text bg>重置</el-button>
        </div>
        <el-table style="width: 100%" :data="AccountList1">
          <el-table-column label="头像" width="100">
            <div class="avatar">
              <el-avatar
                shape="square"
                src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
              ></el-avatar>
            </div>
          </el-table-column>
          <el-table-column label="昵称">张三</el-table-column>
          <el-table-column label="账号">111111</el-table-column>
          <el-table-column label="操作" width="150">
            <template #default="{ row, $index }">
              <!-- 当前账号 ---  switch按钮可消失（切换） -->
              <el-button
                :icon="Switch"
                circle
                plain
                type="primary"
                @click="onEditChannel(row, $index)"
              ></el-button>
              <!-- @click 被我改了，回头改回来  TODO-->
              <el-button
                :icon="Edit"
                circle
                plain
                type="primary"
                @click="bools = true"
              ></el-button>
              <el-button
                :icon="Delete"
                circle
                plain
                type="danger"
                @click="onDelChannel(row, $index)"
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
    <el-dialog v-model="bools" title="修改账号信息" width="500" class="dialog">
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
        <el-form-item label="账号名称">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="radio1">
            <el-radio value="1">男</el-radio>
            <el-radio value="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="个性签名">
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
