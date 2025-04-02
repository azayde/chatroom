// import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import axios from 'axios'
// import { ElMessage } from 'element-plus'
// const router = useRouter()

// const baseURL = 'http://10.8.233.204:8080'
const baseURL = 'http://192.168.3.34:8000/api'
// const baseURL = 'http://127.0.0.1:8080'

const userStore = useUserStore()

const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 100000
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const urlPath = config.url
    const userTokenPaths = [
      '/account/create',
      '/account/token',
      '/account/infos/account',
      '/account/update',
      '/account/delete'
    ]

    // 判断使用哪种token
    const useUserToken = userTokenPaths.some((path) => urlPath.includes(path))
    const token = useUserToken ? userStore.token : userStore.accountToken
    // TODO 2. 携带token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (err) => Promise.reject(err)
)

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    // TODO 3. 处理业务失败
    // TODO 4. 摘取核心响应数据
    console.log(res)
    return res
  },
  (err) => {
    // TODO 5. 处理401错误
    // 401 -token过期 => 拦截到登录
    // if (err.response?.state === 401) {
    //   router.push('/login')
    // }
    // 错误的默认情况
    console.log(err)
    // ElMessage.error(err)
    return Promise.reject(err)
  }
)

export default instance
