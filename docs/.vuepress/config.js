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
            { text: 'Vue 源码学习', link: '/vue/source-study/' },
            { text: 'CSS 规范-翻译', link: '/css-spec/css2.2/9-visual-formatting-model/' },
            {
                text: 'Front End',
                items: [
                    { text: 'JavaScript', link: '/front-end/js/' },
                    { text: 'CSS', link: '/front-end/css/topics/position-fixed' },
                    { text: 'HTML-DOM', link: '/front-end/html-dom/' },
                    { text: '浏览器环境', link: '/front-end/browser-env/browser/' },
                    { text: 'MVVM', link: '/front-end/mvvm/virtual-dom/' },
                    { text: '兼容性', link: '/front-end/compatibility/' },
                    { text: '用户体验', link: '/front-end/user-experience/' },
                    { text: '工程化', link: '/front-end/engineering/project-init' },
                    { text: '奇技淫巧', link: '/front-end/skills/android-weixin-auto-open-browser' },
                    { text: '踩过的坑', link: '/front-end/pitfall/' },
                    { text: '前端面试题', link: '/front-end/interview/js-interview' }
                ]
            },
            { text: 'Back End', link: '/back-end/' },
            { text: 'General Knowledge', link: '/general-knowledge/' },
            { text: 'ES6+', link: '/es6/' },
            { text: '代码片段', link: '/code-snippet/' },
            { text: '算法', link: '/algorithm/sorting-algorithm/' },
            { text: 'GitHub', link: 'https://github.com/wind-stone' },
            { text: '随记', link: '/wander/house/' }
        ],
        sidebar
    }
};
