<script setup>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { reactive, ref, toRaw } from 'vue'

const data = reactive({
  content: '',
  editorOption: {
    modules: {
      toolbar: null
    }
  }
})
const quillRef = ref(null)

// 记住上次聚焦的位置
const index = ref(0)
const updateLength = () => {
  const quill = toRaw(quillRef.value).getQuill()
  if (quill.getSelection()) {
    index.value = quill.getSelection().index
  }
  // console.log(index.value)
}

const setValue = () => {
  // const text = toRaw(quillRef.value).getHTML()
  // console.log(text)
  // emit('updateValue', text)
  updateLength()
}
// 处理emoji表情  向外导出
const emojiHandle = (val) => {
  const url = val
  if (url) {
    const quill = toRaw(quillRef.value).getQuill()
    const length = index.value
    quill.insertEmbed(length, 'image', url)
    quill.setSelection(length + 1)
    index.value = length + 1
  }
}

const clearContent = () => {
  data.content = ''
  if (quillRef.value) {
    const quill = quillRef.value.getQuill()
    quill.root.innerHTML = ''
  }
}
defineExpose({
  getContent: () => data.content,
  emojiHandle,
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
      @click="updateLength"
      @update:content="setValue()"
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
