<script setup lang="ts">
// 特色玩法卡片，描述文字参考 MC 百科服务器页面（play.mcmod.cn/sv20187897）
// TODO: 插图为占位图，正式版替换为 public/images/features/ 下的 4 张 PNG 后改下方 img 路径
const features = [
  {
    img: '/images/guide-image.png',
    title: '经典空岛',
    desc: '一切起点，开放、自由、无主城、无强制任务。可拥有多个空岛、自由切换生物群系与特殊结构，按自己的节奏建设家园，是最适合长期发展与红石建造的稳定空间。'
  },
  {
    img: '/images/1789286456151.png',
    title: '单方块空岛',
    desc: '为喜欢「从一格起家」成长乐趣的玩家而设。2025 年新增 10 个阶段，基本覆盖所有方块类型，让你在极简资源下一步步解锁、逐渐扩张出属于自己的岛屿。'
  },
  {
    img: '/images/image-2.png',
    title: '海底生存',
    desc: '出生在几乎被水完全淹没的世界，物资极度匮乏，必须先排水才能展开建设，是服务器内难度最高的空岛模式之一，使用完全独立存档。'
  },
  {
    img: '/images/1789286482206.png',
    title: '困难空岛',
    desc: '实现李芒果空岛的相关特性，是当前最流行的生电空岛高难玩法之一，面向热爱折腾、追求极限的硬核玩家。'
  }
]
</script>

<template>
  <section class="home-features">
    <div class="home-features__inner">
      <h2 class="home-features__title">特色玩法</h2>

      <div class="home-features__grid">
        <article v-for="f in features" :key="f.title" class="home-features__card">
          <img
            :src="f.img"
            :alt="f.title + ' 玩法插图'"
            class="home-features__image"
            loading="lazy"
          />
          <h3 class="home-features__card-title">{{ f.title }}</h3>
          <p class="home-features__card-desc">{{ f.desc }}</p>
        </article>
      </div>

      <p class="home-features__more">
        <a class="home-features__link" href="/guide/features">
          查看全部特色玩法
          <span aria-hidden="true">→</span>
        </a>
      </p>
    </div>
  </section>
</template>

<style scoped>
.home-features {
  padding: 4rem 1.5rem 5rem;
  background-color: var(--vp-c-bg-soft);
}

@media (min-width: 48rem) {
  .home-features {
    padding: 5rem 2rem 6rem;
  }
}

.home-features__inner {
  max-width: var(--vp-layout-max-width);
  margin: 0 auto;
}

.home-features__title {
  margin: 0 0 2rem;
  font-size: 1.75rem;
  font-weight: 700;
  text-align: center;
  color: var(--vp-c-text-1);
}

.home-features__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}

@media (min-width: 60rem) {
  .home-features__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 90rem) {
  .home-features__grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.home-features__image {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  border-radius: 0.5rem;
}

.home-features__card-title {
  margin: 1rem 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
  color: var(--vp-c-text-1);
}

.home-features__card-desc {
  margin: 0 0 1.25rem;
  font-size: 0.875rem;
  line-height: 1.75;
  color: var(--vp-c-text-2);
}

.home-features__more {
  margin: 2rem 0 0;
}

.home-features__link {
  display: inline-block;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  transition: color 0.25s;
}

.home-features__link:hover {
  color: var(--vp-c-brand-2);
}
</style>
