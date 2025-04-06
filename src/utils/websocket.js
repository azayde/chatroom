import io from 'socket.io-client'

// WebSocket对象
let socket = null

// 链接状态标识，避免重复链接
let isConnect = false

// 延迟请求代码 的存储变量
let rec
// 重连函数
let reConnect = () => {
  console.log('尝试重新连接')
  if (isConnect) return
  rec && clearTimeout(rec)
  rec = setTimeout(() => {
    initWebSocket()
  }, 5000)
}

// WebSocket链接地址
let wsurl = 'ws://192.168.3.34:8000/chat'

// let isConnect = false
// 这个token目前是注册账号时返回的token
import { useUserStore } from '@/stores'

let token = ''
// 初始化websocket
let initWebSocket = () => {
  // 如果 userStore 放到函数外面，则会报错，原因：
  // 在 websocket.js 中，模块加载时立即调用 useUserStore()，而此时 Vue 应用尚未挂载，Pinia 未完成初始化，导致 Store 无法找到活跃的 Pinia 实例。
  // 解决：
  // 延迟 Store 的调用时机，确保在 Pinia 初始化完成后使用，
  // 将 useUserStore 的调用移到函数内部（如 initWebSocket），避免模块加载时立即执行
  const userStore = useUserStore()
  token = userStore.accountToken
  console.log(token)
  try {
    console.log('初始化WebSocket')
    socket = io(wsurl)
    // socket = io(wsurl, {
    //   query: {
    //     encoding: 'UTF-8'
    //   }
    // })
    socket.on('connect', (e) => {
      console.log('Connect:', socket.id)
      console.log('链接成功', e)
      isConnect = true
      // accountToken认证
      socket.emit('auth', token)
    })

    // socket.on('test', (e) => {
    //   console.log('test', e)
    // })
    // // 以上

    socket.on('disconnect', (e) => {
      console.log('链接关闭', e)
      isConnect = false // 表示链接断开
    })
  } catch (e) {
    console.log('尝试创建链接失败', e)
    reConnect()
  }
}
// 创建websocket
const createWebSocket = () => {
  if (socket) closeWebSocket()
  initWebSocket()
}

const sendMsg_socket = (msg) => {
  console.log('发消息')
  if (isConnect === false) {
    console.log('链接断开，不能发送消息')
    return
  }
  // const message = {
  //   relation_id: 24,
  //   msg_content: 'zzzzzz'
  // }
  // const msg = JSON.stringify(message)
  socket.emit('send_msg', msg, (res) => {
    console.log(res)
  })
}

// 接收消息
function onMessage() {
  socket.on('send_msg', (msg) => {
    console.log('收到消息:', msg) // 打印收到的消息
    return msg
  })
}
// 关闭链接函数
let closeWebSocket = () => {
  socket.disconnect()
}
export { createWebSocket, onMessage, closeWebSocket, sendMsg_socket }
