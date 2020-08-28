module.exports = {
    // JavaScript
    '/front-end/js/': [
        {
            title: 'JavaScript',
            collapsable: true,
            children: [
                '',
                'functional-programming',
            ]
        },
        {
            title: '数据结构',
            collapsable: true,
            children: [
                'data-structure/number/',
                'data-structure/number/js-number-implementation',
                'data-structure/string/',
                'data-structure/object/',
                'data-structure/reg-exp/',
                'data-structure/type-conversion',
            ]
        },
        {
            title: '事件循环',
            collapsable: true,
            children: [
                'event-loop/'
            ]
        },
        {
            title: '性能',
            collapsable: true,
            children: [
                'performance/'
            ]
        },
        {
            title: '原型',
            collapsable: true,
            children: [
                'prototype/',
                'prototype/this'
            ]
        },
        {
            title: '运算符',
            collapsable: true,
            children: [
                'operators/',
                'operators/bitwise-operators'
            ]
        },
        {
            title: '执行机制',
            collapsable: true,
            children: [
                'execution-mechanism/'
            ]
        },
        {
            title: 'TypeScript',
            collapsable: true,
            children: [
                'typescript/'
            ]
        }
    ],

    // CSS
    '/front-end/css/': [
        {
            title: 'CSS 专题',
            collapsable: true,
            children: [
                'topics/position-fixed',
                'topics/flex-image/',
                'topics/text-wrap-and-ellipsis/'
            ]
        },
        {
            title: '选择器',
            collapsable: true,
            children: [
                'selectors/'
            ]
        },
        {
            title: '属性',
            collapsable: true,
            children: [
                'properties/',
                'properties/properties-order'
            ]
        },
        {
            title: '屏幕',
            collapsable: true,
            children: [
                'screen/'
            ]
        },
        {
            title: '视口',
            collapsable: true,
            children: [
                'viewport/a-tale-of-viewports-one',
                'viewport/a-tale-of-viewports-two'
            ]
        },
        {
            title: '布局',
            collapsable: true,
            children: [
                'layouts/',
                'layouts/ifc/'
            ]
        },
        {
            title: '字体',
            collapsable: true,
            children: [
                'font/',
                'font/css-font-metrics-line-height-and-vertical-align'
            ]
        },
        {
            title: '实践',
            collapsable: true,
            children: [
                'practices/'
            ]
        }
    ],

    // HMLT-DOM
    '/front-end/html-dom/': [
        {
            title: 'HTML 专题',
            collapsable: true,
            children: [
                'topics/differences-between-properties-and-attributes'
            ]
        },
        {
            title: '元素',
            collapsable: true,
            children: [
                'elements/',
                'elements/meta',
                'elements/file-download/',
                'elements/script'
            ]
        },
        {
            title: '特性',
            collapsable: true,
            children: [
                'attributes/'
            ]
        },
        {
            title: '属性',
            collapsable: true,
            children: [
                'properties/'
            ]
        },
        {
            title: '图片',
            collapsable: true,
            children: [
                'image/',
                'image/image-lazy-load'
            ]
        },
        {
            title: 'DOM 事件',
            collapsable: true,
            children: [
                'events/'
            ]
        }
    ],

    // 浏览器环境
    '/front-end/browser-env/': [
        {
            title: '浏览器',
            collapsable: true,
            children: [
                'browser/',
                'browser/working-principle',
                'browser/event-loop',
                'browser/browser-requests',
                'browser/process-thread',
                'browser/open-page-process',
                'browser/browser-api'
            ]
        },
        {
            title: '日志 & 错误处理 & 调试',
            collapsable: true,
            children: [
                'log/error-handler',
                'log/image-log',
                'log/console/',
                'log/debug/'
            ]
        },
        {
            title: '网络',
            collapsable: true,
            children: [
                'network/http',
                'network/https/'
            ]
        },
        {
            title: '安全',
            collapsable: true,
            children: [
                'security/',
                'security/cross-domain'
            ]
        },
        {
            title: '键盘',
            collapsable: true,
            children: [
                'keyboard/'
            ]
        },
        {
            title: 'Hybrid',
            collapsable: true,
            children: [
                'hybrid/h52app',
                'hybrid/jsbridge'
            ]
        },
        {
            title: '未分类',
            collapsable: true,
            children: [
                'memory',
                'file-system',
                'pwa',
                'web-components'
            ]
        }
    ],

    // 兼容性
    '/front-end/compatibility/': [
        {
            title: 'JS 兼容性',
            collapsable: true,
            children: [
                'js/'
            ]
        },
        {
            title: 'CSS 兼容性',
            collapsable: true,
            children: [
                'css/',
                'css/ie',
                'css/android-small-fontsize'
            ]
        },
        {
            title: 'HTML-DOM 兼容性',
            collapsable: true,
            children: [
                'html-dom/video',
                'html-dom/media',
                'html-dom/input-delay/'
            ]
        },
        {
            title: 'iOS',
            collapsable: true,
            children: [
                'ios/',
                'ios/safari-script-block-render',
            ]
        }
    ],

    // 用户体验
    '/front-end/user-experience/': [
        {
            title: '用户体验',
            collapsable: true,
            children: [
                ''
            ]
        }
    ],

    // MVVM
    '/front-end/mvvm/': [
        {
            title: 'MVVM',
            collapsable: true,
            children: [
                'virtual-dom/'
            ]
        }
    ],

    // 专题
    '/front-end/topics/': [
        {
            title: '滚动',
            collapsable: true,
            children: [
                'scroll/',
                'scroll/touch-event',
                'scroll/click-delay',
                'scroll/fastclick'
            ]
        }
    ],

    // 工程化
    '/front-end/engineering/': [
        {
            title: '工程化',
            collapsable: true,
            children: [
                'project-init',
                'rollup'
            ]
        },
        {
            title: '命名规范',
            collapsable: true,
            children: [
                'naming-convention/js-naming'
            ]
        },
        {
            title: 'ESLint',
            collapsable: true,
            children: [
                'eslint/',
                'eslint/vscode-eslint',
                'eslint/vue-eslint',
                'eslint/prettier-eslint'
            ]
        },
        {
            title: 'Webpack',
            collapsable: true,
            children: [
                'webpack/',
                'webpack/config',
                'webpack/webpack-runtime',
                'webpack/tapable/',
                'webpack/webpack4-import',
                'webpack/practices'
            ]
        }
    ],

    // 奇技淫巧
    '/front-end/skills/': [
        {
            title: '奇技淫巧',
            collapsable: true,
            children: [
                'android-weixin-auto-open-browser'
            ]
        }
    ],

    // 踩过的坑
    '/front-end/pitfall/': [
        {
            title: '踩过的坑',
            collapsable: true,
            children: [
                ''
            ]
        }
    ],

    '/front-end/interview/': [
        {
            title: '前端面试题',
            collapsable: true,
            children: [
                'js-interview',
                'browser-interview'
            ]
        }
    ]
};
