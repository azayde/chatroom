<script setup>
import '@/assets/main.scss'
import { createWebSocket } from '@/utils/websocket.js'
import { useUserStore } from './stores'
const userStore = useUserStore()
createWebSocket()
document.addEventListener('contextmenu', (e) => {
  e.preventDefault()
})
document.title = '聊天室'

const body = document.querySelector('body')
body.style.backgroundColor = userStore.color
</script>

<template>
  <link
    rel="stylesheet"
    href="//at.alicdn.com/t/c/font_4877399_who3uzdgfa.css"
  />
  <div>
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped></style>
