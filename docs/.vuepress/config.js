const sidebar = require('./sidebar-config');

module.exports = {
    title: '风动之石的博客', // 网站的标题
    description: '记录工作，记录生活', // 网站的描述
    head: [ // 额外的需要被注入到当前页面的 HTML <head> 中的标签
        ['link', { rel: 'icon', href: '/img/long.png' }]
    ],

    markdown: {
        lineNumbers: true, // 是否在每个代码块的左侧显示行号
        toc: { // 控制 [[TOC]] 默认行为
            includeLevel: [2, 3, 4, 5] // 决定哪些级别的标题会被显示在目录中，默认值为 [2, 3]
        }
    },

    // base: '/', // 基础路径，默认值
    // host: '0.0.0.0', // 指定用于 dev server 的主机名，默认值
    // port: 8080, // 指定 dev server 的端口，默认值
    // dest: '.vuepress/dist', // 指定 vuepress build 的输出目录。如果传入的是相对路径，则会基于 process.cwd() 进行解析
    // ...（另有一些选项，可能不需要重置，就没列在此处）

    themeConfig: {
        sidebarDepth: 2,
        nav: [
            { text: 'Vue 2.x 源码学习', link: '/vue/source-study/' },
            {
                text: 'JavaScript',
                items: [
                    {
                        text: 'JavaScript',
                        link: '/js/data-types/',
                    },
                    {
                        text: 'TypeScript',
                        link: '/typescript/',
                    }
                ],
            },
            { text: 'ES6+', link: '/es6/' },
            { text: 'CSS', link: '/css/selectors/' },
            { text: '浏览器环境', link: '/browser-env/browser/' },
            { text: '前端工程化', link: '/front-end-engineering/project/init' },
            { text: '小程序', link: '/mini-program/weixin/' },
            { text: '全栈技能', link: '/full-stack/' },
            { text: '技术文章', link: '/articles/string-literal/' },
            { text: 'GitHub', link: 'https://github.com/wind-stone' },
            { text: '随记', link: '/wander/house/' }
        ],
        sidebar
    }
};
