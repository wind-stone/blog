export default {
    '/css/': [
        {
            text: 'CSS 技能',
            children: [
                {
                    text: '布局',
                    prefix: '/css/skills',
                    children: [
                        'line-boxes-truncation-style',
                        'dog-ear',
                    ]
                }
            ]
        },
        {
            text: '专题',
            prefix: '/css/topics',
            children: [
                {
                    text: 'Flex 布局',
                    prefix: 'flex/',
                    children: [
                        '',
                        'flex-image/',
                    ]
                },
                {
                    text: '文本',
                    children: [
                        'text/text-wrap-and-ellipsis/',
                    ]
                },
                {
                    text: '边框',
                    children: [
                        'border/border-image',
                    ]
                },
                'position-fixed',
            ]
        },
        {
            text: '选择器',
            children: [
                '/css/selectors/'
            ]
        },
        {
            text: '属性',
            prefix: '/css/properties',
            children: [
                '',
                'properties-order'
            ]
        },
        {
            text: '屏幕',
            children: [
                '/css/screen/'
            ]
        },
        {
            text: '视口',
            prefix: '/css/viewport',
            children: [
                'a-tale-of-viewports-one',
                'a-tale-of-viewports-two'
            ]
        },
        {
            text: '布局',
            prefix: '/css/layouts',
            children: [
                '',
                'ifc/'
            ]
        },
        {
            text: '字体',
            prefix: '/css/font',
            children: [
                '',
                'css-font-metrics-line-height-and-vertical-align'
            ]
        },
        {
            text: '实践',
            prefix: '/css/practices',
            children: [
                ''
            ]
        },
        {
            text: '预处理器',
            prefix: '/css/preprocessor',
            children: [
                'less',
                'stylus',
            ]
        },
        {
            text: '工具集合',
            prefix: '/css/tools',
            children: [
                'safe-area',
                'text-ellipsis',
            ]
        },
        {
            text: 'CSS 2.2 规范',
            prefix: '/css/css-spec',
            children: [
                'css2.2/8-box-model/',
                'css2.2/9-visual-formatting-model/'
            ]
        },
        {
            text: '未分类',
            prefix: '/css/unclassified',
            children: [
                'user-experience',
                'compatibility',
                'skill-pitfall'
            ]
        }
    ],
};
