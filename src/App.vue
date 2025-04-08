<script setup>
import '@/assets/main.scss'
import { createWebSocket } from '@/utils/websocket.js'
createWebSocket()
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
