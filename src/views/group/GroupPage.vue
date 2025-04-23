<!-- 作用: 群聊页面 -->
<script setup>
import { ref, watch } from 'vue'
import GroupDetail from './GroupDetail.vue'
import GroupList from './GroupList.vue'
import { useGroupStore } from '@/stores'
import { useRoute } from 'vue-router'

const groupStore = useGroupStore()

const route = useRoute()

// 群聊信息
const groupInfo = ref(groupStore.groupInfo)
const groupShow = ref(false)
const getGroupInfo = (obj) => {
  groupInfo.value = obj
  console.log(groupInfo.value)
}
if (route.query.relation_id) {
  groupShow.value = true
}
watch(
  () => route.query.relation_id,
  (newId) => {
    groupShow.value = true
    groupInfo.value = groupStore.groupInfo
    console.log(newId)
  }
)
watch(
  () => groupInfo.value,
  (newVal) => {
    console.log(newVal)
    groupInfo.value = newVal
    groupStore.setGroupInfo(newVal)
  }
)
</script>

<template>
  <el-container>
    <group-list @get-group-info="getGroupInfo"></group-list>
    <el-main>
      <group-detail v-if="groupShow" :groupInfo="groupInfo"></group-detail>
    </el-main>
  </el-container>
</template>

<style lang="scss" scoped>
.el-container {
  height: 94vh;
}
</style>
