<script setup>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { reactive, ref } from 'vue'

// 为什么 TODO ???? ？？？ 富文本样式
const data = reactive({
  content: '',
  editorOption: {
    modules: {
      toolbar: null
    }
  }
})
const quillRef = ref(null)
const clearContent = () => {
  data.content = ''
  if (quillRef.value) {
    const quill = quillRef.value.getQuill()
    quill.root.innerHTML = ''
  }
}
defineExpose({
  getContent: () => data.content,
  clearContent
})
</script>

<template>
  <div class="input-editor">
    <quill-editor
      ref="quillRef"
      nextTick
      theme="snow"
      v-model:content="data.content"
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
