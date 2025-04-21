<script setup>
import { ref } from 'vue'
import { emoTextList, textToImg } from '@/utils/emoji'
const props = defineProps({
  pos: Object
})
const emit = defineEmits(['getEmoji'])
const handelClick = (emoText) => {
  let idx = emoTextList.indexOf(emoText)
  let url = `/public/emoji/${idx}.gif`
  emit('getEmoji', url)
}
</script>

<template>
  <div
    class="emotion-box"
    :style="{ left: props.pos.x - 260 + 'px', top: props.pos.y - 280 + 'px' }"
  >
    <el-scrollbar style="height: 250px">
      <div class="emotion-item-list">
        <div
          class="emotion-item"
          v-for="(emoText, i) in emoTextList"
          :key="i"
          v-html="textToImg(emoText)"
          @click="handelClick(emoText)"
        ></div>
      </div>
    </el-scrollbar>
    <span class="span2"> </span>
    <span class="span1"> </span>
  </div>
</template>

<style lang="scss" scoped>
.emotion-box {
  position: fixed;
  width: 400px;
  box-sizing: border-box;
  padding: 5px;
  border: 1px solid #b3b3b3;
  border-radius: 5px;
  background-color: #f5f5f5;
  box-shadow: 0px 0px 10px #d9d9d9;
  .emotion-item-list {
    display: flex;
    flex-wrap: wrap;

    .emotion-item {
      width: 40px;
      height: 40px;
      text-align: center;
      cursor: pointer;
    }
  }
  .span2 {
    content: '';
    position: absolute;
    left: 185px;
    bottom: -30px;
    width: 0;
    height: 0;
    border-style: solid dashed dashed;
    border-color: #b3b3b3 transparent transparent;
    border-width: 15px;
  }
  .span1 {
    content: '';
    position: absolute;
    left: 185px;
    bottom: -29px;
    width: 0;
    height: 0;
    border-style: solid dashed dashed;
    border-color: #f5f5f5 transparent transparent;
    border-width: 15px;
  }
}
</style>
