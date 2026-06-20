export default {
    // 数据结构+算法
    '/interview/algorithm': [
        {
            text: '算法题',
            prefix: '/interview/algorithm/interview',
            children: [
                {
                    text: '大模型相关',
                    prefix: 'llm',
                    children: ['parse-markdown-to-dom'],
                },
                {
                    text: '二分搜索',
                    prefix: 'binary-search',
                    children: ['', 'binary-search'],
                },

                'fibonacci-sequence',
                'the-all-nodes-of-binary-tree',
                'the-self-closing-string',
            ],
        },

        {
            text: '数据结构',
            prefix: '/interview/algorithm/data-structure',
            children: ['heap/', 'stack-queue/'],
        },
        {
            text: '基础算法',
            prefix: '/interview/algorithm',
            children: [
                {
                    text: '排序',
                    prefix: 'sorting-algorithm',
                    children: ['', 'bubble-sort/', 'selection-sort/', 'insertion-sort/', 'merge-sort/', 'quick-sort/'],
                },
            ],
        },
        {
            text: 'LeetCode',
            prefix: '/interview/algorithm/leetcode',
            children: [
                '11-container-with-most-water',
                '54-spiral-matrix',
                '74-search-a-2d-matrix',
                '92-reverse-linked-list-ii.md',
                '206-reverse-linked-list.md',
                '114-flatten-binary-tree-to-linked-list',
                '129-sum-root-to-leaf-numbers.md',
                '130-surrounded-regions.md',
                '179-largest-number',
                '198-house-robber',
                '213-house-robber-ii',
                '200-number-of-islands',
                '695-max-area-of-island.md',
                '215-kth-largest-element-in-an-array',
                '384-shuffle-an-array',
                '526-beautiful-arrangement',
                '622-design-circular-queue',
                '912-sort-an-array',
                'partition-array-into-three-parts-with-equal-sum',
            ],
        },
    ],
};
