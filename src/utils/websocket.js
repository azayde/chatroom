// websocket 连接地址
// let wsUrl = 'ws://localhost:3000'
let wsUrl = 'ws://192.168.0.197:8000'
// let wsUrl = 'ws://192.168.0.197:8000/socket.io/?EIO=4&transport=websocket'

// websocket对象
let socket = null

// 请求重连 延迟请求
let rec

// 判断是否已经链接上
let isConnect = false
// 重新连接

// const token = '你的JWT Token' // 从登录接口获取
// socket = io('ws://192.168.0.197:8000:', {
//   path: '/socket.io/',
//   query: {
//     //将Token作为查询参数传递
//     token: token,
//     EIO: '4',
//     transport: 'websocket'
//   }
// })
let reConnect = () => {
  console.log('尝试重新连接')
  if (isConnect) return // 如果已经连接上了，不再重连
  rec && clearTimeout(rec)
  rec = setTimeout(() => {
    // 延迟5秒重连，避免频繁请求重连
    initWebSocket()
  }, 5000)
}

// 初始化websocket连接函数
let initWebSocket = () => {
  try {
    // 创建对象
    socket = new WebSocket(wsUrl)
    //
    socket.onmessage = (e) => {
      console.log('接收消息成功', e)
    }

    socket.onclose = (e) => {
      console.log('websocket连接关闭', e)
      isConnect = false // 连接关闭
    }

    socket.onopen = () => {
      console.log('websocket连接成功')
      isConnect = true // 连接成功
    }
  } catch (e) {
    console.log('尝试创建连接失败', e)
    reConnect()
  }
}

// 创建websocket
let createWebSocket = () => {
  // 如果已有websocket服务，关闭
  if (socket) socket.close()
  initWebSocket()
}

// 关闭websocket
let closeWebSocket = () => {
  socket.close()
}

export { createWebSocket, closeWebSocket }
