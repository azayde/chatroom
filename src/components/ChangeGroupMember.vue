<!-- 添加新成员 -->
<script setup>
import { ref, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
// import { getFriendListService } from '@/api/friend.js'
import { inviteMemberService } from '@/api/group.js'
import { useGroupStore } from '@/stores'
const groupStore = useGroupStore()
defineProps({
  friendList: Array
})
// 搜索框
const input = ref('')
// 搜索列表切换
const IsSearch = ref(false)
const handleFocus = () => {
  IsSearch.value = true
  // if (input.value) {
  //   searchFriendByName(input.value)
  //   console.log(11)
  // }
}
const handleBlue = async () => {
  // 输入框为空 且 失焦 切换
  if (!input.value) {
    IsSearch.value = false
  }
  // 查询
  console.log(22)
  // const res = await searchFriendByName(input.value)
  // console.log(res)
}
watch(input, () => {
  // 一直搜索吗？？ TODO:
  console.log(11)
  // searchFriendByName(input.value)
})
const checked = ref([])
const inviteFriend = ref(false)
// const friendList = ref([])
// const getFriendList = async () => {
//   const res = await getFriendListService()
//   console.log(res.data.data)
//   friendList.value = res.data.data.list
// }
// getFriendList()
const handleSelect = (item) => {
  console.log(item)
  console.log(checked.value)
}
const addMember = async () => {
  const res = await inviteMemberService({
    account_id: checked.value,
    relation_id: groupStore.groupInfo.relation_id
  })
  console.log(res)
  inviteFriend.value = false
}
const open = () => {
  inviteFriend.value = true
}
defineExpose({
  open
})
</script>

<template>
  <el-dialog class="invite-friend" v-model="inviteFriend" title="邀请好友">
    <div class="member">
      <div class="friend">
        <el-header>
          <el-input
            v-model="input"
            :prefix-icon="Search"
            placeholder="搜索"
            class="search"
            @focus="handleFocus"
            @blur="handleBlue"
          >
          </el-input>
        </el-header>
        <el-main v-if="!IsSearch" class="list">
          <el-scrollbar>
            <el-checkbox-group v-model="checked" text-color="#fff">
              <el-checkbox
                class="check"
                v-for="item in friendList"
                :key="item.friend_info.account_id"
                :label="item.friend_info.account_id"
                size="large"
                @change="handleSelect(item)"
              >
                <div class="list-item">
                  <div class="avatar">
                    <el-avatar
                      shape="square"
                      :src="item.friend_info.avatar"
                    ></el-avatar>
                  </div>
                  <span class="name">{{ item.friend_info.name }}</span>
                </div>
              </el-checkbox>
            </el-checkbox-group>
          </el-scrollbar>
        </el-main>
        <!-- 搜索结果列表 -->
        <el-main v-else> <search-list></search-list> </el-main>
      </div>

      <div class="line"></div>
      <div class="select">123</div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="inviteFriend = false">取消</el-button>
        <el-button type="primary" @click="addMember"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.invite-friend {
  height: 387px;
}
.member {
  display: flex;
  // flex-direction: column;
  .friend {
    width: 45%;
    display: flex;
    flex-direction: column;
  }
  .el-header {
    height: 45px;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    .el-input {
      width: 90%;
      height: 25px;
    }
    .el-button {
      width: 10px;
    }
  }
  .el-main {
    .check {
      width: 90%;
      cursor: pointer;
      height: 60px;
      padding-top: 5px;
    }
    .list-item {
      display: flex;
      align-items: center;
      .avatar {
        margin: 0 10px;
      }
      .name {
        font-size: 16px;
      }
    }
  }
  .line {
    border-left: 1px solid #000;
    height: 387px;
  }
}
</style>
