
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
          { text: '使用Arthas线上DEBUG', link: '/docs/blog/2024/使用Arthas线上DEBUG' },
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

    '/docs/develop/python/': [
      {
        text: 'Python',
        collapsed: false,
        items: [
          { text: '简介', link: '/docs/develop/python/'},
          { text: '指南', link: '/docs/develop/python/guide/'},
          { text: '最佳实践', link: '/docs/develop/python/startup/'},
          { text: '面试宝典', link: '/docs/develop/python/interview/'},
        ]
      },
      {
        text: '应用',
        collapsed: false,
        items: [
          { text: '爬虫与数据分析', link: '/docs/develop/python/data/'},
          { text: 'Web开发', link: '/docs/develop/python/web/'},
          { text: '自动化办公', link: '/docs/develop/python/work/'},
          { text: '人工智能即未来', link: '/docs/develop/python/smart/'},
        ]
      },
      {
        text: '拓展',
        collapsed: true,
        items: [
          { text: '游戏开发', link: '/docs/develop/python/game/'},
        ]
      },
    ],

    '/docs/media/stable-diffusion/': [
      {
        text: 'Stable Diffusion',
        collapsed: false,
        items: [
          { text: '简介', link: '/docs/media/stable-diffusion/'},
          { text: '快速开始', link: '/docs/media/stable-diffusion/quickstart.md'},
        ]
      },
      {
        text: '功能',
        collapsed: false,
        items: [
          { text: '文生图', link: '/docs/media/stable-diffusion/txt2img.md'},
          { text: '图生图', link: '/docs/media/stable-diffusion/img2img.md'},
        ]
      },
      {
        text: '最佳实践',
        collapsed: true,
        items: [
        ]
      },
    ],
}