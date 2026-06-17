export default {
    '/interview/javascript': [
        {
            text: '库',
            prefix: '/interview/javascript/javascript-libs',
            children: [
                {
                    text: 'Vue',
                    prefix: 'vue',
                    children: ['', 'vue3'],
                },
            ],
        },
        {
            text: '性能优化',
            prefix: '/interview/javascript/performance-optimization',
            children: ['devtools/', 'debounce-throttle/'],
        },
        {
            text: 'Node.js',
            prefix: '/interview/javascript/nodejs',
            children: [''],
        },
        {
            text: '专题',
            prefix: '/interview/javascript/topic',
            children: ['large-file-upload'],
        },
    ],
};
