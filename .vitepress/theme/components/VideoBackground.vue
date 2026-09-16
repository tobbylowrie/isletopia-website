<script setup lang="ts">
import { onMounted, ref } from 'vue'

const video = ref<HTMLVideoElement>()

onMounted(() => {
  // 确保 muted 属性生效，保证浏览器允许自动播放
  if (video.value) {
    video.value.muted = true
    video.value.play().catch(() => {})
  }
})
</script>

<template>
  <section class="video-background">
    <video
      ref="video"
      class="video-background__media"
      autoplay
      muted
      loop
      playsinline
      preload="auto"
      src="/bg.mp4"
      aria-hidden="true"
    ></video>
    <div class="video-background__mask" aria-hidden="true"></div>
    <div class="video-background__fade" aria-hidden="true"></div>
    <div class="video-background__content">
      <slot></slot>
    </div>
  </section>
</template>

<style scoped>
.video-background {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

/* 桌面端导航为 fixed，把视频顶到视口顶部（与默认 VPHero 的处理一致） */
@media (min-width: 60rem) {
  .video-background {
    margin-top: calc((var(--vp-nav-height) + var(--vp-layout-top-height, 0px)) * -1);
  }
}

/* 纯色调整层颜色（唯一调整处）：减淡弱化视频颜色纹理，突出上层内容。
   想换成任何弱化色调（深色/品牌色）只改 --home-video-mask 这一处 */
.video-background {
  --home-video-mask: rgba(0, 0, 0, 0.35);
}

.video-background__media {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.video-background__mask {
  position: absolute;
  inset: 0;
  background: var(--home-video-mask);
  z-index: 1;
}

/* 上下边缘纵向渐变（上：黑→透明，下：透明→黑），叠在遮罩之上、内容之下，
   让视频看起来沉入页面，增加嵌入感；不拦截交互 */
.video-background__fade {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  background:
    linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0) 100px),
    linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0) 100px);
}

.video-background__content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #fff;
  padding: 1.5rem;
  box-sizing: border-box;
}
</style>
