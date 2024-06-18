
module.exports = {
    // 当用户在 `指南` 目录页面下将会展示这个侧边栏
    '/docs/blog/': [
      {
        text: '置顶笔记',
        collapsed: false,
        items: [
          { text: '在线文档与工具', link: '/docs/blog/top/在线文档与工具' },
          { text: '线上DeBug实战', link: '/docs/blog/top/线上DeBug实战' },
        ]
      },
      {
        text: '2024年笔记',
        collapsed: false,
        items: [
          { text: '使用Arthas线上DEBUG', link: '/docs/blog//2024/使用Arthas线上DEBUG' },
        ]
      },
      {
        text: '归档笔记',
        collapsed: true,
        items: [
          { text: '2023年', link: '/docs/blog/history/2023/' },
        ]
      },
    ],

    '/docs/guide/python/': [
      {
        text: 'Python',
        collapsed: false,
        items: [
          { text: '入门', link: ''},
          { text: '指南', link: '/docs/guide/python/'},
          { text: '快速开始', link: ''},
          { text: '面试宝典', link: '/docs/guide/python/interview.md' },
        ]
      },
      {
        text: '应用',
        collapsed: false,
        items: [
          { text: '爬虫与数据分析', link: '/docs/guide/python/data/' },
          { text: 'Web开发', link: '/docs/guide/python/web/' },
          { text: '自动化办公', link: '/docs/guide/python/work/' },
          { text: '人工智能即未来', link: '/docs/guide/python/smart/' },
        ]
      },
      {
        text: '拓展',
        collapsed: true,
        items: [
          { text: '游戏开发', link: '/docs/guide/python/game/' },
        ]
      },
    ],
}