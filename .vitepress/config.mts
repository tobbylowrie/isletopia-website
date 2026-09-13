import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "梦幻之屿",
  description: "MC梦幻之屿官方网站",
  lang: 'zh-CN',
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    // 首页预渲染 HTML 尚无 home-over-video 类（浏览器 JS 才会补上），
    // 用内联脚本在首屏前加上，避免顶部闪现原版配色导航栏。
    // 注意：本版本 head 元组为 [tag, attrs, innerHTML]，脚本体是第三个元素
    ['script', {},
      `(function(){if(location.pathname==='/'||/\\/index\\.html(\\?|#|$)/.test(location.pathname))document.documentElement.classList.add('home-over-video')})()`
    ]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.png',
    // 默认主题内置文案（本版本无 locale 选项，逐个指定中文）
    navMenuLabel: '主导航',
    sidebarMenuLabel: '目录',
    mobileMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
    darkModeSwitchLabel: '外观',
    skipToContentLabel: '跳到主要内容',
    notFound: {
      title: '页面未找到',
      quote: '换个方向看看，也许你想要的页面就在别处。',
      linkLabel: '返回首页',
      linkText: '返回首页'
    },
    outline: { level: 'deep', label: '本页概览' },
    docFooter: { prev: false, next: false },
    nav: [
      { text: '首页', link: '/' },
      { text: '动态', link: '/news' },
      {
        text: '游玩指南',
        items: [
          { text: '特色玩法', link: '/docs/guide/features' },
          { text: '新手教程', link: '/docs/guide/beginner' },
          { text: '常见问题(FAQ)', link: '/docs/guide/faq' },
          { text: 'Wiki', link: '/docs/guide/wiki' },
          { text: '规则', link: '/docs/guide/rules' }
        ]
      },
      {
        text: '资源与下载',
        items: [
          { text: '岛屿存档下载', link: '/docs/resources/saves' },
          { text: '作品墙', link: '/docs/resources/works' },
          { text: '合影墙', link: '/docs/resources/photos' },
          { text: '服务器图库', link: '/docs/resources/gallery' },
          { text: '活动Replay回放', link: '/docs/resources/replays' }
        ]
      },
      { text: '提交反馈', link: 'https://txc.qq.com/products/414594' },
      { text: '关于', link: '/docs/about' }
    ],

    sidebar: [
      {
        text: '示例',
        items: [
          { text: 'Markdown 示例', link: '/docs/markdown-examples' },
          { text: '运行时 API 示例', link: '/docs/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
