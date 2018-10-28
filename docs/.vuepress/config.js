module.exports = {
  title: 'Wind Stone\'s blog',
  description: 'Record something mainly for myself ..',
  markdown: {
    lineNumbers: true,
    toc: {
      includeLevel: [2, 3, 4, 5]
    }
  },
  themeConfig: {
    lastUpdated: 'Last Updated',
    sidebarDepth: 2,
    nav: [
      { text: '前端知识点', link: '/knowledge/js/' },
      { text: '移动端', link: '/mobile/feature/' },
      { text: 'ES6+', link: '/es6/' },
      {
        text: 'Vue.js',
        items: [
          { text: 'Vue 生态系列', link: '/vue/vue-series/vuejs/' },
          { text: 'Vue 源码学习', link: '/vue/source-study/' }
        ]
      },
      { text: '开发环境/工具', link: '/tools/git/' },
      { text: 'Code Snippet', link: '/code-snippet/js/' },
      { text: '算法', link: '/algorithm/sorting-algorithm/' },
      { text: '服务器端', link: '/server/node/' },
      { text: 'GitHub', link: 'https://github.com/wind-stone' },
      { text: '随记', link: '/wander/house/' }
    ],
    sidebar: {
      '/knowledge/': [
        {
          title: 'JavaScript',
          collapsable: true,
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
          collapsable: true,
          children: [
            'css/',
            'css/css-property-order',
            'css/flex-image/'
          ]
        },
        {
          title: 'HMLT-DOM',
          collapsable: true,
          children: [
            'html-dom/'
          ]
        },
        {
          title: '浏览器环境',
          collapsable: true,
          children: [
            'browser-env/',
            'browser-env/console/',
            'browser-env/debug',
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
          collapsable: true,
          children: [
            'node-env/'
          ]
        }
      ],

      '/mobile/': [
        {
          title: '移动端 - 独有特性',
          collapsable: true,
          children: [
            'feature/',
            'feature/click-delay',
            'feature/scroll',
          ]
        },
        {
          title: '移动端 - Hybrid',
          collapsable: true,
          children: [
            'hybrid/h52app'
          ]
        },
        {
          title: '移动端 - 通用兼容性',
          collapsable: true,
          children: [
            'compatibility/general/',
            'compatibility/general/input-delay/',
            'compatibility/general/media',
            'compatibility/general/video'
          ]
        },
        {
          title: '移动端 - JS 兼容性',
          collapsable: true,
          children: [
            'compatibility/js/fastclick'
          ]
        },
        {
          title: '移动端 - CSS 兼容性',
          collapsable: true,
          children: [
            'compatibility/css/ie',
            'compatibility/css/android-small-fontsize'
          ]
        }
      ],

      '/server/': [
        {
          title: 'Node',
          collapsable: false,
          children: [
            'node/'
          ]
        },
        {
          title: 'Unix',
          collapsable: false,
          children: [
            'unix/'
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
        }
      ],

      // Vue 系列
      '/vue/vue-series/': [
        {
          title: 'Vue.js',
          collapsable: true,
          children: [
            'vuejs/',
            'vuejs/scoped-css'
          ]
        },
        {
          title: 'Vuex',
          collapsable: true,
          children: [
            'vuex/register-module'
          ]
        },
        {
          title: 'vue-router',
          collapsable: false,
          children: [
            'vue-router/'
          ]
        }
      ],

      '/vue/source-study/': [
        {
          title: '总览',
          collapsable: false,
          children: [
            ''
          ]
        },
        {
          title: '组件化',
          collapsable: false,
          children: [
            'component/register',
            'component/options',
            'component/async-component'
          ]
        },
        {
          title: '实例化',
          collapsable: false,
          children: [
            'instance/computed',
            'instance/props',
            'instance/directives'
          ]
        },
        {
          title: '响应式原理',
          collapsable: false,
          children: [
            'reactivity/',
            'reactivity/watcher',
          ]
        },
        {
          title: 'Virtual Dom',
          collapsable: false,
          children: [
            'vdom/',
            'vdom/patch'
          ]
        },
        {
          title: '专题',
          collapsable: false,
          children: [
            'topics/dom-binding'
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

      // 代码片段
      '/code-snippet/': [
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
            'rem/'
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
            'git/git-commond',
            'git/gitlab'
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
            'house/tianya-post'
          ]
        },
        {
          title: '其他',
          collapsable: false,
          children: [
            'mac-shortcut-keys',
            'word-pronunciation',
            'effect'
          ]
        }
      ]
    }
  }
}