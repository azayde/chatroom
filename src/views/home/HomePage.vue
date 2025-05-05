<script setup>
import { computed } from 'vue'
import ChatList from '@/views/chat/ChatList.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isHome = computed(() => {
  return route.path === '/chat'
})
</script>

<template>
  <!-- 列表 -->
  <div>
    <el-container class="home-page">
      <chat-list v-if="isHome"></chat-list>
      <el-main v-else>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  height: 94vh;
  background-color: #f8f8f8;
}
</style>
