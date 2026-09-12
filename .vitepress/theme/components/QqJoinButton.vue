<script setup lang="ts">
import { VPButton } from 'vitepress/theme'

// —— QQ 一键加群链接（唯一调整处）——
const QQ_GROUP_URL = 'https://qm.qq.com/q/Ps0olZKRMe'
</script>

<template>
  <!-- 外层直接用 VitePress 默认按钮，仅通过插槽加入 QQ 图标 -->
  <VPButton theme="brand" :href="QQ_GROUP_URL">
    <span>点我一键加入QQ群</span>
  </VPButton>
</template>

<style scoped>
.qq-join__icon {
  display: inline-block;
  width: 1.125rem;
  height: 1.125rem;
  margin-right: 0.375rem;
  vertical-align: -0.25rem;
}
</style>
