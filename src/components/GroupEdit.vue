<script setup>
import { ref } from 'vue'
import { updateGroupInfoService } from '@/api/group.js'
import { useGroupStore } from '@/stores'
const groupStore = useGroupStore()

// const groupInfoEdit = ref(true)
const groupInfoEdit = ref(false)
// 修改群聊信息（在这里改（子组件）？？）
const groupInfo = {
  avatar: '',
  account_id: '',
  name: '',
  description: ''
}
const formData = ref({ ...groupInfo })
// const group_name = ref(groupStore.groupInfo.group_info.name)
// const description = ref(groupStore.groupInfo.group_info.description)
const imgUrl = ref('')
// emit传给父组件
const emit = defineEmits(['submit'])
// 提交表单
const onSubmit = () => {
  // console.log(formData.value)
  // if (formData.value) {
  //   console.log(11)
  // }
  // 判断是否为空 正则 TODO:
  emit('submit', {
    ...formData.value
    // index: currentIndex.value
  })
  // console.log(formData.value)
  // 提交表单时关闭对话框
  groupInfoEdit.value = false
}
// const fd = new FormData()
// const updateGroupInfo = async () => {
//   groupInfoEdit.value = false
//   // 参数 对 or 错 ？？
//   fd.append('relation_id', groupStore.groupInfo.group_info.relation_id)
//   // fd.append('name', group_name)
//   // fd.append('description', description)
//   fd.append('avatar', '')
//   const res = await updateGroupInfoService(fd)
//   console.log(res)
//   ElMessage.success('修改成功')
// }
// const open = () => {
//   groupInfoEdit.value = true
// }
const open = (obj) => {
  console.log(obj.row)
  // formData.value = { ...obj.row }
  // imgUrl.value = formData.value.avatar
  // 调用open的同时打开对话框
  console.log(imgUrl.value)
  groupInfoEdit.value = true
}
defineExpose({
  open
})
</script>

<template>
  <el-dialog
    v-model="groupInfoEdit"
    title="设置群聊信息"
    width="500"
    class="dialog"
  >
    <el-form :model="formData">
      <el-upload
        class="avatar-uploader"
        :auto-upload="false"
        :show-file-list="false"
        @change="onUploadFile"
      >
        <img :src="imgUrl" class="avatar" />
      </el-upload>
      <el-form-item label="群聊名称">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="群描述">
        <el-input v-model="formData.description"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="groupInfoEdit = false">取消</el-button>
        <el-button type="primary" @click="onSubmit"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.dialog {
  .avatar-uploader {
    :deep() {
      .avatar {
        width: 178px;
        height: 178px;
        display: block;
      }
      .el-upload {
        border: 1px dashed var(--el-border-color);
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration-fast);
        margin-bottom: 15px;
      }
      .el-upload:hover {
        border-color: var(--el-color-primary);
      }
      .el-icon.avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        text-align: center;
      }
    }
  }
}
</style>
