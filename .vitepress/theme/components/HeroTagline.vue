<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

/**
 * 首页标语：3D 翻转 + 定时自动轮播
 *
 * 效果参考 Magic UI「Text 3D Flip」：每个字符是一个 3D 容器，内含正面 / 背面两层
 * （backface-visibility: hidden），容器绕 Y 轴旋转 90° 时正面消失、背面显现，
 * 配合逐字 stagger 延迟形成波浪式翻转。此处用纯 CSS 动画实现（无 motion 依赖），
 * 并通过定时切换文本列表实现自动轮播。
 *
 * 修改标语内容：直接编辑下方 TAGLINES 数组即可。
 */

// —— 标语列表（按顺序循环切换）——
const TAGLINES = [
  '千岛星河 · 筑梦之屿',
  '十年不删档 · 空岛筑梦人',
  '扩建岛屿 · 发展科技 · 云上家园',
  '老玩家有伙伴 · 新玩家有归属',
]

// —— 可调参数 ——
const INTERVAL = 3000 // 每条标语停留时长（ms）
const FLIP_DURATION = 0.45 // 单字翻转时长（s）
const STAGGER = 0.035 // 逐字延迟间隔（s）

const index = ref(0)
const current = computed(() => TAGLINES[index.value])

// 按空格分词（词内不拆行），词内再按字符拆分
const words = computed(() =>
  current.value.split(' ').map((word) => ({
    chars: Array.from(word),
  }))
)
const lastWordIdx = computed(() => words.value.length - 1)

// 逐字延迟：从左侧向右侧扩散（对应 Magic UI staggerFrom="first"）
const charDelays = computed(() => {
  let g = 0
  return words.value.map((w) => w.chars.map(() => (g++) * STAGGER))
})

let timer: ReturnType<typeof setInterval> | undefined

function next() {
  index.value = (index.value + 1) % TAGLINES.length
}
function start() {
  stop()
  timer = setInterval(next, INTERVAL)
}
function stop() {
  if (timer !== undefined) {
    clearInterval(timer)
    timer = undefined
  }
}

onMounted(start)
onUnmounted(stop)
</script>

<template>
  <!-- :key 变化时整棵字符树重建，CSS 动画随之重新触发 -->
  <p
    class="hero-tagline hero-tagline--flip"
    :key="index"
    :style="{ '--ht-flip-duration': FLIP_DURATION + 's' }"
    aria-live="polite"
  >
    <span class="ht-sr-only">{{ current }}</span>
    <template v-for="(word, wi) in words" :key="wi">
      <span class="ht-word">
        <span
          v-for="(ch, ci) in word.chars"
          :key="ci"
          class="ht-char"
          :style="{ animationDelay: charDelays[wi][ci] + 's' }"
        >
          <span class="ht-face ht-face--front">{{ ch }}</span>
          <span class="ht-face ht-face--back" aria-hidden="true">{{ ch }}</span>
        </span>
      </span>
      <!-- 词间空格（最后一个词后不加） -->
      <span v-if="wi !== lastWordIdx" class="ht-space">&nbsp;</span>
    </template>
  </p>
</template>

<style scoped>
/* 覆盖全局 .hero-tagline 的 block 布局，改为 flex 以承载 3D 字符 */
.hero-tagline--flip {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: baseline;
  perspective: 600px;
}

.ht-word {
  display: inline-flex;
}

/* 3D 容器：初始 translateZ(-0.5lh) 使正面位于 z=0 平面 */
.ht-char {
  display: inline-block;
  position: relative;
  height: 1lh;
  transform-style: preserve-3d;
  transform: translateZ(-0.5lh);
  animation: ht-flip var(--ht-flip-duration, 0.45s) cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

/* 正面 / 背面：各占半层，背面预旋转 -90°（绕 X 轴），翻转后正立显现 */
.ht-face {
  display: inline-block;
  height: 1lh;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.ht-face--front {
  transform: translateZ(0.5lh);
}
.ht-face--back {
  position: absolute;
  top: 0;
  left: 0;
  transform: rotateX(-90deg) translateZ(0.5lh);
}

/* 翻转：绕 X 轴 0 → 90°（正面消失、背面显现），forwards 保持终态 */
@keyframes ht-flip {
  from {
    transform: translateZ(-0.5lh) rotateX(0deg);
  }
  to {
    transform: translateZ(-0.5lh) rotateX(90deg);
  }
}

.ht-space {
  display: inline-block;
  width: 0.5rem;
}

/* 屏幕阅读器专用（VitePress 默认主题未提供 .sr-only，此处补充） */
.ht-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
