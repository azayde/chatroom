// import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import axios from 'axios'
// import { ElMessage } from 'element-plus'
// const router = useRouter()

// const baseURL = 'http://10.8.233.204:8080'
const baseURL = 'http://192.168.0.198:8000/api'
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
    // TODO 2. 携带token
    if (userStore.token) {
      // config.headers.Authorization = `Bearer ${userStore.token}`
      // config.headers.AccountToken = `Bearer ${userStore.accountToken}`
      config.headers.Authorization = `Bearer ${userStore.accountToken}`
      // config.headers.Authorization = `Bearer v2.local.U8ciVgojLIlO7wZDF1jvj9g0tN8wXf5c2elxonOmBFn-o_OOn0JhGiZVjer66gCHF1AVuf92u3wJskyceyy1kJckl83r8LKW3XphPvPkyqWNZ82EMDlaBLBB8GEqFVNbbFuhIeac2cyOGV3dKsO-pOnrZvHubq84fmcCmbULHfpd11Reav5cRgm1MUrFVfoOoJlU2dvnPIv4E2kIYLAmc65oZY2fCc-lq9F6-BgOfsUesXWW49OPzy-ioouDRzaJ8aSyNxX6svfzuiLFF9RKmT2KepTERFwZ8KlbUlkeX55RWjM.bnVsbA`
      // config.headers.Authorization = `Bearer ${}`
      // config.headers.AuthorizationKey = userStore.token
      // console.log(userStore.token)
      // console.log(config)
      // 账号token TODO:
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
