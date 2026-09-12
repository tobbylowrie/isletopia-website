<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import SiteFooter from './components/SiteFooter.vue'
</script>

<template>
  <DefaultTheme.Layout>
    <!-- 该版本的 Layout 无 footer slot，用 layout-bottom 把统一页脚挂到所有页面底部 -->
    <template #layout-bottom>
      <SiteFooter />
    </template>
  </DefaultTheme.Layout>
</template>
