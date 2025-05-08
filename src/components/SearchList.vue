<!-- 搜索列表  - 没写-->
<script setup></script>

<template>
  <div class="box">
    <div class="list-item">
      <div class="left">
        <el-badge class="item" :value="0" :hidden="true">
          <div class="avatar">
            <el-avatar
              shape="square"
              src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
            ></el-avatar>
          </div>
        </el-badge>
      </div>
      <div class="right">
        <div class="top">
          <span class="name">张三</span>
        </div>
        <span class="message">包含搜索信息</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.box {
  width: 215px;
  .list-item {
    cursor: pointer;
    height: 60px;
    // border: 1px solid #000;
    display: flex;
    align-items: center;
    padding-top: 5px;
    .left {
      margin: 0 10px;
    }
    .right {
      width: 150px;
      height: 60px;
      display: flex;
      padding: 0 6px;
      padding-right: 10px;
      flex-direction: column;
      justify-content: space-between;
      // align-items: center;
      .top {
        display: flex;
        justify-content: space-between;
      }
      .name {
        font-size: 16px;
      }
      .time_now {
        font-size: 12px;
        color: #c4c4c4;
      }
      .message {
        width: 120px;
        font-size: 12px;
        margin-bottom: 10px;
        color: #c4c4c4;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .list-item:hover {
    background-color: #f0f0f0;
    // background-color: #e9e9e9; 点击后颜色
  }
}
</style>
