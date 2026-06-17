export default {
    // 浏览器
    '/interview/browser': [
        {
            text: '浏览器基础',
            prefix: '/interview/browser',
            children: ['inter-page-communication'],
        },
        {
            text: '浏览器渲染机制',
            prefix: '/interview/browser',
            children: [
                'the-process-of-input-an-url',
                'script-defer-async',
                'the-reason-for-the-position-of-css-and-js-in-html',
            ],
        },
        {
            text: 'HTML & DOM',
            prefix: '/interview/browser',
            children: ['the-difference-between-dom-property-and-html-attribute', 'event-delegation', 'flip-ul'],
        },
        {
            text: 'CSS',
            prefix: '/interview/browser/css',
            children: [
                {
                    text: '布局',
                    prefix: 'layout',
                    children: ['footer-attach-to-the-bottom', 'two-columns-layout'],
                },
                {
                    text: 'position 定位',
                    prefix: 'position',
                    children: ['position-question-1', 'position-question-2'],
                },
                'hide-elements-methods',
                'self-fit-square',
            ],
        },
        {
            text: '网络',
            prefix: '/interview/browser/network',
            children: [''],
        },
    ],
};
