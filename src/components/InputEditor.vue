<script setup>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { reactive, ref, toRaw } from 'vue'
import { Close } from '@element-plus/icons-vue'

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
const reply_msg = ref(null)
const relpyHtml = (obj) => {
  reply_msg.value = obj
  // const replyMsg = `
  //   <span style="color:#797979; background-color: #e8e8e8;">${obj.name}:${obj.msg_content}</span>
  //   <div><br></div>
  // `
  // const quill = toRaw(quillRef.value).getQuill()
  // const position = quill.getSelection()?.index || 0

  // // 插入内容
  // quill.clipboard.dangerouslyPasteHTML(position, replyMsg)

  // // 设置光标位置到引用下方
  // quill.setSelection(position + replyMsg.length)
}

// 清除富文本框
const clearContent = () => {
  reply_msg.value = null
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
const emit = defineEmits(['keydown'])
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
      @keydown="(e) => emit('keydown', e)"
    >
    </quill-editor>
  </div>
  <div v-show="reply_msg">
    <div class="reply_msg">
      {{ reply_msg?.name }}: {{ reply_msg?.msg_content }}
      <el-icon class="icon" @click="reply_msg = null"><Close /></el-icon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.input-editor {
  width: 100%;
  height: 100%;
}
.reply_msg {
  display: inline-block;
  margin-left: 10px;
  padding: 5px;
  color: #797979;
  background-color: #e8e8e8;
  max-width: 80%; // 限制最大宽度，避免过长
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  .icon {
    position: relative;
    font-size: 14px;
    cursor: pointer;
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
