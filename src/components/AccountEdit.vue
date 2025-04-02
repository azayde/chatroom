<script setup>
import { ref } from 'vue'
// import { Plus } from '@element-plus/icons-vue'

// 默认头像
// const dafault_avatar =
//   'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
// 判断是否为修改账号
// const currentIndex = ref(-1)
const isEdit = ref(false)

// 对话框是否显示
const accountEditForm = ref(false)

const accountInfo = {
  avatar: '',
  name: '',
  account_id: '',
  gender: '',
  signature: ''
}
// 接口传参要form-data
const imgUrl = ref('')
const fd = new FormData()
fd.append('avatar', imgUrl)
const onUploadFile = (File) => {
  const img = URL.createObjectURL(File)
  console.log(img)
  console.log(File)
}
// emit 传给父组件
const emit = defineEmits(['submit'])
// 表单数据
const formData = ref({ ...accountInfo })

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
  accountEditForm.value = false
}
// 传给父组件的方法
const open = (obj) => {
  console.log(obj.row)
  if (obj.row) {
    // 修改
    formData.value = { ...obj.row }
    imgUrl.value = formData.value.avatar
    isEdit.value = true
    // console.log(formData.value)
  } else {
    formData.value = { ...accountInfo }
    imgUrl.value = ''
    isEdit.value = false
  }
  // 调用open的同时打开对话框
  // console.log(formData.value)
  console.log(imgUrl.value)
  accountEditForm.value = true
}

defineExpose({
  open
})
</script>

<template>
  <el-dialog
    v-model="accountEditForm"
    :title="isEdit ? '修改账号信息' : '添加账号'"
    width="500"
    class="dialog"
  >
    <el-form :model="formData">
      <el-upload
        v-if="isEdit"
        class="avatar-uploader"
        :auto-upload="false"
        :show-file-list="false"
        @change="onUploadFile"
      >
        <img :src="imgUrl" class="avatar" />
        <!-- <el-icon v-else class="avatar-uploader-icon">
          <Plus />
        </el-icon> -->
      </el-upload>
      <el-form-item label="账号昵称">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="formData.gender">
          <el-radio value="男">男</el-radio>
          <el-radio value="女">女</el-radio>
          <el-radio value="未知">保密</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="个性签名">
        <el-input v-model="formData.signature"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="accountEditForm = false">取消</el-button>
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
