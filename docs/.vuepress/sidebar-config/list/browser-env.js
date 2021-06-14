module.exports = {
    '/browser-env/': [
        {
            title: '浏览器',
            collapsable: false,
            children: [
                'browser/',
                'browser/process-thread',
                'browser/open-page-process',
                'browser/event-loop',
                'browser/performance',
                'browser/browser-api',
                'browser/browser-requests',
                'browser/faq',
                'browser/dev-tools/'
            ]
        },
        {
            title: 'HTML/DOM',
            collapsable: false,
            children: [
                'html-dom/elements/',
                'html-dom/attributes-properties/attributes',
                'html-dom/attributes-properties/properties',
                'html-dom/attributes-properties/differences-between-properties-and-attributes',
                'html-dom/events/',
                'html-dom/image/',
                'html-dom/image/image-lazy-load',
            ]
        },
        {
            title: '网络',
            collapsable: false,
            children: [
                'network/http/',
                'network/https/',
                'network/http2/',
                'network/dns',
            ]
        },
        {
            title: '安全',
            collapsable: false,
            children: [
                'security/',
                'security/cross-domain'
            ]
        },
        {
            title: 'Hybrid',
            collapsable: false,
            children: [
                'hybrid/h52app',
                'hybrid/jsbridge',
                'hybrid/universal-links',
            ]
        },
        {
            title: '浏览器厂商及应用环境',
            collapsable: false,
            children: [
                'vendor-app/wechat/',
                'vendor-app/wechat/android-weixin-auto-open-browser',
            ]
        },
        {
            title: '浏览器兼容性',
            collapsable: false,
            children: [
                'compatibility/',
                'compatibility/video',
                'compatibility/audio',
                'compatibility/input-delay/',
                'compatibility/ios/',
                'compatibility/ios/safari-script-block-render',
            ]
        },
        {
            title: '滚动专题',
            collapsable: false,
            children: [
                'scroll/',
                'scroll/touch-event',
                'scroll/click-delay',
                'scroll/fastclick',
                'scroll/performance',
                'scroll/no-bg-scroll'
            ]
        },
        {
            title: '代码片段',
            collapsable: false,
            children: [
                'code-snippet/rem/',
            ]
        },
        {
            title: '未分类',
            collapsable: false,
            children: [
                'unclassified/web-components',
                'unclassified/pwa',
                'unclassified/file-system',
                'unclassified/keyboard',
            ]
        }
    ],
};
