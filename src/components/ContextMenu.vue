<script setup>
import { ref } from 'vue'
// 传过来对应的消息
</script>

<template>
  <div class="context-menu">
    <div class="btn copy">复制</div>
    <div class="btn reply">引用</div>
    <div class="btn top">置顶</div>
    <div class="btn pin">pin</div>
    <div class="btn delete">删除</div>
  </div>
</template>

<style lang="scss" scoped>
.context-menu {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  // margin: 10px;
  .btn {
    padding: 5px 20px;
  }
  .btn:hover {
    background-color: #e2e2e2;
  }
}
</style>
