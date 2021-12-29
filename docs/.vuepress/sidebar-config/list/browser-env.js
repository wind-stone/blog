module.exports = {
    '/browser-env/': [
        {
            text: '浏览器',
            children: [
                '/browser-env/browser/how-browsers-work',
                '/browser-env/browser/first-paint',
                '/browser-env/browser/process-thread',
                '/browser-env/browser/event-loop',
                '/browser-env/browser/cache',
                '/browser-env/browser/performance',
                '/browser-env/browser/browser-api',
                '/browser-env/browser/browser-requests',
                '/browser-env/browser/faq',
                '/browser-env/browser/dev-tools/'
            ]
        },
        {
            text: 'HTML/DOM',
            children: [
                '/browser-env/html-dom/elements/',
                '/browser-env/html-dom/attributes-properties/attributes',
                '/browser-env/html-dom/attributes-properties/properties',
                '/browser-env/html-dom/attributes-properties/differences-between-properties-and-attributes',
                '/browser-env/html-dom/events/',
                '/browser-env/html-dom/image/',
                '/browser-env/html-dom/image/image-lazy-load',
                '/browser-env/html-dom/svg/',
            ]
        },
        {
            text: '网络',
            children: [
                '/browser-env/network/http/',
                '/browser-env/network/https/',
                '/browser-env/network/http2/',
                '/browser-env/network/cors/',
                '/browser-env/network/dns',
            ]
        },
        {
            text: '安全',
            children: [
                '/browser-env/security/',
                '/browser-env/security/chrome-security-policy',
                '/browser-env/security/cross-domain',
                '/browser-env/security/same-site',
            ]
        },
        {
            text: 'Hybrid',
            children: [
                '/browser-env/hybrid/h52app',
                '/browser-env/hybrid/jsbridge',
                '/browser-env/hybrid/universal-links',
            ]
        },
        {
            text: '浏览器厂商及应用环境',
            children: [
                '/browser-env/vendor-app/wechat/',
                '/browser-env/vendor-app/wechat/android-weixin-auto-open-browser',
            ]
        },
        {
            text: '浏览器兼容性',
            children: [
                '/browser-env/compatibility/',
                '/browser-env/compatibility/video',
                '/browser-env/compatibility/audio',
                '/browser-env/compatibility/input-delay/',
                '/browser-env/compatibility/ios/',
                '/browser-env/compatibility/ios/safari-script-block-render',
            ]
        },
        {
            text: '滚动专题',
            children: [
                '/browser-env/scroll/',
                '/browser-env/scroll/touch-event',
                '/browser-env/scroll/click-delay',
                '/browser-env/scroll/fastclick',
                '/browser-env/scroll/no-bg-scroll'
            ]
        },
        {
            text: '未分类',
            children: [
                '/browser-env/unclassified/web-components',
                '/browser-env/unclassified/pwa',
                '/browser-env/unclassified/file-system',
                '/browser-env/unclassified/keyboard',
            ]
        }
    ],
};
