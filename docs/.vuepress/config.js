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
      { text: 'CSS 规范', link: '/css-spec/css2.2/9-visual-formatting-model/' },
      { text: 'Front End', link: '/front-end/' },
      { text: 'Back End', link: '/back-end/'},
      { text: 'General Knowledge', link: '/general-knowledge/'},
      { text: '移动端', link: '/mobile/feature/' },
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
            'css2.2/9-visual-formatting-model/'
          ]
        },
      ],

      // 前端知识点
      '/front-end/': [
        {
          title: 'JavaScript',
          collapsable: true,
          children: [
            'js/',
            'js/data-structure/',
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
            'css/selectors/',
            'css/properties/',
            'css/layouts/',
            'css/layouts/ifc/',
            'css/layouts/font/',
            'css/flex-image/',
            'css/text-wrap-and-ellipsis/'
          ]
        },
        {
          title: 'HMLT-DOM',
          collapsable: true,
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
          collapsable: true,
          children: [
            'browser-env/',
            'browser-env/https/',
            'browser-env/process-thread',
            'browser-env/console/',
            'browser-env/debug/',
            'browser-env/error-handler',
            'browser-env/log',
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
          title: '工具',
          collapsable: true,
          children: [
            'tools/eslint',
            'tools/rollup'
          ]
        },
        {
          title: 'Webpack',
          collapsable: true,
          children: [
            'webpack/',
            'webpack/config',
            'webpack/webpack-runtime',
            'webpack/webpack4-import'
          ]
        },
        {
          title: '专题 - 滚动',
          collapsable: true,
          children: [
            'scroll/',
            'scroll/touch-event',
            'scroll/click-delay',
            'scroll/fastclick'
          ]
        },
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
            'nginx/'
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

      // 移动端
      '/mobile/': [
        {
          title: '移动端 - 独有特性',
          collapsable: false,
          children: [
            'feature/'
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
          ]
        },
        {
          title: '移动端 - CSS 兼容性',
          collapsable: false,
          children: [
            'compatibility/css/',
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
            'house/xishanjinxiufu/'
          ]
        },
        {
          title: '其他',
          collapsable: false,
          children: [
            // 'mac-shortcut-keys',
            // 'word-pronunciation',
            'theories',
            'ssr/'
          ]
        }
      ]
    }
  }
}
