
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

    '/docs/home/': [
      {
        text: '生活随笔',
        collapsed: false,
        items: [
          { text: '书与电影', link: '/docs/home/书与电影' },
          { text: '旅游攻略', link: '/docs/home/旅游攻略' },
        ]
      },
    ],

  
    '/docs/guide/python/course/': [
      {
        text: 'Python',
        collapsed: false,
        items: [
          { text: '简介', link: '/docs/guide/python/course/' },
          { text: '快速开始', link: '/docs/guide/python/course/快速开始' },
          { text: '常用语法概述', link: '/docs/guide/python/course/常用语法概述' },
        ]
      },
      {
        text: '实战',
        collapsed: false,
        items: [
          { text: '课后练习', link: '/docs/guide/python/course/课后练习' },
          { text: '猜数字游戏', link: '/docs/guide/python/course/猜数字游戏' },
          { text: '植物大战僵尸', link: '/docs/guide/python/course/植物大战僵尸' },
        ]
      },
      {
        text: '拓展',
        collapsed: false,
        items: [
          { text: '流畅的Python', link: '/docs/guide/python/course/流畅的Python' },
        ]
      },
    ],
}