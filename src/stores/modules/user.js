import { defineStore } from 'pinia'
import { ref } from 'vue'

// 用户模块
export const useUserStore = defineStore(
  'chat-user',
  () => {
    // 用户登录  -- token
    const token = ref('')
    // 账号token
    const accountToken = ref('')
    const setToken = (newToken) => {
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }

    const setAccountToken = (newToken) => {
      accountToken.value = newToken
    }
    const removeAccountToken = () => {
      accountToken.value = ''
    }

    // 记住我 相关
    // 是否勾选
    // true - 是
    // false -否
    const remember = ref(false)
    // 是 - 存储用户登录信息到本地
    // 否 - 空
    const user = ref({})
    const setRemember = (value) => {
      // console.log('setRemember' + value)
      remember.value = value
    }
    const setUser = (obj) => {
      user.value = obj
    }

    // 用户信息
    const userInfo = ref({})
    const setUserInfo = (obj) => {
      userInfo.value = obj
    }

    // 账号信息
    const accountInfo = ref({})
    const setAccountInfo = (obj) => {
      console.log(obj)
      accountInfo.value = obj
    }

    // 账号登出
    const logoutAccount = () => {
      accountInfo.value = {}
      accountToken.value = ''
      token.value = ''
    }
    return {
      token,
      remember,
      user,
      accountToken,
      userInfo,
      accountInfo,
      setToken,
      removeToken,
      setAccountToken,
      removeAccountToken,
      setRemember,
      setUser,
      setUserInfo,
      setAccountInfo,
      logoutAccount
    }
  },
  {
    persist: true // 持久化
  }
)
