export default {
    '/code-snippet': [
        {
            text: 'JS 代码片段',
            children: [
                {
                    text: '工具函数',
                    prefix: '/code-snippet/js/utils',
                    children: [
                        'data-type',
                        'env',
                        'version',
                        'event-emitter',
                        'queen-next',
                        'format',
                    ]
                },

                {
                    text: '浏览器环境',
                    prefix: '/code-snippet/js/browser',
                    children: [
                        'class',
                        'cookie',
                        'url',
                        'load-script',
                        'storage',
                        'clipboard',
                    ]
                },

                '/code-snippet/js/server/',
                '/code-snippet/js/validate/'
            ]
        },

        {
            text: '浏览器代码片段',
            children: [
                '/code-snippet/browser-env/rem/',
            ]
        },

        {
            text: 'Vue 2.x 组件',
            prefix: '/code-snippet/vue-components',
            children: [
                'base-marquee',
                'common-popup',
            ]
        },
    ]
};
