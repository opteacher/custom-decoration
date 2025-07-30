<script setup lang="ts">
import type { TreeSelectItem } from 'vant'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const items = reactive<TreeSelectItem[]>([
  {
    text: '柜体',
    children: [
      { text: '杭州', id: 1 },
      { text: '温州', id: 2 },
      { text: '宁波', id: 3 }
    ]
  },
  {
    text: '柜门',
    children: [
      { text: '南京', id: 4 },
      { text: '无锡', id: 5 },
      { text: '徐州', id: 6 }
    ]
  },
  {
    text: '五金',
    children: [
      { text: '南京', id: 7 },
      { text: '无锡', id: 8 },
      { text: '徐州', id: 9 }
    ]
  }
])
const selCategory = ref('柜体')
const selProducts = ref([])

function onProdsSelect() {
  console.log('Selected Products:', selProducts.value)
}
</script>

<template>
  <van-nav-bar
    title="选择产品"
    left-arrow
    right-text="确定"
    @click-left="() => router.back()"
    @click-right="onProdsSelect"
  />
  <van-tree-select
    class="h-full"
    v-model:active-id="selProducts"
    v-model:main-active-index="selCategory"
    :items="items"
  />
</template>
