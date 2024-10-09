export default {
    '/browser-env/': [
        {
            text: '浏览器',
            prefix: '/browser-env/browser',
            children: [
                'how-browsers-work',
                'first-paint',
                'process-thread',
                'event-loop',
                'cache',
                'performance/',
                'browser-api',
                'browser-requests',
                'faq',
                'dev-tools/',
                'fingerprint'
            ]
        },
        {
            text: 'HTML/DOM',
            prefix: '/browser-env/html-dom',
            children: [
                'elements/',
                'attributes-properties/attributes',
                'attributes-properties/properties',
                'attributes-properties/differences-between-properties-and-attributes',
                'image/',
                'image/image-lazy-load',
                'svg/',
            ]
        },
        {
            text: '事件',
            prefix: '/browser-env/events',
            children: [
                '',
                'blur',
            ]
        },
        {
            text: '网络',
            prefix: '/browser-env/network',
            children: [
                'http/',
                'https/',
                'http2/',
                'cors/',
                'dns',
            ]
        },
        {
            text: '安全',
            prefix: '/browser-env/security',
            children: [
                '',
                'chrome-security-policy',
                'cross-domain',
                'same-site',
            ]
        },
        {
            text: 'Hybrid',
            prefix: '/browser-env/hybrid',
            children: [
                'h52app',
                'jsbridge',
                'universal-links',
            ]
        },
        {
            text: '浏览器厂商及应用环境',
            prefix: '/browser-env/vendor-app',
            children: [
                'wechat/',
                'wechat/android-weixin-auto-open-browser',
            ]
        },
        {
            text: '浏览器兼容性',
            prefix: '/browser-env/compatibility',
            children: [
                '',
                'video',
                'audio',
                'input-delay/',
                'ios/',
                'ios/safari-script-block-render',
            ]
        },
        {
            text: '滚动专题',
            prefix: '/browser-env/scroll',
            children: [
                '',
                'touch-event',
                'click-delay',
                'fastclick',
                'no-bg-scroll'
            ]
        },
        {
            text: '未分类',
            prefix: '/browser-env/unclassified',
            children: [
                'web-components',
                'pwa',
                'file-system',
                'keyboard',
            ]
        }
    ],
};
