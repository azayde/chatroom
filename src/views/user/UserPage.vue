<!-- 用户管理页面 -->
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
// 路由
const router = useRouter()
// 仓库 - 用户
const userStore = useUserStore()

const goAccount = () => {
  router.push('/account')
}

const dialogFormVisible = ref(false)
const dialogEmailVisible = ref(false)
</script>

<template>
  <el-container>
    <el-header>
      <h1>我的</h1>
    </el-header>
    <el-main>
      <div class="email_now">
        <span class="title">当前邮箱</span>
        <div class="email_content">{{ userStore.user.email }}</div>
      </div>
      <hr />
      <div class="account_now">
        <span class="title">当前账号</span>
        <div class="account_content">
          <div class="left">
            <el-avatar
              size="large"
              shape="square"
              :src="userStore.accountInfo.avatar"
            ></el-avatar>
          </div>
          <div class="right">
            <div class="span">
              昵称：<span>{{ userStore.accountInfo.name }}</span>
            </div>
            <div class="span">
              账号：<span>{{ userStore.accountInfo.id }}</span>
            </div>
            <div class="span">
              性别：<span>{{ userStore.accountInfo.gender }}</span>
            </div>
            <!-- 签名 ？？ ！！！！！！！ -->
            <div class="span">
              个性签名：<span
                >他人很好购房合同如果还突然韩国发都让它发挥通过夫人的aaaaffggyy！！！！！！！！！</span
              >
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div class="account_manage" @click="goAccount">
        <span class="title">账号管理</span>
        <span
          ><el-icon><ArrowRight /></el-icon
        ></span>
      </div>
      <hr />
      <div class="pwd" @click="dialogFormVisible = true">
        <span class="title">修改密码</span>
        <span
          ><el-icon><ArrowRight /></el-icon
        ></span>
      </div>
      <hr />
      <div class="email" @click="dialogEmailVisible = true">
        <span class="title">修改邮箱</span>
        <span
          ><el-icon><ArrowRight /></el-icon
        ></span>
      </div>
      <hr />
      <div class="cancel">注销用户</div>
    </el-main>
  </el-container>

  <!-- 对话框（修改密码） -->
  <el-dialog
    v-model="dialogFormVisible"
    title="修改密码"
    width="500"
    class="dialog"
  >
    <el-form>
      <el-form-item label="用户邮箱">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="新的密码">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="验证码">
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

  <!-- 对话框（修改邮箱） -->
  <el-dialog
    v-model="dialogEmailVisible"
    title="修改邮箱"
    width="500"
    class="dialog"
  >
    <el-form>
      <!-- 自动填充 -->
      <el-form-item label="旧邮箱">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="新邮箱">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="验证码">
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
</template>

<style lang="scss" scoped>
.el-container {
  .el-header {
    // padding-left: 0;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    height: 45px;
    line-height: 45px;
    h1 {
      margin: 0;
      font-size: 22px;
    }
  }
  .el-main {
    // padding-left: 20px;
    // margin: 20px;
    hr {
      // color: #000;
      margin: 10px 0;
      // padding: 10px 0;
      border: none;
      height: 1px;
      background-color: #ececec;
    }
    .title {
      padding-left: 15px;
      font-size: 15px;
    }
    .email_now {
      margin-top: 10px;
      .email_content {
        padding-left: 20px;
        font-size: 15px;
        color: #606266;
      }
    }
    .account_now {
      .account_content {
        width: 100%;
        // max-width: 100px;
        display: flex;
        // justify-content: space-between;
        .left {
          // padding-left: 20px;
          // margin: 0 auto;
          margin: 20px;
          .el-avatar {
            width: 100px;
            height: 100px;
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
          cursor: pointer;
          text-align: center;
          width: 20px;
          height: 20px;
          margin-left: 120px;
        }
        .more:hover {
          background-color: #f0f0f0;
        }
      }
    }
    .account_manage,
    .pwd,
    .email {
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      padding-right: 25px;
    }
    // .account_manage:hover, .pwd:hover, .email:hover{
    //   background-color: #f0f0f0;
    // }
    .cancel {
      cursor: pointer;
      text-align: center;
      color: red;
    }
  }
}
</style>
