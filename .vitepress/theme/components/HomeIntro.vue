<template>
  <section class="home-intro">
    <div class="home-intro__inner">
      <div class="home-intro__text">
        <h2 class="home-intro__title">你好，欢迎来到梦幻之屿</h2>
        <p class="home-intro__para">
          梦幻之屿是已运营十年的
          Minecraft 老牌空岛生存服。从最初几座小小的空岛，到如今玩法成熟、社区活跃的云上家园，岛屿上的每一块矿、每一座建筑，都是玩家亲手打造。这里主打空岛生存的经典循环——扩建岛屿、发展科技、布置建筑、与岛友互动，辅以多年沉淀的稳定规则与插件体系。老玩家在这里有熟悉的伙伴，新玩家也能轻松找到属于自己的小岛。如果你想拥有一片云上的天地，欢迎登上梦幻之屿。
        </p>
        <a class="home-intro__link" href="/docs/guide/features">
          查看特色玩法
          <span aria-hidden="true">→</span>
        </a>
      </div>
      <!-- TODO: 素材待提供，放 public/images/home-intro.jpg（透明底、不规则边缘渲染图）。
           用 :src 动态绑定，避免 SFC 把尚不存在的 public 路径转成构建期 import -->
      <img
        :src="'/images/home-intro.jpg'"
        alt="梦幻之屿岛屿效果图"
        class="home-intro__image"
        loading="lazy"
      />
    </div>
  </section>
</template>

<style scoped>
.home-intro {
  padding: 4rem 1.5rem;
  background-color: var(--vp-c-bg);
}

@media (min-width: 48rem) {
  .home-intro {
    padding: 5rem 2rem;
  }
}

.home-intro__inner {
  max-width: var(--vp-layout-max-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  align-items: center;
}

@media (min-width: 60rem) {
  /* 左文右图 */
  .home-intro__inner {
    grid-template-columns: 3fr 2fr;
    gap: 4rem;
  }
}

.home-intro__title {
  margin: 0 0 1.25rem;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.home-intro__para {
  margin: 0;
  line-height: 1.9;
  color: var(--vp-c-text-2);
}

.home-intro__link {
  display: inline-block;
  margin-top: 1.5rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  transition: color 0.25s;
}

.home-intro__link:hover {
  color: var(--vp-c-brand-2);
}

.home-intro__image {
  width: 100%;
  max-width: 24rem;
  height: auto;
  margin: 0 auto;
  justify-self: center;
}
</style>
