<script setup lang="ts">
import { computed, nextTick, onMounted, watch } from 'vue'
// 构建时内联当前 vitepress 版本号
import { version as vitepressVersion } from 'vitepress/package.json'
import { useRoute } from 'vitepress'

// —— 待替换的文案与数据 ——
// TODO: 正式标语
const SLOGAN = ''
// 服务器开始运行时间（YYYY-MM-DD）；null = 未设置，显示占位
const SERVER_START = '2015-07-11'

// —— 不蒜子访问统计（累计 / 访客数）——
// 模块导入时会自动 fetch 一次，但那时页脚尚未挂载、拿不到元素，
// 需在挂载后重拉；页脚随 Layout 全局挂载，SPA 切路由不重新挂载，需 watch 重拉
const route = useRoute()
const refreshBusuanzi = () => {
  nextTick(() => {
    setTimeout(() => {
      if (typeof window !== 'undefined' && window.busuanzi) {
        window.busuanzi.fetch()
      }
    }, 100)
  })
}
onMounted(refreshBusuanzi)
watch(() => route.path, refreshBusuanzi)

// 已运行时长：从 SERVER_START 到今天，借位换算 年/月/日
const uptime = computed(() => {
  if (!SERVER_START) return 'XX 年 XX 月 XX 天'
  const start = new Date(SERVER_START + 'T00:00:00')
  const now = new Date()
  let years = now.getFullYear() - start.getFullYear()
  let months = now.getMonth() - start.getMonth()
  let days = now.getDate() - start.getDate()
  if (days < 0) {
    months -= 1
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate()
  }
  if (months < 0) {
    years -= 1
    months += 12
  }
  if (years < 0) return '0 年 0 月 0 天'
  return `${years} 年 ${months} 月 ${days} 天`
})

const relatedLinks = [
  { text: 'Minecraft官网', href: 'https://www.minecraft.net/zh-hans' },
  { text: 'Minecraft Wiki（中文）', href: 'https://zh.minecraft.wiki/' },
  { text: 'MODMC服务器列表详情页', href: 'https://play.mcmod.cn/sv20187897.html' },
  { text: '苦力怕论坛宣传贴',href: 'https://klpbbs.com/thread-132596-1-1.html'},
  { text: 'NameMC详情页', href: 'https://namemc.com/server/play.molean.com' }
]

// 均分两列，各自独立成列
const linkColumns = [relatedLinks.slice(0, 2), relatedLinks.slice(2)]
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer__top">
      <!-- 左：LOGO + 标题 + 标语 -->
      <div class="site-footer__brand">
        <img src="/logo.png" class="site-footer__logo" alt="梦幻之屿 LOGO" />
        <p class="site-footer__title">梦幻之屿</p>
        <p class="site-footer__slogan">{{ SLOGAN }}</p>
      </div>

      <!-- 中：相关链接（两列各自独立列表，顶部对齐） -->
      <nav class="site-footer__links" aria-label="相关链接">
        <p class="site-footer__links-title">相关链接</p>
        <div class="site-footer__links-cols">
          <ul v-for="col in linkColumns" :key="col[0].href">
            <li v-for="link in col" :key="link.href">
              <a :href="link.href" target="_blank" rel="noopener noreferrer">{{ link.text }}</a>
            </li>
          </ul>
        </div>
      </nav>

      <!-- 右：预留位置，将来放有趣的插入图/动图 -->
      <div class="site-footer__aside" aria-hidden="true"></div>
    </div>

    <!-- 底部 -->
    <div class="site-footer__bottom">
      <p class="site-footer__line">
        本站累计访问共<span id="busuanzi_value_site_pv">...</span>次，访客共<span id="busuanzi_value_site_uv">...</span>人
        <span class="site-footer__divider">|</span>
        梦幻之屿服务器已运行 {{ uptime }}
      </p>
      <p class="site-footer__line">
        © 2026 梦幻之屿 © All Rights Reserved.
        <span class="site-footer__divider">|</span>
        Not an official Minecraft website. We are not associated with Mojang or Microsoft.
      </p>
      <p class="site-footer__line">
        <a href="/legal/disclaimer">免责声明</a>
        <span class="site-footer__divider">|</span>
        <a href="/legal/copyright">版权声明</a>
        <span class="site-footer__divider">|</span>
        <a href="/legal/cookie-policy">Cookie 政策</a>
        <span class="site-footer__divider">|</span>
        <a href="/legal/privacy-policy">隐私政策</a>
      </p>
      <p class="site-footer__version">VitePress v{{ vitepressVersion }}</p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  position: relative;
  z-index: var(--vp-z-index-footer);
  border-top: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
  padding: 2.5rem 1.5rem 1.5rem;
}

@media (min-width: 48rem) {
  .site-footer {
    padding: 2.5rem 2rem 1.5rem;
  }
}

.site-footer__top {
  max-width: var(--vp-layout-max-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 60rem) {
  .site-footer__top {
    /* 左中右按 2:4:2 划分 */
    grid-template-columns: 2fr 4fr 2fr;
    align-items: start;
  }
}

/* 左：品牌区 */
.site-footer__brand {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.site-footer__logo {
  width: 4.5rem;
  height: 4.5rem;
  object-fit: contain;
}

.site-footer__title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.site-footer__slogan {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

/* 中：相关链接 */
.site-footer__links-title {
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.site-footer__links-cols {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.375rem 1.5rem;
  align-items: start;
}

@media (min-width: 60rem) {
  /* 两列各自独立列表，高度互不影响，顶部对齐 */
  .site-footer__links-cols {
    grid-template-columns: 1fr 1fr;
  }
}

.site-footer__links ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.site-footer__links a {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  transition: color 0.25s;
}

.site-footer__links a:hover {
  color: var(--vp-c-text-1);
}

/* 右：预留位，桌面端撑出高度让三列平衡 */
@media (min-width: 60rem) {
  .site-footer__aside {
    min-height: 6rem;
  }
}

/* 底部 */
.site-footer__bottom {
  max-width: var(--vp-layout-max-width);
  margin: 2rem auto 0;
  padding-top: 1.25rem;
  border-top: 1px solid var(--vp-c-divider);
  text-align: center;
}

.site-footer__line {
  font-size: 0.8125rem;
  line-height: 1.7142857;
  color: var(--vp-c-text-3);
}

.site-footer__divider {
  margin: 0 0.5rem;
}

.site-footer__version {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.site-footer__bottom a {
  color: var(--vp-c-text-3);
  text-decoration-line: underline;
  text-underline-offset: 0.125rem;
  transition: color 0.25s;
}

.site-footer__bottom a:hover {
  color: var(--vp-c-text-1);
}
</style>
