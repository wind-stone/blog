export default {
    '/frontend-fundamentals/code-snippet/': [
        {
            text: 'JS 代码片段',
            children: [
                {
                    text: '工具函数',
                    prefix: '/frontend-fundamentals/code-snippet/js/utils',
                    children: ['data-type', 'env', 'version', 'event-emitter', 'queen-next', 'format'],
                },

                {
                    text: '浏览器环境',
                    prefix: '/frontend-fundamentals/code-snippet/js/browser',
                    children: ['class', 'cookie', 'url', 'load-script', 'storage', 'clipboard'],
                },

                '/frontend-fundamentals/code-snippet/js/server/',
                '/frontend-fundamentals/code-snippet/js/validate/',
            ],
        },

        {
            text: '浏览器代码片段',
            children: ['/frontend-fundamentals/code-snippet/browser-env/rem/'],
        },

        {
            text: 'Vue 2.x 组件',
            prefix: '/frontend-fundamentals/code-snippet/vue-components',
            children: ['base-marquee', 'common-popup'],
        },
    ],
};
