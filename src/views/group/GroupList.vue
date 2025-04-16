<!-- 群聊列表 -->
<script setup>
import { ref, watch } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import {
  createGroupService,
  searchGroupByName,
  getGroupListService
} from '@/api/group.js'
// 查询同好友查询一样(还有问题没解决，待定) TODO:
import { useRoute, useRouter } from 'vue-router'
import { useGroupStore } from '@/stores'
const route = useRoute()
const router = useRouter()
const groupStore = useGroupStore()
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
  // const res = await searchGroupByName(input.value)
  // console.log(res)
}
watch(input, () => {
  // 一直搜索吗？？ TODO:
  console.log(11)
  // searchFriendByName(input.value)
})

// 创建群聊
const groupInfo = ref({
  name: '',
  description: ''
})
const bools = ref(false)
const creatrGroup = async () => {
  bools.value = false
  const res = await createGroupService(groupInfo.value)
  console.log(res)
  // ElMessage.success('群聊创建成功')
}
// 群聊列表
// const groupList = ref([])
const groupList = ref([
  {
    relation_id: 22,
    relation_type: 'group',
    is_show: true,
    pin_time: '2025-03-10T15:00:00',
    last_show: '2025-03-11T10:00:00',
    group_info: {
      relation_id: 1010,
      name: '低代码开发平台',
      description: '探索低代码/零代码开发',
      avatar: 'https://pic.616pic.com/ys_bnew_img/00/02/01/VafZfftlPM.jpg'
    }
  },
  {
    relation_id: 23,
    relation_type: 'group',
    is_show: false,
    pin_time: '2025-03-09T20:00:00',
    last_show: '2025-03-11T07:00:00',
    group_info: {
      relation_id: 1111,
      name: '前端技术早报',
      description: '每日推送最新的前端资讯',
      avatar:
        'https://ts1.tc.mm.bing.net/th/id/R-C.c105782760255c8c917f16e18bc62188?rik=oPIWUoft19kO5g&riu=http%3a%2f%2fwww.kuaipng.com%2fUploads%2fpic%2fw%2f2018%2f09-04%2f46419%2fwater_46419_698_698_.png&ehk=QbsUJSSSxFCkMQHvPXUi1KHvTmpKqTWCjP8Ao0Xaz%2fQ%3d&risl=&pid=ImgRaw&r=0'
    }
  },
  {
    relation_id: 24,
    relation_type: 'group',
    is_show: true,
    pin_time: '2025-03-11T11:00:00',
    last_show: '2025-03-11T11:15:00',
    group_info: {
      relation_id: 1212,
      name: '数据分析交流群',
      description: '分享数据分析技巧',
      avatar: 'https://img.shetu66.com/2023/06/28/1687937373741115.png'
    }
  },
  {
    relation_id: 28,
    relation_type: 'group',
    is_show: false,
    pin_time: '2025-03-05T14:15:00',
    last_show: '2025-03-09T08:00:00',
    group_info: {
      relation_id: 101,
      name: '技术交流群',
      description: '分享技术，共同进步',
      avatar:
        'https://img.tukuppt.com/ad_preview/00/13/99/5e143031aaca7.jpg!/fw/980'
    }
  }
])

// 获取群聊列表
const getGroupList = async () => {
  const res = await getGroupListService()
  console.log(res.data.data.List)
  groupList.value = res.data.data.List
}
getGroupList()
const activeGroup = ref(route.query.relation_id ? groupStore.groupInfo : 0)
// const activeGroup = ref(0)

// 子传父 群聊详细信息传到GroupPage
const emit = defineEmits(['get-group-info'])
const sendMsg = (obj) => {
  activeGroup.value = obj
  console.log(obj)
  emit('get-group-info', obj)
  console.log(obj)
  router.push({
    path: '/chat/group',
    query: { relation_id: obj.relation_id }
  })
}
</script>
<template>
  <el-aside>
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
      <el-button :icon="Plus" plain size="small" @click="bools = true" />
    </el-header>
    <el-main v-if="!IsSearch" class="list">
      <el-scrollbar>
        <div
          class="list-item"
          v-for="item in groupList"
          :key="item.relation_id"
          @click="sendMsg(item)"
          :class="{ active: item.relation_id === activeGroup.relation_id }"
        >
          <div class="avatar">
            <el-avatar shape="square" :src="item.group_info.avatar"></el-avatar>
          </div>
          <span class="name">{{ item.group_info.name }}</span>
        </div></el-scrollbar
      >
    </el-main>
    <!-- 搜索结果列表 -->
    <el-main v-else> <search-list></search-list></el-main>

    <!-- 创建群聊 -->
    <el-dialog v-model="bools" title="创建群聊" width="500" class="dialog">
      <el-form>
        <el-form-item label="群聊名称">
          <el-input v-model="groupInfo.name"></el-input>
        </el-form-item>
        <!-- 可选 -->
        <el-form-item label="群描述">
          <el-input v-model="groupInfo.description"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="bools = false">取消</el-button>
          <el-button type="primary" @click="creatrGroup"> 创建 </el-button>
        </div>
      </template>
    </el-dialog>
  </el-aside>
</template>

<style lang="scss" scoped>
.el-aside {
  width: 215px;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  .el-header {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    height: 45px;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    .el-input {
      width: 170px;
      height: 25px;
    }
    .el-button {
      width: 10px;
    }
  }
  .el-main {
    .list-item {
      cursor: pointer;
      height: 60px;
      display: flex;
      align-items: center;
      padding-top: 5px;
      .avatar {
        margin: 0 10px;
      }
      .name {
        font-size: 16px;
      }
    }
    .list-item:hover {
      background-color: #f0f0f0;
      // background-color: #e9e9e9; 点击后颜色
    }
    .active {
      background-color: #d6d6d6 !important; //点击后颜色
    }
  }
}
</style>
