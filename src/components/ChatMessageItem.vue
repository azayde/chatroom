<!-- 聊天窗 -->
<script setup>
import { transform } from '@/utils/emoji'
import { useUserStore } from '@/stores'
const userStore = useUserStore()
const props = defineProps({
  msgInfo: Object,
  headImage: String,
  name: String
})
// 右键菜单
const emit = defineEmits(['setContextMenu'])
const handleRightClick = (e) => {
  let obj = {
    clientX: e.clientX,
    clientY: e.clientY,
    msg: props.msgInfo
  }
  emit('setContextMenu', obj)
}
</script>

<template>
  <div class="chat-msg-item">
    <div class="chat-system" v-show="msgInfo.notify_type === 'system'">
      {{ msgInfo.msg_content }}
    </div>
    <div
      v-show="msgInfo.notify_type === 'common'"
      class="chat-item"
      :class="{
        left: props.msgInfo.account_id !== userStore.accountInfo.account_id,
        right: props.msgInfo.account_id === userStore.accountInfo.account_id
      }"
      v-if="!props.msgInfo?.is_revoke"
    >
      <div class="user-avatar">
        <el-avatar shape="square" :src="props.headImage"></el-avatar>
      </div>
      <div class="ri_pao">
        <div class="name" v-if="props.name !== userStore.accountInfo.name">
          {{ props.name === userStore.accountInfo.name ? '' : props.name }}
        </div>
        <div
          class="chat-pao"
          v-show="props.msgInfo.msg_type === 'text'"
          @contextmenu="handleRightClick($event)"
          v-html="transform(props.msgInfo.msg_content)"
        ></div>
        <div
          class="picture"
          v-show="props.msgInfo.msg_type === 'file'"
          @contextmenu="handleRightClick($event)"
        >
          <img class="img" :src="props.msgInfo.msg_content" alt="" />
        </div>
      </div>

      <!-- <div class="file">
      <el-link href="https://element-plus.org" :underline="false">
        <div class="item">
          <div class="right">
            <span class="file_name">文件1</span>
            <span class="file_size">1090024</span>
          </div>
          <i class="iconfont icon-pdf pdf"></i>
        </div>
      </el-link>
    </div> -->
    </div>
    <div class="chat-system" v-else>
      {{
        props.msgInfo.account_id !== userStore.accountInfo.account_id
          ? `${props.name}撤回了一条消息`
          : '你撤回了一条消息'
      }}
    </div>
  </div>
</template>
<style lang="scss" scoped>
.chat-msg-item {
  .chat-system {
    line-height: 50px;
    text-align: center;
    color: #b8b5b5;
  }
  .chat-item {
    display: flex;
    align-items: center;
    // position: relative;
    margin: 8px 30px;
    .user-avatar {
      // position: absolute;
      width: 40px;
      height: 40px;
    }
    .ri_pao {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      // width: 90%;
      max-width: 60%;
      .name {
        padding-left: 15px;
        color: #b8b5b5;
      }
    }
    // 文字
    .chat-pao {
      position: relative;
      padding: 5px;
      border-radius: 6px;
      // border: 1px solid #c2d9ea;
      background-color: #e0effb;
      // width: 90%;
      // max-width: 90%;
    }
    // 图片
    .picture {
      max-width: 60%; // 与文字消息保持一致
      margin: 0 15px; // 保持与文字相同的边距
      border-radius: 6px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      .img {
        width: 100%;
        height: auto; // 高度自动按比例缩放
        display: block; // 去除图片底部间隙
        max-height: 300px; // 防止过高图片
        object-fit: contain; // 保持比例完整显示
      }
    }
    // 文件类
    .el-link {
      width: 100%;
    }
    .el-link__inner {
      width: 100%;
      background-color: #fff;
    }
    .file {
      width: 200px;
      .item {
        width: 200px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 8px;
        height: 55px;
        background-color: #fff;
        padding-left: 15px;
        .iconfont {
          font-size: 40px;
          padding-right: 10px;
        }
        .right {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .file_name {
            font-size: 16px;
            max-width: 100px;
            color: #000;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .file_size {
            font-size: 12px;
            max-width: 50px;
            color: #c4c4c4;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
  // before 是一个小的矩形
  .chat-pao::before {
    content: '';
    width: 10px;
    height: 10px;
    position: absolute;
    top: 10px;
    border: inherit;
    background: inherit;
    transform: rotate(45deg);
  }
  // 设置两个小矩形的位置和角度旋转
  .chat-item.right {
    flex-direction: row-reverse;
    // .name {
    //   text-align: right;
    //   padding-right: 15px;
    // }
    .chat-pao {
      // margin-left: 0;
      margin-right: 15px;
      background-color: #95ec69;
      // border-color: #99c2ff;
      // &引用上一层选择器
      &::before {
        right: -5px;
        border-left: none;
        border-bottom: none;
      }
    }
    .picture {
      margin-right: 10px;
    }
  }
  .chat-item.left {
    .chat-pao {
      margin-left: 15px;
      background-color: #fff;
      &::before {
        border-right: none;
        border-bottom: none;
        left: -5px;
        transform: rotate(-45deg);
      }
    }
    .picture {
      margin-left: 10px;
    }
  }
}
@keyframes highlight {
  0% {
    background-color: rgba(228, 228, 228, 0.5);
  }
  100% {
    background-color: transparent;
  }
}

.height-msg {
  animation: highlight 2s ease-in;
}
</style>
