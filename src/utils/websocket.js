// websocket 连接地址
let wsUrl = 'ws://localhost:3000'

// websocket对象
let socket = null

// 请求重连 延迟请求
let rec
// 重新连接
let reConnect = () => {
  console.log('尝试重新连接')
  rec && clearTimeout(rec)
  rec = setTimeout(() => {
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
    }

    socket.onopen = () => {
      console.log('websocket连接成功')
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
