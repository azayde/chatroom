<!-- 作用: 群聊页面 -->
<script setup>
import { ref, watch } from 'vue'
import GroupDetail from './GroupDetail.vue'
import GroupList from './GroupList.vue'
import { useGroupStore } from '@/stores'
import { useRoute } from 'vue-router'

const groupStore = useGroupStore()
// console.log()
const route = useRoute()
// groupStore.setGroupInfo({
//   relation_id: 22,
//   relation_type: 'group',
//   is_show: true,
//   pin_time: '2025-03-10T15:00:00',
//   last_show: '2025-03-11T10:00:00',
//   group_info: {
//     relation_id: 1010,
//     name: '低代码开发平台',
//     description: '探索低代码/零代码开发',
//     avatar: 'https://pic.616pic.com/ys_bnew_img/00/02/01/VafZfftlPM.jpg'
//   }
// })
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
