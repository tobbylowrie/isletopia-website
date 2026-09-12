---
layout: page
sidebar: false
isHome: true
---
<!-- 第一屏 -->
<VideoBackground>
  <img src="/logo.png" class="hero-logo" alt="梦幻之屿 logo" />
  <h1 class="hero-title">梦幻之屿服务器群组</h1>
  <p class="hero-tagline">千岛星河 · 筑梦之屿</p>
  <p class="hero-actions">
    <VPButton theme="brand" text="加入QQ群" href="/docs/join-us" />
    <CopyIp />
  </p>
  <SocialLinks />
  <!-- 底部下滑提示：绝对定位在视频区底部，不影响中部内容的垂直居中 -->
  <div class="hero-scroll-hint">
    <span class="hero-scroll-hint__text">向下滑动，了解更多</span>
    <svg
      class="hero-scroll-hint__arrow"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  </div>
</VideoBackground>

<!-- 第二屏 -->
<HomeIntro />

<!-- 第三屏 -->
<HomeSteps />
