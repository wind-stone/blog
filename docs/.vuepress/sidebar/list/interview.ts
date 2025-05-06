export default {
    '/interview': [
        {
            text: '面试题目',
            prefix: '/interview',
            children: ['browser/', 'css/', 'algorithm/interview/', 'nodejs/'],
        },
        {
            text: 'JS 面试题',
            prefix: '/interview/javascript',
            children: [
                {
                    text: '前端基础',
                    prefix: 'foundation',
                    children: ['data-type/', 'execution-context/', 'execution-mechanism/'],
                },
                {
                    text: '前端编码',
                    prefix: 'coding',
                    children: ['basic-api-usage/', 'program-design/'],
                },
                {
                    text: '性能优化',
                    prefix: 'performance-optimization',
                    children: ['debounce-throttle/'],
                },
            ],
        },
        {
            text: '专题',
            prefix: '/interview/topic',
            children: ['large-file-upload'],
        },
        {
            text: '数据结构',
            prefix: '/interview/data-structure',
            children: ['binary-tree', 'heap/', 'stack-queue/'],
        },
        {
            text: '算法',
            prefix: '/interview/algorithm',
            children: [
                {
                    text: '排序',
                    prefix: 'sorting-algorithm',
                    children: [
                        '',
                        'bubble-sort/',
                        'selection-sort/',
                        'insertion-sort/',
                        'merge-sort/',
                        'quick-sort/',
                    ],
                },
                {
                    text: '其他',
                    prefix: 'others',
                    children: ['binary-search/', 'fibonacci-sequence'],
                },
            ],
        },
    ],
};
