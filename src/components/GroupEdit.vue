<script setup>
import { ref } from 'vue'
import { updateGroupInfoService } from '@/api/group.js'
import { useGroupStore } from '@/stores'
const groupStore = useGroupStore()

const groupInfoEdit = ref(false)
// 修改群聊信息（在这里改（子组件）？？）
const group_name = ref(groupStore.groupInfo.group_info.name)
const description = ref(groupStore.groupInfo.group_info.description)
const imgUrl = ref('')
const fd = new FormData()
const updateGroupInfo = async () => {
  groupInfoEdit.value = false
  // 参数 对 or 错 ？？
  fd.append('relation_id', groupStore.groupInfo.group_info.relation_id)
  fd.append('name', group_name)
  fd.append('description', description)
  fd.append('avatar', '')
  const res = await updateGroupInfoService(fd)
  console.log(res)
  ElMessage.success('修改成功')
}
const open = () => {
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
    <el-form>
      <el-upload
        class="avatar-uploader"
        :auto-upload="false"
        :show-file-list="false"
      >
        <img v-if="imgUrl" :src="imgUrl" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon">
          <Plus />
        </el-icon>
      </el-upload>
      <el-form-item label="群聊名称">
        <el-input v-model="group_name"></el-input>
      </el-form-item>
      <el-form-item label="群描述">
        <el-input v-model="description"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="groupInfoEdit = false">取消</el-button>
        <el-button type="primary" @click="updateGroupInfo"> 确定 </el-button>
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
