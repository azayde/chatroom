<script setup>
import { ref, watch } from 'vue'
import { updatePinMsg, updateTopMsg, revokeMsgService } from '@/api/chat'
import { useChatStore } from '@/stores'
const chatStore = useChatStore()
// 传过来对应的消息
const props = defineProps({
  msg: Object
})
const activeMsg = ref()
watch(
  () => props.msg,
  (newVal) => {
    activeMsg.value = newVal
    // console.log(newVal)
  }
)
const emit = defineEmits([
  'reply-msg',
  'refresh-top',
  'refresh-pin',
  'refresh-revoke'
])
const isPin = ref(activeMsg.value?.is_pin || true)
const isTop = ref(activeMsg.value?.is_top || true)
// 引用
const handleReply = () => {
  console.log('引用')
  emit('reply-msg', props.msg)
}
// 置顶
const handleTop = async () => {
  console.log(isTop.value)
  const res = await updateTopMsg({
    id: activeMsg.value.id,
    relation_id: chatStore.chatInfo.relation_id,
    is_top: isTop.value
  })
  if (res.status === 200) {
    emit('refresh-top')
  }
  console.log(res)
}
// pin
const handlePin = async () => {
  console.log(isPin.value)
  const res = await updatePinMsg({
    id: activeMsg.value.id,
    relation_id: chatStore.chatInfo.relation_id,
    is_pin: isPin.value
  })
  if (res.status === 200) {
    console.log('pin更新')
    emit('refresh-pin')
  }
  console.log(res)
}
// 撤回
const handleRevoke = async () => {
  const res = await revokeMsgService({ id: activeMsg.value.id })
  if (res.status === 200) {
    emit('refresh-revoke')
  }
  console.log(res)
}
</script>

<template>
  <div class="context-menu">
    <div class="btn copy">复制</div>
    <div class="btn reply" @click="handleReply">引用</div>
    <div class="btn top" @click="handleTop">置顶</div>
    <div class="btn pin" @click="handlePin">pin</div>
    <div class="btn delete" @click="handleRevoke">撤回</div>
  </div>
</template>

<style lang="scss" scoped>
.context-menu {
  z-index: 3000;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  // margin: 10px;
  .btn {
    padding: 5px 20px;
    cursor: pointer;
  }
  .btn:hover {
    background-color: #e2e2e2;
  }
}
</style>
