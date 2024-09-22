export default {
    // 技术文章
    '/articles/': [
        {
            title: '文章列表',
            collapsable: false,
            children: [
                '/articles/string-literal/',
                '/articles/line-terminator/',
                '/articles/wechat-mini-program-sourcemap/'
            ]
        },
        {
            title: '日常阅读文章',
            collapsable: false,
            children: [
                '/articles/good-articles/',
                '/articles/good-articles/javascript',
            ]
        }
    ]
};
