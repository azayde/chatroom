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

// 引用样式
const relpyHtml = (obj) => {
  const replyMsg = `
    <span style="color:#797979; background-color: #e8e8e8;">${obj.name}:${obj.msg_content}</span>
    <div><br></div>
  `
  const quill = toRaw(quillRef.value).getQuill()
  const position = quill.getSelection()?.index || 0

  // 插入内容
  quill.clipboard.dangerouslyPasteHTML(position, replyMsg)

  // 设置光标位置到引用下方
  quill.setSelection(position + replyMsg.length)
}

// 清除富文本框
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
  relpyHtml,
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
:deep(.ql-editor) {
  .reply_msg {
    &::before {
      content: '>';
      color: #409eff;
      position: absolute;
      left: -12px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
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
