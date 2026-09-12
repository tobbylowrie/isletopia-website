<script setup lang="ts">
import CopyIp from './CopyIp.vue'

// 客户端官网下载地址（待你核对一遍）
const clients = [
  { text: 'JAVA版官方启动器', href: 'https://www.minecraft.net/zh-hans/download' },
  { text: 'HMCL启动器', href: 'https://hmcl.huangyuhui.net/download' },
  { text: 'PCL2启动器', href: 'https://www.pcl2start.cn/' },
  { text: 'Modrinth App', href: 'https://modrinth.com/app' },
  { text: 'Axolotl 启动器', href: 'https://axlmc.org/' }
]
</script>

<template>
  <section class="home-steps">
    <div class="home-steps__inner">
      <h2 class="home-steps__title">新手入服，只需三步</h2>

      <ol class="home-steps__list">
        <li class="home-steps__card">
          <span class="home-steps__num" aria-hidden="true">1</span>
          <h3 class="home-steps__card-title">选择下载客户端</h3>
          <p class="home-steps__card-text">
            任选一款 Minecraft 客户端下载并安装，并登录你的正版账号、安装最新版本的游戏：
          </p>
          <ul class="home-steps__clients">
            <li v-for="client in clients" :key="client.href">
              <a
                :href="client.href"
                target="_blank"
                rel="noopener noreferrer"
                class="home-steps__client"
              >{{ client.text }}<span aria-hidden="true"> ↗</span></a>
            </li>
          </ul>
        </li>

        <li class="home-steps__card">
          <span class="home-steps__num" aria-hidden="true">2</span>
          <h3 class="home-steps__card-title">登录服务器</h3>
          <p class="home-steps__card-text">
            打开客户端，进入「多人游戏 → 添加服务器」，填入下方地址并加入：
          </p>
          <CopyIp class="home-steps__ip" />
        </li>

        <li class="home-steps__card">
          <span class="home-steps__num" aria-hidden="true">3</span>
          <h3 class="home-steps__card-title">加入我们的社区</h3>
          <p class="home-steps__card-text">
            加入 QQ 群，获取最新活动通知、聊天交流、问题反馈。
          </p>
          <a href="/docs/join-us" class="home-steps__cta">加入 QQ 群</a>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.home-steps {
  padding: 4rem 1.5rem 5rem;
  background-color: var(--vp-c-bg-soft);
}

@media (min-width: 48rem) {
  .home-steps {
    padding: 5rem 2rem 6rem;
  }
}

.home-steps__inner {
  max-width: var(--vp-layout-max-width);
  margin: 0 auto;
}

.home-steps__title {
  margin: 0 0 2rem;
  font-size: 1.75rem;
  font-weight: 700;
  text-align: center;
  color: var(--vp-c-text-1);
}

.home-steps__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

@media (min-width: 60rem) {
  .home-steps__list {
    grid-template-columns: repeat(3, 1fr);
  }
}

.home-steps__card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.5rem;
  background-color: var(--vp-c-bg);
  padding: 1.5rem;
}

.home-steps__num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  margin-bottom: 1rem;
  border-radius: 50%;
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 1rem;
  font-weight: 700;
}

.home-steps__card-title {
  margin: 0 0 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.home-steps__card-text {
  margin: 0;
  line-height: 1.75;
  color: var(--vp-c-text-2);
}

.home-steps__clients {
  margin: 1rem 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.home-steps__client {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  transition: color 0.25s, border-color 0.25s;
}

.home-steps__client:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.home-steps__ip {
  margin-top: 1rem;
}

.home-steps__cta {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1.25rem;
  border-radius: 0.375rem;
  background-color: var(--vp-c-brand-3);
  color: var(--vp-c-white);
  font-size: 0.9375rem;
  font-weight: 500;
  transition: background-color 0.25s;
}

.home-steps__cta:hover {
  background-color: var(--vp-c-brand-2);
}
</style>
