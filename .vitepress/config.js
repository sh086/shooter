import { defineConfig } from "vitepress";
import nav from "./nav";
import sidebar from "./sidebar";

export default defineConfig ({
    base: '/course', // 项目访问路径
    description: "知识库",
    outDir: './dist', // 自定义打包路径
    lang: 'zh-CN',
    lastUpdated: 'true',
    markdown: {
        // theme: "github-light",
        lineNumbers: true
    },
    titleTemplate:'知识库',
    themeConfig: {
        logo: '/logo.svg',
        nav: nav,
        sidebar: sidebar,
        socialLinks:[
            { icon: 'github', link: 'https://gitlab.com/sh086' }
        ],
        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2023-present S.H'
        },
        docFooter: {
            prev: '上一页',
            next: '下一页'
        }
    },
})