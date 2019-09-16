module.exports = {
  title: 'Wind Stone\'s blog', // 网站的标题
  description: '记录工作，记录生活', // 网站的描述
  head: [ // 额外的需要被注入到当前页面的 HTML <head> 中的标签
    ['link', { rel: 'icon', href: `/img/long.png` }]
  ],

  markdown: {
    lineNumbers: true, // 是否在每个代码块的左侧显示行号
    toc: { // 控制 [[TOC]] 默认行为
      includeLevel: [2, 3, 4, 5] // 决定哪些级别的标题会被显示在目录中，默认值为 [2, 3]
    }
  },

  // base: '/', // 基础路径，默认值
  // host: '0.0.0.0', // 指定用于 dev server 的主机名，默认值
  // port: 8080, // 指定 dev server 的端口，默认值
  // dest: '.vuepress/dist', // 指定 vuepress build 的输出目录。如果传入的是相对路径，则会基于 process.cwd() 进行解析
  // ...（另有一些选项，可能不需要重置，就没列在此处）

  themeConfig: {
    lastUpdated: 'Last Updated',
    sidebarDepth: 2,
    nav: [
      { text: 'Vue 源码学习', link: '/vue/source-study/' },
      { text: 'CSS 规范-翻译', link: '/css-spec/css2.2/9-visual-formatting-model/' },
      {
        text: 'Front End',
        items: [
          { text: 'JavaScript', link: '/front-end/js/' },
          { text: 'CSS', link: '/front-end/css/' },
          { text: 'HTML-DOM', link: '/front-end/html-dom/' },
          { text: '浏览器环境', link: '/front-end/browser-env/' },
          { text: '兼容性', link: '/front-end/compatibility/' },
          { text: '工具', link: '/front-end/tools/eslint' }
        ]
      },
      { text: 'Back End', link: '/back-end/'},
      { text: 'General Knowledge', link: '/general-knowledge/'},
      { text: 'ES6+', link: '/es6/' },
      { text: '代码片段', link: '/code-snippet/' },
      { text: '算法', link: '/algorithm/sorting-algorithm/' },
      { text: 'GitHub', link: 'https://github.com/wind-stone' },
      { text: '随记', link: '/wander/house/' }
    ],
    sidebar: {
      // Vue 源码学习
      '/vue/': [
        {
          title: 'Vue 应用',
          collapsable: false,
          children: [
            'vue-series/vuejs/',
            'vue-series/vuejs/scoped-css',
            'vue-series/vuex/register-module',
            'vue-series/vue-router/',
          ]
        },
        {
          title: '实例化',
          collapsable: false,
          children: [
            'source-study/vue-constructor',
            'source-study/instance/create',
            'source-study/instance/state/',
            'source-study/instance/state/props',
            'source-study/instance/state/methods',
            'source-study/instance/state/data',
            'source-study/instance/state/computed',
            'source-study/instance/state/watch',
            'source-study/instance/directives',
            'source-study/instance/events'
          ]
        },
        {
          title: '组件化',
          collapsable: false,
          children: [
            'source-study/component/register',
            'source-study/component/options',
            'source-study/component/async-component',
            'source-study/component/functional-component',
            'source-study/component/extend'
          ]
        },
        {
          title: '响应式原理',
          collapsable: false,
          children: [
            'source-study/observer/',
            'source-study/observer/dep-collection',
            'source-study/observer/notify-update',
            'source-study/observer/dep',
            'source-study/observer/watcher',
            'source-study/observer/scheduler',
          ]
        },
        {
          title: 'Virtual Dom',
          collapsable: false,
          children: [
            'source-study/vdom/',
            'source-study/vdom/vnode-tree-create',
            'source-study/vdom/patch',
            'source-study/vdom/patch-vnode',
            'source-study/vdom/child-component-create',
            'source-study/vdom/patch-modules/',
            'source-study/vdom/patch-fn',
            'source-study/vdom/topics/dom-binding'
          ]
        },
        {
          title: '编译',
          collapsable: false,
          children: [
            'source-study/compile/',
            'source-study/compile/compile-process',
            'source-study/compile/base-compile',
            'source-study/compile/parse',
            'source-study/compile/parse-html',
            'source-study/compile/optimize'
          ]
        },
        {
          title: '编译专题',
          collapsable: false,
          children: [
            'source-study/compile/topics/event',
            'source-study/compile/topics/v-model',
            'source-study/compile/topics/slot'
          ]
        },
        {
          title: 'Util',
          collapsable: false,
          children: [
            'source-study/util/next-tick'
          ]
        },
        {
          title: 'Vuex',
          collapsable: false,
          children: [
            'source-study/vuex/'
          ]
        }
      ],

      // CSS 2.2 规范
      '/css-spec/': [
        {
          title: 'CSS 2.2 规范',
          collapsable: true,
          children: [
            'css2.2/8-box-model/',
            'css2.2/9-visual-formatting-model/',
          ]
        },
      ],

      // Front End - JavaScript
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
            'data-structure/object/',

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
        }
      ],

      // Front End - CSS
      '/front-end/css/': [
        {
          title: 'CSS 专题',
          collapsable: true,
          children: [
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
            'properties/properties-order',
            'properties/user-experience'
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

      // Front End - HMLT-DOM
      '/front-end/html-dom/': [
        {
          title: 'HTML 专题',
          collapsable: true,
          children: [
            'topics/preload-and-prefetch',
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

      // Front End - 浏览器环境
      '/front-end/browser-env/': [
        {
          title: '浏览器',
          collapsable: true,
          children: [
            'browser/process-thread'
          ]
        },
        {
          title: '浏览器环境',
          collapsable: true,
          children: [
            '',
            'memory',
            'file-system',
            'pwa',
            'web-components'
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
        }
      ],

      '/front-end/compatibility/': [
        {
          title: '概述',
          collapsable: true,
          children: [
            ''
          ]
        },
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
            'css/ios',
            'css/ie',
            'css/android-small-fontsize'
          ]
        },
        {
          title: '兼容性',
          collapsable: true,
          children: [
            'html-dom/video',
            'html-dom/media',
            'html-dom/input-delay/'
          ]
        }
      ],

      // Front End - 工具
      '/front-end/tools/': [
        {
          title: '工具',
          collapsable: true,
          children: [
            'eslint',
            'rollup'
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
            'webpack/webpack4-import'
          ]
        }
      ],

      // Front End - 专题
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

      // Back End
      '/back-end/': [
        {
          title: 'Node',
          collapsable: true,
          children: [
            'node/pm2',
            'node/koa/',
            'node/commonjs',
            'node/package-json',
            'node/third-party-package',
            'node/'
          ]
        }
      ],

      // General Knowledge
      '/general-knowledge/': [
        {
          title: 'CLI',
          collapsable: true,
          children: [
            'cli/',
            'cli/command'
          ]
        },
        {
          title: 'Git',
          collapsable: true,
          children: [
            'git/git-command',
            'git/git-commit-guidelines',
            'git/gitlab',
            'git/'
          ]
        },
        {
          title: 'Nginx',
          collapsable: true,
          children: [
            'nginx/',
            'nginx/nginx-conf',
            'nginx/ngx_http_proxy_module',
            'nginx/ngx_http_upstream_module'
          ]
        },
        {
          title: 'Network',
          collapsable: true,
          children: [
            'network/dns'
          ]
        },
        {
          title: 'Server',
          collapsable: true,
          children: [
            'server/'
          ]
        },
        {
          title: '其他',
          collapsable: true,
          children: [
            'others/glob',
            'others/google-cloud'
          ]
        }
      ],

      // ES6
      '/es6/': [
        {
          title: 'ES6+',
          collapsable: false,
          children: [
            '',
            'babel/',
            'let-const/',
            'destructuring-assignment/',
            'function/',
            'array/',
            'regexp/',
            'class/',
            'module/',
            'iterator/',
            'generator/',
            'promise/',
            'async-await/'
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
          collapsable: false,
          children: [
            'vue-components/common-popup',
            'vue-components/simple-marquee'
          ]
        },
        {
          title: 'JS 代码片段',
          collapsable: false,
          children: [
            'js/',
            'js/browser/',
            'js/server/',
            'js/validate/'
          ]
        },
        {
          title: 'CSS 代码片段',
          collapsable: false,
          children: [
            // 'css/',
            'css/dog-ear'
          ]
        },
        {
          title: '其他',
          collapsable: false,
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
          collapsable: false,
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

      // 随记
      '/wander/': [
        {
          title: 'House 相关',
          collapsable: false,
          children: [
            'house/',
            'house/tianya-post',
            'house/beijing/',
            'house/zhonghailichunhushu/',
            'house/wanxiangyuefu/',
            'house/xishanjinxiufu/',
            'house/comparison'
          ]
        },
        {
          title: '户外',
          collapsable: false,
          children: [
            'outdoor/',
          ]
        },
        {
          title: '其他',
          collapsable: false,
          children: [
            // 'mac-shortcut-keys',
            // 'word-pronunciation',
            'others/theories',
            'others/ssr/'
          ]
        }
      ]
    }
  }
}
