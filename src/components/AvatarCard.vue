<script setup>
defineProps({
  member: Object,
  isFriend: Boolean
})
</script>

<template>
  <el-popover placement="right" trigger="click" width="450px">
    <template #reference>
      <!-- 需修改 TODO -->
      <div class="member-item">
        <el-avatar
          shape="square"
          :src="member.friend_info?.avatar || member.avatar"
          class="member-avatar"
        />
        <div class="member-name">
          {{ member?.friend_info?.name || member.name }}
        </div>
      </div>
    </template>
    <div class="user-info">
      <user-card
        :userInfo="member"
        :isFriend="isFriend"
        style="padding: 10px"
      ></user-card>
    </div>
  </el-popover>
</template>

<style lang="scss" scoped>
.member-item {
  margin: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .member-avatar {
    margin-bottom: 8px;
    // transition: transform 0.3s;
    cursor: pointer;
  }
  // .member-avatar:hover{
  //   transform: scale(1.1);
  // }
  .member-name {
    width: 55px;
    text-align: center;
    font-size: 13px;
    color: #606266;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 5px;
  }
}
</style>
