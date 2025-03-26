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
let wsurl = 'ws://192.168.0.197:8000/chat'

// let isConnect = false
// 这个token目前是注册账号时返回的token
const token =
  'v2.local.IkHpwHaqMynwGanhU4rUZ3np5GpilU3K_Dq-K3oAdqLrbQncz2RlIeSNTy76_VfxSg4uGafmWb88EGtA_T7YjnPq6l3mVsB_qh9jBchs7dsv8E9DO24oQlkJKR_-7LIgZVNI6mbyVLQB3igzfWNqiRk13IvIoIyg3ZzVB1LpOS8irpDSvLhLSd9loJ54L04bPAQwsNW9I99m8gOiHy8u2DUcrQ-tWk3i_XhT8qZUudTJ6VCfejWgCoS-79OUwZOKKNm2uMZrwM9TrGMd3O5w1LK2iahtfGPaPBkwbRWfAaA6CRPSF4w3bAB50BCYs0UShLHj84UOYV2f4-E.bnVsbA'
// 初始化websocket
let initWebSocket = () => {
  try {
    console.log('初始化WebSocket')
    socket = io(wsurl)
    socket.on('connect', (e) => {
      console.log('Connect:', socket.id)
      console.log('链接成功', e)
      isConnect = true
      // accountToken认证
      socket.emit('auth', token)
    })

    // 一串串，暂时不知道放哪儿
    socket.on('read_msg', (e) => {
      console.log('read_msg', e)
    })
    socket.on('send_msg', (e) => {
      console.log('send_msg', e)
    })
    socket.on('test', (e) => {
      console.log('test', e)
    })
    // 以上

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

// 接收消息
function onMessage(data) {
  console.log(data)
}
// 关闭链接函数
let closeWebSocket = () => {
  socket.disconnect()
}
export { createWebSocket, onMessage, closeWebSocket }
