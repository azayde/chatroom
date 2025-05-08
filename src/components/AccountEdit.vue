<script setup>
import { ref } from 'vue'
// import { useUserStore } from '@/stores'
import { updateAvatarService } from '@/api/user.js'
// const useStore = useUserStore()
// 判断是否为修改账号
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
const rules = {
  name: [{ required: true, message: '请输入账号昵称', trigger: 'blur' }],
  signature: [{ required: true, message: '请输入个性签名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }]
}

// 表单数据
const formData = ref({ ...accountInfo })

// 接口传参要form-data
const imgUrl = ref('')
const fd = new FormData()
const onUploadFile = async (File) => {
  imgUrl.value = URL.createObjectURL(File.raw)
  fd.append('file', File.raw)
  // console.log(File)
}
const updateAvatar = async () => {
  for (let [key, value] of fd.entries()) {
    console.log(key, value)
  }
  console.log(imgUrl.value.startsWith('blob'))
  if (imgUrl.value.startsWith('blob')) {
    console.log('头像')
    const res = await updateAvatarService(fd)
    console.log(res)
    formData.value.avatar = res.data.data.url
  }
}
// emit 传给父组件
const emit = defineEmits(['submit'])

const formRef = ref(null)
// 提交表单
const onSubmit = async () => {
  await updateAvatar()
  // 判断是否为空
  formRef.value.validate((valid) => {
    if (valid) {
      emit('submit', {
        ...formData.value
      })

      // 提交表单时关闭对话框
      accountEditForm.value = false
      // for (const key of formData.value.keys()) {
      //   formData.value.delete(key)
      // }
    } else {
      ElMessage.warning('请先完善信息，再点击确定')
    }
  })
}
// 传给父组件的方法
const open = (obj) => {
  if (obj.row) {
    // 修改
    // console.log(obj.row)
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
  console.log(imgUrl.value)
  accountEditForm.value = true
}

defineExpose({
  open,
  updateAvatar
})
</script>

<template>
  <el-dialog
    v-model="accountEditForm"
    :title="isEdit ? '修改账号信息' : '添加账号'"
    width="500"
    class="dialog"
  >
    <el-form :model="formData" :rules="rules" ref="formRef">
      <el-upload
        v-if="isEdit"
        class="avatar-uploader"
        :auto-upload="false"
        :show-file-list="false"
        @change="onUploadFile"
      >
        <img :src="imgUrl" class="avatar" />
      </el-upload>
      <el-form-item label="账号昵称" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="formData.gender">
          <el-radio value="男">男</el-radio>
          <el-radio value="女">女</el-radio>
          <el-radio value="未知">保密</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="个性签名" prop="signature">
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
