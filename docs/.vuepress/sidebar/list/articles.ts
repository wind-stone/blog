export default {
    // 技术文章
    '/articles/': [
        {
            text: '文章列表',
            collapsable: false,
            prefix: '/articles',
            children: [
                'string-literal/',
                'line-terminator/',
                'wechat-mini-program-sourcemap/'
            ]
        },
        {
            text: '日常阅读文章',
            collapsable: false,
            prefix: '/articles',
            children: [
                'good-articles/',
                'good-articles/javascript',
            ]
        }
    ]
};
