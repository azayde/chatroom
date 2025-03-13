<script setup>
// import { useRouter } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'

import AccountList from '@/views/account/AccountList.vue'

import {
  sendEmailService,
  userRegisterService,
  userLoginService,
  getAccountService
} from '@/api/user.js'

import { useUserStore } from '@/stores'
// 路由
// const router = useRouter()
// 仓库 - 用户
const userStore = useUserStore()
// 登录用户后 登录账号
const IsAccountLogin = ref(false)

// 账号信息
const accountInfo = ref([
  // {
  //   id: 1,
  //   name: '成员1',
  //   avatar:
  //     'https://img2.baidu.com/it/u=55345731,784172631&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500',
  //   gender: '男',
  //   signature: '我想了一个好主意！'
  // },
  // {
  //   id: 2,
  //   name: '成员2',
  //   avatar:
  //     'https://q1.itc.cn/q_70/images03/20241212/702ee264f5aa44a3aec02043acf3a694.jpeg',
  //   gender: '男',
  //   signature: '我想了一个好主意！'
  // }
])

// 进入账号页面 调用这个函数
// const getAccount = async () => {
//   const res = await getAccountService()
//   accountInfo.value = res.data.list
// }
// getAccount()

const form = ref()
// 是否是注册
const isRegister = ref(false)
// 记住我
const rememberCheck = ref(false)
// 免密登录
const freeCheck = ref(false)
// 表单内容
const formModel = ref({
  email: '',
  password: '',
  repassword: '',
  code: ''
})
// 表单的验证规则
const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: '请输入正确的邮箱地址',
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15位的非空字符',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15位的非空字符',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}

// 总秒数
const totalSecond = 60
// 当前秒数
const seconds = ref(60)
let timer = null // 定时器

// 获取验证码
const getCode = async () => {
  // 当前没有定时器开着，并且当前秒数等于总秒数
  if (!timer && seconds.value === totalSecond) {
    console.log(typeof formModel.value.email)
    // 发送请求获取验证码
    // await sendEmailService(formModel.value.email)
    const res = await sendEmailService(formModel.value)
    // const res = 'WqrpRu'
    console.log(res)
    // 开启倒计时
    timer = setInterval(() => {
      seconds.value--
      if (seconds.value <= 0) {
        clearInterval(timer)
        timer = null
        seconds.value = totalSecond
      }
    }, 1000)
  }
  // console.log('获取验证码')
}

// 点击注册
const register = async () => {
  await form.value.validate()
  console.log(formModel.value)

  // TODO: 注册逻辑
  await userRegisterService(formModel.value)
  ElMessage.success('注册成功')
  isRegister.value = false
}

// 记住我
if (isRegister.value === false) {
  // 读取 store 是否记住我
  if (userStore.remember) {
    // 自动勾选
    rememberCheck.value = userStore.remember
    // 登录自动填充账号密码
    formModel.value = userStore.user
  }
}

// 7天免密登录
// TODO: 7天免密登录功能
// token 7 天不过期 - 直接跳转
// 使用refreshToken做

// 点击登录
const login = async () => {
  await form.value.validate()
  console.log(formModel.value)

  console.log('点击登录')
  // TODO: 登录逻辑
  // const res = await userLoginService(formModel.value)
  // console.log(res.data.data.token.access_token)
  // userStore.setToken(res.data.data.token.access_token)
  // data.data.token.refresh_token
  // data.data.token.access_token
  // 是否记得账号密码（记住我）
  if (rememberCheck.value) {
    // 是 - 勾选记住我 - 存进store - 本地存储
    userStore.setRemember(true)
    // 信息存到本地
    userStore.setUser(formModel.value)
  } else {
    // 否
    userStore.setRemember(false)
    userStore.setUser({})
  }

  // 登录账号
  IsAccountLogin.value = true
  // getAccount()

  // 获取账号token 登录 TODO:
  // accountList.vue(已实现)

  // ElMessage.success('登录成功')
  // 跳转
  // router.push('/')
}

// 切换的时候，需要重置表单内容
watch(isRegister, () => {
  formModel.value = {
    email: '',
    password: '',
    repassword: '',
    code: ''
  }
})
</script>
<template>
  <el-row class="login-page">
    <el-col :span="6" :offset="9" class="form" v-if="!IsAccountLogin">
      <!-- 注册 -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        class="register"
        v-if="isRegister"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item class="email" prop="email">
          <el-input
            v-model="formModel.email"
            :prefix-icon="User"
            placeholder="请输入邮箱"
            type="email"
          ></el-input>
        </el-form-item>
        <el-form-item class="password" prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            placeholder="请输入密码"
            type="password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item class="password" prop="repassword">
          <el-input
            v-model="formModel.repassword"
            :prefix-icon="Lock"
            placeholder="请再次输入密码"
            type="password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item class="code" prop="code">
          <el-input
            v-model="formModel.code"
            :prefix-icon="Lock"
            placeholder="请输入验证码"
            class="input-code"
          >
          </el-input>
          <el-button @click="getCode" text bg class="btn">{{
            seconds === totalSecond ? '获取验证码' : seconds + 's后重新发送'
          }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="register"
            style="width: 100%"
            auto-insert-space
            type="primary"
            >注册</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>

      <!-- 登录 -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        class="login"
        v-else
      >
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item class="email" prop="email">
          <el-input
            v-model="formModel.email"
            :prefix-icon="User"
            placeholder="请输入邮箱"
            type="email"
          ></el-input>
        </el-form-item>
        <el-form-item class="password" prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            placeholder="请输入密码"
            type="password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <el-checkbox v-model="rememberCheck">记住我</el-checkbox>
          <el-checkbox v-model="freeCheck">7天免密登录</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="login"
            style="width: 100%"
            auto-insert-space
            type="primary"
            >登录</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-link type="info" :underline="false" @click="isRegister = true">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>

    <el-col :span="6" :offset="9" class="account" v-else>
      <account-list :account="accountInfo"></account-list>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;

  display: flex;
  flex-direction: column;
  .form {
    margin-top: 100px;
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    // position: absolute;
    .el-form-item {
      margin: 30px 0;
    }
    .input-code {
      padding-right: 110px;
    }
    .btn {
      // 发送验证码的按钮
      width: 105px;
      position: absolute;
      right: 3px;
      top: 50%;
      transform: translateY(-50%); // 垂直居中
      z-index: 2;
    }
    // .login{
    //     .flex {
    //       width: 100%;
    //       display: flex;
    //       justify-content: space-between;
    //   }
    // }
  }
  .account {
    margin-top: 100px;
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
}
</style>
