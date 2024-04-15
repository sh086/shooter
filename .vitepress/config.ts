// 参考配置文档 : https://vitepress.dev/

import { defineConfig } from 'vitepress'
import nav from "./nav";
import sidebar from "./sidebar";

export default defineConfig({
  title: "OpenDoc",
  description: "OpenDoc",
  themeConfig: {
    nav : nav,
    sidebar: sidebar, // 页面左侧导航栏
    outline: [2,3], // 页面右侧导航栏深度
    socialLinks: [
      { icon: 'twitter', link: 'https://gitlab.com/sh086' },
      { icon: 'github', link: 'https://gitlab.com/sh086' },
    ]
  }
})
