import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(persist)

export default pinia

// 接收并导出所有模块
export * from './modules/user'
export * from './modules/chat'
