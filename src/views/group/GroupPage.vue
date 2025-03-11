<!-- 作用: 群聊页面 -->
<script setup>
import { ref } from 'vue'
import GroupDetail from './GroupDetail.vue'
import GroupList from './GroupList.vue'

// 群聊信息
const groupInfo = ref()
const getGroupInfo = (obj) => {
  groupInfo.value = obj
  console.log(obj)
}
</script>

<template>
  <el-container>
    <group-list @get-group-info="getGroupInfo"></group-list>
    <el-main>
      <group-detail v-if="groupInfo" :groupInfo="groupInfo"></group-detail>
    </el-main>
  </el-container>
</template>

<style lang="scss" scoped>
.el-container {
  height: 94vh;
}
</style>
