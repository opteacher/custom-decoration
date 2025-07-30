<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <van-nav-bar title="定制设计结算" :left-arrow="false">
    <template #right>
      <van-icon name="plus" size="1.5rem" @click="() => router.push('/custom-decoration/select')" />
    </template>
  </van-nav-bar>
  <van-cell-group>
    <van-cell title="单元格" value="内容" />
    <van-cell title="单元格" value="内容" label="描述信息" />
  </van-cell-group>
</template>
