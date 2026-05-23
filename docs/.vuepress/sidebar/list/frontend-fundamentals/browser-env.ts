export default {
    '/frontend-fundamentals/browser-env/': [
        {
            text: '浏览器',
            prefix: '/frontend-fundamentals/browser-env/browser',
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
                'fingerprint',
            ],
        },
        {
            text: 'HTML/DOM',
            prefix: '/frontend-fundamentals/browser-env/html-dom',
            children: [
                'elements/',
                'attributes-properties/attributes',
                'attributes-properties/properties',
                'attributes-properties/differences-between-properties-and-attributes',
                'image/',
                'image/image-lazy-load',
                'svg/',
            ],
        },
        {
            text: '事件',
            prefix: '/frontend-fundamentals/browser-env/events',
            children: ['', 'blur'],
        },
        {
            text: '网络',
            prefix: '/frontend-fundamentals/browser-env/network',
            children: ['http/', 'https/', 'http2/', 'cors/', 'dns'],
        },
        {
            text: '安全',
            prefix: '/frontend-fundamentals/browser-env/security',
            children: ['', 'xss', 'csrf', 'chrome-security-policy', 'cross-domain', 'same-site'],
        },
        {
            text: 'Hybrid',
            prefix: '/frontend-fundamentals/browser-env/hybrid',
            children: ['h52app', 'jsbridge', 'universal-links'],
        },
        {
            text: '浏览器厂商及应用环境',
            prefix: '/frontend-fundamentals/browser-env/vendor-app',
            children: ['wechat/', 'wechat/android-weixin-auto-open-browser'],
        },
        {
            text: '浏览器兼容性',
            prefix: '/frontend-fundamentals/browser-env/compatibility',
            children: ['', 'video', 'audio', 'input-delay/', 'ios/', 'ios/safari-script-block-render'],
        },
        {
            text: '滚动专题',
            prefix: '/frontend-fundamentals/browser-env/scroll',
            children: ['', 'touch-event', 'click-delay', 'fastclick', 'no-bg-scroll'],
        },
        {
            text: '未分类',
            prefix: '/frontend-fundamentals/browser-env/unclassified',
            children: ['web-components', 'pwa', 'file-system', 'keyboard'],
        },
    ],
};
