import path from 'path';
import { defineUserConfig } from 'vuepress-vite';
import type { DefaultThemeOptions } from 'vuepress-vite';
const sidebar = require('./sidebar-config');

export default defineUserConfig<DefaultThemeOptions>({
    title: '风动之石的博客',          // 网站的标题
    description: '记录工作，记录生活', // 网站的描述
    // head: [                         // 额外的需要被注入到当前页面的 HTML <head> 中的标签
    //     ['link', {
    //         rel: 'icon',
    //         href: '/img/long.png'
    //     }]
    // ],

    // 开发配置项
    debug: true,                    // 是否启用 Debug 模式
    open: true,                     // 是否在开发服务器启动后打开浏览器

    // markdown 配置
    markdown: {
        toc: {                      // 控制 [[TOC]] 默认行为
            level: [2, 3, 4, 5]     // 决定哪些级别的标题会被显示在目录中，默认值为 [2, 3]
        },

        importCode: {
            handleImportPath: (str) =>
                str.replace(/^@components/, path.resolve(__dirname, './components')),
        },
    },

    // 主题配置
    themeConfig: {
        logo: '/images/logo.png',
        navbar: [
            { text: 'Vue 2.x 源码学习', link: '/vue/source-study/' },
            {
                text: 'JavaScript',
                children: [
                    { text: 'JavaScript', link: '/js/data-types/', activeMatch: '^/js' },
                    { text: 'ES6+', link: '/es6/', activeMatch: '^/es6' },
                    { text: 'TypeScript', link: '/typescript/', activeMatch: '^/typescript' }
                ],
            },
            {
                text: 'HTML/CSS/浏览器',
                children: [
                    { text: 'CSS', link: '/css/selectors/', activeMatch: '^/css' },
                    { text: '浏览器', link: '/browser-env/browser/', activeMatch: '^/browser-env' },
                    { text: '小程序', link: '/mini-program/weixin/', activeMatch: '^/mini-program' },
                ],
            },
            { text: '前端工程化', link: '/front-end-engineering/project/init' },
            { text: '全栈技能', link: '/full-stack/' },
            {
                text: '代码片段/技术文章',
                children: [
                    { text: '代码片段', link: '/code-snippet/', activeMatch: '^/code-snippet' },
                    { text: '技术文章', link: '/articles/string-literal/', activeMatch: '^/articles' }
                ]
            },
            { text: 'GitHub', link: 'https://github.com/wind-stone' },
            { text: '随记', link: '/wander/house/' }
        ],

        sidebarDepth: 1,
        sidebar,
        lastUpdated: false,
        contributors: false
    }
});
