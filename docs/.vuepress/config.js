module.exports = {
  title: 'Wind Stone\'s blog',
  description: '记录工作，记录生活',
  markdown: {
    lineNumbers: true,
    toc: {
      includeLevel: [2, 3, 4, 5]
    }
  },
  head: [
    ['link', { rel: 'icon', href: `/img/long.png` }]
  ],
  themeConfig: {
    lastUpdated: 'Last Updated',
    sidebarDepth: 2,
    nav: [
      { text: 'Vue 源码学习', link: '/vue/source-study/' },
      { text: '前端专题', link: '/web-topics/' },
      { text: '前端知识点', link: '/knowledge/' },
      { text: '移动端', link: '/mobile/feature/' },
      { text: 'ES6+', link: '/es6/' },
      { text: '开发环境/工具', link: '/tools/git/' },
      { text: 'Code Snippet', link: '/code-snippet/js/' },
      { text: '算法', link: '/algorithm/sorting-algorithm/' },
      { text: 'GitHub', link: 'https://github.com/wind-stone' },
      { text: '随记', link: '/wander/house/' }
    ],
    sidebar: {
      // Vue 源码学习
      '/vue/source-study/': [
        {
          title: '总览',
          collapsable: false,
          children: [
            '',
            'vue-constructor',
            'skills'
          ]
        },
        {
          title: '实例化',
          collapsable: false,
          children: [
            'instance/create',
            'instance/state/',
            'instance/state/props',
            'instance/state/methods',
            'instance/state/data',
            'instance/state/computed',
            'instance/state/watch',
            'instance/directives',
            'instance/events'
          ]
        },
        {
          title: '组件化',
          collapsable: false,
          children: [
            'component/register',
            'component/options',
            'component/async-component',
            'component/functional-component',
            'component/extend'
          ]
        },
        {
          title: '响应式原理',
          collapsable: false,
          children: [
            'observer/',
            'observer/dep-collection',
            'observer/notify-update',
            'observer/dep',
            'observer/watcher',
            'observer/scheduler',
          ]
        },
        {
          title: 'Virtual Dom',
          collapsable: false,
          children: [
            'vdom/',
            'vdom/vnode-tree-create',
            'vdom/patch',
            'vdom/patch-vnode',
            'vdom/child-component-create',
            'vdom/patch-modules/',
            'vdom/patch-fn',
            'vdom/topics/dom-binding'
          ]
        },
        {
          title: '编译',
          collapsable: false,
          children: [
            'compile/',
            'compile/compile-process',
            'compile/base-compile',
            'compile/parse',
            'compile/parse-html',
            'compile/optimize'
          ]
        },
        {
          title: '编译专题',
          collapsable: false,
          children: [
            'compile/topics/event',
            'compile/topics/v-model',
            'compile/topics/slot'
          ]
        },
        {
          title: 'Util',
          collapsable: false,
          children: [
            'util/next-tick'
          ]
        },
        {
          title: 'Vuex',
          collapsable: false,
          children: [
            'vuex/'
          ]
        }
      ],

      // Vue 生态系列
      '/vue/vue-series/': [
        {
          title: 'Vue.js',
          collapsable: false,
          children: [
            'vuejs/',
            'vuejs/scoped-css'
          ]
        },
        {
          title: 'Vuex',
          collapsable: false,
          children: [
            'vuex/register-module'
          ]
        },
        {
          title: 'vue-router',
          collapsable: false,
          children: [
            'vue-router/',
            'vue-router/best-practice'
          ]
        }
      ],

      '/web-topics/': [
        {
          title: '滚动专题',
          collapsable: false,
          children: [
            'scroll/',
            'scroll/touch-event',
            'scroll/click-delay',
            'scroll/fastclick'
          ]
        },
      ],

      // 前端知识点
      '/knowledge/': [
        {
          title: '前端知识点',
          collapsable: false,
          children: [
            ''
          ]
        },
        {
          title: 'JavaScript',
          collapsable: false,
          children: [
            'js/',
            'js/data-structure',
            'js/event-loop',
            'js/prototype',
            'js/this',
            'js/functional-programming',
            'js/performance'
          ]
        },
        {
          title: 'CSS',
          collapsable: false,
          children: [
            'css/',
            'css/selectors/',
            'css/properties/',
            'css/layouts/',
            'css/layouts/ifc/',
            'css/flex-image/',
            'css/text-wrap-and-ellipsis/'
          ]
        },
        {
          title: 'HMLT-DOM',
          collapsable: false,
          children: [
            'html-dom/',
            'html-dom/elements/',
            'html-dom/attributes/',
            'html-dom/properties/',
            'html-dom/image/'
          ]
        },
        {
          title: '浏览器环境',
          collapsable: false,
          children: [
            'browser-env/',
            'browser-env/console/',
            'browser-env/debug/',
            'browser-env/error-handler',
            'browser-env/memory',
            'browser-env/cross-domain',
            'browser-env/security',
            'browser-env/file-system',
            'browser-env/file-download/',
            'browser-env/pwa',
            'browser-env/web-components',
            'browser-env/image-lazy-load'
          ]
        },
        {
          title: 'Node 环境',
          collapsable: false,
          children: [
            'node-env/'
          ]
        },
        {
          title: '网络',
          collapsable: false,
          children: [
            'network/dns'
          ]
        },
      ],

      // 移动端
      '/mobile/': [
        {
          title: '移动端 - 独有特性',
          collapsable: false,
          children: [
            'feature/',
            'feature/click-delay'
          ]
        },
        {
          title: '移动端 - Hybrid',
          collapsable: false,
          children: [
            'hybrid/h52app',
            'hybrid/jsbridge'
          ]
        },
        {
          title: '移动端 - 通用兼容性',
          collapsable: false,
          children: [
            'compatibility/general/',
            'compatibility/general/input-delay/',
            'compatibility/general/media',
            'compatibility/general/video'
          ]
        },
        {
          title: '移动端 - JS 兼容性',
          collapsable: false,
          children: [
            'compatibility/js/',
            'compatibility/js/fastclick'
          ]
        },
        {
          title: '移动端 - CSS 兼容性',
          collapsable: false,
          children: [
            'compatibility/css/',
            'compatibility/css/flex',
            'compatibility/css/ie',
            'compatibility/css/android-small-fontsize'
          ]
        },
        {
          title: '用户体验',
          collapsable: false,
          children: [
            'user-experience/',
          ]
        }
      ],

      '/es6/': [
        {
          title: 'ES6+',
          collapsable: false,
          children: [
            '',
            'babel/',
            'let-const/',
            'destructuring-assignment/',
            'array/',
            'object/',
            'class/',
            'iterator/',
            'generator/',
            'promise/',
            'async-await/',
            'module/'
          ]
        },
        {
          title: 'Polyfill',
          collapsable: false,
          children: [
            'polyfill/object/'
          ]
        }
      ],

      // 代码片段
      '/code-snippet/': [
        {
          title: 'Vue 组件',
          collapsable: true,
          children: [
            'vue-components/common-popup',
            'vue-components/simple-marquee',
            'vue-components/vue-tap'
          ]
        },
        {
          title: 'JS 代码片段',
          collapsable: true,
          children: [
            'js/'
          ]
        },
        {
          title: 'CSS 代码片段',
          collapsable: true,
          children: [
            // 'css/',
            'css/dog-ear'
          ]
        },
        {
          title: '其他',
          collapsable: true,
          children: [
            'rem/',
            'other/no-bg-scroll'
          ]
        }
      ],

      // 算法
      '/algorithm/sorting-algorithm/': [
        {
          title: '排序算法',
          collapsable: true,
          children: [
            '',
            'bubble-sort/',
            'selection-sort/',
            'insertion-sort/',
            'merge-sort/',
            'quick-sort/'
          ]
        }
      ],

      // 开发环境/工具
      '/tools/': [
        {
          title: '构建工具',
          collapsable: false,
          children: [
            'bundler/webpack/',
            'bundler/webpack/bootstrap',
            'bundler/rollup'
          ]
        },
        {
          title: 'git',
          collapsable: false,
          children: [
            'git/',
            'git/git-command',
            'git/gitlab',
            'git/git-commit-guidelines'
          ]
        },
        {
          title: 'Node',
          collapsable: false,
          children: [
            'node/'
          ]
        },
        {
          title: 'CLI Tools',
          collapsable: false,
          children: [
            'cli-tools/'
          ]
        },
        {
          title: '其它工具',
          collapsable: false,
          children: [
            '',
            'linux',
            'eslint',
          ]
        }
      ],

      // 随记
      '/wander/': [
        {
          title: 'House 相关',
          collapsable: false,
          children: [
            'house/',
            'house/tianya-post',
            'house/zhonghailichunhushu/'
          ]
        },
        {
          title: '其他',
          collapsable: false,
          children: [
            'mac-shortcut-keys',
            'word-pronunciation',
            'theories',
            'ssr/'
          ]
        }
      ]
    }
  }
}