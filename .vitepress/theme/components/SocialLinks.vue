<script setup lang="ts">
// —— 社交平台链接（唯一调整处）——
const links = [
  { name: 'QQ群', icon: '/icons/qq.svg', href: '/join-us', external: false },
  { name: 'b站', icon: '/icons/bilibili.svg', href: 'https://space.bilibili.com/3546572702878559', external: true },
  { name: '抖音', icon: '/icons/tiktok.svg', href: 'https://v.douyin.com/6IAzNtm8BEU/', external: true },
  { name: '小红书', icon: '/icons/xiaohongshu.svg', href: 'https://www.xiaohongshu.com/user/profile/67179c78000000001e001449', external: true }
]
</script>

<template>
  <nav class="social-links" aria-label="社交平台">
    <a
      v-for="link in links"
      :key="link.name"
      class="social-links__item"
      :href="link.href"
      :title="link.name"
      :aria-label="link.name"
      v-bind="link.external ? { target: '_blank', rel: 'noopener' } : {}"
    >
      <span
        class="social-links__icon"
        :style="{ '--social-icon': `url(${link.icon})` }"
        aria-hidden="true"
      ></span>
    </a>
  </nav>
</template>

<style scoped>
/* 纯图标社交链接：public/icons 里的 SVG 是固定单色（黑），
   用 CSS mask 染成当前文字色——首屏视频上为白，浅色背景下自动跟随主题色 */
.social-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.25rem;
  margin: 1.5rem 0 0;
}

.social-links__item {
  display: inline-flex;
  line-height: 0;
  opacity: 0.8;
  transition: opacity 0.2s, transform 0.2s;
}

.social-links__item:hover {
  opacity: 1;
  transform: translateY(-2px);
}

.social-links__icon {
  display: block;
  width: 1.75rem;
  height: 1.75rem;
  background-color: currentColor;
  -webkit-mask: var(--social-icon) center / contain no-repeat;
  mask: var(--social-icon) center / contain no-repeat;
}
</style>
