<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

/**
 * 首页标语：3D 翻转 + 定时自动轮播
 *
 * 两层文本叠放在同一网格单元中，各自按自身内容分词排版并居中（长度不同也
 * 互不挤动）：前层为当前标语，背层为下一条标语。每层始终处于自己的自然
 * 布局，翻转过程中不会错位。
 *
 * 翻转是文本切换的过渡：前层字符逐个向上翻出（0° → 90° + 上移半字高），
 * 背层字符从下方逐个翻入（边缘态 + 下移半字高 → 0°），逐字 stagger 形成
 * 波浪。全部字符翻完后，同帧交换两层内容并移除动画类：旧背层（已在 0°
 * 完整显示新文本）成为新前层，旧前层（已边缘态不可见）归位 0° 承载下条
 * 文本，新文本在完全相同的位置交接，无可见跳变。
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
const nextIndex = ref(1 % TAGLINES.length)
const flipping = ref(false)
const current = computed(() => TAGLINES[index.value])
const nextText = computed(() => TAGLINES[nextIndex.value])

// 各层按自身文本分词（词内不拆行）
const toWords = (text: string) =>
  text.split(' ').map((word) => Array.from(word))
const frontWords = computed(() => toWords(current.value))
const backWords = computed(() => toWords(nextText.value))

// 逐字延迟（不含空格）：从左侧向右侧扩散
const toDelays = (text: string) => {
  let g = 0
  return text.split(' ').map((word) =>
    Array.from(word).map(() => (g++) * STAGGER)
  )
}
const frontDelays = computed(() => toDelays(current.value))
const backDelays = computed(() => toDelays(nextText.value))

const charCount = (text: string) =>
  Array.from(text).filter((c) => c !== ' ').length

// 两层中最慢一个字符翻完的总时长
const flipTotalMs = () =>
  Math.round(
    (FLIP_DURATION +
      (Math.max(charCount(current.value), charCount(nextText.value)) - 1) *
        STAGGER) *
      1000
  )

let timer: ReturnType<typeof setTimeout> | undefined
let flipTimer: ReturnType<typeof setTimeout> | undefined

function scheduleFlip() {
  timer = setTimeout(flip, INTERVAL)
}

function flip() {
  if (flipping.value) return
  flipping.value = true
  flipTimer = setTimeout(() => {
    // 背层已在 0° 完整显示新文本、前层已边缘态不可见：
    // 同帧交换两层内容并移除动画类，新文本位置不变，无可见跳变
    index.value = nextIndex.value
    nextIndex.value = (index.value + 1) % TAGLINES.length
    flipping.value = false
    scheduleFlip()
  }, flipTotalMs())
}

onMounted(scheduleFlip)
onUnmounted(() => {
  if (timer !== undefined) clearTimeout(timer)
  if (flipTimer !== undefined) clearTimeout(flipTimer)
})
</script>

<template>
  <p
    class="hero-tagline hero-tagline--flip"
    :class="{ 'is-flipping': flipping }"
    :style="{ '--ht-flip-duration': FLIP_DURATION + 's' }"
    aria-live="polite"
  >
    <span class="ht-sr-only">{{ current }}</span>
    <span class="ht-line ht-line--front">
      <template v-for="(word, wi) in frontWords" :key="wi">
        <span class="ht-word">
          <span
            v-for="(ch, ci) in word"
            :key="ci"
            class="ht-char"
            :style="{ animationDelay: frontDelays[wi][ci] + 's' }"
          >{{ ch }}</span>
        </span>
        <!-- 词间空格（最后一个词后不加） -->
        <span v-if="wi !== frontWords.length - 1" class="ht-space">&nbsp;</span>
      </template>
    </span>
    <span class="ht-line ht-line--back" aria-hidden="true">
      <template v-for="(word, wi) in backWords" :key="wi">
        <span class="ht-word">
          <span
            v-for="(ch, ci) in word"
            :key="ci"
            class="ht-char"
            :style="{ animationDelay: backDelays[wi][ci] + 's' }"
          >{{ ch }}</span>
        </span>
        <!-- 词间空格（最后一个词后不加） -->
        <span v-if="wi !== backWords.length - 1" class="ht-space">&nbsp;</span>
      </template>
    </span>
  </p>
</template>

<style scoped>
/* 覆盖全局 .hero-tagline 的 block 布局：单列 1fr 网格让两层共享同一单元
   且占满整宽（列宽与文本长短无关，轮播时不会水平偏移） */
.hero-tagline--flip {
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  text-align: center;
}

.ht-line {
  grid-area: 1 / 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: baseline;
}

.ht-word {
  display: inline-flex;
}

/* 单字 3D 容器 */
.ht-char {
  display: inline-block;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

/* 背层静息在字符下方、呈边缘态（不可见），等待翻入 */
.ht-line--back .ht-char {
  transform: translateY(50%) rotateX(-90deg);
}

/* 切换期间：前层字符向上翻出，背层字符自下翻入 */
.is-flipping .ht-line--front .ht-char {
  animation: ht-flip-out var(--ht-flip-duration, 0.45s) cubic-bezier(0.4, 0, 0.2, 1)
    forwards;
}
.is-flipping .ht-line--back .ht-char {
  animation: ht-flip-in var(--ht-flip-duration, 0.45s) cubic-bezier(0.4, 0, 0.2, 1)
    forwards;
}

@keyframes ht-flip-out {
  from {
    transform: translateY(0) rotateX(0deg);
  }
  to {
    transform: translateY(-50%) rotateX(90deg);
  }
}

@keyframes ht-flip-in {
  from {
    transform: translateY(50%) rotateX(-90deg);
  }
  to {
    transform: translateY(0) rotateX(0deg);
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
