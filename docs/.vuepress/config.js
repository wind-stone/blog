module.exports = {
  title: 'Wind Stone\'s blog',
  description: 'Record something mainly for myself ..',
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    lastUpdated: 'Last Updated',
    sidebarDepth: 2,
    nav: [
      { text: '前端知识点', link: '/knowledge/js/data-structure' },
      {
        text: '移动端',
        items: [
          { text: '独有特性', link: '/mobile/feature/' },
          { text: '兼容性', link: '/mobile/compatibility/general/' },
        ]
      },
      { text: '服务器端', link: '/server/node/' },
      { text: 'ES6+', link: '/es6/' },
      {
        text: '开发框架',
        items: [
          { text: 'Vue', link: '/framework/vue/vue/' }
          // { text: 'React', link: '/framework/react/' },
          // { text: 'Koa', link: '/framework/koa/' },
        ]
      },
      { text: '构建工具', link: '/bundler/webpack/' },
      { text: '开发环境/工具', link: '/tools/git/' },
      { text: 'Code Snippet', link: '/code-snippet/js/' },
      { text: '最佳实践', link: '/best-practice/css/' },
      { text: 'GitHub', link: 'https://github.com/wind-stone' },
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
            'css/'
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

      '/mobile/feature/': [
        {
          title: '移动端 - 独有特性',
          collapsable: false,
          children: [
            '',
            'click-delay',
            'scroll',
          ]
        }
      ],

      '/mobile/compatibility/': [
        {
          title: '移动端 - 兼容性',
          collapsable: false,
          children: [
            'general/',
            'general/input-delay/',
            'general/media'
          ]
        },
        {
          title: 'CSS 兼容性',
          collapsable: false,
          children: [
            'css/ie',
            'css/android-small-fontsize'
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
        },
        {
          title: '工具',
          collapsable: false,
          children: [
            'tools/rsync'
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

      // 前端框架
      '/framework/vue/': [
        {
          title: 'Vue',
          collapsable: false,
          children: [
            'vue/',
            'vue/scoped-css'
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
            'vue-router/'
          ]
        }
      ],

      // 模块打包器
      '/bundler/': [
        {
          title: 'Webpack',
          collapsable: true,
          children: [
            'webpack/',
            'webpack/bootstrap'
          ]
        },
        {
          title: 'Rollup',
          collapsable: true,
          children: [
            'rollup/'
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

      // 最佳实践
      '/best-practice/': [
        {
          title: 'CSS 最佳实践',
          collapsable: false,
          children: [
            'css/'
          ]
        }
      ],

      // 开发环境/工具
      '/tools/': [
        {
          title: 'git',
          collapsable: false,
          children: [
            'git/',
            'git/gitlab'
          ]
        },
        {
          title: 'NPM',
          collapsable: false,
          children: [
            'npm/'
          ]
        },
        {
          title: 'CLI',
          collapsable: false,
          children: [
            'cli/'
          ]
        },
        {
          title: 'ESlint',
          collapsable: false,
          children: [
            'eslint/eslint-vue'
          ]
        }
      ]
    }
  }
}