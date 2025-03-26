<!-- eslint-disable no-unused-vars -->
<script setup>
import '@/assets/main.scss'
import { createWebSocket } from '@/utils/websocket.js'
createWebSocket()
</script>

<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped></style>
