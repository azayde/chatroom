<script lang="ts" setup>
import { ref } from 'vue'
import {
  TransferDirection,
  TransferKey,
  renderContent,
} from 'element-plus'
interface Option {
  key: number
  label: string
  disabled: boolean
}

const generateData = (): Option[] => {
  const data: Option[] = []
  for (let i = 1; i <= 15; i++) {
    data.push({
      key: i,
      label: `Option ${i}`,
      disabled: i % 4 === 0,
    })
  }
  return data
}

const data = ref(generateData())
const rightValue = ref([1])
const leftValue = ref([1])

const renderFunc: renderContent = (h, option) => h('span', null, option.label)

const handleChange = (
  value: TransferKey[],
  direction: TransferDirection,
  movedKeys: TransferKey[]
) => {
  console.log(value, direction, movedKeys)
}
</script>


<template>
  <div style="text-align: center">
    <el-transfer
      v-model="leftValue"
      style="text-align: left; display: inline-block"
      filterable
      :render-content="renderFunc"
      :titles="['Source', 'Target']"
      :format="{
        noChecked: '${total}',
        hasChecked: '${checked}/${total}',
      }"
      :data="data"
      @change="handleChange"
    >
      <!-- <template #left-footer>
        <el-button class="transfer-footer" size="small">Operation</el-button>
      </template>
      <template #right-footer>
        <el-button class="transfer-footer" size="small">Operation</el-button>
      </template> -->
    </el-transfer>
  </div>
</template>

<style>
.transfer-footer {
  margin-left: 15px;
  padding: 6px 5px;
}
</style>
