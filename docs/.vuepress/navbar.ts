export default [
    { text: 'Vue 2.x 源码学习', link: '/vue/source-study/' },
    {
        text: 'JavaScript',
        children: [
            { text: 'JavaScript', link: '/js/data-types/', activeMatch: '^/js' },
            { text: 'ES6+', link: '/es6/', activeMatch: '^/es6' },
            { text: 'TypeScript', link: '/typescript/', activeMatch: '^/typescript' },
            { text: 'React', link: '/react/hooks/', activeMatch: '^/react' }
        ],
    },
    {
        text: 'HTML/CSS/浏览器',
        children: [
            { text: 'CSS', link: '/css/selectors/', activeMatch: '^/css' },
            { text: 'CSS/JS 动画效果', link: '/animation-effects/', activeMatch: '^/animation-effects/' },
            { text: '浏览器', link: '/browser-env/browser/how-browsers-work', activeMatch: '^/browser-env' },
            { text: '小程序', link: '/mini-program/weixin/', activeMatch: '^/mini-program' },
        ],
    },
    {
        text: '前端工程化',
        children: [
            {
                text: '开发环境',
                link: '/front-end-engineering/environment/ide/vscode',
                activeMatch: '^/front-end-engineering/environment'
            },
            {
                text: '开发流程工具',
                link: '/front-end-engineering/tools/build/source-map',
                activeMatch: '^/front-end-engineering/tools'
            },
            {
                text: '开发技能',
                link: '/front-end-engineering/development-skills/h5/',
                activeMatch: '^/front-end-engineering/development-skills'
            },
            {
                text: '前端稳定性建设',
                link: '/front-end-engineering/frontend-stability-construction/',
                activeMatch: '^/front-end-engineering/frontend-stability-construction'
            },
        ],
    },
    {
        text: '全栈技能',
        children: [
            {
                text: '设计模式',
                link: '/full-stack/design-patterns/singleton-pattern'
            },
            {
                text: '操作系统与命令行',
                link: '/full-stack/operating-system/linux/'
            },

            {
                text: '数据管理',
                link: '/full-stack/data-management/kafka/'
            },
            {
                text: '后端开发',
                link: '/full-stack/backend/nestjs/'
            },
            {
                text: '全栈开发的软件使用',
                link: '/full-stack/software/nginx/'
            },
            {
                text: '其他',
                link: '/full-stack/others/google-cloud'
            },
        ]
    },
    {
        text: '代码片段/技术文章',
        children: [
            { text: '代码片段', link: '/code-snippet/', activeMatch: '^/code-snippet' },
            { text: '技术文章', link: '/articles/string-literal/', activeMatch: '^/articles' },
            { text: '面试题库', link: '/interview/', activeMatch: '^/interview' }
        ]
    },
    { text: 'GitHub', link: 'https://github.com/wind-stone' },
    { text: '随记', link: '/wander/house/' }
]
