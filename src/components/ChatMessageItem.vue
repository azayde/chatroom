<!-- 聊天窗 -->
<script setup>
import { computed } from 'vue'
import { transform } from '@/utils/emoji'
import { useUserStore } from '@/stores'
import { formatTime } from '@/utils/time'
const userStore = useUserStore()
const props = defineProps({
  msgInfo: Object,
  headImage: String,
  name: String,
  prevMsgInfo: Object
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
// 判断是否需要显示时间
const showTime = computed(() => {
  // 第一条消息必显示
  if (!props.prevMsgInfo) return true

  // 系统消息不显示
  if (props.msgInfo.notify_type === 'system') return false

  // 跨天/跨周必显示
  const currentDate = new Date(props.msgInfo.create_at)
  const prevDate = new Date(props.prevMsgInfo.create_at)
  const isSameDay = currentDate.toDateString() === prevDate.toDateString()
  const isSameWeek = currentDate.getWeek() === prevDate.getWeek()

  if (!isSameDay || !isSameWeek) return true

  // 间隔≥5分钟显示
  const timeDiff = (currentDate - prevDate) / (1000 * 60) // 转换为分钟
  return timeDiff >= 5
})

// 上传文件
const fileTypeIcon = {
  pdf: 'icon-pdf',
  txt: 'icon-wenbenwendang-txt',
  ppt: 'icon-yanshiwendang-ppt_pptx',
  zip: 'icon-yasuowenjian-zip_rar_7z',
  excel: 'icon-biaoge-xlxs_xls',
  mp4: 'icon-shipin-mov_mp4_avi',
  doc: 'icon-wendang-docx_doc',
  docx: 'icon-wendang-docx_doc',
  exe: 'icon-kezhihangwenjian-exe'
}
</script>

<template>
  <div class="chat-msg-item">
    <div class="chat-system" v-show="msgInfo.notify_type === 'system'">
      {{ msgInfo.msg_content }}
    </div>
    <div class="time-stamp" v-if="showTime">
      {{ formatTime(msgInfo.create_at) }}
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
          v-if="
            props.msgInfo.msg_content.split('.').pop() === 'png' ||
            props.msgInfo.msg_content.split('.').pop() === 'jpg'
          "
        >
          <img class="img" :src="props.msgInfo.msg_content" alt="" />
        </div>
        <div class="file" v-show="props.msgInfo.msg_type === 'file'" v-else>
          <el-link :href="props.msgInfo?.msg_content" :underline="false">
            <div class="item">
              <div class="right">
                <span class="file_name">{{ props.msgInfo.file_name }}</span>
                <span class="file_size">{{
                  (props.msgInfo.file_size / 1024).toFixed(2) + 'KB'
                }}</span>
              </div>
              <i
                class="iconfont"
                :class="
                  fileTypeIcon[props.msgInfo.msg_content.split('.').pop()] ||
                  'icon-qita'
                "
              ></i>
            </div>
          </el-link>
        </div>
      </div>
      <div class="rlymsg" v-show="msgInfo.rly_msg?.msg_content">
        {{ msgInfo.rly_msg?.msg_content }}
      </div>
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
  .time-stamp {
    text-align: center;
    color: #b8b5b5;
    font-size: 12px;
    margin: 8px 0;
    clear: both; /* 防止浮动消息布局错乱 */
  }
  .chat-item {
    // border: 1px solid #000;
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
    .rlymsg {
      position: relative;
      padding: 8px 12px;
      // top: 40px;
      margin: 5px 0;
      color: #666;
      background-color: #f0f2f5;
      border-left: 4px solid #409eff;
      border-right: 4px solid #409eff;
      border-radius: 4px;
      font-size: 12px;
      line-height: 1.5;
      max-width: 80%; // 限制最大宽度，避免过长
      word-break: break-word; // 自动换行
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
      // max-width: 60%; // 与文字消息保持一致
      // margin: 0 15px; // 保持与文字相同的边距
      border-radius: 6px;
      // overflow: hidden;
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
    .file {
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
    .file {
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
