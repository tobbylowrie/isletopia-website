<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import SiteFooter from './components/SiteFooter.vue'
import ArticleMeta from './components/ArticleMeta.vue'
</script>

<template>
  <DefaultTheme.Layout>
    <!-- 该版本的 Layout 无 footer slot，用 layout-bottom 把统一页脚挂到所有页面底部 -->
    <template #layout-bottom>
      <SiteFooter />
    </template>
    <!-- 「动态」文章页元信息（组件挂载后自行移到正文第一个 h1 之后） -->
    <template #doc-after>
      <ArticleMeta />
    </template>
  </DefaultTheme.Layout>
</template>
