<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  buildArticles,
  CATEGORY_LABELS,
  type Article
} from '../utils/articleFeed'

// 单批渲染的卡片数量（上限由 MAX_BATCH_SIZE 钳制，下滑触底自动加载下一批）
const BATCH_SIZE = 12
const MAX_BATCH_SIZE = 24
const PER_BATCH = Math.min(BATCH_SIZE, MAX_BATCH_SIZE)

// 文章目录 md 原文（?raw 由 Vite 直接读盘），运行时按需加载
const rawModules = import.meta.glob('/docs/{news,blogs,events,changelog}/**/*.md', {
  query: '?raw',
  import: 'default'
})

const articles = ref<Article[]>([])
const loading = ref(true)
const visibleCount = ref(PER_BATCH)
const colCount = ref(3)
const sentinel = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const hasMore = computed(() => visibleCount.value < articles.value.length)

// 瀑布流：按列轮转均分，追加批次时已有卡片不位移
const columns = computed(() => {
  const cols: Article[][] = Array.from({ length: colCount.value }, () => [])
  articles.value.slice(0, visibleCount.value).forEach((a, i) => {
    cols[i % colCount.value].push(a)
  })
  return cols
})

function loadMore() {
  if (hasMore.value) {
    visibleCount.value = Math.min(visibleCount.value + PER_BATCH, articles.value.length)
  }
}

function onCoverError(article: Article) {
  article.cover = null
}

function syncColumns() {
  colCount.value = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1
}

function formatDate(date: string) {
  return date.replaceAll('-', '.')
}

onMounted(async () => {
  syncColumns()
  window.addEventListener('resize', syncColumns)

  const entries = await Promise.all(
    Object.keys(rawModules).map(async (file) =>
      [file, (await rawModules[file]()) as string] as const
    )
  )
  articles.value = buildArticles(entries)
  loading.value = false
  await nextTick()
  if (sentinel.value) {
    observer = new IntersectionObserver(
      (list) => list.some((e) => e.isIntersecting) && loadMore(),
      { rootMargin: '300px 0px' }
    )
    observer.observe(sentinel.value)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncColumns)
  observer?.disconnect()
})
</script>

<template>
  <div class="news-feed">
    <p v-if="loading" class="news-feed__status">正在加载文章…</p>

    <template v-else>
      <div
        class="news-feed__waterfall"
        :style="{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }"
      >
        <div v-for="(col, ci) in columns" :key="ci" class="news-feed__column">
          <a
            v-for="a in col"
            :key="a.href"
            :href="a.href"
            class="card"
            :class="`card--${a.category}`"
          >
            <div v-if="a.cover" class="card__cover">
              <!-- no-referrer：bilibili 等图床按 Referer 防盗链（非 b 站来源 403），不发送 Referer 即可正常加载 -->
              <img
                :src="a.cover"
                :alt="a.title"
                loading="lazy"
                referrerpolicy="no-referrer"
                @error="onCoverError(a)"
              />
            </div>
            <div class="card__body">
              <span class="card__badge">{{ CATEGORY_LABELS[a.category] ?? a.category }}</span>
              <h3 class="card__title">{{ a.title }}</h3>
              <p class="card__meta">
                <template v-if="a.author">{{ a.author }} · </template>{{ formatDate(a.date) }}
              </p>
              <p class="card__summary">{{ a.description }}</p>
            </div>
          </a>
        </div>
      </div>

      <div v-if="hasMore" ref="sentinel" class="news-feed__status">正在加载…</div>
      <p v-else class="news-feed__status">已显示全部 {{ articles.length }} 条动态</p>
    </template>
  </div>
</template>

<style scoped>
.news-feed {
  max-width: var(--vp-layout-max-width);
  margin: 0 auto;
  padding: 1.5rem 1.5rem 4rem;
}

.news-feed__waterfall {
  display: grid;
  gap: 1rem;
}

.news-feed__column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
}

.news-feed__status {
  margin: 1.5rem 0 0;
  text-align: center;
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
}

/* 分类配色（明暗主题唯一调整处） */
.card {
  --cat-1: var(--vp-c-text-2);
  --cat-soft: var(--vp-c-bg-soft);
}
.card--news {
  --cat-1: #5c73e7;
  --cat-soft: rgba(92, 115, 231, 0.12);
}
.card--blogs {
  --cat-1: #16a34a;
  --cat-soft: rgba(22, 163, 74, 0.12);
}
.card--events {
  --cat-1: #ea580c;
  --cat-soft: rgba(234, 88, 12, 0.12);
}
.card--changelog {
  --cat-1: #64748b;
  --cat-soft: rgba(100, 116, 139, 0.14);
}

.dark .card--news {
  --cat-1: #a8b1ff;
  --cat-soft: rgba(168, 177, 255, 0.16);
}
.dark .card--blogs {
  --cat-1: #4ade80;
  --cat-soft: rgba(74, 222, 128, 0.16);
}
.dark .card--events {
  --cat-1: #fb923c;
  --cat-soft: rgba(251, 146, 60, 0.16);
}
.dark .card--changelog {
  --cat-1: #94a3b8;
  --cat-soft: rgba(148, 163, 184, 0.18);
}

.card {
  display: block;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.75rem;
  background-color: var(--vp-c-bg);
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}
.card:hover {
  border-color: var(--cat-1);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.card__cover {
  line-height: 0;
}
.card__cover img {
  display: block;
  width: 100%;
  height: auto;
}

.card__body {
  padding: 0.875rem 1rem 1rem;
}

.card__badge {
  display: inline-block;
  padding: 0.125rem 0.625rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.5;
  color: var(--cat-1);
  background-color: var(--cat-soft);
}

.card__title {
  margin: 0.625rem 0 0.375rem;
  font-size: 1.0625rem;
  font-weight: 600;
  line-height: 1.45;
  color: var(--vp-c-text-1);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card__meta {
  margin: 0 0 0.5rem;
  font-size: 0.8125rem;
  color: var(--vp-c-text-3);
}

.card__summary {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.65;
  color: var(--vp-c-text-2);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
