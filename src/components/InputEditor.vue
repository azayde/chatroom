<script setup>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { reactive, ref } from 'vue'
const content = ref('')

// 为什么 TODO ???? ？？？ 富文本样式
const data = reactive({
  content: '',
  editorOption: {
    modules: {
      toolbar: null
    }
  }
})
</script>

<template>
  <div class="input-editor">
    <quill-editor
      nextTick
      theme="snow"
      v-model:content="content"
      :options="data.editorOption"
      content-type="html"
    >
    </quill-editor>
  </div>
</template>

<style lang="scss" scoped>
.input-editor {
  width: 100%;
  height: 100%;
}
:deep(.ql-container) {
  border: none;
  .ql-editor {
    width: 100%;
    height: 100%;
    font-size: 18px;
  }
}
</style>
